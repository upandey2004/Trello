import pytest
from fastapi import HTTPException
from app.services.section_service import SectionService
from app.schemas.section import SectionCreate

def test_get_board_sections(mock_supabase):
    service = SectionService(mock_supabase)
    
    # Mock fetching sections from the database
    mock_supabase.table.return_value.select.return_value.eq.return_value.execute.return_value.data = [
        {"id": "section-1", "name": "To Do", "board_id": "board-1"},
        {"id": "section-2", "name": "In Progress", "board_id": "board-1"}
    ]
    
    result = service.get_board_sections("board-1")
    assert len(result) == 2
    assert result[0]["name"] == "To Do"

def test_create_section_as_owner(mock_supabase):
    service = SectionService(mock_supabase)
    
    # 1. Mock the ownership check (User IS the owner)
    mock_supabase.table.return_value.select.return_value.eq.return_value.execute.return_value.data = [{"owner_id": "user-123"}]
    
    # 2. Mock the actual database insertion
    mock_supabase.table.return_value.insert.return_value.execute.return_value.data = [
        {"id": "section-3", "name": "Done", "board_id": "board-1"}
    ]
    
    section_in = SectionCreate(name="Done", board_id="board-1")
    result = service.create_section(section_in, "user-123")
    
    assert result["id"] == "section-3"
    assert result["name"] == "Done"

def test_create_section_as_non_owner(mock_supabase):
    service = SectionService(mock_supabase)
    
    # 1. Mock the ownership check (Someone else owns the board)
    mock_supabase.table.return_value.select.return_value.eq.return_value.execute.return_value.data = [{"owner_id": "other-user-999"}]
    
    section_in = SectionCreate(name="Done", board_id="board-1")
    
    # 2. Verify it blocks the user and throws a 403 Forbidden
    with pytest.raises(HTTPException) as excinfo:
        service.create_section(section_in, "user-123")
        
    assert excinfo.value.status_code == 403
    assert "Only the board owner can add a new list" in excinfo.value.detail