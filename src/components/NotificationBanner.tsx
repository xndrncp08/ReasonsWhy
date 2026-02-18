"use client";

import { useEffect, useState } from "react";

interface NotificationBannerProps {
  message: string;
  senderName: string;
  onDismiss: () => void;
}

export default function NotificationBanner({
  message,
  senderName,
  onDismiss,
}: NotificationBannerProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onDismiss, 300);
    }, 4000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div
      className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
      }`}
    >
      <div className="notification-banner glass-card px-5 py-3.5 flex items-center gap-3 min-w-64 max-w-xs">
        <span className="text-xl heart-decoration">♡</span>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-[#7a6658] font-medium mb-0.5">
            New message from {senderName}
          </p>
          <p className="text-sm font-serif text-[#3d2f22] truncate">
            {message}
          </p>
        </div>
        <button
          onClick={() => {
            setVisible(false);
            setTimeout(onDismiss, 300);
          }}
          className="text-[#c8b8a8] hover:text-[#7a6658] transition-colors flex-shrink-0 p-1"
          aria-label="Dismiss notification"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
            <path d="M11 1L1 11M1 1L11 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
