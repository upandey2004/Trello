from supabase import Client
from fastapi import HTTPException, status
from app.schemas.user import UserCreate


class AuthService:
    def __init__(self, client: Client):
        self.client = client

    def register_user(self, user_in: UserCreate):
        try:
            res = self.client.auth.sign_up({
                "email": user_in.email,
                "password": user_in.password,
                "options": {
                    "data": {
                        "first_name": user_in.first_name,
                        "last_name": user_in.last_name
                    }
                }
            })

            return res

        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=str(e)
            )

    def login_user(self, email: str, password: str):
        res = self.client.auth.sign_in_with_password({
            "email": email,
            "password": password
        })

        if not res.session:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )

        return res