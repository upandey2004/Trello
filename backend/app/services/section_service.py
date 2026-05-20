from supabase import Client
from fastapi import HTTPException
from app.schemas.section import SectionCreate, SectionUpdate

class SectionService:
    def __init__(self, client: Client):
        self.client = client

    def get_board_sections(self, board_id: str):
        res = self.client.table("sections").select("*").eq("board_id", board_id).execute()
        return res.data

    def create_section(self, section_in: SectionCreate):
        data = section_in.model_dump()
        res = self.client.table("sections").insert(data).execute()
        return res.data[0]

    def update_section(self, section_id: str, section_in: SectionUpdate):
        # Only update fields that were actually provided
        update_data = {k: v for k, v in section_in.model_dump().items() if v is not None}
        if not update_data:
            raise HTTPException(status_code=400, detail="No data provided to update")
            
        res = self.client.table("sections").update(update_data).eq("id", section_id).execute()
        if not res.data:
            raise HTTPException(status_code=404, detail="Section not found")
        return res.data[0]

    def delete_section(self, section_id: str):
        res = self.client.table("sections").delete().eq("id", section_id).execute()
        if not res.data:
            raise HTTPException(status_code=404, detail="Section not found")
        return {"message": "Section deleted successfully"}