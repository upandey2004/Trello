import pytest
from fastapi import HTTPException
from app.services.board_service import BoardService
from app.schemas.board import BoardCreate

def test_create_board(mock_supabase):
    # Setup Mock
    service = BoardService(mock_supabase)
    
    # FIX: Use .return_value to configure the mock without triggering a "call"
    mock_supabase.table.return_value.insert.return_value.execute.return_value.data = [{"id": "board-1", "name": "Test Board"}]
    
    # Execute
    board_in = BoardCreate(name="Test Board", description="Desc")
    result = service.create_board(board_in, "user-123")
    
    # Assert
    assert result["id"] == "board-1"
    # Check the insert call count on the table's return value
    assert mock_supabase.table.return_value.insert.call_count == 2 # Once for board, once for board_member
def test_delete_board_as_owner(mock_supabase):
    service = BoardService(mock_supabase)
    # Mock finding the board and verifying ownership
    mock_supabase.table().select().eq().execute.return_value.data = [{"owner_id": "user-123"}]
    
    result = service.delete_board("board-1", "user-123")
    assert result == {"message": "Board deleted successfully"}

def test_delete_board_as_non_owner(mock_supabase):
    service = BoardService(mock_supabase)
    # Mock finding the board where someone else is the owner
    mock_supabase.table().select().eq().execute.return_value.data = [{"owner_id": "other-user-456"}]
    
    with pytest.raises(HTTPException) as excinfo:
        service.delete_board("board-1", "user-123")
    
    assert excinfo.value.status_code == 403
    assert "Only the board owner" in excinfo.value.detail

def test_get_user_boards(mock_supabase):
    service = BoardService(mock_supabase)
    # Mock the database returning a nested board object
    mock_supabase.table.return_value.select.return_value.eq.return_value.execute.return_value.data = [
        {"board_id": "b-1", "boards": {"id": "b-1", "name": "B1"}}
    ]
    
    result = service.get_user_boards("user-123")
    assert len(result) == 1
    assert result[0]["name"] == "B1"

def test_get_board_as_owner(mock_supabase):
    service = BoardService(mock_supabase)
    # Mock fetching the board where the user is the owner
    mock_supabase.table.return_value.select.return_value.eq.return_value.execute.return_value.data = [
        {"id": "board-1", "owner_id": "user-123", "name": "My Board"}
    ]
    
    result = service.get_board("board-1", "user-123")
    assert result["name"] == "My Board"