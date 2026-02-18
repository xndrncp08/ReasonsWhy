"use client";

import { useState } from "react";
import { signIn } from "@/lib/actions";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = await signIn(email, password);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated background */}
      <div className="bg-canvas">
        <div className="bg-orb bg-orb-1" />
        <div className="bg-orb bg-orb-2" />
        <div className="bg-orb bg-orb-3" />
      </div>

      <div className="relative z-10 w-full max-w-md px-6">
        {/* Logo area */}
        <div className="text-center mb-10 animate-fade-in">
          <div className="heart-decoration text-5xl mb-4 inline-block">♡</div>
          <h1 className="font-script text-5xl text-warm-800 mb-2">
            Reasons Why
          </h1>
          <p className="font-serif text-soft-text text-lg italic text-[#7a6658]">
            a place just for the two of us
          </p>
        </div>

        {/* Login card */}
        <div
          className="glass-card p-8 animate-slide-up"
          style={{ animationDelay: "0.1s", opacity: 0 }}
        >
          <h2 className="font-display text-2xl font-medium text-warm-800 text-center mb-6 text-[#3d2f22]">
            Welcome back
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-[#7a6658] mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="glass-input w-full px-4 py-3 rounded-xl text-[#3d2f22] placeholder-[#b8a898] text-sm"
                placeholder="your@email.com"
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#7a6658] mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="glass-input w-full px-4 py-3 rounded-xl text-[#3d2f22] placeholder-[#b8a898] text-sm"
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
            </div>

            {error && (
              <div className="bg-red-50/80 backdrop-blur border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3.5 rounded-xl font-medium text-sm tracking-wide disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="spinner w-4 h-4" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-[#b8a898] mt-6">
          This is a private space — by invitation only ♡
        </p>
      </div>
    </div>
  );
}
