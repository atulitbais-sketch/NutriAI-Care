from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.models.lab_model import LabReport
from app.services.lab_interpreter import interpret_labs
from app.models.lab_input import LabInput

router = APIRouter(
    prefix="/labs",
    tags=["Labs"]
)

# Database dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/analyze")
async def analyze_labs(
    data: LabInput,
    db: Session = Depends(get_db)
):
    labs_dict = data.model_dump()
    result = interpret_labs(labs_dict)

    report = LabReport(
        age=data.age,
        gender=data.gender,
        hemoglobin=data.hemoglobin,
        vitamin_d=data.vitamin_d,
        fasting_sugar=data.fasting_sugar,
        risk_level="Calculated",
        ai_explanation=result
    )
    
    @router.get("/history")
    def get_history(db: Session = Depends(get_db)):
        reports = db.query(LabReport).all()

        return reports

    db.add(report)
    db.commit()
    db.refresh(report)
    
    @router.get("/{report_id}")
    def get_report(report_id: int, db: Session = Depends(get_db)):
        report = db.query(LabReport).filter(
            LabReport.id == report_id
            ).first()
        
        if not report:
            return {"error": "Report not found"}
        return report

    return {
        "report_id": report.id,
        "analysis": result
    }
