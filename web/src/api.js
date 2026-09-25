const API_URL = "https://studymate-4tj1.onrender.com";

export async function testBackend() {
  const response = await fetch(`${API_URL}/api/test`);
  const data = await response.json();

  return data;
}

export async function signupUser(name, email, password) {
  const response = await fetch(`${API_URL}/api/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      email,
      password,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Signup failed");
  }

  return data;
}

export async function loginUser(email, password) {
  const response = await fetch(`${API_URL}/api/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Login failed");
  }

  return data;
}