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
        
    def get_board(self, board_id: str, user_id: str):
        # 1. Verify the user is actually a member of this board
        member_check = self.client.table("board_members").select("*").eq("board_id", board_id).eq("user_id", user_id).execute()
        if not member_check.data:
            raise HTTPException(status_code=403, detail="You do not have access to this board")
            
        # 2. Fetch and return the board details
        res = self.client.table("boards").select("*").eq("id", board_id).execute()
        if not res.data:
            raise HTTPException(status_code=404, detail="Board not found")
        return res.data[0]

    def join_board(self, user_id: str, token: str):
        # 1. Find the board by its unique invitation token
        res = self.client.table("boards").select("*").eq("invitation_token", token).execute()
        if not res.data:
            raise HTTPException(status_code=404, detail="Invalid or expired invitation link")
        
        board = res.data[0]

        # 2. Check if the user is already a member
        member_check = self.client.table("board_members").select("*").eq("board_id", board["id"]).eq("user_id", user_id).execute()
        
        # 3. If not a member, add them to the board_members table
        if not member_check.data:
            self.client.table("board_members").insert({
                "board_id": board["id"],
                "user_id": user_id
            }).execute()
            
        return board