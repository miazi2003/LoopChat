import api from "@/lib/api";
import type { ChatUser, Conversation } from "@/types/chat";
import {
  getNameSearchVariants,
  getPhoneSearchVariants,
  isPhoneSearch
} from "@/utils/search";

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
  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    return [];
  }

  const queries = isPhoneSearch(trimmedQuery)
    ? getPhoneSearchVariants(trimmedQuery)
    : getNameSearchVariants(trimmedQuery);

  const searchResults = await Promise.allSettled(
    queries.map((searchQuery) =>
      api.get<ChatUser[]>("/users/search", {
        params: {
          q: searchQuery
        }
      })
    )
  );

  const responses = searchResults
    .filter((result) => result.status === "fulfilled")
    .map((result) => result.value);

  if (responses.length === 0) {
    const failedResult = searchResults.find(
      (result) => result.status === "rejected"
    );

    throw failedResult?.reason;
  }

  return Array.from(
    new Map(
      responses
        .flatMap((response) => response.data)
        .map((user) => [user._id, user])
    ).values()
  );
}

export async function startConversation(userId: string) {
  const response = await api.post<unknown>("/conversations", {
    userId
  });

  return response.data;
}
