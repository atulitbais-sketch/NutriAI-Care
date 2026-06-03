from pydantic import BaseModel
from typing import Literal, Optional


class LabInput(BaseModel):
    age: int
    gender: Literal["male", "female"]
    hemoglobin: float
    vitamin_d: float
    fasting_sugar: float


class LabReportResponse(BaseModel):
    id: int
    user_id: int
    age: int
    gender: str
    hemoglobin: float
    vitamin_d: float
    fasting_sugar: float
    risk_level: Optional[str] = None
    ai_explanation: Optional[str] = None

    class Config:
        from_attributes = True