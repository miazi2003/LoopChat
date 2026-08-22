import api from "@/lib/api";
import type { Message } from "@/types/chat";

type ApiMessage = {
  _id: string;
  conversation: string;
  sender: string;
  text: string;
  createdAt: string;
};

type MessagesResponse = {
  messages: ApiMessage[];
  hasMore: boolean;
};

export async function getMessages(conversationId: string) {
  const response = await api.get<MessagesResponse>(
    `/conversations/${conversationId}/messages`
  );

  return [...response.data.messages].reverse().map<Message>((message) => ({
    id: message._id,
    conversation: message.conversation,
    sender: message.sender,
    text: message.text,
    createdAt: message.createdAt
  }));
}
