import type { RefObject } from "react";
import { MessageBubble } from "@/components/chat/message-bubble";
import type { Conversation, Message } from "@/types/chat";

type MessageListProps = {
  messageListRef: RefObject<HTMLDivElement | null>;
  conversation: Conversation;
  messages: Message[];
  currentUserId: string;
  isLoading: boolean;
  error: string;
  showNewMessagesButton: boolean;
  onScroll: () => void;
  onNewMessagesClick: () => void;
};

export function MessageList({
  messageListRef,
  conversation,
  messages,
  currentUserId,
  isLoading,
  error,
  showNewMessagesButton,
  onScroll,
  onNewMessagesClick
}: MessageListProps) {
  return (
    <div
      ref={messageListRef}
      onScroll={onScroll}
      className="relative min-h-0 flex-1 overflow-y-auto bg-white px-5 py-6 sm:px-6"
    >
      {isLoading && messages.length === 0 ? (
        <p className="py-8 text-center text-sm text-[#879088]">
          Loading messages...
        </p>
      ) : null}

      {error && messages.length === 0 ? (
        <p className="mx-auto max-w-sm rounded-lg bg-red-50 px-4 py-3 text-center text-sm text-red-600">
          {error}
        </p>
      ) : null}

      {!isLoading && !error && messages.length === 0 ? (
        <p className="py-8 text-center text-sm leading-6 text-[#879088]">
          No messages yet.
          <br />
          Send the first message.
        </p>
      ) : null}

      {messages.length > 0 ? (
        <div className="space-y-3.5">
          {messages.map((message) => {
            const isOwnMessage = message.sender === currentUserId;
            const senderName =
              conversation.participants?.find(
                (participant) => participant._id === message.sender
              )?.name ?? "Unknown user";

            return (
              <MessageBubble
                key={message.id}
                message={message}
                isOwnMessage={isOwnMessage}
                senderName={senderName}
                showSenderName={conversation.type === "group" && !isOwnMessage}
              />
            );
          })}
        </div>
      ) : null}

      {showNewMessagesButton ? (
        <button
          type="button"
          onClick={onNewMessagesClick}
          className="sticky bottom-3 left-1/2 mt-4 -translate-x-1/2 rounded-full border border-[#e6e9e5] bg-white px-4 py-2 text-xs font-semibold text-[#398047] shadow-[0_4px_16px_rgba(20,35,24,0.1)] transition hover:bg-[#f7faf7]"
        >
          New messages ↓
        </button>
      ) : null}
    </div>
  );
}
