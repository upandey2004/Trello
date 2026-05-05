from fastapi import FastAPI
from app.api import auth

app = FastAPI(title="Trello Clone API")

app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])

@app.get("/health")
def health_check():
    return {"status": "System is operational"}