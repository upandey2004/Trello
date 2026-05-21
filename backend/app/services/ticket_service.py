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

    def _check_permissions(self, ticket_id: str, user_id: str, user_email: str):
        """Helper method to ensure only owners or assigned creators can modify tickets."""
        ticket_res = self.client.table("tickets").select("*, sections(board_id)").eq("id", ticket_id).execute()
        if not ticket_res.data:
            raise HTTPException(status_code=404, detail="Ticket not found")
        
        ticket = ticket_res.data[0]
        board_id = ticket["sections"]["board_id"]
        
        board_res = self.client.table("boards").select("owner_id").eq("id", board_id).execute()
        owner_id = board_res.data[0]["owner_id"]
        
        # We now check if the user is the owner, OR if their email matches the assigned_to field
        if user_id != owner_id and user_email != ticket.get("assigned_to"):
            raise HTTPException(status_code=403, detail="Only the board owner or assigned user can modify this ticket.")
            
        return ticket

    def update_ticket(self, ticket_id: str, ticket_in: TicketUpdate, user_id: str, user_email: str):
        self._check_permissions(ticket_id, user_id, user_email)
        
        update_data = {k: v for k, v in ticket_in.model_dump().items() if v is not None}
        if not update_data:
            raise HTTPException(status_code=400, detail="No data provided to update")
            
        res = self.client.table("tickets").update(update_data).eq("id", ticket_id).execute()
        return res.data[0]

    def delete_ticket(self, ticket_id: str, user_id: str, user_email: str):
        self._check_permissions(ticket_id, user_id, user_email)
        
        res = self.client.table("tickets").delete().eq("id", ticket_id).execute()
        return {"message": "Ticket deleted successfully"}