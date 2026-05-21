from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class TicketCreate(BaseModel):
    name: str
    description: Optional[str] = None
    section_id: str
    assigned_to: Optional[str] = None
    is_done: Optional[bool] = False

class TicketUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    section_id: Optional[str] = None
    assigned_to: Optional[str] = None
    is_done: Optional[bool] = None

class TicketResponse(BaseModel):
    id: str
    section_id: str
    name: str
    description: Optional[str] = None
    assigned_to: Optional[str] = None
    created_by: Optional[str] = None
    is_done: Optional[bool] = False
    created_at: datetime