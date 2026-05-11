const API_BASE = import.meta.env.VITE_API_BASE_URL || "/api";

export async function apiRequest(path, options = {}) {
  const token = window.localStorage.getItem("resumeai-token");
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers
    },
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Request failed");
  }

  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/pdf")) {
    return response.blob();
  }

  return response.json();
}
