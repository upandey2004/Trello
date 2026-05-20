from pydantic import BaseModel
from typing import Optional

class SectionCreate(BaseModel):
    name: str
    description: Optional[str] = None
    board_id: str

class SectionUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None

class SectionResponse(BaseModel):
    id: str
    board_id: str
    name: str
    description: Optional[str] = None