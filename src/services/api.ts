const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export async function api(endpoint: string, { body, token, method, ...options }: any = {}) {
  const res = await fetch(`${API_URL}${endpoint}`, {
    method: method ?? (body ? "POST" : "GET"),
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...(body && { body: JSON.stringify(body) }),
    ...options,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ message: "An unknown error occurred" }));
    throw errorData;
  }
  
  return res.json();
}
