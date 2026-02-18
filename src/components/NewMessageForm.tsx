"use client";

import { useState } from "react";
import { sendMessage } from "@/lib/actions";

export default function NewMessageForm({ partnerName }: { partnerName?: string }) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const MAX_LENGTH = 500;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim() || loading) return;

    setLoading(true);
    setError("");

    const result = await sendMessage(message);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="glass-card p-8 animate-slide-up">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">♡</div>
          <h1 className="font-display text-3xl font-medium text-[#3d2f22] mb-2">
            A new reason
          </h1>
          {partnerName && (
            <p className="font-serif italic text-[#7a6658]">
              for {partnerName}
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            {/* Decorative quote */}
            <span className="absolute top-3 left-4 font-display text-4xl leading-none text-[#e8c8b8] pointer-events-none select-none">
              "
            </span>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={MAX_LENGTH}
              rows={6}
              className="glass-input w-full px-5 pt-8 pb-4 rounded-2xl text-[#3d2f22] placeholder-[#c8b8a8] font-serif text-base leading-relaxed resize-none"
              placeholder="Tell them something beautiful..."
              required
              autoFocus
            />
            <div className="absolute bottom-3 right-4 text-xs text-[#c8b8a8] font-sans">
              {message.length}/{MAX_LENGTH}
            </div>
          </div>

          {/* Prompt suggestions */}
          <div className="flex flex-wrap gap-2">
            {[
              "I love the way you...",
              "You make me feel...",
              "My favourite memory of us...",
              "Because of you...",
            ].map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => setMessage(prompt)}
                className="text-xs px-3 py-1.5 rounded-full border border-[#e8d0c0] text-[#a89888] hover:bg-white/60 hover:text-[#7a6658] transition-all duration-200 font-sans"
              >
                {prompt}
              </button>
            ))}
          </div>

          {error && (
            <div className="bg-red-50/80 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl font-sans">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <a
              href="/home"
              className="btn-ghost flex-1 py-3.5 rounded-xl text-sm font-medium text-center transition-all duration-200"
            >
              Cancel
            </a>
            <button
              type="submit"
              disabled={loading || !message.trim()}
              className="btn-primary flex-[2] py-3.5 rounded-xl text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="spinner w-4 h-4" />
                  Sending...
                </>
              ) : (
                <>
                  <span>Send with love</span>
                  <span>♡</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
