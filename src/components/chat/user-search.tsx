import { Search } from "lucide-react";
import { ChatAvatar } from "@/components/chat/chat-avatar";
import type { ChatUser } from "@/types/chat";

type UserSearchProps = {
  value: string;
  results: ChatUser[];
  isSearching: boolean;
  message: string;
  isStartingConversation: boolean;
  onChange: (value: string) => void;
  onStartConversation: (user: ChatUser) => void;
};

export function UserSearch({
  value,
  results,
  isSearching,
  message,
  isStartingConversation,
  onChange,
  onStartConversation
}: UserSearchProps) {
  return (
    <>
      <div className="relative mt-5">
        <Search
          aria-hidden="true"
          size={16}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#9ba39d]"
        />
        <input
          id="user-search"
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-11 w-full rounded-full border border-white bg-white py-2 pl-11 pr-4 text-sm text-[#263029] shadow-sm outline-none transition placeholder:text-[#a1a9a3] focus:border-[#b9d7bd] focus:ring-2 focus:ring-[#dcefe0]"
          placeholder="Search or start a new chat"
          aria-label="Search users by name or phone"
        />
      </div>

      {value.trim() ? (
        <div className="mt-3 overflow-hidden rounded-lg border border-[#e2e8e1] bg-white shadow-sm">
          {isSearching ? (
            <p className="px-4 py-3 text-sm text-[#7d887f]">Searching users...</p>
          ) : null}

          {!isSearching && message ? (
            <p className="px-4 py-3 text-sm text-[#7d887f]">{message}</p>
          ) : null}

          {!isSearching && results.length > 0 ? (
            <div className="divide-y divide-[#edf0ec]">
              {results.map((result) => (
                <button
                  key={result._id}
                  type="button"
                  onClick={() => onStartConversation(result)}
                  disabled={isStartingConversation}
                  className="flex w-full items-center gap-3 px-3 py-3 text-left transition hover:bg-[#f6f9f5] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <ChatAvatar name={result.name} size="sm" />
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-[#263029]">
                      {result.name}
                    </span>
                    <span className="mt-0.5 block text-xs text-[#7d887f]">
                      {result.phone}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </>
  );
}
