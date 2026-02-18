"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "@/lib/actions";
import DarkModeToggle from "./DarkModeToggle";

interface NavProps {
  unreadCount: number;
  partnerName?: string;
}

export default function Navigation({ unreadCount, partnerName }: NavProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Top bar */}
      <nav className="glass-nav sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-5 h-14 flex items-center justify-between">
          <Link href="/home" className="flex items-center gap-2 group">
            <span className="text-lg group-hover:scale-110 transition-transform duration-200">♡</span>
            <span className="font-script text-2xl text-[#3d2f22] dark:text-white leading-none">
              Reasons Why
            </span>
          </Link>

          <div className="flex items-center gap-2">
            {partnerName && (
              <span className="hidden sm:block text-xs text-[#b8a898] font-sans">
                with {partnerName}
              </span>
            )}
            <DarkModeToggle />
            <form action={signOut}>
              <button
                type="submit"
                className="p-2 rounded-xl text-[#b8a898] hover:text-[#7a6658] hover:bg-white/40 transition-all duration-200"
                title="Sign out"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16,17 21,12 16,7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      </nav>

      {/* Bottom nav — mobile only */}
      <div className="fixed bottom-0 left-0 right-0 z-50 sm:hidden glass-nav border-t border-white/20">
        <div className="flex items-center justify-around px-4 h-16">
          <Link
            href="/home"
            className={`flex flex-col items-center gap-0.5 px-4 py-2 rounded-xl transition-all duration-200 ${
              pathname === "/home" ? "text-[#c85540]" : "text-[#b8a898]"
            }`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill={pathname === "/home" ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            <span className="text-[10px] font-sans font-medium">Messages</span>
            {unreadCount > 0 && (
              <span className="absolute top-2 w-4 h-4 bg-[#c85540] text-white text-[10px] font-bold rounded-full flex items-center justify-center unread-pulse">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </Link>

          <Link
            href="/summary"
            className={`flex flex-col items-center gap-0.5 px-4 py-2 rounded-xl transition-all duration-200 ${
              pathname === "/summary" ? "text-[#c85540]" : "text-[#b8a898]"
            }`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <span className="text-[10px] font-sans font-medium">Timeline</span>
          </Link>

          <Link
            href="/new"
            className="flex flex-col items-center gap-0.5 px-5 py-2 rounded-2xl btn-primary transition-all duration-200"
          >
            <span className="text-xl leading-none text-white">+</span>
            <span className="text-[10px] font-sans font-medium text-white">New</span>
          </Link>

          <Link
            href="/settings"
            className={`flex flex-col items-center gap-0.5 px-4 py-2 rounded-xl transition-all duration-200 ${
              pathname === "/settings" ? "text-[#c85540]" : "text-[#b8a898]"
            }`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
            </svg>
            <span className="text-[10px] font-sans font-medium">Profile</span>
          </Link>
        </div>
      </div>

      {/* Desktop side links */}
      <div className="hidden sm:flex fixed top-14 left-0 right-0 z-40 justify-center gap-2 pt-3 pb-2">
        <Link
          href="/home"
          className={`relative px-4 py-1.5 rounded-xl transition-all duration-200 text-sm font-medium ${
            pathname === "/home" ? "bg-white/60 text-[#3d2f22]" : "text-[#7a6658] hover:bg-white/40"
          }`}
        >
          Messages
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#c85540] text-white text-[10px] font-bold rounded-full flex items-center justify-center unread-pulse">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Link>
        <Link
          href="/summary"
          className={`px-4 py-1.5 rounded-xl transition-all duration-200 text-sm font-medium ${
            pathname === "/summary" ? "bg-white/60 text-[#3d2f22]" : "text-[#7a6658] hover:bg-white/40"
          }`}
        >
          Timeline
        </Link>
        <Link
          href="/new"
          className="btn-primary px-4 py-1.5 rounded-xl text-sm font-medium"
        >
          + New
        </Link>
      </div>
    </>
  );
}