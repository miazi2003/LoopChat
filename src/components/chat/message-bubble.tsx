import type { Message } from "@/types/chat";
import { formatMessageTime } from "@/utils/format";

type MessageBubbleProps = {
  message: Message;
  isOwnMessage: boolean;
  senderName: string;
  showSenderName: boolean;
};

export function MessageBubble({
  message,
  isOwnMessage,
  senderName,
  showSenderName
}: MessageBubbleProps) {
  return (
    <div className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}>
      <div className="max-w-[75%] sm:max-w-[68%]">
        {showSenderName ? (
          <p className="mb-1 ml-1 text-[11px] font-semibold text-[#657168]">
            {senderName}
          </p>
        ) : null}
        <div
          className={`rounded-2xl px-3.5 py-2.5 text-sm leading-5 shadow-sm ${
            isOwnMessage
              ? "rounded-br-md bg-[#35ad49] text-white"
              : "rounded-bl-md bg-[#f1f3f0] text-[#263029]"
          }`}
        >
          <p className="whitespace-pre-wrap break-words">{message.text || " "}</p>
          <p
            className={`mt-1 text-right text-[10px] ${
              isOwnMessage ? "text-white/70" : "text-[#8a948c]"
            }`}
          >
            {formatMessageTime(message.createdAt)}
          </p>
        </div>
      </div>
    </div>
  );
}
