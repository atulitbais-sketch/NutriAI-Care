from fastapi import APIRouter
from pydantic import BaseModel
from app.services.lab_interpreter import interpret_labs

router = APIRouter()

class LabInput(BaseModel):
    age: int
    gender: str
    hemoglobin: float
    vitamin_d: float
    fasting_sugar: float


@router.post("/labs/analyze")
def analyze_labs(data: LabInput):

    labs = {
        "age": data.age,
        "gender": data.gender,
        "hemoglobin": data.hemoglobin,
        "vitamin_d": data.vitamin_d,
        "fasting_sugar": data.fasting_sugar
    }

    result = interpret_labs(labs)

    return {
        "analysis": result
    }