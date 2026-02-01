const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

/**
 * Generic API helper (AUTH + NON-AUTH)
 */
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

  let data: any = {};
  try {
    data = await res.json();
  } catch {
    // ignore JSON parse error
  }

  // ❗ Do NOT crash app on 401/403
  if (!res.ok) {
    return {
      error: true,
      status: res.status,
      message: data.message || "API Error",
    };
  }

  return data;
}

/**
 * 🔓 PUBLIC DEALS API (NO AUTH REQUIRED)
 */
export async function fetchDeals() {
  const res = await fetch(`${API_URL}/api/deals`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch deals");
  }

  return res.json();
}
