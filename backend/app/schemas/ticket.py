from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class TicketCreate(BaseModel):
    name: str
    description: Optional[str] = None
    section_id: str
    assigned_to: Optional[str] = None

class TicketUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    section_id: Optional[str] = None # Allows moving the ticket to another list
    assigned_to: Optional[str] = None

class TicketResponse(BaseModel):
    id: str
    section_id: str
    name: str
    description: Optional[str] = None
    assigned_to: Optional[str] = None
    created_by: Optional[str] = None
    created_at: datetime
