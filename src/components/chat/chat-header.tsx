import { ArrowLeft, Info } from "lucide-react";
import { ChatAvatar } from "@/components/chat/chat-avatar";
import type { Conversation } from "@/types/chat";
import { getConversationName } from "@/utils/format";

type ChatHeaderProps = {
  conversation: Conversation;
  onBack: () => void;
  onOpenGroupInfo: () => void;
};

export function ChatHeader({
  conversation,
  onBack,
  onOpenGroupInfo
}: ChatHeaderProps) {
  const name = getConversationName(conversation);

  return (
    <header className="flex min-h-[76px] items-center justify-between gap-4 border-b border-[#e8ece7] bg-white px-4 py-3 sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back to conversations"
          title="Back to conversations"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#657168] transition hover:bg-[#f3f5f2] md:hidden"
        >
          <ArrowLeft size={19} />
        </button>
        <ChatAvatar
          name={name}
          isGroup={conversation.type === "group"}
          size="lg"
        />
        <div className="min-w-0">
          <h2 className="truncate text-base font-semibold tracking-normal text-[#19221b] sm:text-lg">
            {name}
          </h2>
          <p className="mt-0.5 truncate text-xs text-[#879088]">
            {conversation.type === "group"
              ? `${conversation.participants?.length ?? 0} members`
              : conversation.participant?.phone}
          </p>
        </div>
      </div>
      {conversation.type === "group" ? (
        <button
          type="button"
          onClick={onOpenGroupInfo}
          className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#e0e6df] bg-white px-3 text-xs font-semibold text-[#536057] transition hover:bg-[#f5f8f4]"
        >
          <Info size={16} />
          Group info
        </button>
      ) : null}
    </header>
  );
}
