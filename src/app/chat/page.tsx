"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { Socket } from "socket.io-client";
import { createSocket } from "@/lib/socket";
import { getCurrentUser } from "@/services/auth";
import {
  getConversations,
  searchUsers,
  startConversation
} from "@/services/conversations";
import { getMessages } from "@/services/messages";
import type { User } from "@/types/auth";
import type { ChatUser, Conversation, Message } from "@/types/chat";

type SocketMessage = {
  id: string;
  conversation: string;
  sender: string;
  text: string;
  createdAt: number;
};

function formatMessageTime(value: string | number) {
  return new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(value));
}

function normalizeSocketMessage(message: SocketMessage): Message {
  return {
    id: message.id,
    conversation: message.conversation,
    sender: message.sender,
    text: message.text,
    createdAt: message.createdAt
  };
}

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
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [messageError, setMessageError] = useState("");
  const [newMessageText, setNewMessageText] = useState("");
  const [sendError, setSendError] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isNearBottom, setIsNearBottom] = useState(true);
  const [showNewMessagesButton, setShowNewMessagesButton] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const selectedConversationRef = useRef<Conversation | null>(null);
  const messageListRef = useRef<HTMLDivElement | null>(null);

  const loadConversations = useCallback(async (userToSelect?: ChatUser) => {
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
  }, []);

  const scrollToBottom = useCallback(() => {
    const messageList = messageListRef.current;

    if (!messageList) {
      return;
    }

    messageList.scrollTop = messageList.scrollHeight;
    setShowNewMessagesButton(false);
  }, []);

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
        const socket = createSocket(token);
        socketRef.current = socket;
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.replace("/login");
      } finally {
        setIsCheckingAuth(false);
      }
    }

    checkAuth();

    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [loadConversations, router]);

  useEffect(() => {
    const socket = socketRef.current;

    if (!socket) {
      return;
    }

    function handleNewMessage(incomingMessage: SocketMessage) {
      const normalizedMessage = normalizeSocketMessage(incomingMessage);
      const activeConversation = selectedConversationRef.current;

      if (activeConversation?._id === normalizedMessage.conversation) {
        setMessages((currentMessages) => {
          const alreadyExists = currentMessages.some(
            (message) => message.id === normalizedMessage.id
          );

          if (alreadyExists) {
            return currentMessages;
          }

          return [...currentMessages, normalizedMessage];
        });

        if (isNearBottom) {
          window.setTimeout(scrollToBottom, 0);
        } else {
          setShowNewMessagesButton(true);
        }
      }

      loadConversations();
    }

    socket.on("message:new", handleNewMessage);

    return () => {
      socket.off("message:new", handleNewMessage);
    };
  }, [isNearBottom, loadConversations, scrollToBottom]);

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

  useEffect(() => {
    selectedConversationRef.current = selectedConversation;
  }, [selectedConversation]);

  useEffect(() => {
    async function loadSelectedMessages() {
      if (!selectedConversation) {
        setMessages([]);
        return;
      }

      setMessages([]);
      setIsLoadingMessages(true);
      setMessageError("");
      setShowNewMessagesButton(false);
      setIsNearBottom(true);

      try {
        const nextMessages = await getMessages(selectedConversation._id);
        setMessages(nextMessages);
        window.setTimeout(scrollToBottom, 0);
      } catch {
        setMessageError("Failed to load messages.");
      } finally {
        setIsLoadingMessages(false);
      }
    }

    loadSelectedMessages();
  }, [scrollToBottom, selectedConversation]);

  useEffect(() => {
    if (isNearBottom) {
      window.setTimeout(scrollToBottom, 0);
    }
  }, [isNearBottom, messages, scrollToBottom]);

  function handleLogout() {
    socketRef.current?.disconnect();
    socketRef.current = null;
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

  function handleMessageScroll() {
    const messageList = messageListRef.current;

    if (!messageList) {
      return;
    }

    const distanceFromBottom =
      messageList.scrollHeight - messageList.scrollTop - messageList.clientHeight;
    const nearBottom = distanceFromBottom < 100;

    setIsNearBottom(nearBottom);

    if (nearBottom) {
      setShowNewMessagesButton(false);
    }
  }

  function handleSendMessage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedText = newMessageText.trim();

    if (!trimmedText || !selectedConversation || !socketRef.current) {
      return;
    }

    setIsSending(true);
    setSendError("");

    socketRef.current.emit(
      "message:send",
      {
        conversationId: selectedConversation._id,
        text: trimmedText
      },
      (acknowledgement?: { ok?: boolean }) => {
        setIsSending(false);

        if (acknowledgement?.ok === false) {
          setSendError("Failed to send message.");
          return;
        }

        setNewMessageText("");
        loadConversations();
      }
    );
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

        <section className="flex min-h-[360px] flex-1 flex-col">
          {selectedConversation ? (
            <>
              <header className="border-b border-slate-200 px-5 py-4">
                <h2 className="text-lg font-semibold tracking-normal">
                  {selectedConversation.participant.name}
                </h2>
                <p className="mt-0.5 text-sm text-slate-600">
                  {selectedConversation.participant.phone}
                </p>
              </header>

              <div
                ref={messageListRef}
                onScroll={handleMessageScroll}
                className="relative flex-1 overflow-y-auto px-5 py-4"
              >
                {isLoadingMessages ? (
                  <p className="text-center text-sm text-slate-600">
                    Loading messages...
                  </p>
                ) : null}

                {!isLoadingMessages && messageError ? (
                  <p className="text-center text-sm text-red-600">{messageError}</p>
                ) : null}

                {!isLoadingMessages && !messageError && messages.length === 0 ? (
                  <p className="text-center text-sm text-slate-600">
                    No messages yet.
                    <br />
                    Start the conversation.
                  </p>
                ) : null}

                {!isLoadingMessages && !messageError && messages.length > 0 ? (
                  <div className="space-y-3">
                    {messages.map((message) => {
                      const isOwnMessage = message.sender === user._id;

                      return (
                        <div
                          key={message.id}
                          className={`flex ${
                            isOwnMessage ? "justify-end" : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-[75%] rounded-lg px-3 py-2 text-sm ${
                              isOwnMessage
                                ? "bg-slate-900 text-white"
                                : "bg-slate-100 text-slate-950"
                            }`}
                          >
                            <p className="whitespace-pre-wrap break-words">
                              {message.text || " "}
                            </p>
                            <p
                              className={`mt-1 text-right text-[11px] ${
                                isOwnMessage ? "text-slate-300" : "text-slate-500"
                              }`}
                            >
                              {formatMessageTime(message.createdAt)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : null}

                {showNewMessagesButton ? (
                  <button
                    type="button"
                    onClick={scrollToBottom}
                    className="sticky bottom-3 left-1/2 mt-4 -translate-x-1/2 rounded-full bg-slate-900 px-3 py-1.5 text-xs font-medium text-white shadow"
                  >
                    New messages down
                  </button>
                ) : null}
              </div>

              <form
                onSubmit={handleSendMessage}
                className="border-t border-slate-200 p-4"
              >
                {sendError ? (
                  <p className="mb-2 text-sm text-red-600">{sendError}</p>
                ) : null}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessageText}
                    onChange={(event) => setNewMessageText(event.target.value)}
                    className="min-w-0 flex-1 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                    placeholder="Type a message..."
                  />
                  <button
                    type="submit"
                    disabled={!newMessageText.trim() || isSending}
                    className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSending ? "Sending..." : "Send"}
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center p-6">
              <p className="text-sm text-slate-600">Select a conversation</p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
