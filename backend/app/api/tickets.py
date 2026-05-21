from fastapi import APIRouter, Depends
from supabase import Client
from typing import List
from app.db.supabase import get_supabase_client
from app.api.dependencies import get_current_user
from app.schemas.ticket import TicketCreate, TicketUpdate, TicketResponse
from app.services.ticket_service import TicketService

router = APIRouter()

@router.get("/section/{section_id}", response_model=List[TicketResponse])
def get_tickets(
    section_id: str, 
    current_user = Depends(get_current_user), 
    client: Client = Depends(get_supabase_client)
):
    service = TicketService(client)
    return service.get_section_tickets(section_id)

@router.post("", response_model=TicketResponse)
def create_ticket(
    ticket_in: TicketCreate, 
    current_user = Depends(get_current_user), 
    client: Client = Depends(get_supabase_client)
):
    service = TicketService(client)
    return service.create_ticket(ticket_in)

@router.put("/{ticket_id}", response_model=TicketResponse)
def update_ticket(
    ticket_id: str, 
    ticket_in: TicketUpdate, 
    current_user = Depends(get_current_user), 
    client: Client = Depends(get_supabase_client)
):
    service = TicketService(client)
    # Pass the user's email into the service
    return service.update_ticket(ticket_id, ticket_in, current_user.id, current_user.email) 

@router.delete("/{ticket_id}")
def delete_ticket(
    ticket_id: str, 
    current_user = Depends(get_current_user), 
    client: Client = Depends(get_supabase_client)
):
    service = TicketService(client)
    # Pass the user's email into the service
    return service.delete_ticket(ticket_id, current_user.id, current_user.email)