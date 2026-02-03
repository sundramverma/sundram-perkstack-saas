"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { apiRequest, authRequest } from "@/lib/api"; // 👈 authRequest ADD

export default function HomePage() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleExplore = () => {
    const token = sessionStorage.getItem("perkstack_token");

    if (!token) {
      router.push("/login?redirect=/deals");
      return;
    }

    router.push("/deals");
  };

  return (
    <main className="relative min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white flex items-center justify-center px-6 overflow-hidden">
      <motion.div
        initial={{ scale: 0.96 }}
        animate={{ scale: [0.96, 1.03, 0.96] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <h1 className="text-5xl md:text-6xl font-extrabold">
          Unlock Premium SaaS Perks
          <span className="block text-blue-500 mt-2">
            Built for Startups
          </span>
        </h1>

        <p className="mt-6 text-gray-300">
          PerkStack helps early-stage founders access exclusive deals without
          burning cash.
        </p>

        <div className="mt-10 flex gap-5 justify-center flex-wrap">
          <button
            onClick={handleExplore}
            className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-500"
          >
            Explore Deals
          </button>

          <Link
            href="/register"
            className="px-8 py-3 rounded-xl border border-gray-600 hover:border-blue-500"
          >
            Join as Startup
          </Link>

          <button
            onClick={() => setOpen(true)}
            className="px-8 py-3 rounded-xl border border-gray-600 hover:border-blue-500"
          >
            Login
          </button>
        </div>
      </motion.div>

      <AnimatePresence>
        {open && <LoginModal onClose={() => setOpen(false)} />}
      </AnimatePresence>
    </main>
  );
}

/* ================= LOGIN MODAL ================= */

function LoginModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [role, setRole] = useState<"user" | "admin">("user");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    // ✅ LOGIN MUST USE authRequest (NO TOKEN ATTACHED)
    const res = await authRequest("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password, role }),
    });

    if (res?.error) {
      setError(res.message);
      setLoading(false);
      return;
    }

    // ✅ SAVE FRESH TOKEN
    sessionStorage.setItem("perkstack_token", res.token);
    sessionStorage.setItem("perkstack_role", res.role);

    onClose();
    router.replace(res.role === "admin" ? "/admin" : "/dashboard");
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95 }}
        className="w-full max-w-sm bg-black border border-gray-700 rounded-2xl p-6 space-y-4"
      >
        <div className="flex border border-gray-700 rounded-xl overflow-hidden">
          <button
            type="button"
            onClick={() => setRole("user")}
            className={`w-1/2 py-2 ${
              role === "user" ? "bg-blue-600" : "bg-black"
            }`}
          >
            User
          </button>
          <button
            type="button"
            onClick={() => setRole("admin")}
            className={`w-1/2 py-2 ${
              role === "admin" ? "bg-blue-600" : "bg-black"
            }`}
          >
            Admin
          </button>
        </div>

        <h2 className="text-xl font-semibold text-center">
          {role === "admin" ? "Admin Login" : "User Login"}
        </h2>

        {error && (
          <p className="text-red-500 text-sm text-center">{error}</p>
        )}

        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 bg-black border border-gray-700 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 bg-black border border-gray-700 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-500 transition py-2 rounded-xl font-semibold"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <button
          type="button"
          onClick={onClose}
          className="w-full text-sm text-gray-400 hover:text-blue-400"
        >
          Cancel & go back
        </button>
      </motion.div>
    </motion.div>
  );
}
