"use client";

import { useState } from "react";
import { Message } from "@/types";
import MessageCard from "./MessageCard";
import { User } from "@/types";

interface RandomReasonProps {
  messages: Message[];
  currentUser: User;
}

export default function RandomReason({ messages, currentUser }: RandomReasonProps) {
  const [shown, setShown] = useState<Message | null>(null);

  function pickRandom() {
    if (messages.length === 0) return;
    const random = messages[Math.floor(Math.random() * messages.length)];
    setShown(random);
  }

  return (
    <>
      <button
        onClick={pickRandom}
        className="btn-ghost w-full py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2 mb-4"
      >
        <span>✦</span>
        <span>Surprise me with a reason</span>
      </button>

      {/* Modal */}
      {shown && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm"
          onClick={() => setShown(null)}
        >
          <div
            className="glass-card p-6 max-w-sm w-full animate-notification"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-4">
              <div className="text-3xl mb-1">✦</div>
              <p className="text-xs text-[#b8a898] font-sans">a reason from the past</p>
              <p className="text-xs text-[#c8b8a8] font-sans mt-1">
                {new Date(shown.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>

            <MessageCard
              message={shown}
              isSent={shown.sender_id === currentUser.id}
            />

            <button
              onClick={() => setShown(null)}
              className="btn-ghost w-full mt-4 py-2.5 rounded-xl text-sm"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}