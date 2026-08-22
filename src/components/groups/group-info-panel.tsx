import { UserPlus, X } from "lucide-react";
import { ChatAvatar } from "@/components/chat/chat-avatar";
import { AddMemberPanel } from "@/components/groups/add-member-panel";
import { GroupMemberList } from "@/components/groups/group-member-list";
import type { ChatUser, Conversation } from "@/types/chat";
import { getConversationName } from "@/utils/format";

type GroupInfoPanelProps = {
  conversation: Conversation;
  currentUserId: string;
  currentUserIsAdmin: boolean;
  isAddMemberPanelOpen: boolean;
  renameText: string;
  addMemberSearchText: string;
  addMemberResults: ChatUser[];
  selectedAddMembers: ChatUser[];
  isAddMemberSearching: boolean;
  isLoading: boolean;
  error: string;
  onClose: () => void;
  onOpenAddMemberPanel: () => void;
  onCloseAddMemberPanel: () => void;
  onRenameTextChange: (value: string) => void;
  onRename: () => void;
  onPromote: (member: ChatUser) => void;
  onRemove: (member: ChatUser) => void;
  onAddMemberSearchChange: (value: string) => void;
  onSelectAddMember: (member: ChatUser) => void;
  onRemoveSelectedAddMember: (member: ChatUser) => void;
  onAddMembers: () => void;
  onLeave: () => void;
};

export function GroupInfoPanel({
  conversation,
  currentUserId,
  currentUserIsAdmin,
  isAddMemberPanelOpen,
  renameText,
  addMemberSearchText,
  addMemberResults,
  selectedAddMembers,
  isAddMemberSearching,
  isLoading,
  error,
  onClose,
  onOpenAddMemberPanel,
  onCloseAddMemberPanel,
  onRenameTextChange,
  onRename,
  onPromote,
  onRemove,
  onAddMemberSearchChange,
  onSelectAddMember,
  onRemoveSelectedAddMember,
  onAddMembers,
  onLeave
}: GroupInfoPanelProps) {
  return (
    <div className="fixed inset-0 z-20 flex items-start justify-center overflow-y-auto bg-[#152018]/35 px-4 py-4 backdrop-blur-[2px] sm:items-center">
      <section className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg border border-[#e1e7e0] bg-white p-5 shadow-2xl shadow-black/10 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <ChatAvatar name={getConversationName(conversation)} isGroup size="lg" />
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase text-[#3b9d49]">
                Group info
              </p>
              <h2 className="truncate text-lg font-semibold text-[#19221b]">
                {getConversationName(conversation)}
              </h2>
              <p className="mt-0.5 text-sm text-[#7d887f]">
                {conversation.participants?.length ?? 0} members
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close group info"
            title="Close"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#7d887f] transition hover:bg-[#f3f5f2] hover:text-[#263029]"
          >
            <X size={18} />
          </button>
        </div>

        {currentUserIsAdmin ? (
          <div className="mt-6 rounded-lg border border-[#e2e8e1] bg-[#f9faf8] p-4">
            <label htmlFor="rename-group" className="block text-sm font-semibold text-[#39443c]">
              Rename group
            </label>
            <div className="mt-2 flex gap-2">
              <input
                id="rename-group"
                value={renameText}
                onChange={(event) => onRenameTextChange(event.target.value)}
                className="h-10 min-w-0 flex-1 rounded-lg border border-[#dce3db] bg-white px-3 text-sm outline-none transition focus:border-[#9fcba6] focus:ring-2 focus:ring-[#dcefe0]"
              />
              <button
                type="button"
                onClick={onRename}
                disabled={isLoading || !renameText.trim()}
                className="rounded-lg bg-[#35ad49] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#2d9e40] disabled:cursor-not-allowed disabled:bg-[#b7c2b8]"
              >
                Save
              </button>
            </div>
          </div>
        ) : null}

        <GroupMemberList
          members={conversation.participants ?? []}
          adminIds={conversation.admins ?? []}
          currentUserId={currentUserId}
          currentUserIsAdmin={currentUserIsAdmin}
          isLoading={isLoading}
          onPromote={onPromote}
          onRemove={onRemove}
        />

        {currentUserIsAdmin && !isAddMemberPanelOpen ? (
          <button
            type="button"
            onClick={onOpenAddMemberPanel}
            className="mt-5 inline-flex items-center gap-2 rounded-lg border border-[#cfe4d2] bg-[#edf8ef] px-3 py-2 text-sm font-semibold text-[#2d7639] transition hover:bg-[#e1f2e4]"
          >
            <UserPlus size={16} />
            Add member
          </button>
        ) : null}

        {currentUserIsAdmin && isAddMemberPanelOpen ? (
          <AddMemberPanel
            searchText={addMemberSearchText}
            results={addMemberResults}
            selectedMembers={selectedAddMembers}
            isSearching={isAddMemberSearching}
            isLoading={isLoading}
            onClose={onCloseAddMemberPanel}
            onSearchChange={onAddMemberSearchChange}
            onSelectMember={onSelectAddMember}
            onRemoveSelectedMember={onRemoveSelectedAddMember}
            onAddMembers={onAddMembers}
          />
        ) : null}

        {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}

        {isLoading ? (
          <p className="mt-3 text-sm text-[#7d887f]">Updating group...</p>
        ) : null}

        <button
          type="button"
          onClick={onLeave}
          disabled={isLoading}
          className="mt-5 rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Leave group
        </button>
      </section>
    </div>
  );
}
