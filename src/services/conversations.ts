import api from "@/lib/api";
import type { ChatUser, Conversation } from "@/types/chat";

type ConversationsResponse = Conversation[] | { data: Conversation[] };

export async function getConversations() {
  const response = await api.get<ConversationsResponse>("/conversations");
  const conversations = response.data;

  if (Array.isArray(conversations)) {
    return conversations;
  }

  return conversations.data;
}

export async function searchUsers(query: string) {
  const response = await api.get<ChatUser[]>("/users/search", {
    params: {
      q: query
    }
  });

  return response.data;
}

export async function startConversation(userId: string) {
  const response = await api.post("/conversations", {
    userId
  });

  return response.data;
}
