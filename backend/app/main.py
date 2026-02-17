from fastapi import FastAPI
from app.api.lab import router as labs_router
from app.api.health import router as health_router
from app.db.database import Base, engine

# Import models so SQLAlchemy can detect them
from app.models import lab_model
from app.models import user_model

app = FastAPI()

# Global API prefix
app.include_router(labs_router, prefix="/api")
app.include_router(health_router, prefix="/api")

# Create tables
Base.metadata.create_all(bind=engine)


@app.get("/")
def root():
    return {"message": "NutriAI backend running 🚀"}
