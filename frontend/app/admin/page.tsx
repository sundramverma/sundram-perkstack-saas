"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";

export default function AdminDashboard() {
  const [users, setUsers] = useState<any[]>([]);
  const [error, setError] = useState("");

  const loadUsers = () => {
    apiRequest("/api/admin/users").then((res: any) => {
      if (res?.error) {
        setError(res.message || "Admin access only");
        setUsers([]);
      } else {
        setUsers(Array.isArray(res) ? res : []);
      }
    });
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const updateClaim = async (
    userId: string,
    dealId: string,
    status: "approved" | "rejected"
  ) => {
    await apiRequest("/api/admin/claim-action", {
      method: "POST",
      body: JSON.stringify({ userId, dealId, status }),
    });

    alert(`Claim ${status}`);
    loadUsers(); // refresh list
  };

  return (
    <div className="p-10 space-y-6 text-white">
      <h1 className="text-3xl font-bold">🛠 Admin Dashboard</h1>

      {error && <p className="text-red-500">{error}</p>}

      {users.map((u) => (
        <div
          key={u._id}
          className="border border-gray-700 p-4 rounded-xl space-y-3"
        >
          <div>
            <p className="font-semibold">{u.name}</p>
            <p className="text-sm text-gray-400">{u.email}</p>
          </div>

          {/* 🔥 CLAIM REQUESTS */}
          {u.claims?.length > 0 ? (
            u.claims.map((c: any) => (
              <div
                key={c.dealId}
                className="border border-gray-600 p-3 rounded flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">{c.dealTitle}</p>
                  <p className="text-xs text-gray-400">
                    Status: {c.status}
                  </p>
                </div>

                {c.status === "pending" && (
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        updateClaim(u._id, c.dealId, "approved")
                      }
                      className="px-3 py-1 bg-green-600 rounded text-sm"
                    >
                      Approve
                    </button>

                    <button
                      onClick={() =>
                        updateClaim(u._id, c.dealId, "rejected")
                      }
                      className="px-3 py-1 bg-red-600 rounded text-sm"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">
              No claims from this user
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
