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
import {
  addParticipants,
  createGroup,
  promoteAdmin,
  removeParticipant,
  renameGroup
} from "@/services/groups";
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

function getConversationName(conversation: Conversation) {
  if (conversation.type === "group") {
    return conversation.name || "Group conversation";
  }

  return conversation.participant?.name || "Direct conversation";
}

function getConversationSubtitle(conversation: Conversation) {
  if (conversation.lastMessage?.text) {
    return conversation.lastMessage.text;
  }

  if (conversation.type === "group") {
    const count = conversation.participants?.length ?? 0;
    return `${count} ${count === 1 ? "member" : "members"}`;
  }

  return conversation.participant?.phone || "";
}

export default function ChatPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isSocketReady, setIsSocketReady] = useState(false);
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
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupSearchText, setGroupSearchText] = useState("");
  const [groupSearchResults, setGroupSearchResults] = useState<ChatUser[]>([]);
  const [selectedGroupMembers, setSelectedGroupMembers] = useState<ChatUser[]>(
    []
  );
  const [isGroupSearching, setIsGroupSearching] = useState(false);
  const [groupError, setGroupError] = useState("");
  const [isGroupInfoOpen, setIsGroupInfoOpen] = useState(false);
  const [renameText, setRenameText] = useState("");
  const [addMemberSearchText, setAddMemberSearchText] = useState("");
  const [addMemberResults, setAddMemberResults] = useState<ChatUser[]>([]);
  const [selectedAddMembers, setSelectedAddMembers] = useState<ChatUser[]>([]);
  const [isAddMemberSearching, setIsAddMemberSearching] = useState(false);
  const [groupActionError, setGroupActionError] = useState("");
  const [isGroupActionLoading, setIsGroupActionLoading] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const selectedConversationRef = useRef<Conversation | null>(null);
  const messageListRef = useRef<HTMLDivElement | null>(null);

  const loadConversations = useCallback(
    async (conversationToSelect?: Conversation | ChatUser) => {
      setIsLoadingConversations(true);
      setConversationError("");

      try {
        const nextConversations = await getConversations();
        setConversations(nextConversations);

        if (conversationToSelect && "_id" in conversationToSelect) {
          const matchingConversation = nextConversations.find((conversation) => {
            if ("type" in conversationToSelect) {
              return conversation._id === conversationToSelect._id;
            }

            return conversation.participant?._id === conversationToSelect._id;
          });

          if (matchingConversation) {
            setSelectedConversation(matchingConversation);
          }
        }
      } catch {
        setConversationError("Failed to load conversations.");
      } finally {
        setIsLoadingConversations(false);
      }
    },
    []
  );

  const scrollToBottom = useCallback(() => {
    const messageList = messageListRef.current;

    if (!messageList) {
      return;
    }

    messageList.scrollTop = messageList.scrollHeight;
    setShowNewMessagesButton(false);
  }, []);

  const updateSelectedGroup = useCallback(
    (updatedConversation: Conversation) => {
      setSelectedConversation((currentConversation) => {
        if (currentConversation?._id !== updatedConversation._id) {
          return currentConversation;
        }

        return updatedConversation;
      });
    },
    []
  );

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
        socketRef.current = createSocket(token);
        setIsSocketReady(true);
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
    if (!isSocketReady || !socketRef.current) {
      return;
    }

    const socket = socketRef.current;

    function handleNewMessage(incomingMessage: SocketMessage) {
      const normalizedMessage = normalizeSocketMessage(incomingMessage);
      const activeConversation = selectedConversationRef.current;

      if (activeConversation?._id === normalizedMessage.conversation) {
        setMessages((currentMessages) => {
          const exists = currentMessages.some(
            (message) => message.id === normalizedMessage.id
          );

          return exists ? currentMessages : [...currentMessages, normalizedMessage];
        });

        if (isNearBottom) {
          window.setTimeout(scrollToBottom, 0);
        } else {
          setShowNewMessagesButton(true);
        }
      }

      loadConversations();
    }

    function handleConversationUpdated(updatedConversation: Conversation) {
      loadConversations();
      updateSelectedGroup(updatedConversation);
    }

    socket.on("message:new", handleNewMessage);
    socket.on("conversation:updated", handleConversationUpdated);

    return () => {
      socket.off("message:new", handleNewMessage);
      socket.off("conversation:updated", handleConversationUpdated);
    };
  }, [
    isNearBottom,
    isSocketReady,
    loadConversations,
    scrollToBottom,
    updateSelectedGroup
  ]);

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
    const trimmedSearch = groupSearchText.trim();

    if (!trimmedSearch || !user) {
      return;
    }

    const timeoutId = window.setTimeout(async () => {
      try {
        const users = await searchUsers(trimmedSearch);
        const selectedIds = selectedGroupMembers.map((member) => member._id);
        setGroupSearchResults(
          users.filter(
            (result) => result._id !== user._id && !selectedIds.includes(result._id)
          )
        );
      } catch {
        setGroupError("Failed to search users.");
      } finally {
        setIsGroupSearching(false);
      }
    }, 350);

    return () => window.clearTimeout(timeoutId);
  }, [groupSearchText, selectedGroupMembers, user]);

  useEffect(() => {
    const trimmedSearch = addMemberSearchText.trim();

    if (!trimmedSearch || !user || selectedConversation?.type !== "group") {
      return;
    }

    const timeoutId = window.setTimeout(async () => {
      try {
        const users = await searchUsers(trimmedSearch);
        const existingIds =
          selectedConversation.participants?.map((participant) => participant._id) ??
          [];
        const selectedIds = selectedAddMembers.map((member) => member._id);
        setAddMemberResults(
          users.filter(
            (result) =>
              result._id !== user._id &&
              !existingIds.includes(result._id) &&
              !selectedIds.includes(result._id)
          )
        );
      } catch {
        setGroupActionError("Failed to search users.");
      } finally {
        setIsAddMemberSearching(false);
      }
    }, 350);

    return () => window.clearTimeout(timeoutId);
  }, [addMemberSearchText, selectedAddMembers, selectedConversation, user]);

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

  function handleSelectConversation(conversation: Conversation) {
    setSelectedConversation(conversation);
    setIsGroupInfoOpen(false);
    setGroupActionError("");
    setSelectedAddMembers([]);
    setAddMemberSearchText("");
    setAddMemberResults([]);
  }

  function handleOpenGroupInfo() {
    setRenameText(selectedConversation?.name ?? "");
    setGroupActionError("");
    setSelectedAddMembers([]);
    setAddMemberSearchText("");
    setAddMemberResults([]);
    setIsGroupInfoOpen(true);
  }

  function handleGroupSearchChange(value: string) {
    setGroupSearchText(value);

    if (!value.trim()) {
      setGroupSearchResults([]);
      setIsGroupSearching(false);
      return;
    }

    setGroupSearchResults([]);
    setGroupError("");
    setIsGroupSearching(true);
  }

  function handleAddMemberSearchChange(value: string) {
    setAddMemberSearchText(value);

    if (!value.trim()) {
      setAddMemberResults([]);
      setIsAddMemberSearching(false);
      return;
    }

    setAddMemberResults([]);
    setGroupActionError("");
    setIsAddMemberSearching(true);
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

  async function handleCreateGroup() {
    const trimmedName = groupName.trim();

    if (!trimmedName || selectedGroupMembers.length < 2) {
      setGroupError("Add a group name and at least two other members.");
      return;
    }

    setIsGroupActionLoading(true);
    setGroupError("");

    try {
      const group = await createGroup(
        trimmedName,
        selectedGroupMembers.map((member) => member._id)
      );
      setIsCreatingGroup(false);
      setGroupName("");
      setGroupSearchText("");
      setGroupSearchResults([]);
      setSelectedGroupMembers([]);
      await loadConversations(group);
    } catch {
      setGroupError("Failed to create group.");
    } finally {
      setIsGroupActionLoading(false);
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

  async function handleRenameGroup() {
    if (!selectedConversation || selectedConversation.type !== "group") {
      return;
    }

    const trimmedName = renameText.trim();

    if (!trimmedName) {
      setGroupActionError("Group name is required.");
      return;
    }

    setIsGroupActionLoading(true);
    setGroupActionError("");

    try {
      const updatedGroup = await renameGroup(selectedConversation._id, trimmedName);
      setSelectedConversation(updatedGroup);
      setRenameText(updatedGroup.name ?? "");
      await loadConversations(updatedGroup);
    } catch {
      setGroupActionError("Failed to rename group.");
    } finally {
      setIsGroupActionLoading(false);
    }
  }

  async function handleAddMembers() {
    if (!selectedConversation || selectedAddMembers.length === 0) {
      return;
    }

    setIsGroupActionLoading(true);
    setGroupActionError("");

    try {
      const updatedGroup = await addParticipants(
        selectedConversation._id,
        selectedAddMembers.map((member) => member._id)
      );
      setSelectedConversation(updatedGroup);
      setSelectedAddMembers([]);
      setAddMemberSearchText("");
      setAddMemberResults([]);
      await loadConversations(updatedGroup);
    } catch {
      setGroupActionError("Failed to add members.");
    } finally {
      setIsGroupActionLoading(false);
    }
  }

  async function handleRemoveMember(member: ChatUser) {
    if (!selectedConversation || !window.confirm(`Remove ${member.name}?`)) {
      return;
    }

    setIsGroupActionLoading(true);
    setGroupActionError("");

    try {
      const updatedGroup = await removeParticipant(
        selectedConversation._id,
        member._id
      );
      setSelectedConversation(updatedGroup);
      await loadConversations(updatedGroup);
    } catch {
      setGroupActionError("Failed to remove member.");
    } finally {
      setIsGroupActionLoading(false);
    }
  }

  async function handlePromoteAdmin(member: ChatUser) {
    if (!selectedConversation) {
      return;
    }

    setIsGroupActionLoading(true);
    setGroupActionError("");

    try {
      const updatedGroup = await promoteAdmin(selectedConversation._id, member._id);
      setSelectedConversation(updatedGroup);
      await loadConversations(updatedGroup);
    } catch {
      setGroupActionError("Failed to promote member.");
    } finally {
      setIsGroupActionLoading(false);
    }
  }

  async function handleLeaveGroup() {
    if (!selectedConversation || !user || !window.confirm("Leave this group?")) {
      return;
    }

    setIsGroupActionLoading(true);
    setGroupActionError("");

    try {
      await removeParticipant(selectedConversation._id, user._id);
      setSelectedConversation(null);
      setIsGroupInfoOpen(false);
      await loadConversations();
    } catch {
      setGroupActionError("Failed to leave group.");
    } finally {
      setIsGroupActionLoading(false);
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

  const selectedIsGroup = selectedConversation?.type === "group";
  const selectedIsAdmin =
    selectedIsGroup && selectedConversation.admins?.includes(user._id);

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

          <button
            type="button"
            onClick={() => setIsCreatingGroup(true)}
            className="mt-5 w-full rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            New Group
          </button>

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

                    return (
                      <button
                        key={conversation._id}
                        type="button"
                        onClick={() => handleSelectConversation(conversation)}
                        className={`w-full px-3 py-3 text-left transition ${
                          isSelected ? "bg-slate-100" : "hover:bg-slate-50"
                        }`}
                      >
                        <span className="flex items-center gap-2 text-sm font-medium">
                          {conversation.type === "group" ? (
                            <span className="rounded bg-slate-200 px-1.5 py-0.5 text-[10px] uppercase text-slate-700">
                              Group
                            </span>
                          ) : null}
                          {getConversationName(conversation)}
                        </span>
                        <span className="mt-0.5 block truncate text-xs text-slate-600">
                          {getConversationSubtitle(conversation)}
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
              <header className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4">
                <div>
                  <h2 className="text-lg font-semibold tracking-normal">
                    {getConversationName(selectedConversation)}
                  </h2>
                  <p className="mt-0.5 text-sm text-slate-600">
                    {selectedConversation.type === "group"
                      ? `${selectedConversation.participants?.length ?? 0} members`
                      : selectedConversation.participant?.phone}
                  </p>
                </div>
                {selectedConversation.type === "group" ? (
                  <button
                    type="button"
                    onClick={handleOpenGroupInfo}
                    className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium transition hover:bg-slate-100"
                  >
                    Group info
                  </button>
                ) : null}
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

      {isCreatingGroup ? (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-slate-950/30 px-4">
          <section className="w-full max-w-md rounded-lg bg-white p-5 shadow-lg">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold">New Group</h2>
                <p className="mt-1 text-sm text-slate-600">
                  Add at least two other members.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsCreatingGroup(false)}
                className="text-sm text-slate-600 hover:text-slate-950"
              >
                Close
              </button>
            </div>

            <label htmlFor="group-name" className="mt-5 block text-sm font-medium">
              Group name
            </label>
            <input
              id="group-name"
              value={groupName}
              onChange={(event) => setGroupName(event.target.value)}
              className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              placeholder="Frontend Team"
            />

            <label htmlFor="group-search" className="mt-4 block text-sm font-medium">
              Search users
            </label>
            <input
              id="group-search"
              type="search"
              value={groupSearchText}
              onChange={(event) => handleGroupSearchChange(event.target.value)}
              className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              placeholder="Search by name or phone"
            />

            {isGroupSearching ? (
              <p className="mt-2 text-sm text-slate-600">Searching users...</p>
            ) : null}

            {groupSearchResults.length > 0 ? (
              <div className="mt-2 max-h-32 divide-y divide-slate-200 overflow-y-auto rounded-md border border-slate-200">
                {groupSearchResults.map((result) => (
                  <button
                    key={result._id}
                    type="button"
                    onClick={() => {
                      setSelectedGroupMembers((members) => [...members, result]);
                      setGroupSearchResults((results) =>
                        results.filter((userResult) => userResult._id !== result._id)
                      );
                    }}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-slate-50"
                  >
                    {result.name}
                    <span className="block text-xs text-slate-600">
                      {result.phone}
                    </span>
                  </button>
                ))}
              </div>
            ) : null}

            <div className="mt-4">
              <h3 className="text-sm font-medium">Selected members</h3>
              {selectedGroupMembers.length === 0 ? (
                <p className="mt-2 text-sm text-slate-600">No members selected.</p>
              ) : (
                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedGroupMembers.map((member) => (
                    <button
                      key={member._id}
                      type="button"
                      onClick={() =>
                        setSelectedGroupMembers((members) =>
                          members.filter((item) => item._id !== member._id)
                        )
                      }
                      className="rounded-full bg-slate-100 px-3 py-1 text-xs hover:bg-slate-200"
                    >
                      {member.name} x
                    </button>
                  ))}
                </div>
              )}
            </div>

            {groupError ? (
              <p className="mt-3 text-sm text-red-600">{groupError}</p>
            ) : null}

            <button
              type="button"
              onClick={handleCreateGroup}
              disabled={
                isGroupActionLoading ||
                !groupName.trim() ||
                selectedGroupMembers.length < 2
              }
              className="mt-5 w-full rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isGroupActionLoading ? "Creating..." : "Create Group"}
            </button>
          </section>
        </div>
      ) : null}

      {isGroupInfoOpen && selectedConversation?.type === "group" ? (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-slate-950/30 px-4">
          <section className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg bg-white p-5 shadow-lg">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold">
                  {getConversationName(selectedConversation)}
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  {selectedConversation.participants?.length ?? 0} members
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsGroupInfoOpen(false)}
                className="text-sm text-slate-600 hover:text-slate-950"
              >
                Close
              </button>
            </div>

            {selectedIsAdmin ? (
              <div className="mt-5 rounded-md border border-slate-200 p-3">
                <label
                  htmlFor="rename-group"
                  className="block text-sm font-medium"
                >
                  Rename group
                </label>
                <div className="mt-2 flex gap-2">
                  <input
                    id="rename-group"
                    value={renameText}
                    onChange={(event) => setRenameText(event.target.value)}
                    className="min-w-0 flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                  />
                  <button
                    type="button"
                    onClick={handleRenameGroup}
                    disabled={isGroupActionLoading || !renameText.trim()}
                    className="rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : null}

            <div className="mt-5">
              <h3 className="text-sm font-semibold">Members</h3>
              <div className="mt-2 divide-y divide-slate-200 rounded-md border border-slate-200">
                {selectedConversation.participants?.map((member) => {
                  const memberIsAdmin =
                    selectedConversation.admins?.includes(member._id) ?? false;
                  const isCurrentUser = member._id === user._id;

                  return (
                    <div
                      key={member._id}
                      className="flex items-center justify-between gap-3 px-3 py-3"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">
                          {member.name} {isCurrentUser ? "(you)" : ""}
                        </p>
                        <p className="text-xs text-slate-600">
                          {member.phone}
                          {memberIsAdmin ? " · admin" : ""}
                        </p>
                      </div>
                      {selectedIsAdmin && !isCurrentUser ? (
                        <div className="flex shrink-0 gap-2">
                          {!memberIsAdmin ? (
                            <button
                              type="button"
                              onClick={() => handlePromoteAdmin(member)}
                              disabled={isGroupActionLoading}
                              className="text-xs font-medium text-slate-700 hover:text-slate-950 disabled:opacity-60"
                            >
                              Make admin
                            </button>
                          ) : null}
                          <button
                            type="button"
                            onClick={() => handleRemoveMember(member)}
                            disabled={isGroupActionLoading}
                            className="text-xs font-medium text-red-600 hover:text-red-700 disabled:opacity-60"
                          >
                            Remove
                          </button>
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>

            {selectedIsAdmin ? (
              <div className="mt-5 rounded-md border border-slate-200 p-3">
                <label
                  htmlFor="add-member-search"
                  className="block text-sm font-medium"
                >
                  Add member
                </label>
                <input
                  id="add-member-search"
                  type="search"
                  value={addMemberSearchText}
                  onChange={(event) =>
                    handleAddMemberSearchChange(event.target.value)
                  }
                  className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                  placeholder="Search by name or phone"
                />
                {isAddMemberSearching ? (
                  <p className="mt-2 text-sm text-slate-600">Searching users...</p>
                ) : null}
                {addMemberResults.length > 0 ? (
                  <div className="mt-2 max-h-28 divide-y divide-slate-200 overflow-y-auto rounded-md border border-slate-200">
                    {addMemberResults.map((result) => (
                      <button
                        key={result._id}
                        type="button"
                        onClick={() => {
                          setSelectedAddMembers((members) => [...members, result]);
                          setAddMemberResults((results) =>
                            results.filter((item) => item._id !== result._id)
                          );
                        }}
                        className="w-full px-3 py-2 text-left text-sm hover:bg-slate-50"
                      >
                        {result.name}
                        <span className="block text-xs text-slate-600">
                          {result.phone}
                        </span>
                      </button>
                    ))}
                  </div>
                ) : null}
                {selectedAddMembers.length > 0 ? (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedAddMembers.map((member) => (
                      <button
                        key={member._id}
                        type="button"
                        onClick={() =>
                          setSelectedAddMembers((members) =>
                            members.filter((item) => item._id !== member._id)
                          )
                        }
                        className="rounded-full bg-slate-100 px-3 py-1 text-xs hover:bg-slate-200"
                      >
                        {member.name} x
                      </button>
                    ))}
                  </div>
                ) : null}
                <button
                  type="button"
                  onClick={handleAddMembers}
                  disabled={isGroupActionLoading || selectedAddMembers.length === 0}
                  className="mt-3 rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Add selected
                </button>
              </div>
            ) : null}

            {groupActionError ? (
              <p className="mt-3 text-sm text-red-600">{groupActionError}</p>
            ) : null}

            <button
              type="button"
              onClick={handleLeaveGroup}
              disabled={isGroupActionLoading}
              className="mt-5 rounded-md border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Leave group
            </button>
          </section>
        </div>
      ) : null}
    </main>
  );
}
