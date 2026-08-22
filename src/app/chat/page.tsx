"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/services/auth";
import type { User } from "@/types/auth";

export default function ChatPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      const token = localStorage.getItem("token");

      if (!token) {
        router.replace("/login");
        return;
      }

      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.replace("/login");
      } finally {
        setIsLoading(false);
      }
    }

    checkAuth();
  }, [router]);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  }

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6">
        <p className="text-sm text-slate-600">Checking authentication...</p>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <section className="w-full max-w-md text-center">
        <h1 className="text-3xl font-semibold tracking-normal">LoopChat</h1>
        <p className="mt-4 text-lg">Welcome, {user.name}</p>
        <p className="mt-2 text-sm text-slate-600">Chat interface coming next.</p>
        <button
          type="button"
          onClick={handleLogout}
          className="mt-6 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-900 transition hover:bg-slate-100"
        >
          Logout
        </button>
      </section>
    </main>
  );
}
