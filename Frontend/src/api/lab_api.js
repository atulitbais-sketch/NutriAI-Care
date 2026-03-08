const API_URL = "http://127.0.0.1:8000";

export const getUserLabs = async (userId) => {
  const res = await fetch(`${API_URL}/api/labs/user/${userId}`);
  return res.json();
};

export const createLab = async (labData) => {
  const res = await fetch(`${API_URL}/api/labs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(labData)
  });

  return res.json();
};