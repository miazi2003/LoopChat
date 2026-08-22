import type { Message } from "@/types/chat";

export type SocketMessage = {
  id: string;
  conversation: string;
  sender: string;
  text: string;
  createdAt: number;
};

export function normalizeSocketMessage(message: SocketMessage): Message {
  return {
    id: message.id,
    conversation: message.conversation,
    sender: message.sender,
    text: message.text,
    createdAt: message.createdAt
  };
}

export function isMatchingOptimisticMessage(
  message: Message,
  incomingMessage: Message
) {
  const messageTime = Number(message.createdAt);
  const incomingTime = Number(incomingMessage.createdAt);

  return (
    message.id.startsWith("temp-") &&
    message.conversation === incomingMessage.conversation &&
    message.sender === incomingMessage.sender &&
    message.text === incomingMessage.text &&
    Math.abs(messageTime - incomingTime) < 10000
  );
}
