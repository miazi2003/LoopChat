"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/services/auth";
import {
  getConversations,
  searchUsers,
  startConversation
} from "@/services/conversations";
import type { User } from "@/types/auth";
import type { ChatUser, Conversation } from "@/types/chat";

export default function ChatPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [isLoadingConversations, setIsLoadingConversations] = useState(false);
  const [conversationError, setConversationError] = useState("");
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState<ChatUser[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchMessage, setSearchMessage] = useState("");
  const [isStartingConversation, setIsStartingConversation] = useState(false);

  async function loadConversations(userToSelect?: ChatUser) {
    setIsLoadingConversations(true);
    setConversationError("");

    try {
      const nextConversations = await getConversations();
      setConversations(nextConversations);

      if (userToSelect) {
        const matchingConversation = nextConversations.find(
          (conversation) => conversation.participant._id === userToSelect._id
        );

        if (matchingConversation) {
          setSelectedConversation(matchingConversation);
        }
      }
    } catch {
      setConversationError("Failed to load conversations.");
    } finally {
      setIsLoadingConversations(false);
    }
  }

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
        await loadConversations();
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.replace("/login");
      } finally {
        setIsCheckingAuth(false);
      }
    }

    checkAuth();
  }, [router]);

  useEffect(() => {
    const trimmedSearch = searchText.trim();

    if (!trimmedSearch || !user) {
      return;
    }

    const timeoutId = window.setTimeout(async () => {
      try {
        const users = await searchUsers(trimmedSearch);
        const otherUsers = users.filter((result) => result._id !== user._id);
        setSearchResults(otherUsers);
        setSearchMessage(otherUsers.length === 0 ? "No users found." : "");
      } catch {
        setSearchResults([]);
        setSearchMessage("Failed to search users.");
      } finally {
        setIsSearching(false);
      }
    }, 350);

    return () => window.clearTimeout(timeoutId);
  }, [searchText, user]);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  }

  function handleSearchChange(value: string) {
    setSearchText(value);

    if (!value.trim()) {
      setSearchResults([]);
      setSearchMessage("");
      setIsSearching(false);
      return;
    }

    setSearchResults([]);
    setSearchMessage("");
    setIsSearching(true);
  }

  async function handleStartConversation(selectedUser: ChatUser) {
    setIsStartingConversation(true);
    setSearchMessage("");

    try {
      await startConversation(selectedUser._id);
      await loadConversations(selectedUser);
      setSearchText("");
      setSearchResults([]);
    } catch {
      setSearchMessage("Failed to start conversation.");
    } finally {
      setIsStartingConversation(false);
    }
  }

  if (isCheckingAuth) {
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
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col border-x border-slate-200 bg-white md:flex-row">
        <aside className="w-full border-b border-slate-200 p-5 md:w-80 md:border-b-0 md:border-r">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold tracking-normal">LoopChat</h1>
              <p className="mt-1 text-sm text-slate-600">{user.name}</p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium transition hover:bg-slate-100"
            >
              Logout
            </button>
          </div>

          <div className="mt-6">
            <label htmlFor="user-search" className="mb-2 block text-sm font-medium">
              Search users
            </label>
            <input
              id="user-search"
              type="search"
              value={searchText}
              onChange={(event) => handleSearchChange(event.target.value)}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              placeholder="Search by name or phone"
            />
          </div>

          {searchText.trim() ? (
            <div className="mt-3 rounded-md border border-slate-200">
              {isSearching ? (
                <p className="px-3 py-3 text-sm text-slate-600">Searching users...</p>
              ) : null}

              {!isSearching && searchMessage ? (
                <p className="px-3 py-3 text-sm text-slate-600">{searchMessage}</p>
              ) : null}

              {!isSearching && searchResults.length > 0 ? (
                <div className="divide-y divide-slate-200">
                  {searchResults.map((result) => (
                    <button
                      key={result._id}
                      type="button"
                      onClick={() => handleStartConversation(result)}
                      disabled={isStartingConversation}
                      className="w-full px-3 py-3 text-left transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <span className="block text-sm font-medium">{result.name}</span>
                      <span className="mt-0.5 block text-xs text-slate-600">
                        {result.phone}
                      </span>
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          ) : null}

          <div className="mt-6">
            <h2 className="text-sm font-semibold">Conversations</h2>

            <div className="mt-3">
              {isLoadingConversations ? (
                <p className="text-sm text-slate-600">Loading conversations...</p>
              ) : null}

              {!isLoadingConversations && conversationError ? (
                <p className="text-sm text-red-600">{conversationError}</p>
              ) : null}

              {!isLoadingConversations &&
              !conversationError &&
              conversations.length === 0 ? (
                <p className="text-sm text-slate-600">
                  No conversations yet.
                  <br />
                  Search for someone to start chatting.
                </p>
              ) : null}

              {!isLoadingConversations &&
              !conversationError &&
              conversations.length > 0 ? (
                <div className="divide-y divide-slate-200 rounded-md border border-slate-200">
                  {conversations.map((conversation) => {
                    const isSelected =
                      selectedConversation?._id === conversation._id;
                    const preview =
                      conversation.lastMessage?.text ||
                      conversation.participant.phone;

                    return (
                      <button
                        key={conversation._id}
                        type="button"
                        onClick={() => setSelectedConversation(conversation)}
                        className={`w-full px-3 py-3 text-left transition ${
                          isSelected ? "bg-slate-100" : "hover:bg-slate-50"
                        }`}
                      >
                        <span className="block text-sm font-medium">
                          {conversation.participant.name}
                        </span>
                        <span className="mt-0.5 block truncate text-xs text-slate-600">
                          {preview}
                        </span>
                      </button>
                    );
                  })}
                </div>
              ) : null}
            </div>
          </div>
        </aside>

        <section className="flex min-h-[360px] flex-1 items-center justify-center p-6">
          {selectedConversation ? (
            <div className="text-center">
              <h2 className="text-2xl font-semibold tracking-normal">
                {selectedConversation.participant.name}
              </h2>
              <p className="mt-3 text-sm text-slate-600">Conversation selected.</p>
              <p className="mt-1 text-sm text-slate-600">
                Messages will appear here next.
              </p>
            </div>
          ) : (
            <p className="text-sm text-slate-600">Select a conversation</p>
          )}
        </section>
      </div>
    </main>
  );
}
