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
  const messageTime = new Date(message.createdAt).getTime();
  const incomingTime = new Date(incomingMessage.createdAt).getTime();

  return (
    message.id.startsWith("temp-") &&
    message.conversation === incomingMessage.conversation &&
    message.sender === incomingMessage.sender &&
    message.text === incomingMessage.text &&
    Math.abs(messageTime - incomingTime) < 10000
  );
}

export function mergeMessageHistory(
  historyMessages: Message[],
  currentMessages: Message[]
) {
  const mergedMessages = [...historyMessages];

  currentMessages.forEach((currentMessage) => {
    const alreadyIncluded = mergedMessages.some(
      (message) => message.id === currentMessage.id
    );
    const reconciledOptimisticMessage = mergedMessages.some((message) =>
      isMatchingOptimisticMessage(currentMessage, message)
    );

    if (!alreadyIncluded && !reconciledOptimisticMessage) {
      mergedMessages.push(currentMessage);
    }
  });

  return mergedMessages.sort(
    (firstMessage, secondMessage) =>
      new Date(firstMessage.createdAt).getTime() -
      new Date(secondMessage.createdAt).getTime()
  );
}
