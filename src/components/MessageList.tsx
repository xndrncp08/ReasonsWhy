"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Message, User } from "@/types";
import MessageCard from "./MessageCard";
import NotificationBanner from "./NotificationBanner";
import { markMessagesAsRead } from "@/lib/actions";

interface MessageListProps {
  initialMessages: Message[];
  currentUser: User;
  otherUser: User | null;
}

interface Notification {
  id: string;
  message: string;
  senderName: string;
}

export default function MessageList({
  initialMessages,
  currentUser,
  otherUser,
}: MessageListProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [newMessageIds, setNewMessageIds] = useState<Set<string>>(new Set());
  const bottomRef = useRef<HTMLDivElement>(null);
  const supabase = createClient() as any;

  const scrollToBottom = useCallback((smooth = true) => {
    bottomRef.current?.scrollIntoView({
      behavior: smooth ? "smooth" : "instant",
    });
  }, []);

  // Mark messages as read on mount
  useEffect(() => {
    markMessagesAsRead();
    scrollToBottom(false);
  }, [scrollToBottom]);

  // Real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel("messages-realtime")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        async (payload: { new: Message }) => {
          const newMsg = payload.new as Message;

          // Fetch sender details
          const { data: sender } = (await supabase
            .from("users")
            .select("*")
            .eq("id", newMsg.sender_id)
            .single()) as any;

          const enrichedMsg = { ...newMsg, sender: sender ?? undefined };
          setMessages((prev) => [...prev, enrichedMsg]);
          setNewMessageIds((prev) => new Set(prev).add(newMsg.id));

          // Show notification only for received messages
          if (newMsg.receiver_id === currentUser.id) {
            const senderName = sender?.name || "Someone";
            setNotifications((prev) => [
              ...prev,
              {
                id: newMsg.id,
                message: newMsg.message,
                senderName,
              },
            ]);
            // Mark as read automatically since user is viewing
            await supabase
              .from("messages")
              .update({ is_read: true })
              .eq("id", newMsg.id);
          }

          setTimeout(() => scrollToBottom(), 100);
        },
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "messages",
        },
        (payload: { new: Message }) => {
          const updated = payload.new as Message;
          setMessages((prev) =>
            prev.map((m) => (m.id === updated.id ? { ...m, ...updated } : m)),
          );
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUser.id, scrollToBottom, supabase]);

  const dismissNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 animate-fade-in">
        <div className="text-5xl heart-decoration">♡</div>
        <p className="font-serif text-xl italic text-[#7a6658] text-center">
          No messages yet...
        </p>
        <p className="text-sm text-[#b8a898] text-center font-sans">
          Be the first to share a reason why
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Notification banners */}
      {notifications.map((notif) => (
        <NotificationBanner
          key={notif.id}
          message={notif.message}
          senderName={notif.senderName}
          onDismiss={() => dismissNotification(notif.id)}
        />
      ))}

      {/* Message list */}
      <div className="flex flex-col gap-5 py-6">
        {messages.map((msg, idx) => {
          const isSent = msg.sender_id === currentUser.id;
          const isNew = newMessageIds.has(msg.id);

          // Date separator
          const showDate =
            idx === 0 ||
            new Date(messages[idx - 1].created_at).toDateString() !==
              new Date(msg.created_at).toDateString();

          return (
            <div key={msg.id}>
              {showDate && (
                <div className="flex items-center gap-3 my-4">
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#e8d8c8] to-transparent" />
                  <span className="text-xs text-[#c8b8a8] font-sans whitespace-nowrap">
                    {new Date(msg.created_at).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#e8d8c8] to-transparent" />
                </div>
              )}
              <MessageCard message={msg} isSent={isSent} isNew={isNew} currentUserId={currentUser.id}/>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>
    </>
  );
}
