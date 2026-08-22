import { LogOut, Plus } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { ConversationList } from "@/components/chat/conversation-list";
import { UserSearch } from "@/components/chat/user-search";
import type { User } from "@/types/auth";
import type { ChatUser, Conversation } from "@/types/chat";

type ChatSidebarProps = {
  user: User;
  conversations: Conversation[];
  unreadCounts: Record<string, number>;
  selectedConversation: Conversation | null;
  isLoadingConversations: boolean;
  conversationError: string;
  searchText: string;
  searchResults: ChatUser[];
  isSearching: boolean;
  searchMessage: string;
  isStartingConversation: boolean;
  onLogout: () => void;
  onOpenCreateGroup: () => void;
  onSearchChange: (value: string) => void;
  onStartConversation: (user: ChatUser) => void;
  onSelectConversation: (conversation: Conversation) => void;
};

export function ChatSidebar({
  user,
  conversations,
  unreadCounts,
  selectedConversation,
  isLoadingConversations,
  conversationError,
  searchText,
  searchResults,
  isSearching,
  searchMessage,
  isStartingConversation,
  onLogout,
  onOpenCreateGroup,
  onSearchChange,
  onStartConversation,
  onSelectConversation
}: ChatSidebarProps) {
  return (
    <aside
      className={`min-h-0 w-full overflow-y-auto border-b border-[#e7eae6] bg-[#f5f6f4] px-4 py-5 md:block md:w-[310px] md:flex-none md:border-b-0 md:border-r ${
        selectedConversation ? "hidden" : "block"
      }`}
    >
      <div className="flex items-center justify-between gap-3 px-1">
        <div className="min-w-0">
          <BrandLogo
            size="sm"
            className="text-[#172019]"
            nameClassName="text-sm"
          />
          <h1 className="mt-0.5 text-2xl font-semibold tracking-normal text-[#172019]">
            Chats
          </h1>
          <p className="mt-1 truncate text-xs text-[#7a857c]">{user.name}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={onOpenCreateGroup}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#dce3db] bg-white px-3 text-xs font-semibold text-[#344238] shadow-sm transition hover:border-[#b9d7bd] hover:bg-[#f8fbf8]"
          >
            <Plus size={15} />
            New group
          </button>
          <button
            type="button"
            onClick={onLogout}
            aria-label="Logout"
            title="Logout"
            className="flex h-9 w-9 items-center justify-center rounded-full text-[#748077] transition hover:bg-white hover:text-[#27342b]"
          >
            <LogOut size={17} />
          </button>
        </div>
      </div>

      <UserSearch
        value={searchText}
        results={searchResults}
        isSearching={isSearching}
        message={searchMessage}
        isStartingConversation={isStartingConversation}
        onChange={onSearchChange}
        onStartConversation={onStartConversation}
      />

      <ConversationList
        conversations={conversations}
        unreadCounts={unreadCounts}
        selectedConversation={selectedConversation}
        isLoading={isLoadingConversations}
        error={conversationError}
        onSelect={onSelectConversation}
      />
    </aside>
  );
}
