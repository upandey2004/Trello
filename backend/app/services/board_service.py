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
        
    def get_boards(self, user_id: str):
        # Fetch boards I created
        owned = self.client.table("boards").select("*").eq("owner_id", user_id).execute()
        
        # Fetch boards I was invited to
        member_of = self.client.table("board_members").select("boards(*)").eq("user_id", user_id).execute()
        
        # Combine them
        boards = owned.data
        for record in member_of.data:
            if record.get("boards"):
                boards.append(record["boards"])
        return boards
    
    def get_board(self, board_id: str, user_id: str):
        # 1. Fetch the board details
        res = self.client.table("boards").select("*").eq("id", board_id).execute()
        if not res.data:
            from fastapi import HTTPException
            raise HTTPException(status_code=404, detail="Board not found")
            
        board = res.data[0]
        
        # 2. Check if the user is the owner
        if board["owner_id"] == user_id:
            return board
            
        # 3. If not the owner, check if they are an invited member
        member_check = self.client.table("board_members").select("*").eq("board_id", board_id).eq("user_id", user_id).execute()
        if not member_check.data:
            from fastapi import HTTPException
            raise HTTPException(status_code=403, detail="You do not have access to this board")
            
        return board

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
    
    def get_board_members(self, board_id: str):
        # Fetch the users from the board_members table
        res = self.client.table("board_members").select("user_id, users:user_id(id, email, first_name, last_name)").eq("board_id", board_id).execute()
        
        # Clean up the response
        members = []
        for item in res.data:
            # Note: Supabase auth.users isn't directly queryable this way by default unless exposed. 
            # If 'users' join fails due to Supabase auth schema restrictions, 
            # we will return just the user_id for now.
            members.append(item)
        return members
    
    def get_board_member_emails(self, board_id: str):
        # 1. Get the board owner's ID
        board = self.client.table("boards").select("owner_id").eq("id", board_id).execute()
        owner_id = board.data[0]["owner_id"]
        
        # 2. Get all invited member IDs
        members = self.client.table("board_members").select("user_id").eq("board_id", board_id).execute()
        
        # 3. Combine owner and member IDs into one list
        all_user_ids = [owner_id]
        for m in members.data:
            all_user_ids.append(m["user_id"])
            
        # 4. Fetch the emails from the profiles table for all these IDs at once
        profiles = self.client.table("profiles").select("email").in_("id", all_user_ids).execute()
        
        # Extract the emails and return a unique list
        emails = [p["email"] for p in profiles.data]
        return list(set(emails))