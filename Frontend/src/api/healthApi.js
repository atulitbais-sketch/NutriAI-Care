export async function analyzeLabs(labData) {

  const res = await fetch("http://127.0.0.1:8000/api/labs/analyze", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(labData)
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.detail || "Analysis failed");
  }

  return data;
}