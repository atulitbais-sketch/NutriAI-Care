const API_URL = "https://nutriai-care.onrender.com";

const getToken = () => localStorage.getItem("token");

export const analyzeLabs = async (labData) => {
  const res = await fetch(`${API_URL}/api/labs/analyze`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(labData),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.detail || "Analysis failed");
  }

  return data;
};

export const getUserLabs = async (userId) => {
  const res = await fetch(`${API_URL}/api/labs/user/${userId}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.detail || "Failed to fetch reports");
  }

  return data;
};