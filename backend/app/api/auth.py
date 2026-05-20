from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from supabase import Client
from app.db.supabase import get_supabase_client
from app.schemas.user import UserCreate
from app.services.auth_service import AuthService

router = APIRouter()

@router.post("/register")
def register(user_in: UserCreate, client: Client = Depends(get_supabase_client)):
    service = AuthService(client)
    res = service.register_user(user_in)
    return {"message": "User registered successfully", "user_id": res.user.id}

@router.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    client: Client = Depends(get_supabase_client)
):
    try:
        res = client.auth.sign_in_with_password({
            "email": form_data.username,
            "password": form_data.password
        })

        if not res.session:
            raise HTTPException(status_code=401, detail="Invalid credentials")

        return {
            "access_token": res.session.access_token,
            "token_type": "bearer"
        }

    except Exception:
        raise HTTPException(status_code=401, detail="Invalid email or password")