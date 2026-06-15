const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000/api";

export const signup = async (userData) => {
  const response = await fetch(`${API_BASE}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || "Signup failed");
  return data;
};

export const login = async (userData) => {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || "Login failed");
  return data;
};

export const analyzeLabs = async (labData) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE}/labs/analyze`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(labData),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || "Analysis failed");
  return data;
};