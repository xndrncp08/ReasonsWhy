import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Navigation from "@/components/Navigation";
import { signOut } from "@/lib/actions";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: currentUser } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  const { data: otherUser } = await supabase
    .from("users")
    .select("*")
    .neq("id", user.id)
    .single();

  return (
    <div className="min-h-screen relative">
      <div className="bg-canvas">
        <div className="bg-orb bg-orb-1" />
        <div className="bg-orb bg-orb-2" />
      </div>

      <div className="relative z-10">
        <Navigation unreadCount={0} partnerName={(otherUser as any)?.name} />

        <main className="max-w-2xl mx-auto px-4 py-8">
          <div className="glass-card p-8 animate-fade-in">
            <h1 className="font-display text-3xl font-medium text-[#3d2f22] mb-6">
              Settings
            </h1>

            {currentUser && (
              <div className="space-y-4 mb-8">
                <div className="glass p-4 rounded-xl">
                  <p className="text-xs text-[#b8a898] font-sans mb-1">
                    Your name
                  </p>
                  <p className="text-[#3d2f22] font-serif">
                    {(currentUser as any).name}
                  </p>
                </div>
                <div className="glass p-4 rounded-xl">
                  <p className="text-xs text-[#b8a898] font-sans mb-1">Email</p>
                  <p className="text-[#3d2f22] font-sans text-sm">
                    {(currentUser as any).email}
                  </p>
                </div>
              </div>
            )}

            <form action={signOut}>
              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl border-2 border-[#e8d0c0] text-[#a89888] hover:bg-[#fce8e4] hover:text-[#c85540] hover:border-[#f0a898] transition-all duration-200 font-medium text-sm font-sans"
              >
                Sign out
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
