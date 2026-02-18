import { Message } from "@/types";
import { User } from "@/types";
import MessageCard from "./MessageCard";

interface OnThisDayProps {
  messages: Message[];
  currentUser: User;
}

export default function OnThisDay({ messages, currentUser }: OnThisDayProps) {
  const today = new Date();
  const thisYear = today.getFullYear();

  const onThisDay = messages.filter((m) => {
    const date = new Date(m.created_at);
    return (
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate() &&
      date.getFullYear() < thisYear
    );
  });

  if (onThisDay.length === 0) return null;

  return (
    <div className="glass-card p-5 mb-6 animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg">🕰️</span>
        <h2 className="font-display text-xl text-[#3d2f22]">On this day</h2>
        <span className="text-xs text-[#b8a898] font-sans ml-auto">
          {today.toLocaleDateString("en-US", { month: "long", day: "numeric" })}
        </span>
      </div>

      <div className="flex flex-col gap-4">
        {onThisDay.map((msg) => (
          <div key={msg.id}>
            <p className="text-xs text-[#b8a898] font-sans mb-2 px-1">
              {new Date(msg.created_at).getFullYear()}
            </p>
            <MessageCard
              message={msg}
              isSent={msg.sender_id === currentUser.id}
            />
          </div>
        ))}
      </div>
    </div>
  );
}