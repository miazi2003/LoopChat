import { ConversationItem } from "@/components/chat/conversation-item";
import type { Conversation } from "@/types/chat";

type ConversationListProps = {
  conversations: Conversation[];
  selectedConversation: Conversation | null;
  isLoading: boolean;
  error: string;
  onSelect: (conversation: Conversation) => void;
};

export function ConversationList({
  conversations,
  selectedConversation,
  isLoading,
  error,
  onSelect
}: ConversationListProps) {
  return (
    <div className="mt-5">
      <h2 className="px-1 text-xs font-semibold uppercase text-[#7d887f]">
        Conversations
      </h2>

      <div className="mt-2.5">
        {isLoading && conversations.length === 0 ? (
          <p className="rounded-lg bg-white px-4 py-5 text-center text-sm text-[#7d887f]">
            Loading conversations...
          </p>
        ) : null}

        {error && conversations.length === 0 ? (
          <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </p>
        ) : null}

        {!isLoading && conversations.length === 0 && !error ? (
          <p className="rounded-lg bg-white px-4 py-5 text-center text-sm leading-6 text-[#7d887f]">
            No conversations yet.
            <br />
            Search for someone to start chatting.
          </p>
        ) : null}

        {conversations.length > 0 ? (
          <div className="space-y-2">
            {conversations.map((conversation) => (
              <ConversationItem
                key={conversation._id}
                conversation={conversation}
                isSelected={selectedConversation?._id === conversation._id}
                onSelect={onSelect}
              />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
