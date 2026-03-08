const API_BASE = "http://localhost:8000/api";

export const signup = async (userData) => {
  const response = await fetch(`${API_BASE}/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(userData)
  });

  return response.json();
};

export const login = async (userData) => {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(userData)
  });

  return response.json();
};

export const analyzeLabs = async (labData) => {
  const response = await fetch(`${API_BASE}/labs/analyze`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(labData)
  });

  return response.json();
};