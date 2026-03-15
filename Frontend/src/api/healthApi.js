export async function analyzeLabs(labData) {

  const res = await fetch("https://nutriai-care.onrender.com/api/labs/analyze", {
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