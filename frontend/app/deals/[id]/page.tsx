"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";

export default function DealDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [deal, setDeal] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [error, setError] = useState("");

  // 🔐 LOGIN GUARD (SESSION STORAGE)
  useEffect(() => {
    const token = sessionStorage.getItem("perkstack_token");
    if (!token) {
      router.replace(`/login?redirect=/deals/${id}`);
    }
  }, [id, router]);

  useEffect(() => {
    const fetchDeal = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/deals/${id}`
        );

        if (!res.ok) throw new Error("Deal not found");

        const data = await res.json();

        // 🔥 IMPORTANT FIX: handle BOTH response shapes
        const dealData = data.deal ?? data;

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

        setDeal({ ...dealData, claimStatus, unlocked });
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDeal();
  }, [id]);

  const handleClaim = async () => {
    setClaiming(true);
    setError("");

    const res = await apiRequest(`/api/claim/${id}`, {
      method: "POST",
    });

    if (res?.error) {
      if (res.status === 401) {
        router.push(`/login?redirect=/deals/${id}`);
        return;
      }
      setError(res.message);
      setClaiming(false);
      return;
    }

    alert("Deal claimed! Awaiting approval.");
    router.refresh();
    setClaiming(false);
  };

  if (loading) return <p className="p-10 text-gray-500">Loading deal...</p>;
  if (!deal) return <p className="p-10 text-red-500">Deal not found</p>;

  return (
    <div className="max-w-3xl mx-auto p-10 space-y-6">
      <h1 className="text-4xl font-bold">{deal.title}</h1>

      <p className="text-gray-200">
        <strong className="text-white">Partner:</strong>{" "}
        <span className="text-blue-400">{deal.partner}</span>
      </p>

      <p className="text-gray-200">
        <strong className="text-white">Category:</strong>{" "}
        <span className="text-green-400">{deal.category}</span>
      </p>

      <p className="text-gray-200">
        <strong className="text-white">Eligibility:</strong>{" "}
        <span className="text-yellow-400">
          {deal.eligibility || "All startups"}
        </span>
      </p>

      {deal.isLocked && !deal.unlocked && (
        <div className="p-4 border border-yellow-300 rounded">
          🔒 This deal is locked. Verification or admin approval is required.
        </div>
      )}

      {deal.claimStatus && (
        <p className="text-sm text-blue-600">
          Claim status: <strong>{deal.claimStatus}</strong>
        </p>
      )}

      {!deal.claimStatus && (
        <button
          onClick={handleClaim}
          disabled={claiming}
          className="px-6 py-3 bg-black text-white rounded hover:bg-gray-800"
        >
          {claiming ? "Claiming..." : "Claim Deal"}
        </button>
      )}

      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
