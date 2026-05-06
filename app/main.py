# app/main.py
from fastapi import FastAPI
from app.api import auth, boards 

app = FastAPI(title="Trello Clone API")

app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(boards.router, prefix="/api/v1/boards", tags=["Boards"]) 

@app.get("/health")
def health_check():
    return {"status": "System is operational"}