import { Search, X } from "lucide-react";
import { ChatAvatar } from "@/components/chat/chat-avatar";
import type { ChatUser } from "@/types/chat";

type AddMemberPanelProps = {
  searchText: string;
  results: ChatUser[];
  selectedMembers: ChatUser[];
  isSearching: boolean;
  isLoading: boolean;
  onClose: () => void;
  onSearchChange: (value: string) => void;
  onSelectMember: (member: ChatUser) => void;
  onRemoveSelectedMember: (member: ChatUser) => void;
  onAddMembers: () => void;
};

export function AddMemberPanel({
  searchText,
  results,
  selectedMembers,
  isSearching,
  isLoading,
  onClose,
  onSearchChange,
  onSelectMember,
  onRemoveSelectedMember,
  onAddMembers
}: AddMemberPanelProps) {
  return (
    <div className="mt-5 rounded-lg border border-[#e2e8e1] bg-[#f9faf8] p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-[#39443c]">Add members</h3>
          <p className="mt-0.5 text-xs text-[#7d887f]">
            Search by name or phone.
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close add member panel"
          title="Close"
          className="flex h-8 w-8 items-center justify-center rounded-full text-[#7d887f] transition hover:bg-white hover:text-[#263029]"
        >
          <X size={16} />
        </button>
      </div>
      <label htmlFor="add-member-search" className="sr-only">
        Search users to add
      </label>
      <div className="relative mt-2">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#98a199]" size={16} />
        <input
          id="add-member-search"
          type="search"
          value={searchText}
          onChange={(event) => onSearchChange(event.target.value)}
          className="h-10 w-full rounded-lg border border-[#dce3db] bg-white pl-10 pr-3 text-sm outline-none transition focus:border-[#9fcba6] focus:ring-2 focus:ring-[#dcefe0]"
          placeholder="Search by name or phone"
        />
      </div>
      {isSearching ? (
        <p className="mt-2 text-sm text-[#7d887f]">Searching users...</p>
      ) : null}
      {!isSearching && searchText.trim() && results.length === 0 ? (
        <p className="mt-2 text-sm text-[#7d887f]">No users found.</p>
      ) : null}
      {results.length > 0 ? (
        <div className="mt-2 max-h-32 divide-y divide-[#edf0ec] overflow-y-auto rounded-lg border border-[#e2e8e1] bg-white">
          {results.map((result) => (
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
      {selectedMembers.length > 0 ? (
        <div className="mt-2 flex flex-wrap gap-2">
          {selectedMembers.map((member) => (
            <button
              key={member._id}
              type="button"
              onClick={() => onRemoveSelectedMember(member)}
              className="rounded-full bg-[#eaf5eb] px-3 py-1.5 text-xs font-medium text-[#2d7639] transition hover:bg-[#dcefe0]"
            >
              {member.name} x
            </button>
          ))}
        </div>
      ) : null}
      <button
        type="button"
        onClick={onAddMembers}
        disabled={isLoading || selectedMembers.length === 0}
        className="mt-3 rounded-lg bg-[#35ad49] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#2d9e40] disabled:cursor-not-allowed disabled:bg-[#b7c2b8]"
      >
        Add members
      </button>
    </div>
  );
}
