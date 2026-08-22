import { ChatAvatar } from "@/components/chat/chat-avatar";
import type { Conversation } from "@/types/chat";
import {
  formatMessageTime,
  getConversationName,
  getConversationSubtitle
} from "@/utils/format";

type ConversationItemProps = {
  conversation: Conversation;
  isSelected: boolean;
  onSelect: (conversation: Conversation) => void;
};

export function ConversationItem({
  conversation,
  isSelected,
  onSelect
}: ConversationItemProps) {
  const name = getConversationName(conversation);

  return (
    <button
      type="button"
      onClick={() => onSelect(conversation)}
      className={`flex min-h-[68px] w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left shadow-[0_3px_10px_rgba(0,0,0,0.025)] transition ${
        isSelected
          ? "border-transparent bg-[#edf8ef]"
          : "border-transparent bg-white hover:border-[#e1e7e0] hover:shadow-sm"
      }`}
    >
      <ChatAvatar name={name} isGroup={conversation.type === "group"} />
      <span className="min-w-0 flex-1">
        <span className="flex items-center justify-between gap-2">
          <span className="truncate text-sm font-semibold text-[#1d2720]">
            {name}
          </span>
          <span className="shrink-0 text-[10px] text-[#929b94]">
            {formatMessageTime(
              conversation.lastMessage?.createdAt ?? conversation.updatedAt
            )}
          </span>
        </span>
        <span className="mt-1 block truncate text-xs text-[#7b867e]">
          {getConversationSubtitle(conversation)}
        </span>
      </span>
    </button>
  );
}
