from fastapi import FastAPI
from app.api.lab import router as labs_router
from app.api.health import router as health_router


app = FastAPI()

app.include_router(labs_router, prefix="/api")
app.include_router(health_router, prefix="/api")