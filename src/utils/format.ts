import type { Conversation } from "@/types/chat";

export function formatMessageTime(value: string | number) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "2-digit"
  }).format(date);
}

export function getConversationName(conversation: Conversation) {
  if (conversation.type === "group") {
    return conversation.name || "Group conversation";
  }

  return conversation.participant?.name || "Direct conversation";
}

export function getConversationSubtitle(conversation: Conversation) {
  if (conversation.lastMessage?.text) {
    return conversation.lastMessage.text;
  }

  if (conversation.type === "group") {
    const count = conversation.participants?.length ?? 0;
    return `${count} ${count === 1 ? "member" : "members"}`;
  }

  return conversation.participant?.phone || "";
}
