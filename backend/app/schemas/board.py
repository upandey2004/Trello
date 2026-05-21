# app/schemas/board.py
from pydantic import BaseModel
from typing import Optional

class BoardCreate(BaseModel):
    name: str
    description: Optional[str] = None

class BoardResponse(BoardCreate):
    id: str
    owner_id: str
    invitation_token: str

class BoardUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None