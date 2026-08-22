import { Search, X } from "lucide-react";
import { ChatAvatar } from "@/components/chat/chat-avatar";
import type { ChatUser } from "@/types/chat";

type CreateGroupPanelProps = {
  name: string;
  searchText: string;
  searchResults: ChatUser[];
  selectedMembers: ChatUser[];
  isSearching: boolean;
  isLoading: boolean;
  error: string;
  onClose: () => void;
  onNameChange: (value: string) => void;
  onSearchChange: (value: string) => void;
  onSelectMember: (member: ChatUser) => void;
  onRemoveMember: (member: ChatUser) => void;
  onCreate: () => void;
};

export function CreateGroupPanel({
  name,
  searchText,
  searchResults,
  selectedMembers,
  isSearching,
  isLoading,
  error,
  onClose,
  onNameChange,
  onSearchChange,
  onSelectMember,
  onRemoveMember,
  onCreate
}: CreateGroupPanelProps) {
  return (
    <div className="fixed inset-0 z-20 flex items-start justify-center overflow-y-auto bg-[#152018]/35 px-4 py-4 backdrop-blur-[2px] sm:items-center">
      <section className="w-full max-w-md rounded-lg border border-[#e1e7e0] bg-white p-5 shadow-2xl shadow-black/10 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-[#19221b]">New group</h2>
            <p className="mt-1 text-sm text-[#7d887f]">
              Add at least two other members.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close new group panel"
            title="Close"
            className="flex h-9 w-9 items-center justify-center rounded-full text-[#7d887f] transition hover:bg-[#f3f5f2] hover:text-[#263029]"
          >
            <X size={18} />
          </button>
        </div>

        <label htmlFor="group-name" className="mt-6 block text-sm font-semibold text-[#39443c]">
          Group name
        </label>
        <input
          id="group-name"
          value={name}
          onChange={(event) => onNameChange(event.target.value)}
          className="mt-2 h-11 w-full rounded-lg border border-[#dce3db] bg-[#f9faf8] px-3 text-sm outline-none transition focus:border-[#9fcba6] focus:ring-2 focus:ring-[#dcefe0]"
          placeholder="Frontend Team"
        />

        <label htmlFor="group-search" className="mt-5 block text-sm font-semibold text-[#39443c]">
          Search users
        </label>
        <div className="relative mt-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#98a199]" size={16} />
          <input
            id="group-search"
            type="search"
            value={searchText}
            onChange={(event) => onSearchChange(event.target.value)}
            className="h-11 w-full rounded-lg border border-[#dce3db] bg-[#f9faf8] pl-10 pr-3 text-sm outline-none transition focus:border-[#9fcba6] focus:ring-2 focus:ring-[#dcefe0]"
            placeholder="Search by name or phone"
          />
        </div>

        {isSearching ? (
          <p className="mt-2 text-sm text-[#7d887f]">Searching users...</p>
        ) : null}

        {!isSearching && searchText.trim() && searchResults.length === 0 ? (
          <p className="mt-2 text-sm text-[#7d887f]">No users found.</p>
        ) : null}

        {searchResults.length > 0 ? (
          <div className="mt-2 max-h-36 divide-y divide-[#edf0ec] overflow-y-auto rounded-lg border border-[#e2e8e1] bg-white">
            {searchResults.map((result) => (
              <button
                key={result._id}
                type="button"
                onClick={() => onSelectMember(result)}
                className="flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm transition hover:bg-[#f6f9f5]"
              >
                <ChatAvatar name={result.name} size="sm" />
                <span>
                  <span className="block font-semibold text-[#263029]">{result.name}</span>
                  <span className="block text-xs text-[#7d887f]">{result.phone}</span>
                </span>
              </button>
            ))}
          </div>
        ) : null}

        <div className="mt-4">
          <h3 className="text-sm font-semibold text-[#39443c]">Selected members</h3>
          {selectedMembers.length === 0 ? (
            <p className="mt-2 text-sm text-[#7d887f]">No members selected.</p>
          ) : (
            <div className="mt-2 flex flex-wrap gap-2">
              {selectedMembers.map((member) => (
                <button
                  key={member._id}
                  type="button"
                  onClick={() => onRemoveMember(member)}
                  className="rounded-full bg-[#eaf5eb] px-3 py-1.5 text-xs font-medium text-[#2d7639] transition hover:bg-[#dcefe0]"
                >
                  {member.name} x
                </button>
              ))}
            </div>
          )}
        </div>

        {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}

        {isLoading ? (
          <p className="mt-3 text-sm text-[#7d887f]">Creating group...</p>
        ) : null}

        <button
          type="button"
          onClick={onCreate}
          disabled={isLoading || !name.trim() || selectedMembers.length < 2}
          className="mt-5 w-full rounded-lg bg-[#35ad49] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#2d9e40] disabled:cursor-not-allowed disabled:bg-[#b7c2b8]"
        >
          {isLoading ? "Creating..." : "Create Group"}
        </button>
      </section>
    </div>
  );
}
