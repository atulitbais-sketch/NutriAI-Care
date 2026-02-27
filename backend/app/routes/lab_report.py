from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.lab_model import LabReport
from app.schemas.lab_schema import LabInput

router = APIRouter(prefix="/labs", tags=["Lab Reports"])


@router.post("/")
def create_lab_report(report: LabInput, db: Session = Depends(get_db)):
    # simple AI logic (example)
    if report.hemoglobin < 12 or report.vitamin_d < 20:
        risk_level = "High"
        ai_explanation = "Possible anemia or vitamin D deficiency"
    else:
        risk_level = "Normal"
        ai_explanation = "Lab values are within normal range"

    new_report = LabReport(
        user_id=1,  # later replace with JWT user id
        age=report.age,
        gender=report.gender,
        hemoglobin=report.hemoglobin,
        vitamin_d=report.vitamin_d,
        fasting_sugar=report.fasting_sugar,
        risk_level=risk_level,
        ai_explanation=ai_explanation
    )

    db.add(new_report)
    db.commit()
    db.refresh(new_report)

    return new_report


@router.get("/user/{user_id}")
def get_user_labs(user_id: int, db: Session = Depends(get_db)):
    return db.query(LabReport).filter(LabReport.user_id == user_id).all()