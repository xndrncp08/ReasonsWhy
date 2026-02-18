"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "@/lib/actions";

interface NavProps {
  unreadCount: number;
  partnerName?: string;
}

export default function Navigation({ unreadCount, partnerName }: NavProps) {
  const pathname = usePathname();

  return (
    <nav className="glass-nav sticky top-0 z-50">
      <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/home" className="flex items-center gap-2 group">
          <span className="text-xl group-hover:scale-110 transition-transform duration-200">
            ♡
          </span>
          <span className="font-script text-2xl text-[#3d2f22]">
            Reasons Why
          </span>
        </Link>

        <div className="flex items-center gap-3">
          {partnerName && (
            <span className="hidden sm:block text-xs text-[#b8a898] font-sans">
              with {partnerName}
            </span>
          )}

          <Link
            href="/home"
            className={`relative p-2 rounded-xl transition-all duration-200 text-sm font-medium ${
              pathname === "/home"
                ? "bg-white/60 text-[#3d2f22]"
                : "text-[#7a6658] hover:bg-white/40"
            }`}
          >
            <span>Messages</span>
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#c85540] text-white text-[10px] font-bold rounded-full flex items-center justify-center unread-pulse">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </Link>

          <Link
            href="/summary"
            className={`p-2 rounded-xl transition-all duration-200 text-sm font-medium ${
              pathname === "/summary"
                ? "bg-white/60 text-[#3d2f22]"
                : "text-[#7a6658] hover:bg-white/40"
            }`}
          >
            Timeline
          </Link>

          <Link
            href="/new"
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              pathname === "/new" ? "btn-primary" : "btn-ghost"
            }`}
          >
            + New
          </Link>

          <form action={signOut}>
            <button
              type="submit"
              className="p-2 rounded-xl text-[#b8a898] hover:text-[#7a6658] hover:bg-white/40 transition-all duration-200 text-sm"
              title="Sign out"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16,17 21,12 16,7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </nav>
  );
}