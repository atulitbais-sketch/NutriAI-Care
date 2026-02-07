from fastapi import FastAPI
from app.api.lab import router as labs_router

app = FastAPI()

app.include_router(labs_router, prefix="/api")
