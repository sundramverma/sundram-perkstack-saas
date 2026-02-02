"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";

type Claim = {
  _id: string;
  status: "pending" | "approved" | "rejected";
  user: {
    name: string;
    email: string;
  };
  deal: {
    title: string;
  };
};

export default function AdminDashboard() {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [error, setError] = useState("");

  const loadClaims = async () => {
    const res = await apiRequest("/api/admin/claims");

    if (res?.error) {
      setError(res.message || "Admin access only");
      setClaims([]);
    } else {
      setClaims(Array.isArray(res) ? res : []);
    }
  };

  useEffect(() => {
    loadClaims();
  }, []);

  const updateClaim = async (
    claimId: string,
    action: "approve" | "reject"
  ) => {
    const res = await apiRequest(
      `/api/admin/claims/${claimId}/${action}`,
      { method: "PUT" }
    );

    if (!res?.error) {
      alert(`Claim ${action}d`);
      loadClaims();
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-10 space-y-6">
      <h1 className="text-3xl font-bold">🛠 Admin Dashboard</h1>

      {error && <p className="text-red-500">{error}</p>}

      {claims.length === 0 && !error && (
        <p className="text-gray-400">No claims found</p>
      )}

      {claims.map((c) => (
        <div
          key={c._id}
          className="border border-gray-700 p-4 rounded-xl space-y-2"
        >
          <p className="font-semibold">
            {c.user.name} ({c.user.email})
          </p>

          <p className="text-sm text-gray-300">
            Deal: <b>{c.deal.title}</b>
          </p>

          <p className="text-sm">
            Status:{" "}
            <span className="capitalize text-yellow-400">
              {c.status}
            </span>
          </p>

          {c.status === "pending" && (
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => updateClaim(c._id, "approve")}
                className="px-4 py-1 bg-green-600 rounded"
              >
                Approve
              </button>

              <button
                onClick={() => updateClaim(c._id, "reject")}
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
