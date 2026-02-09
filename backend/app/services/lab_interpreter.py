import requests
from fastapi import HTTPException

OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL = "mistral"   

def interpret_labs(labs: dict) -> str:
    try:
        units = {
            "hemoglobin": "g/dL",
            "vitamin_d": "ng/mL",
            "fasting_sugar": "mg/dL"
        }

        formatted_labs = "\n".join(
            [f"- {k}: {v} {units.get(k, '')}" for k, v in labs.items()]
        )

        prompt = f"""
You are a medical lab interpretation assistant.
Do NOT diagnose.
Explain results in simple words.

Lab values:
{formatted_labs}

Give output in this format:
- Status (Normal/Low/High)
- Explanation (simple)
- Health note (non-alarming)
"""

        response = requests.post(
            OLLAMA_URL,
            json={
                "model": MODEL,
                "prompt": prompt,
                "stream": False
            },
            timeout=60
        )

        response.raise_for_status()
        return response.json()["response"]

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
