from sqlalchemy import Column, Integer, Float, String, ForeignKey, Text
from app.db.database import Base

class LabReport(Base):
    __tablename__ = "lab_reports"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))

    age = Column(Integer)
    gender = Column(String(10))
    hemoglobin = Column(Float)
    vitamin_d = Column(Float)
    fasting_sugar = Column(Float)

    risk_level = Column(String(50))
    ai_explanation = Column(Text)
