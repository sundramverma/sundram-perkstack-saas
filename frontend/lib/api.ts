const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

/* ================= PUBLIC AUTH REQUEST (LOGIN / REGISTER) ================= */
export async function authRequest(
  path: string,
  options: RequestInit = {}
) {
  if (!API_URL) {
    throw new Error("API URL not defined");
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  let data: any = {};
  try {
    data = await res.json();
  } catch {}

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
  if (!API_URL) {
    throw new Error("API URL not defined");
  }

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

  let data: any = {};
  try {
    data = await res.json();
  } catch {}

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
  if (!API_URL) {
    throw new Error("API URL not defined");
  }

  const res = await fetch(`${API_URL}/api/deals`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch deals");
  }

  return res.json();
}
