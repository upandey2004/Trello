from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import auth, boards,sections

app = FastAPI(title="Trello Clone API")

# --- CORS Configuration ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"], # Your Vite frontend URLs
    allow_credentials=True,
    allow_methods=["*"], # Allows GET, POST, PUT, DELETE, etc.
    allow_headers=["*"], # Allows all headers (like our Authorization Bearer token)
)

app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(boards.router, prefix="/api/v1/boards", tags=["Boards"])
app.include_router(sections.router, prefix="/api/v1/sections", tags=["Sections"])

@app.get("/health")
def health_check():
    return {"status": "System is operational"}