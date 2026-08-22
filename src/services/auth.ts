import api from "@/lib/api";
import type { LoginResponse, User } from "@/types/auth";

export async function loginUser(name: string, phone: string) {
  const response = await api.post<LoginResponse>("/auth/login", {
    name,
    phone
  });

  return response.data;
}

export async function getCurrentUser() {
  const response = await api.get<User>("/auth/me");

  return response.data;
}
