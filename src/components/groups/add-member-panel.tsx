import type { FormEvent } from "react";
import { Plus, Search, X } from "lucide-react";
import { ChatAvatar } from "@/components/chat/chat-avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
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
  onAddMembers: () => Promise<boolean>;
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
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await onAddMembers();
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] max-w-md overflow-y-auto rounded-2xl p-6">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-lg">Add members</DialogTitle>
            <DialogDescription>
              Search people by name or phone.
            </DialogDescription>
          </DialogHeader>

          <div className="relative mt-5">
            <Search
              aria-hidden="true"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#98a199]"
              size={16}
            />
            <Input
              type="search"
              value={searchText}
              onChange={(event) => onSearchChange(event.target.value)}
              className="h-11 pl-10"
              placeholder="Search by name or phone"
              aria-label="Search users to add"
            />
          </div>

          {isSearching ? (
            <p className="mt-3 text-sm text-muted-foreground">
              Searching users...
            </p>
          ) : null}

          {!isSearching && searchText.trim() && results.length === 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">
              No users found.
            </p>
          ) : null}

          {results.length > 0 ? (
            <div className="mt-3 max-h-44 divide-y overflow-y-auto rounded-lg border bg-white">
              {results.map((result) => (
                <div
                  key={result._id}
                  className="flex items-center gap-3 px-3 py-2.5"
                >
                  <ChatAvatar name={result.name} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">
                      {result.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {result.phone}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => onSelectMember(result)}
                  >
                    <Plus />
                    Add
                  </Button>
                </div>
              ))}
            </div>
          ) : null}

          {selectedMembers.length > 0 ? (
            <div className="mt-4">
              <p className="text-xs font-semibold uppercase text-muted-foreground">
                Selected
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {selectedMembers.map((member) => (
                  <button
                    key={member._id}
                    type="button"
                    onClick={() => onRemoveSelectedMember(member)}
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#eaf5eb] px-3 py-1.5 text-xs font-medium text-[#2d7639]"
                  >
                    {member.name}
                    <X size={13} />
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="lg"
              disabled={isLoading || selectedMembers.length === 0}
            >
              {isLoading ? "Adding..." : "Add members"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
