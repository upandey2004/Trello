import pytest
from fastapi import HTTPException
from app.services.ticket_service import TicketService
from app.schemas.ticket import TicketCreate

# 1. We must use this helper class to simulate how Supabase returns data
class MockResponse:
    def __init__(self, data):
        self.data = data

def test_get_section_tickets(mock_supabase):
    service = TicketService(mock_supabase)
    mock_supabase.table.return_value.select.return_value.eq.return_value.order.return_value.execute.return_value = MockResponse([
        {"id": "ticket-1", "name": "Fix Bug", "section_id": "section-1"}
    ])
    
    result = service.get_section_tickets("section-1")
    assert len(result) == 1
    assert result[0]["name"] == "Fix Bug"

def test_create_ticket_as_member(mock_supabase):
    service = TicketService(mock_supabase)
    
    # 2. We use 'side_effect' so the mock returns 'board-1' on the first call, and 'other-user' on the second call.
    mock_supabase.table.return_value.select.return_value.eq.return_value.execute.side_effect = [
        MockResponse([{"board_id": "board-1"}]),     # 1st call: section lookup
        MockResponse([{"owner_id": "other-user"}])   # 2nd call: board owner lookup
    ]
    
    mock_supabase.table.return_value.select.return_value.eq.return_value.eq.return_value.execute.return_value = MockResponse([{"user_id": "user-123"}])
    mock_supabase.table.return_value.insert.return_value.execute.return_value = MockResponse([{"id": "ticket-1", "name": "New Task"}])
    
    ticket_in = TicketCreate(name="New Task", section_id="section-1")
    result = service.create_ticket(ticket_in, "user-123", "test@example.com")
    
    assert result["name"] == "New Task"

def test_delete_ticket_as_creator(mock_supabase):
    service = TicketService(mock_supabase)
    
    # 3. Use 'side_effect' here as well for the two sequential lookups.
    mock_supabase.table.return_value.select.return_value.eq.return_value.execute.side_effect = [
        MockResponse([{"id": "ticket-1", "created_by": "user-123", "sections": {"board_id": "board-1"}}]), # 1st call: ticket lookup
        MockResponse([{"owner_id": "other-owner"}]) # 2nd call: board lookup
    ]
    
    mock_supabase.table.return_value.delete.return_value.eq.return_value.execute.return_value = MockResponse([])
    
    result = service.delete_ticket("ticket-1", "user-123", "test@example.com")
    assert result == {"message": "Ticket deleted successfully"}

