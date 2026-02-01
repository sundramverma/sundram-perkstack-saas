"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiRequest("/api/dashboard").then((res: any) => {
      if (res?.error) {
        setData(null);
      } else {
        // 🔥 SAFETY: ensure claims is always array
        setData({
          ...res,
          claims: Array.isArray(res.claims) ? res.claims : [],
        });
      }
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Loading dashboard...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Unauthorized
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-10 space-y-8 text-white">
      <div>
        <h1 className="text-3xl font-bold">User Dashboard</h1>
        <p className="text-gray-400">
          {data.name} • {data.email}
        </p>
      </div>

      <div className="border border-gray-700 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">
          Your Claimed Deals
        </h2>

        {data.claims.length === 0 && (
          <p className="text-gray-500">No deals claimed yet.</p>
        )}

        <ul className="space-y-3">
          {data.claims.map((claim: any) => (
            <li
              key={claim._id}
              className="flex justify-between items-center border border-gray-700 p-3 rounded"
            >
              <div>
                <p className="font-medium">{claim.title}</p>
                <p className="text-sm text-gray-400">
                  {claim.partner}
                </p>
              </div>

              <span
                className={`text-xs font-semibold px-3 py-1 rounded-full uppercase ${
                  claim.status === "approved"
                    ? "bg-green-600/20 text-green-400"
                    : claim.status === "rejected"
                    ? "bg-red-600/20 text-red-400"
                    : "bg-yellow-600/20 text-yellow-400"
                }`}
              >
                {claim.status}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
