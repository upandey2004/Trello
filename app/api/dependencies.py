# app/api/dependencies.py
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from supabase import Client
from app.db.supabase import get_supabase_client

# This tells FastAPI where the login route is, so the Swagger UI knows how to authenticate
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")

def get_current_user(
    token: str = Depends(oauth2_scheme), 
    client: Client = Depends(get_supabase_client)
):
    try:
        # Ask Supabase to verify the JWT token
        res = client.auth.get_user(jwt=token)
        if not res or not res.user:
            raise Exception("User not found")
        return res.user
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired authentication token",
            headers={"WWW-Authenticate": "Bearer"},
        )