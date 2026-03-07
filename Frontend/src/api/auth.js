export async function loginUser(email, password) {
  const res = await fetch("http://127.0.0.1:8000/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    console.log("Login error:", data); // helps debugging
    throw new Error(data.detail || "Login failed");
  }

  return data; // contains access_token
}