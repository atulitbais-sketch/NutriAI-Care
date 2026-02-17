from pydantic import BaseModel
from typing import Literal

class LabInput(BaseModel):
    age: int
    gender: Literal["male", "female"]
    hemoglobin: float
    vitamin_d: float
    fasting_sugar: float
