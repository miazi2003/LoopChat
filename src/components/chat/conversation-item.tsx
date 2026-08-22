import { ChatAvatar } from "@/components/chat/chat-avatar";
import type { Conversation } from "@/types/chat";
import {
  formatMessageTime,
  getConversationName,
  getConversationSubtitle
} from "@/utils/format";

type ConversationItemProps = {
  conversation: Conversation;
  unreadCount: number;
  isSelected: boolean;
  onSelect: (conversation: Conversation) => void;
};

export function ConversationItem({
  conversation,
  unreadCount,
  isSelected,
  onSelect
}: ConversationItemProps) {
  const name = getConversationName(conversation);
  const hasUnreadMessages = unreadCount > 0;
  const unreadLabel = unreadCount > 99 ? "99+" : unreadCount.toString();

  return (
    <button
      type="button"
      onClick={() => onSelect(conversation)}
      aria-pressed={isSelected}
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
          <span
            className={`shrink-0 text-[10px] ${
              hasUnreadMessages ? "font-medium text-[#35ad49]" : "text-[#929b94]"
            }`}
          >
            {formatMessageTime(
              conversation.lastMessage?.createdAt ?? conversation.updatedAt
            )}
          </span>
        </span>
        <span className="mt-1 flex min-w-0 items-center justify-between gap-2">
          <span
            className={`min-w-0 flex-1 truncate text-xs ${
              hasUnreadMessages
                ? "font-medium text-[#28332b]"
                : "text-[#7b867e]"
            }`}
          >
            {getConversationSubtitle(conversation)}
          </span>
          {hasUnreadMessages ? (
            <span
              aria-label={`${unreadLabel} unread messages`}
              className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-[#3bb74d] px-1.5 text-[11px] font-semibold text-white"
            >
              {unreadLabel}
            </span>
          ) : null}
        </span>
      </span>
    </button>
  );
}
