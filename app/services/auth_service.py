from supabase import Client
from fastapi import HTTPException, status
from app.schemas.user import UserCreate

class AuthService:
    def __init__(self, client: Client):
        self.client = client

    def register_user(self, user_in: UserCreate):
        try:
            return self.client.auth.sign_up({
                "email": user_in.email,
                "password": user_in.password,
                "options": {
                    "data": {
                        "first_name": user_in.first_name,
                        "last_name": user_in.last_name
                    }
                }
            })
        except Exception as e:
            raise HTTPException(status_code=400, detail=str(e))

    def login_user(self, email: str, password: str):
        try:
            return self.client.auth.sign_in_with_password({
                "email": email,
                "password": password
            })
        except Exception as e:
            raise HTTPException(status_code=401, detail="Invalid credentials")