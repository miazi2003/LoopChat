"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { Socket } from "socket.io-client";
import { ChatHeader } from "@/components/chat/chat-header";
import { ChatSidebar } from "@/components/chat/chat-sidebar";
import { MessageInput } from "@/components/chat/message-input";
import { MessageList } from "@/components/chat/message-list";
import { CreateGroupPanel } from "@/components/groups/create-group-panel";
import { GroupInfoPanel } from "@/components/groups/group-info-panel";
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
import {
  isMatchingOptimisticMessage,
  normalizeSocketMessage,
  type SocketMessage
} from "@/utils/message";

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
  const [isAddMemberPanelOpen, setIsAddMemberPanelOpen] = useState(false);
  const [renameText, setRenameText] = useState("");
  const [addMemberSearchText, setAddMemberSearchText] = useState("");
  const [addMemberResults, setAddMemberResults] = useState<ChatUser[]>([]);
  const [selectedAddMembers, setSelectedAddMembers] = useState<ChatUser[]>([]);
  const [isAddMemberSearching, setIsAddMemberSearching] = useState(false);
  const [groupActionError, setGroupActionError] = useState("");
  const [isGroupActionLoading, setIsGroupActionLoading] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const selectedConversationIdRef = useRef<string | null>(null);
  const isNearBottomRef = useRef(true);
  const messageListRef = useRef<HTMLDivElement | null>(null);
  const shouldScrollAfterRenderRef = useRef(false);
  const conversationOpenScrollIdRef = useRef<string | null>(null);
  const selectedConversationId = selectedConversation?._id;

  const loadConversations = useCallback(
    async (
      conversationToSelect?: Conversation | ChatUser,
      showLoading = true
    ) => {
      if (showLoading) {
        setIsLoadingConversations(true);
      }

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
        if (showLoading) {
          setIsLoadingConversations(false);
        }
      }
    },
    []
  );

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "auto") => {
    const messageList = messageListRef.current;

    if (!messageList) {
      return;
    }

    messageList.scrollTo({
      top: messageList.scrollHeight,
      behavior
    });
    isNearBottomRef.current = true;
    setIsNearBottom(true);
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
      const activeConversationId = selectedConversationIdRef.current;

      if (activeConversationId === normalizedMessage.conversation) {
        setMessages((currentMessages) => {
          const exists = currentMessages.some(
            (message) => message.id === normalizedMessage.id
          );

          if (exists) {
            return currentMessages;
          }

          const optimisticIndex = currentMessages.findIndex((message) =>
            isMatchingOptimisticMessage(message, normalizedMessage)
          );

          if (optimisticIndex >= 0) {
            return currentMessages.map((message, index) =>
              index === optimisticIndex ? normalizedMessage : message
            );
          }

          return [...currentMessages, normalizedMessage];
        });

        if (isNearBottomRef.current) {
          shouldScrollAfterRenderRef.current = true;
        } else {
          setShowNewMessagesButton(true);
        }
      }

      loadConversations(undefined, false);
    }

    function handleConversationUpdated(updatedConversation: Conversation) {
      loadConversations(undefined, false);
      updateSelectedGroup(updatedConversation);
    }

    socket.on("message:new", handleNewMessage);
    socket.on("conversation:updated", handleConversationUpdated);

    return () => {
      socket.off("message:new", handleNewMessage);
      socket.off("conversation:updated", handleConversationUpdated);
    };
  }, [isSocketReady, loadConversations, updateSelectedGroup]);

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
            (result) =>
              result._id !== user._id && !selectedIds.includes(result._id)
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
          selectedConversation.participants?.map(
            (participant) => participant._id
          ) ?? [];
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
    selectedConversationIdRef.current = selectedConversation?._id ?? null;
  }, [selectedConversation]);

  useEffect(() => {
    isNearBottomRef.current = isNearBottom;
  }, [isNearBottom]);

  useEffect(() => {
    async function loadSelectedMessages() {
      if (!selectedConversationId) {
        setMessages([]);
        return;
      }

      setMessages([]);
      setIsLoadingMessages(true);
      setMessageError("");
      setShowNewMessagesButton(false);
      isNearBottomRef.current = true;
      setIsNearBottom(true);

      try {
        const nextMessages = await getMessages(selectedConversationId);
        conversationOpenScrollIdRef.current = selectedConversationId;
        setMessages(nextMessages);
      } catch {
        setMessageError("Failed to load messages.");
      } finally {
        setIsLoadingMessages(false);
      }
    }

    loadSelectedMessages();
  }, [selectedConversationId]);

  useEffect(() => {
    if (conversationOpenScrollIdRef.current !== selectedConversationId) {
      return;
    }

    let secondFrameId: number | undefined;
    const firstFrameId = requestAnimationFrame(() => {
      secondFrameId = requestAnimationFrame(() => {
        if (conversationOpenScrollIdRef.current !== selectedConversationId) {
          return;
        }

        scrollToBottom("auto");
        conversationOpenScrollIdRef.current = null;
      });
    });

    return () => {
      cancelAnimationFrame(firstFrameId);

      if (secondFrameId !== undefined) {
        cancelAnimationFrame(secondFrameId);
      }
    };
  }, [messages, scrollToBottom, selectedConversationId]);

  useEffect(() => {
    if (!shouldScrollAfterRenderRef.current) {
      return;
    }

    shouldScrollAfterRenderRef.current = false;
    requestAnimationFrame(() => {
      scrollToBottom("auto");
    });
  }, [messages, scrollToBottom]);

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
    setIsAddMemberPanelOpen(false);
    setGroupActionError("");
    setSelectedAddMembers([]);
    setAddMemberSearchText("");
    setAddMemberResults([]);
  }

  function handleOpenGroupInfo() {
    setRenameText(selectedConversation?.name ?? "");
    setGroupActionError("");
    setIsAddMemberPanelOpen(false);
    setSelectedAddMembers([]);
    setAddMemberSearchText("");
    setAddMemberResults([]);
    setIsGroupInfoOpen(true);
  }

  function handleCloseGroupInfo() {
    setIsGroupInfoOpen(false);
    setIsAddMemberPanelOpen(false);
    setSelectedAddMembers([]);
    setAddMemberSearchText("");
    setAddMemberResults([]);
    setIsAddMemberSearching(false);
  }

  function handleCloseAddMemberPanel() {
    setIsAddMemberPanelOpen(false);
    setSelectedAddMembers([]);
    setAddMemberSearchText("");
    setAddMemberResults([]);
    setIsAddMemberSearching(false);
    setGroupActionError("");
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

    isNearBottomRef.current = nearBottom;
    setIsNearBottom(nearBottom);

    if (nearBottom) {
      setShowNewMessagesButton(false);
    }
  }

  function handleNewMessagesClick() {
    scrollToBottom("smooth");
    setShowNewMessagesButton(false);
    isNearBottomRef.current = true;
    setIsNearBottom(true);
  }

  function handleSendMessage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedText = newMessageText.trim();

    if (!trimmedText || !selectedConversation || !user || !socketRef.current) {
      return;
    }

    const optimisticMessage: Message = {
      id: `temp-${Date.now()}`,
      conversation: selectedConversation._id,
      sender: user._id,
      text: trimmedText,
      createdAt: Date.now()
    };

    setMessages((currentMessages) => [...currentMessages, optimisticMessage]);
    setIsSending(true);
    setSendError("");

    if (isNearBottomRef.current) {
      shouldScrollAfterRenderRef.current = true;
    }

    socketRef.current.emit(
      "message:send",
      {
        conversationId: selectedConversation._id,
        text: trimmedText
      },
      (acknowledgement?: { ok?: boolean }) => {
        setIsSending(false);

        if (acknowledgement?.ok === false) {
          setMessages((currentMessages) =>
            currentMessages.filter(
              (message) => message.id !== optimisticMessage.id
            )
          );
          setSendError("Failed to send message.");
          return;
        }

        setNewMessageText("");
        loadConversations();
      }
    );
  }

  function handleMessageKeyDown(
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
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
      const updatedGroup = await renameGroup(
        selectedConversation._id,
        trimmedName
      );
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
      setIsAddMemberPanelOpen(false);
      await loadConversations(updatedGroup, false);
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
      const updatedGroup = await promoteAdmin(
        selectedConversation._id,
        member._id
      );
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

  const selectedIsAdmin =
    selectedConversation?.type === "group" &&
    selectedConversation.admins?.includes(user._id);

  return (
    <main className="h-dvh overflow-hidden bg-white text-[#18201b]">
      <div className="flex h-full min-h-0 w-full flex-col bg-white md:flex-row">
        <ChatSidebar
          user={user}
          conversations={conversations}
          selectedConversation={selectedConversation}
          isLoadingConversations={isLoadingConversations}
          conversationError={conversationError}
          searchText={searchText}
          searchResults={searchResults}
          isSearching={isSearching}
          searchMessage={searchMessage}
          isStartingConversation={isStartingConversation}
          onLogout={handleLogout}
          onOpenCreateGroup={() => setIsCreatingGroup(true)}
          onSearchChange={handleSearchChange}
          onStartConversation={handleStartConversation}
          onSelectConversation={handleSelectConversation}
        />

        <section
          className={`min-h-0 flex-1 flex-col md:flex ${
            selectedConversation ? "flex" : "hidden"
          }`}
        >
          {selectedConversation ? (
            <>
              <ChatHeader
                conversation={selectedConversation}
                onBack={() => setSelectedConversation(null)}
                onOpenGroupInfo={handleOpenGroupInfo}
              />
              <MessageList
                messageListRef={messageListRef}
                conversation={selectedConversation}
                messages={messages}
                currentUserId={user._id}
                isLoading={isLoadingMessages}
                error={messageError}
                showNewMessagesButton={showNewMessagesButton}
                onScroll={handleMessageScroll}
                onNewMessagesClick={handleNewMessagesClick}
              />
              <MessageInput
                value={newMessageText}
                error={sendError}
                isSending={isSending}
                onChange={setNewMessageText}
                onSubmit={handleSendMessage}
                onKeyDown={handleMessageKeyDown}
              />
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center bg-white p-6">
              <p className="rounded-lg bg-[#f5f7f4] px-5 py-3 text-sm text-[#7d887f]">
                Select a conversation to start chatting.
              </p>
            </div>
          )}
        </section>
      </div>

      {isCreatingGroup ? (
        <CreateGroupPanel
          name={groupName}
          searchText={groupSearchText}
          searchResults={groupSearchResults}
          selectedMembers={selectedGroupMembers}
          isSearching={isGroupSearching}
          isLoading={isGroupActionLoading}
          error={groupError}
          onClose={() => setIsCreatingGroup(false)}
          onNameChange={setGroupName}
          onSearchChange={handleGroupSearchChange}
          onSelectMember={(member) => {
            setSelectedGroupMembers((members) => [...members, member]);
            setGroupSearchResults((results) =>
              results.filter((result) => result._id !== member._id)
            );
          }}
          onRemoveMember={(member) =>
            setSelectedGroupMembers((members) =>
              members.filter((item) => item._id !== member._id)
            )
          }
          onCreate={handleCreateGroup}
        />
      ) : null}

      {isGroupInfoOpen && selectedConversation?.type === "group" ? (
        <GroupInfoPanel
          conversation={selectedConversation}
          currentUserId={user._id}
          currentUserIsAdmin={Boolean(selectedIsAdmin)}
          isAddMemberPanelOpen={isAddMemberPanelOpen}
          renameText={renameText}
          addMemberSearchText={addMemberSearchText}
          addMemberResults={addMemberResults}
          selectedAddMembers={selectedAddMembers}
          isAddMemberSearching={isAddMemberSearching}
          isLoading={isGroupActionLoading}
          error={groupActionError}
          onClose={handleCloseGroupInfo}
          onOpenAddMemberPanel={() => setIsAddMemberPanelOpen(true)}
          onCloseAddMemberPanel={handleCloseAddMemberPanel}
          onRenameTextChange={setRenameText}
          onRename={handleRenameGroup}
          onPromote={handlePromoteAdmin}
          onRemove={handleRemoveMember}
          onAddMemberSearchChange={handleAddMemberSearchChange}
          onSelectAddMember={(member) => {
            setSelectedAddMembers((members) => [...members, member]);
            setAddMemberResults((results) =>
              results.filter((result) => result._id !== member._id)
            );
          }}
          onRemoveSelectedAddMember={(member) =>
            setSelectedAddMembers((members) =>
              members.filter((item) => item._id !== member._id)
            )
          }
          onAddMembers={handleAddMembers}
          onLeave={handleLeaveGroup}
        />
      ) : null}
    </main>
  );
}
