export async function loginUser(email, password) {
  const formData = new URLSearchParams();
  formData.append("usernameS", email);
  formData.append("password", password);

  const res = await fetch("http://127.0.0.1:8000/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData.toString(),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.detail || "Login failed");
  }

  return data; // contains access_token
}