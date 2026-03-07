from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.auth_routes import router as auth_router
from app.routes.lab_report import router as lab_router   
from app.db.database import engine
from app.models.user_model import Base
from app.models.lab_model import LabReport              
app = FastAPI()

# ✅ CORS first
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ then routers
app.include_router(auth_router, prefix="/api")
app.include_router(lab_router, prefix="/api")   

# ✅ create tables
Base.metadata.create_all(bind=engine)

@app.get("/")
def root():
    return {"message": "NutriAI backend running"}