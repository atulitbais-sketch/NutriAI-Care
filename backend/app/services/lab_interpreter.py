import requests

OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL = "tinyllama"   # smaller and easier to run


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


def calculate_severity(value, low, high):
    if value < low:
        diff = low - value
        if diff < 2:
            return "Mild"
        elif diff < 5:
            return "Moderate"
        else:
            return "Severe"

    if value > high:
        diff = value - high
        if diff < 10:
            return "Mild"
        elif diff < 25:
            return "Moderate"
        else:
            return "Severe"

    return "Normal"


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
    return "High Risk"


def nutrition_recommendation(lab, status):
    recommendations = {
        "hemoglobin": {
            "Low": "Increase iron-rich foods like spinach, lentils, red meat."
        },
        "vitamin_d": {
            "Low": "Increase sunlight exposure and consume fortified dairy or supplements."
        },
        "fasting_sugar": {
            "High": "Reduce refined sugar, increase fiber intake, exercise regularly."
        }
    }

    return recommendations.get(lab, {}).get(status, "Maintain a balanced diet.")


def build_rule_based_response(age, gender, results, risk):
    lines = [f"Overall Risk: {risk}", "", "Explanation:"]

    abnormal_found = False
    for r in results:
        if r["status"] != "Normal":
            abnormal_found = True
            lines.append(
                f"- {r['lab']} is {r['status'].lower()} ({r['severity'].lower()}) at {r['value']}."
            )

    if not abnormal_found:
        lines.append("- Most major values are within the expected range.")

    lines.append("")
    lines.append("Lifestyle Advice:")

    added = False
    for r in results:
        if r["status"] != "Normal":
            lines.append(f"- {r['nutrition']}")
            added = True

    if not added:
        lines.append("- Maintain balanced meals, hydration, sleep, and regular exercise.")

    return "\n".join(lines)


def interpret_labs(labs: dict) -> str:
    age = labs["age"]
    gender = labs["gender"]

    results = []

    for lab, value in labs.items():
        if lab in ["age", "gender"]:
            continue

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

    summary_lines = []
    for r in results:
        summary_lines.append(
            f"{r['lab']} = {r['value']} -> {r['status']} ({r['severity']})"
        )

    structured_summary = "\n".join(summary_lines)

    prompt = f"""
You are a medical lab interpretation assistant.
Do not diagnose.
Use simple language.

Patient age: {age}
Gender: {gender}

Lab Evaluation:
{structured_summary}

Overall Risk Level: {risk}

Give output exactly in this format:

Overall Risk:
Explanation:
Lifestyle Advice:
"""

    try:
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

        data = response.json()
        text = data.get("response", "").strip()

        if text:
            return text

    except requests.RequestException as error:
        print("Ollama request failed, using fallback:", error)

    return build_rule_based_response(age, gender, results, risk)