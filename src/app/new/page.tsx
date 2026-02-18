import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Navigation from "@/components/Navigation";
import NewMessageForm from "@/components/NewMessageForm";

export default async function NewPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Get partner name
  const { data: otherUser } = await supabase
    .from("users")
    .select("name")
    .neq("id", user.id)
    .single();

  return (
    <div className="min-h-screen relative">
      <div className="bg-canvas">
        <div className="bg-orb bg-orb-1" />
        <div className="bg-orb bg-orb-2" />
        <div className="bg-orb bg-orb-3" />
      </div>

      <div className="relative z-10">
        <Navigation
          unreadCount={0}
          partnerName={otherUser?.name}
        />
        <NewMessageForm partnerName={otherUser?.name} />
      </div>
    </div>
  );
}
