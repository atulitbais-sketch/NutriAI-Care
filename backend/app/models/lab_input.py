from pydantic import BaseModel

class LabInput(BaseModel):
        hemoglobin: float
        vitamin_d: float
        fasting_sugar: float