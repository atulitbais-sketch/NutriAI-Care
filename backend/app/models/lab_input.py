from pydantic import BaseModel, Field
from typing import Literal

class LabInput(BaseModel):
        age: int = Field(..., example=30)
        gender: Literal["male", "female"] = Field(..., example="male")
        hemoglobin: float = Field(..., example=13.5)
        vitamin_d: float = Field(..., example=25)
        fasting_sugar: float = Field(..., example=95)
