import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getMessages } from "@/lib/actions";
import Navigation from "@/components/Navigation";
import { Message } from "@/types";

export const dynamic = "force-dynamic";

function groupByMonth(messages: Message[]) {
  const groups: Record<string, Message[]> = {};
  messages.forEach((m) => {
    const key = new Date(m.created_at).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });
    if (!groups[key]) groups[key] = [];
    groups[key].push(m);
  });
  return groups;
}

export default async function SummaryPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { messages, currentUser, otherUser } = await getMessages();
  const grouped = groupByMonth(messages);

  return (
    <div className="min-h-screen relative">
      <div className="bg-canvas">
        <div className="bg-orb bg-orb-1" />
        <div className="bg-orb bg-orb-2" />
      </div>

      <div className="relative z-10">
        <Navigation unreadCount={0} partnerName={(otherUser as any)?.name} />

        <main className="max-w-2xl mx-auto px-4 py-8">
          <div className="text-center mb-8 animate-fade-in">
            <h1 className="font-script text-4xl text-[#3d2f22] mb-1">Our Timeline</h1>
            <p className="font-serif italic text-[#a89888] text-sm">
              {messages.length} reasons shared together
            </p>
          </div>

          <div className="flex flex-col gap-6">
            {Object.entries(grouped).reverse().map(([month, msgs]) => {
              const sentCount = msgs.filter((m) => m.sender_id === user.id).length;
              const receivedCount = msgs.length - sentCount;

              return (
                <div key={month} className="glass-card p-6 animate-fade-in">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-display text-2xl text-[#3d2f22]">{month}</h2>
                    <span className="text-xs text-[#b8a898] font-sans">
                      {msgs.length} reason{msgs.length !== 1 ? "s" : ""}
                    </span>
                  </div>

                  <div className="flex gap-4 mb-4">
                    <div className="glass p-3 rounded-xl flex-1 text-center">
                      <p className="text-2xl font-display text-[#c85540]">{sentCount}</p>
                      <p className="text-xs text-[#b8a898] font-sans mt-1">you sent</p>
                    </div>
                    <div className="glass p-3 rounded-xl flex-1 text-center">
                      <p className="text-2xl font-display text-[#88a888]">{receivedCount}</p>
                      <p className="text-xs text-[#b8a898] font-sans mt-1">you received</p>
                    </div>
                  </div>

                  {/* Latest message preview */}
                  <div className="border-t border-[#f0e8e0] pt-4">
                    <p className="text-xs text-[#b8a898] font-sans mb-2">latest reason</p>
                    <p className="font-serif text-[#3d2f22] text-sm leading-relaxed line-clamp-3">
                      "{msgs[msgs.length - 1].message}"
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}