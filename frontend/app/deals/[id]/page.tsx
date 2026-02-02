"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";

export default function DealDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [deal, setDeal] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [error, setError] = useState("");

  /* ================= AUTH GUARD ================= */
  useEffect(() => {
    const token = sessionStorage.getItem("perkstack_token");
    if (!token) {
      router.replace(`/login?redirect=/deals/${id}`);
    }
  }, [id, router]);

  /* ================= FETCH DEAL + CLAIM STATUS ================= */
  useEffect(() => {
    if (!id) return;

    const fetchDeal = async () => {
      try {
        // ✅ ALWAYS use apiRequest (correct base URL + headers)
        const data = await apiRequest(`/api/deals/${id}`);
        if (data?.error) throw new Error(data.message);

        let claimStatus = null;
        let unlocked = false;

        const token = sessionStorage.getItem("perkstack_token");
        if (token) {
          const userRes = await apiRequest(`/api/user-deals/${id}`);
          if (!userRes?.error) {
            claimStatus = userRes.claimStatus;
            unlocked = userRes.unlocked;
          }
        }

        setDeal({ ...data, claimStatus, unlocked });
      } catch (err: any) {
        setError(err.message || "Failed to load deal");
      } finally {
        setLoading(false);
      }
    };

    fetchDeal();
  }, [id]);

  /* ================= CLAIM DEAL ================= */
  const handleClaim = async () => {
    setClaiming(true);
    setError("");

    const res = await apiRequest(`/api/claim/${id}`, {
      method: "POST",
    });

    if (res?.error) {
      if (res.status === 401) {
        router.replace(`/login?redirect=/deals/${id}`);
        return;
      }
      setError(res.message || "Claim failed");
      setClaiming(false);
      return;
    }

    alert("Deal claimed! Awaiting admin approval.");
    router.refresh(); // re-fetch server state
    setClaiming(false);
  };

  /* ================= UI ================= */
  if (loading) {
    return <p className="p-10 text-gray-400">Loading deal...</p>;
  }

  if (!deal) {
    return <p className="p-10 text-red-500">Deal not found</p>;
  }

  return (
    <div className="max-w-3xl mx-auto p-10 space-y-6 text-white">
      <h1 className="text-4xl font-bold">{deal.title}</h1>

      <p>
        <b>Partner:</b>{" "}
        <span className="text-blue-400">{deal.partner}</span>
      </p>

      <p>
        <b>Category:</b>{" "}
        <span className="text-green-400">{deal.category}</span>
      </p>

      <p>
        <b>Eligibility:</b>{" "}
        <span className="text-yellow-400">
          {deal.eligibility || "All startups"}
        </span>
      </p>

      {deal.isLocked && !deal.unlocked && (
        <div className="p-4 border border-yellow-400 rounded">
          🔒 This deal is locked. Admin approval or verification required.
        </div>
      )}

      {deal.claimStatus && (
        <p className="text-sm text-blue-400">
          Claim status: <b>{deal.claimStatus}</b>
        </p>
      )}

      {!deal.claimStatus && (
        <button
          onClick={handleClaim}
          disabled={claiming}
          className="px-6 py-3 bg-blue-600 rounded hover:bg-blue-500"
        >
          {claiming ? "Claiming..." : "Claim Deal"}
        </button>
      )}

      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
