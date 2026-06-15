import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.auth_routes import router as auth_router
from app.routes.lab_routes import router as lab_router
from app.db.database import engine, Base

app = FastAPI()

origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/api")
app.include_router(lab_router, prefix="/api")

Base.metadata.create_all(bind=engine)

@app.get("/")
def root():
    return {"message": "NutriAI backend running"}