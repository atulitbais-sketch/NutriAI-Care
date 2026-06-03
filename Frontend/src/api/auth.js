import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

axios.get(`${API_URL}/api/doctors`);
export const loginUser = async (email, password) => {

  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email,
      password
    })
  });

  if (!res.ok) {
    throw new Error("Login failed");
  }

  return res.json();
};