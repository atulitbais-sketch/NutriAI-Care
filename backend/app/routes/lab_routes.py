from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.lab_model import LabReport
from app.schemas.lab_schema import LabInput
from app.services.lab_interpreter import interpret_labs

router = APIRouter(prefix="/labs", tags=["Labs"])


@router.post("/analyze")
def analyze_labs(data: LabInput, db: Session = Depends(get_db)):

    labs_dict = data.model_dump()

    result = interpret_labs(labs_dict)

    report = LabReport(
        user_id=1,
        age=data.age,
        gender=data.gender,
        hemoglobin=data.hemoglobin,
        vitamin_d=data.vitamin_d,
        fasting_sugar=data.fasting_sugar,
        risk_level="Calculated",
        ai_explanation=result
    )

    db.add(report)
    db.commit()
    db.refresh(report)

    return {
        "report_id": report.id,
        "analysis": result
    }


@router.get("/user/{user_id}")
def get_user_reports(user_id: int, db: Session = Depends(get_db)):

    reports = db.query(LabReport).filter(
        LabReport.user_id == user_id
    ).all()

    return reports