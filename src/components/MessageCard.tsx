import { Message } from "@/types";
import { formatDistanceToNow } from "date-fns";

interface MessageCardProps {
  message: Message;
  isSent: boolean;
  isNew?: boolean;
}

export default function MessageCard({ message, isSent, isNew }: MessageCardProps) {
  const timeAgo = formatDistanceToNow(new Date(message.created_at), {
    addSuffix: true,
  });

  const senderName = (message.sender as any)?.name || "Someone";

  return (
    <div
      className={`flex ${isSent ? "justify-end" : "justify-start"} ${
        isNew ? "message-card-enter" : "animate-fade-in"
      }`}
    >
      <div className={`max-w-[80%] sm:max-w-[65%] ${isSent ? "items-end" : "items-start"} flex flex-col gap-1.5`}>
        <span className="text-xs text-[#b8a898] px-2">
          {isSent ? "you" : senderName}
        </span>

        <div
          className={`px-5 py-4 relative group ${
            isSent ? "glass-card-sent" : "glass-card-received"
          }`}
        >
          <span
            className={`absolute top-2 left-3 font-display text-3xl leading-none opacity-15 ${
              isSent ? "text-[#c85540]" : "text-[#485848]"
            }`}
            aria-hidden
          >
            "
          </span>

          <p className="font-serif text-[#3d2f22] text-base leading-relaxed pt-1 pl-2">
            {message.message}
          </p>

          {/* Image attachment */}
          {message.image_url && (
            <div className="mt-3">
              <img
                src={message.image_url}
                alt="Attached image"
                className="max-h-64 rounded-xl object-cover w-full cursor-pointer hover:opacity-95 transition-opacity"
                onClick={() => window.open(message.image_url, "_blank")}
              />
            </div>
          )}

          {isSent && (
            <div className="flex justify-end mt-2">
              <span className={`text-[10px] font-sans ${message.is_read ? "text-[#88a888]" : "text-[#b8a898]"}`}>
                {message.is_read ? "✓✓ seen" : "✓ sent"}
              </span>
            </div>
          )}
        </div>

        <span className="text-xs text-[#c8b8a8] px-2 font-sans">
          {timeAgo}
        </span>
      </div>
    </div>
  );
}