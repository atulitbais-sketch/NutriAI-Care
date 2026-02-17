import requests
from fastapi import HTTPException


OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL = "mistral"


# ------------------------------
# Reference Ranges by Gender
# ------------------------------
REFERENCE_RANGES = {
    "male": {
        "hemoglobin": (13.5, 17.5),
    },
    "female": {
        "hemoglobin": (12.0, 15.5),
    },
    "all": {
        "vitamin_d": (20, 50),
        "fasting_sugar": (70, 100),
    }
}


# ------------------------------
# Severity Calculation
# ------------------------------
def calculate_severity(value, low, high):
    if value < low:
        diff = low - value
        if diff < 2:
            return "Mild"
        elif diff < 5:
            return "Moderate"
        else:
            return "Severe"

    elif value > high:
        diff = value - high
        if diff < 10:
            return "Mild"
        elif diff < 25:
            return "Moderate"
        else:
            return "Severe"

    return "Normal"


# ------------------------------
# Risk Scoring
# ------------------------------
def calculate_risk_score(results):
    score = 0

    for r in results:
        if r["severity"] == "Mild":
            score += 1
        elif r["severity"] == "Moderate":
            score += 2
        elif r["severity"] == "Severe":
            score += 3

    if score == 0:
        return "Low Risk"
    elif score <= 3:
        return "Moderate Risk"
    else:
        return "High Risk"


# ------------------------------
# Nutrition Engine
# ------------------------------
def nutrition_recommendation(lab, status):
    recommendations = {
        "hemoglobin": {
            "Low": "Increase iron-rich foods like spinach, lentils, red meat.",
        },
        "vitamin_d": {
            "Low": "Increase sunlight exposure and consume fortified dairy or supplements.",
        },
        "fasting_sugar": {
            "High": "Reduce refined sugar, increase fiber intake, exercise regularly.",
        }
    }

    return recommendations.get(lab, {}).get(status, "Maintain balanced diet.")


# ------------------------------
# Main Function
# ------------------------------
def interpret_labs(labs: dict) -> str:
    try:
        age = labs["age"]
        gender = labs["gender"]

        results = []

        for lab, value in labs.items():
            if lab in ["age", "gender"]:
                continue

            # Select correct range
            if lab in REFERENCE_RANGES.get(gender, {}):
                low, high = REFERENCE_RANGES[gender][lab]
            else:
                low, high = REFERENCE_RANGES["all"].get(lab, (None, None))

            if low is None:
                continue

            if value < low:
                status = "Low"
            elif value > high:
                status = "High"
            else:
                status = "Normal"

            severity = calculate_severity(value, low, high)
            nutrition = nutrition_recommendation(lab, status)

            results.append({
                "lab": lab,
                "value": value,
                "status": status,
                "severity": severity,
                "nutrition": nutrition
            })

        risk = calculate_risk_score(results)

        # Structured summary for LLM
        summary_lines = []
        for r in results:
            summary_lines.append(
                f"{r['lab']}: {r['value']} → {r['status']} ({r['severity']})"
            )

        structured_summary = "\n".join(summary_lines)

        prompt = f"""
You are a medical lab interpretation assistant.
Do NOT diagnose.

Patient age: {age}
Gender: {gender}

Clinical evaluation:
{structured_summary}

Overall Risk Level: {risk}

Explain results in simple language.
Give output in this format:
- Overall Risk
- Explanation
- Lifestyle Advice
"""

        response = requests.post(
            OLLAMA_URL,
            json={
                "model": MODEL,
                "prompt": prompt,
                "stream": False
            },
            timeout=120
        )

        if response.status_code != 200:
            raise HTTPException(status_code=500, detail=response.text)

        data = response.json()
        return data.get("response", "").strip()

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
