"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";
import { motion } from "framer-motion";

type Role = "user" | "admin";

export default function RegisterPage() {
  const router = useRouter();

  const [role, setRole] = useState<Role>("user");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      await apiRequest("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({
          name,
          email,
          password,
          role,
        }),
      });

      router.push("/login");
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-black text-white">
      {/* ===== BLURRED BACKGROUND ===== */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md z-10" />

      {/* ===== MODAL CARD ===== */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative z-20 min-h-screen flex items-center justify-center px-4"
      >
        <form
          onSubmit={handleRegister}
          className="w-full max-w-sm bg-black border border-gray-700 rounded-2xl p-6 space-y-4"
        >
          {/* ===== ROLE TOGGLE ===== */}
          <div className="flex border border-gray-700 rounded-xl overflow-hidden mb-2">
            <button
              type="button"
              onClick={() => setRole("user")}
              className={`w-1/2 py-2 transition ${
                role === "user" ? "bg-blue-600" : "bg-black"
              }`}
            >
              User
            </button>
            <button
              type="button"
              onClick={() => setRole("admin")}
              className={`w-1/2 py-2 transition ${
                role === "admin" ? "bg-blue-600" : "bg-black"
              }`}
            >
              Admin
            </button>
          </div>

          <h2 className="text-xl font-semibold text-center">
            {role === "admin" ? "Admin Registration" : "User Registration"}
          </h2>

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <input
            type="text"
            placeholder="Name"
            className="w-full p-2 bg-black border border-gray-700 rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 bg-black border border-gray-700 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 bg-black border border-gray-700 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 transition py-2 rounded-xl font-semibold"
          >
            {loading ? "Creating account..." : "Register"}
          </button>

          <button
            type="button"
            onClick={() => router.push("/")}
            className="w-full text-sm text-gray-400 hover:text-blue-400"
          >
            Cancel & go back
          </button>
        </form>
      </motion.div>
    </div>
  );
}
