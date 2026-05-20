# app/services/board_service.py
from supabase import Client
from fastapi import HTTPException, status
from app.schemas.board import BoardCreate

class BoardService:
    def __init__(self, client: Client):
        self.client = client

    def create_board(self, board_in: BoardCreate, user_id: str):
        try:
            # 1. Insert the new board
            board_data = {
                "name": board_in.name,
                "description": board_in.description,
                "owner_id": user_id
            }
            res = self.client.table("boards").insert(board_data).execute()
            new_board = res.data[0]

            # 2. Add the owner as a member of the board
            self.client.table("board_members").insert({
                "board_id": new_board["id"],
                "user_id": user_id
            }).execute()

            return new_board
        except Exception as e:
            raise HTTPException(status_code=400, detail=str(e))

    def get_user_boards(self, user_id: str):
        try:
            # Fetch all boards where this user is listed as a member
            res = self.client.table("board_members").select("board_id, boards(*)").eq("user_id", user_id).execute()
            
            # Clean up the Supabase JSON response to just return the board objects
            return [item["boards"] for item in res.data if item.get("boards")]
        except Exception as e:
            raise HTTPException(status_code=400, detail=str(e))