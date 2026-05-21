from supabase import Client
from fastapi import HTTPException
from app.schemas.section import SectionCreate, SectionUpdate

class SectionService:
    def __init__(self, client: Client):
        self.client = client

    def get_board_sections(self, board_id: str):
        res = self.client.table("sections").select("*").eq("board_id", board_id).execute()
        return res.data

    def create_section(self, section_in: SectionCreate, user_id: str):
        # Only the board owner may add new lists.
        board_res = self.client.table("boards").select("owner_id").eq("id", section_in.board_id).execute()
        if not board_res.data:
            raise HTTPException(status_code=404, detail="Board not found")
        if board_res.data[0]["owner_id"] != user_id:
            raise HTTPException(status_code=403, detail="Only the board owner can add a new list")

        data = section_in.model_dump()
        res = self.client.table("sections").insert(data).execute()
        return res.data[0]

    def update_section(self, section_id: str, section_in: SectionUpdate, user_id: str):
        # Only the board owner may update a list.
        section_res = self.client.table("sections").select("board_id").eq("id", section_id).execute()
        if not section_res.data:
            raise HTTPException(status_code=404, detail="Section not found")
        
        board_id = section_res.data[0]["board_id"]
        board_res = self.client.table("boards").select("owner_id").eq("id", board_id).execute()
        if not board_res.data:
            raise HTTPException(status_code=404, detail="Board not found")
        if board_res.data[0]["owner_id"] != user_id:
            raise HTTPException(status_code=403, detail="Only the board owner can edit a list")
        
        # Only update fields that were actually provided
        update_data = {k: v for k, v in section_in.model_dump().items() if v is not None}
        if not update_data:
            raise HTTPException(status_code=400, detail="No data provided to update")
            
        res = self.client.table("sections").update(update_data).eq("id", section_id).execute()
        if not res.data:
            raise HTTPException(status_code=404, detail="Section not found")
        return res.data[0]

    def delete_section(self, section_id: str, user_id: str):
        # Only the board owner may delete a list.
        section_res = self.client.table("sections").select("board_id").eq("id", section_id).execute()
        if not section_res.data:
            raise HTTPException(status_code=404, detail="Section not found")
        
        board_id = section_res.data[0]["board_id"]
        board_res = self.client.table("boards").select("owner_id").eq("id", board_id).execute()
        if not board_res.data:
            raise HTTPException(status_code=404, detail="Board not found")
        if board_res.data[0]["owner_id"] != user_id:
            raise HTTPException(status_code=403, detail="Only the board owner can delete a list")
        
        res = self.client.table("sections").delete().eq("id", section_id).execute()
        if not res.data:
            raise HTTPException(status_code=404, detail="Section not found")
        return {"message": "Section deleted successfully"}