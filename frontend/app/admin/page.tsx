"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";

type AdminClaim = {
  userId: string;
  userName: string;
  userEmail: string;
  dealId: string;
  title: string;
  partner: string;
  status: "pending" | "approved" | "rejected";
};

export default function AdminDashboard() {
  const router = useRouter();

  const [claims, setClaims] = useState<AdminClaim[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  /* ================= LOAD CLAIMS ================= */
  const loadClaims = async () => {
    const res = await apiRequest("/api/admin/claims");

    if (res?.error) {
      setError(res.message || "Admin access only");
      setClaims([]);
    } else {
      setError("");
      setClaims(Array.isArray(res) ? res : []);
    }

    setLoading(false);
  };

  /* ================= ADMIN AUTH GUARD ================= */
  useEffect(() => {
    const token = sessionStorage.getItem("perkstack_token");
    const role = sessionStorage.getItem("perkstack_role");

    // 🔒 BLOCK UNAUTH / NON-ADMIN
    if (!token || role !== "admin") {
      router.replace("/login");
      return;
    }

    // ✅ SAFE TO LOAD ADMIN DATA
    loadClaims();
  }, []);

  /* ================= UPDATE CLAIM ================= */
  const updateClaim = async (
    userId: string,
    dealId: string,
    status: "approved" | "rejected"
  ) => {
    const res = await apiRequest("/api/admin/claims", {
      method: "PUT",
      body: JSON.stringify({ userId, dealId, status }),
    });

    if (!res?.error) {
      loadClaims();
    } else {
      alert(res.message || "Action failed");
    }
  };

  /* ================= UI STATES ================= */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Loading admin dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-10 space-y-6">
      <h1 className="text-3xl font-bold">🛠 Admin Dashboard</h1>

      {error && <p className="text-red-500">{error}</p>}

      {claims.length === 0 && !error && (
        <p className="text-gray-400">No claims found</p>
      )}

      {claims.map((c, idx) => (
        <div
          key={idx}
          className="border border-gray-700 p-4 rounded-xl space-y-2"
        >
          <p className="font-semibold">
            {c.userName} ({c.userEmail})
          </p>

          <p className="text-sm text-gray-300">
            Deal: <b>{c.title}</b> — {c.partner}
          </p>

          <p className="text-sm">
            Status:{" "}
            <span
              className={`capitalize ${
                c.status === "pending"
                  ? "text-yellow-400"
                  : c.status === "approved"
                  ? "text-green-400"
                  : "text-red-400"
              }`}
            >
              {c.status}
            </span>
          </p>

          {c.status === "pending" && (
            <div className="flex gap-3 pt-2">
              <button
                onClick={() =>
                  updateClaim(c.userId, c.dealId, "approved")
                }
                className="px-4 py-1 bg-green-600 rounded"
              >
                Approve
              </button>

              <button
                onClick={() =>
                  updateClaim(c.userId, c.dealId, "rejected")
                }
                className="px-4 py-1 bg-red-600 rounded"
              >
                Reject
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
