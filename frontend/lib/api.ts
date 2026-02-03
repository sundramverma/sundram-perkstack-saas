const API_URL = "https://sundram-perkstack-saas-backend.onrender.com";

/* ================= PUBLIC AUTH REQUEST ================= */
export async function authRequest(
  path: string,
  options: RequestInit = {}
) {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  const data = await res.json();

  if (!res.ok) {
    return {
      error: true,
      status: res.status,
      message: data.message || "API Error",
    };
  }

  return data;
}

/* ================= AUTHENTICATED REQUEST ================= */
export async function apiRequest(
  path: string,
  options: RequestInit = {}
) {
  const token =
    typeof window !== "undefined"
      ? sessionStorage.getItem("perkstack_token")
      : null;

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  const data = await res.json();

  if (!res.ok) {
    return {
      error: true,
      status: res.status,
      message: data.message || "API Error",
    };
  }

  return data;
}

/* ================= PUBLIC DEALS ================= */
export async function fetchDeals() {
  const res = await fetch(`${API_URL}/api/deals`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch deals");
  }

  return res.json();
}
