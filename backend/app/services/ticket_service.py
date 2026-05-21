from supabase import Client
from fastapi import HTTPException
from postgrest.exceptions import APIError
from app.schemas.ticket import TicketCreate, TicketUpdate

class TicketService:
    def __init__(self, client: Client):
        self.client = client

    def get_section_tickets(self, section_id: str):
        res = self.client.table("tickets").select("*").eq("section_id", section_id).order("created_at").execute()
        return res.data

    def create_ticket(self, ticket_in: TicketCreate, user_id: str, user_email: str):
        # Any board member may add new cards.
        section_res = self.client.table("sections").select("board_id").eq("id", ticket_in.section_id).execute()
        if not section_res.data:
            raise HTTPException(status_code=404, detail="Section not found")

        board_id = section_res.data[0]["board_id"]
        board_res = self.client.table("boards").select("owner_id").eq("id", board_id).execute()
        if not board_res.data:
            raise HTTPException(status_code=404, detail="Board not found")

        owner_id = board_res.data[0]["owner_id"]
        member_check = self.client.table("board_members").select("*").eq("board_id", board_id).eq("user_id", user_id).execute()
        if owner_id != user_id and not member_check.data:
            raise HTTPException(status_code=403, detail="Only board members can add a new card")

        data = ticket_in.model_dump()
        if not data.get("assigned_to") and owner_id != user_id:
            data["assigned_to"] = user_email

        data["created_by"] = user_id

        try:
            res = self.client.table("tickets").insert(data).execute()
        except Exception as exc:
            err = exc.args[0] if exc.args else exc
            err_msg = ""
            err_code = None

            if isinstance(err, dict):
                err_msg = err.get("message", "")
                err_code = err.get("code")
            else:
                err_msg = str(err)

            if err_code == "PGRST204" or "created_by" in err_msg:
                data.pop("created_by", None)
                res = self.client.table("tickets").insert(data).execute()
            else:
                raise

        return res.data[0]

    def _check_permissions(self, ticket_id: str, user_id: str, user_email: str):
        """Helper method to ensure only board owner or ticket creator can modify tickets."""
        ticket_res = self.client.table("tickets").select("*, sections(board_id)").eq("id", ticket_id).execute()
        if not ticket_res.data:
            raise HTTPException(status_code=404, detail="Ticket not found")
        
        ticket = ticket_res.data[0]
        board_id = ticket["sections"]["board_id"]
        
        board_res = self.client.table("boards").select("owner_id").eq("id", board_id).execute()
        owner_id = board_res.data[0]["owner_id"]
        
        # Board owner can always modify.
        created_by = ticket.get("created_by")
        is_creator = created_by == user_id

        # If created_by is not available in the DB schema yet, fall back to assigned_to for member-created tickets.
        if created_by is None:
            is_creator = ticket.get("assigned_to") == user_email

        if user_id != owner_id and not is_creator:
            raise HTTPException(status_code=403, detail="Only the board owner or ticket creator can modify this ticket.")
            
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