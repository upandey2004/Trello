from supabase import Client
from fastapi import HTTPException
from app.schemas.ticket import TicketCreate, TicketUpdate

class TicketService:
    def __init__(self, client: Client):
        self.client = client

    def get_section_tickets(self, section_id: str):
        res = self.client.table("tickets").select("*").eq("section_id", section_id).order("created_at").execute()
        return res.data

    def create_ticket(self, ticket_in: TicketCreate):
        data = ticket_in.model_dump()
        res = self.client.table("tickets").insert(data).execute()
        return res.data[0]

    def update_ticket(self, ticket_id: str, ticket_in: TicketUpdate):
        # Drop None values so we only update what was actually sent
        update_data = {k: v for k, v in ticket_in.model_dump().items() if v is not None}
        if not update_data:
            raise HTTPException(status_code=400, detail="No data provided to update")
            
        res = self.client.table("tickets").update(update_data).eq("id", ticket_id).execute()
        if not res.data:
            raise HTTPException(status_code=404, detail="Ticket not found")
        return res.data[0]

    def delete_ticket(self, ticket_id: str):
        res = self.client.table("tickets").delete().eq("id", ticket_id).execute()
        if not res.data:
            raise HTTPException(status_code=404, detail="Ticket not found")
        return {"message": "Ticket deleted successfully"}