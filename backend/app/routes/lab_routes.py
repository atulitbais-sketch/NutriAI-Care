from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.lab_model import LabReport
from app.schemas.lab_schema import LabInput
from app.services.lab_interpreter import interpret_labs
from app.utils.auth import get_current_user_id

router = APIRouter(prefix="/labs", tags=["Labs"])


@router.post("/analyze")
def analyze_labs(
    data: LabInput,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    labs_dict = data.model_dump()

    result = interpret_labs(labs_dict)

    report = LabReport(
        user_id=current_user_id,
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
        "user_id": report.user_id,
        "analysis": result
    }


@router.get("/user/{user_id}")
def get_user_reports(
    user_id: int,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    if user_id != current_user_id:
        raise HTTPException(status_code=403, detail="Unauthorized access")

    reports = db.query(LabReport).filter(
        LabReport.user_id == user_id
    ).all()

    return reports