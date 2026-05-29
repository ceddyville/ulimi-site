"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { adminLogin, verifyToken } from "@/lib/adminApi";

const TOKEN_KEY = "ulimi_admin_token";

export default function AdminLoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  // If already logged in, redirect immediately
  useEffect(() => {
    const stored = localStorage.getItem(TOKEN_KEY);
    if (!stored) { setChecking(false); return; }
    verifyToken(stored)
      .then((u) => {
        if (u.is_staff) router.replace(params.get("next") ?? "/");
        else { localStorage.removeItem(TOKEN_KEY); setChecking(false); }
      })
      .catch(() => { localStorage.removeItem(TOKEN_KEY); setChecking(false); });
  }, [router, params]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const token = await adminLogin(username, password);
      const user = await verifyToken(token);
      if (!user.is_staff) {
        setError("This account does not have admin access.");
        setLoading(false);
        return;
      }
      localStorage.setItem(TOKEN_KEY, token);
      router.replace(params.get("next") ?? "/");
    } catch {
      setError("Invalid username or password.");
      setLoading(false);
    }
  }

  if (checking) return null;

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4">
      <div className="w-full max-w-[360px]">
        <div className="text-center mb-8">
          <div className="text-[11px] font-medium tracking-[0.15em] uppercase text-ink3 mb-2">
            Ulimi Dictionary
          </div>
          <h1 className="font-[family-name:var(--font-cormorant)] text-[32px] font-bold text-ink">
            Admin access
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-medium text-ink3 tracking-[0.08em] uppercase">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
              className="w-full bg-cream border border-border rounded px-3 py-2.5 text-[14px] text-ink outline-none focus:border-ochre focus:ring-1 focus:ring-ochre/30 font-[family-name:var(--font-jost)]"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-medium text-ink3 tracking-[0.08em] uppercase">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              className="w-full bg-cream border border-border rounded px-3 py-2.5 text-[14px] text-ink outline-none focus:border-ochre focus:ring-1 focus:ring-ochre/30 font-[family-name:var(--font-jost)]"
            />
          </div>

          {error && (
            <p className="text-[12px] text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-1 bg-ink text-cream text-[12px] font-medium tracking-[0.08em] uppercase py-3 rounded cursor-pointer hover:bg-ochre-d transition-colors disabled:opacity-50 font-[family-name:var(--font-jost)]"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <div className="text-center mt-6">
          <Link href="/" className="text-[12px] text-ink3 no-underline hover:text-ochre-d transition-colors font-[family-name:var(--font-jost)]">
            ← Back to dictionary
          </Link>
        </div>
      </div>
    </div>
  );
}
