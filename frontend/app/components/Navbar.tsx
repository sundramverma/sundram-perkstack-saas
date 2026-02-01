"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const isLoggedIn =
    typeof window !== "undefined" &&
    localStorage.getItem("perkstack_token");

  const logout = () => {
    localStorage.removeItem("perkstack_token");
    router.push("/login");
  };

  return (
    <nav className="w-full border-b px-6 py-3 flex justify-between items-center">
      <Link href="/" className="font-bold text-lg">
        PerkStack
      </Link>

      <div className="flex gap-4 text-sm items-center">
        <Link href="/deals">Deals</Link>

        {isLoggedIn ? (
          <>
            <Link href="/dashboard">Dashboard</Link>
            <button onClick={logout} className="text-red-600">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login">Login</Link>
            <Link href="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
