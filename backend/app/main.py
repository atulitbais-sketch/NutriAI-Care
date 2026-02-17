# from fastapi import FastAPI
# from app.routes.auth_routes import router as auth_router
# from app.routes.auth_routes import router as labs_router
# from app.routes.health_routes import router as health_router
# from app.db.database import engine
# from app.models.lab_model import Base

# app = FastAPI()

# # Routers
# app.include_router(auth_router, prefix="/api")
# app.include_router(labs_router, prefix="/api")
# app.include_router(health_router, prefix="/api")

# # Create tables
# Base.metadata.create_all(bind=engine)

# @app.get("/")
# def root():
#     return {"message": "NutriAI backend running "}


from fastapi import FastAPI
from app.routes.auth_routes import router as auth_router
from app.db.database import engine
from app.models.user_model import Base

app = FastAPI()

app.include_router(auth_router, prefix="/api")

Base.metadata.create_all(bind=engine)

@app.get("/")
def root():
    return {"message": "NutriAI backend running "}

