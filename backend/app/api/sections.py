from fastapi import APIRouter, Depends
from supabase import Client
from typing import List
from app.db.supabase import get_supabase_client
from app.api.dependencies import get_current_user
from app.schemas.section import SectionCreate, SectionUpdate, SectionResponse
from app.services.section_service import SectionService

router = APIRouter()

# Get sections for a specific board
@router.get("/board/{board_id}", response_model=List[SectionResponse])
def get_sections(
    board_id: str, 
    current_user = Depends(get_current_user), 
    client: Client = Depends(get_supabase_client)
):
    # Note: In a production app, we'd verify the user is a member of this board first!
    service = SectionService(client)
    return service.get_board_sections(board_id)

@router.post("", response_model=SectionResponse)
def create_section(
    section_in: SectionCreate, 
    current_user = Depends(get_current_user), 
    client: Client = Depends(get_supabase_client)
):
    service = SectionService(client)
    return service.create_section(section_in, current_user.id)

@router.put("/{section_id}", response_model=SectionResponse)
def update_section(
    section_id: str, 
    section_in: SectionUpdate, 
    current_user = Depends(get_current_user), 
    client: Client = Depends(get_supabase_client)
):
    service = SectionService(client)
    return service.update_section(section_id, section_in, current_user.id)

@router.delete("/{section_id}")
def delete_section(
    section_id: str, 
    current_user = Depends(get_current_user), 
    client: Client = Depends(get_supabase_client)
):
    service = SectionService(client)
    return service.delete_section(section_id, current_user.id)