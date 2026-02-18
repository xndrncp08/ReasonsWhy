import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getMessages } from "@/lib/actions";
import Navigation from "@/components/Navigation";
import MessageList from "@/components/MessageList";
import RandomReason from "@/components/RandomReason";
import OnThisDay from "@/components/OnThisDay";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { messages, currentUser, otherUser, unreadCount } = await getMessages();

  if (!currentUser) redirect("/login");

  return (
    <div className="min-h-screen relative">
      {/* Background */}
      <div className="bg-canvas">
        <div className="bg-orb bg-orb-1" />
        <div className="bg-orb bg-orb-2" />
        <div className="bg-orb bg-orb-3" />
      </div>

      <div className="relative z-10">
        <Navigation
          unreadCount={unreadCount ?? 0}
          partnerName={(otherUser as any)?.name}
        />

        <main className="max-w-2xl mx-auto px-4 pb-24">
          {/* Header */}
          <div className="text-center py-8 animate-fade-in">
            <h1 className="font-script text-4xl text-[#3d2f22] mb-1">
              Our Story
            </h1>
            <p className="font-serif italic text-[#a89888] text-sm">
              {messages.length === 0
                ? "Your story starts here"
                : `${messages.length} reason${messages.length !== 1 ? "s" : ""} and counting`}
            </p>
          </div>

          <OnThisDay messages={messages} currentUser={currentUser} />

          {messages.length > 0 && (
            <RandomReason messages={messages} currentUser={currentUser} />
          )}

          <MessageList
            initialMessages={messages}
            currentUser={currentUser}
            otherUser={otherUser ?? null}
          />
        </main>

        {/* Floating compose button */}
        <div className="fixed bottom-8 right-1/2 translate-x-1/2 sm:right-8 sm:translate-x-0 z-40">
          <Link
            href="/new"
            className="btn-primary flex items-center gap-2 px-6 py-3.5 rounded-full text-sm font-medium shadow-lg"
          >
            <span className="text-lg leading-none">+</span>
            <span>Add a reason</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
