"use server";
import twilio from "twilio";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function signIn(email: string, password: string) {
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: error.message };
  revalidatePath("/", "layout");
  redirect("/home");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function sendMessage(message: string, imageUrl?: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { data: otherUser, error: userError } = await supabase
    .from("users")
    .select("id")
    .neq("id", user.id)
    .single();

  if (userError || !otherUser) return { error: "Could not find receiver" };

  const { error } = await supabase.from("messages").insert({
    message: message.trim(),
    sender_id: user.id,
    receiver_id: (otherUser as any).id,
    is_read: false,
    image_url: imageUrl,
  });

  if (error) return { error: error.message };

  try {
    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    await client.messages.create({
      body: `💌 A new reason why: "${message.trim()}"`,
      from: process.env.TWILIO_FROM_NUMBER,
      to: process.env.PARTNER_PHONE_NUMBER!,
    });
  } catch (e) {
    console.error("SMS failed:", e);
  }

  revalidatePath("/home");
  redirect("/home");
}

export async function markMessagesAsRead() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from("messages")
    .update({ is_read: true })
    .eq("receiver_id", user.id)
    .eq("is_read", false);

  revalidatePath("/home");
}

export async function getMessages() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { messages: [], currentUser: null };

  const { data: messages } = await supabase
    .from("messages")
    .select(
      "*, sender:users!messages_sender_id_fkey(id, name, email), receiver:users!messages_receiver_id_fkey(id, name, email)",
    )
    .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
    .order("created_at", { ascending: true });

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

  const unreadCount =
    messages?.filter((m) => m.receiver_id === user.id && !m.is_read).length ??
    0;

  return { messages: messages ?? [], currentUser, otherUser, unreadCount };
}
