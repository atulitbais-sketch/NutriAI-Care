from fastapi import APIRouter
from app.models.lab_input import LabInput
from app.services.lab_interpreter import interpret_labs

router = APIRouter()

@router.post("/labs/analyze")
def analyze_labs(data: LabInput):
    result = interpret_labs(data.model_dump())
    return {"analysis": result}
