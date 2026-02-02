"use client";

import { useState } from "react";
import { authRequest } from "@/lib/api";

type Role = "user" | "admin";

export default function LoginPage() {
  const [role, setRole] = useState<Role>("user");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await authRequest("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password, role }),
      });

      if (res?.error) {
        throw new Error(res.message || "Login failed");
      }

      // ✅ SESSION STORAGE
      sessionStorage.setItem("perkstack_token", res.token);
      sessionStorage.setItem("perkstack_role", res.role);

      const params = new URLSearchParams(window.location.search);
      const redirect = params.get("redirect");

      window.location.href =
        redirect || (res.role === "admin" ? "/admin" : "/dashboard");
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center text-white">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm border border-gray-700 rounded-xl p-6 space-y-4"
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

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <input
          type="email"
          required
          placeholder="Email"
          className="w-full p-2 bg-black border border-gray-700 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          required
          placeholder="Password"
          className="w-full p-2 bg-black border border-gray-700 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 py-2 rounded-xl"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
