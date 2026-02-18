"use client";

import { useState } from "react";
import { toggleReaction } from "@/lib/actions";

interface Reaction {
  emoji: string;
  count: number;
  reacted: boolean;
}

interface ReactionBarProps {
  messageId: string;
  reactions: Reaction[];
}

const EMOJIS = ["♡", "🥹", "😊", "💋"];

export default function ReactionBar({
  messageId,
  reactions,
}: ReactionBarProps) {
  const [open, setOpen] = useState(false);
  const [localReactions, setLocalReactions] = useState<Reaction[]>(reactions);

  async function handleReact(emoji: string) {
    setOpen(false);

    // Optimistic update
    setLocalReactions((prev) => {
      const existing = prev.find((r) => r.emoji === emoji);
      if (existing) {
        return prev.map((r) =>
          r.emoji === emoji
            ? {
                ...r,
                count: r.reacted ? r.count - 1 : r.count + 1,
                reacted: !r.reacted,
              }
            : r,
        );
      }
      return [...prev, { emoji, count: 1, reacted: true }];
    });

    await toggleReaction(messageId, emoji);
  }

  const active = localReactions.filter((r) => r.count > 0);

  return (
    <div className="flex items-center gap-1.5 mt-2 flex-wrap max-w-full">
      {active.map((r) => (
        <button
          key={r.emoji}
          onClick={() => handleReact(r.emoji)}
          className={`text-xs px-2 py-0.5 rounded-full border transition-all duration-200 flex items-center gap-1 ${
            r.reacted
              ? "bg-[#fce8e4] border-[#f0a898] text-[#c85540]"
              : "bg-white/40 border-[#e8d0c0] text-[#a89888]"
          }`}
        >
          <span>{r.emoji}</span>
          <span className="font-sans">{r.count}</span>
        </button>
      ))}

      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="text-xs px-2 py-0.5 rounded-full border border-[#e8d0c0] text-[#c8b8a8] hover:bg-white/40 transition-all duration-200"
        >
          +
        </button>

        {open && (
          <div className="absolute bottom-8 left-0 glass-card px-3 py-2 flex gap-2 rounded-xl z-10 shadow-lg">
            {EMOJIS.map((emoji) => (
              <button
                key={emoji}
                onClick={() => handleReact(emoji)}
                className="text-lg hover:scale-125 transition-transform duration-150 p-1"
              >
                {emoji}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
