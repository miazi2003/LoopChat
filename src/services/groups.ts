import api from "@/lib/api";
import type { Conversation } from "@/types/chat";

export async function createGroup(name: string, participantIds: string[]) {
  const response = await api.post<Conversation>("/conversations/group", {
    name,
    participantIds
  });

  return response.data;
}

export async function addParticipants(groupId: string, userIds: string[]) {
  const response = await api.post<Conversation>(
    `/conversations/${groupId}/participants`,
    { userIds }
  );

  return response.data;
}

export async function removeParticipant(groupId: string, userId: string) {
  const response = await api.delete<Conversation>(
    `/conversations/${groupId}/participants/${userId}`
  );

  return response.data;
}

export async function promoteAdmin(groupId: string, userId: string) {
  const response = await api.post<Conversation>(
    `/conversations/${groupId}/admins`,
    { userId }
  );

  return response.data;
}

export async function renameGroup(groupId: string, name: string) {
  const response = await api.patch<Conversation>(`/conversations/${groupId}`, {
    name
  });

  return response.data;
}
