# app/api/boards.py
from fastapi import APIRouter, Depends
from supabase import Client
from app.db.supabase import get_supabase_client
from app.schemas.board import BoardCreate, BoardResponse
from app.services.board_service import BoardService
from app.api.dependencies import get_current_user

router = APIRouter()

@router.post("/", response_model=BoardResponse)
def create_board(
    board_in: BoardCreate,
    current_user = Depends(get_current_user), # <--- Protects the route
    client: Client = Depends(get_supabase_client)
):
    """Create a new board and assign the current user as the owner."""
    service = BoardService(client)
    return service.create_board(board_in, current_user.id)

@router.get("/")
def get_my_boards(
    current_user = Depends(get_current_user), # <--- Protects the route
    client: Client = Depends(get_supabase_client)
):
    """Get a list of all boards the current user is a member of."""
    service = BoardService(client)
    return service.get_user_boards(current_user.id)

@router.get("/{board_id}", response_model=BoardResponse)
def get_single_board(
    board_id: str,
    current_user = Depends(get_current_user),
    client: Client = Depends(get_supabase_client)
):
    """Fetch a single board (used to get the invite token)."""
    service = BoardService(client)
    return service.get_board(board_id, current_user.id)

@router.post("/join/{token}", response_model=BoardResponse)
def join_board_via_token(
    token: str,
    current_user = Depends(get_current_user),
    client: Client = Depends(get_supabase_client)
):
    """Join a board using an invitation token."""
    service = BoardService(client)
    return service.join_board(current_user.id, token)

@router.get("/{board_id}/members")
def get_members(
    board_id: str,
    current_user = Depends(get_current_user),
    client: Client = Depends(get_supabase_client)
):
    service = BoardService(client)
    return service.get_board_member_emails(board_id)