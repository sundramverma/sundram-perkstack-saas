"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { fetchDeals } from "@/lib/api";
import { motion } from "framer-motion";

type Deal = {
  _id: string;
  title: string;
  description: string;
  partner: string;
  category: string;
  isLocked: boolean;
};

export default function DealsPage() {
  const router = useRouter();

  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

  const [query, setQuery] = useState("");
  const [access, setAccess] = useState<"all" | "locked" | "unlocked">("all");

  /* ================= AUTH + FETCH DEALS ================= */
  useEffect(() => {
    const token =
      typeof window !== "undefined"
        ? sessionStorage.getItem("perkstack_token")
        : null;

    if (!token) {
      router.replace("/login?redirect=/deals");
      return;
    }

    setAuthChecked(true);

    fetchDeals()
      .then((data: any) => {
        console.log("DEALS API RESPONSE 👉", data);

        if (Array.isArray(data)) {
          setDeals(data);
        } else {
          setDeals([]);
        }
      })
      .catch((err) => {
        console.error("FETCH DEALS FAILED 👉", err);
        setDeals([]);
      })
      .finally(() => setLoading(false));
  }, [router]);

  /* ================= FILTER LOGIC ================= */
  const filteredDeals = useMemo(() => {
    return deals.filter((deal) => {
      const matchQuery =
        deal.title.toLowerCase().includes(query.toLowerCase()) ||
        deal.partner.toLowerCase().includes(query.toLowerCase());

      const matchAccess =
        access === "all" ||
        (access === "locked" && deal.isLocked) ||
        (access === "unlocked" && !deal.isLocked);

      return matchQuery && matchAccess;
    });
  }, [deals, query, access]);

  /* ================= GUARDS ================= */
  if (!authChecked) return null;

  if (loading) {
    return (
      <div className="p-10 grid gap-4 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-32 border rounded-xl animate-pulse bg-gray-100"
          />
        ))}
      </div>
    );
  }

  /* ================= UI ================= */
  return (
    <div className="p-10 space-y-6">
      <h1 className="text-3xl font-bold">🔥 PerkStack Deals</h1>

      {/* 🔎 FILTERS */}
      <div className="flex flex-col md:flex-row gap-3">
        <input
          placeholder="Search by SaaS or partner..."
          className="border rounded px-3 py-2 w-full md:w-1/2"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <select
          className="border rounded px-3 py-2 w-full md:w-48"
          value={access}
          onChange={(e) =>
            setAccess(e.target.value as "all" | "locked" | "unlocked")
          }
        >
          <option value="all">All Deals</option>
          <option value="locked">Locked Only</option>
          <option value="unlocked">Unlocked Only</option>
        </select>
      </div>

      {filteredDeals.length === 0 && (
        <p className="text-gray-500">No deals match your filters.</p>
      )}

      {/* 🧩 DEAL CARDS */}
      <div className="grid gap-4 md:grid-cols-2">
        {filteredDeals.map((deal) => (
          <motion.div
            key={deal._id}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Link
              href={`/deals/${deal._id}`}
              className="block border p-4 rounded-xl shadow-sm hover:shadow-md transition"
            >
              <h3 className="text-lg font-semibold">{deal.title}</h3>

              <p className="text-gray-600 mt-1 line-clamp-2">
                {deal.description}
              </p>

              <p className="text-sm text-blue-600 mt-2">{deal.partner}</p>

              <p className="mt-3 text-sm font-medium text-black">
                View Deal →
              </p>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
