import { ChatAvatar } from "@/components/chat/chat-avatar";
import type { ChatUser } from "@/types/chat";

type GroupMemberListProps = {
  members: ChatUser[];
  adminIds: string[];
  currentUserId: string;
  currentUserIsAdmin: boolean;
  isLoading: boolean;
  onPromote: (member: ChatUser) => void;
  onRemove: (member: ChatUser) => void;
};

export function GroupMemberList({
  members,
  adminIds,
  currentUserId,
  currentUserIsAdmin,
  isLoading,
  onPromote,
  onRemove
}: GroupMemberListProps) {
  return (
    <div className="mt-6">
      <h3 className="text-sm font-semibold text-[#39443c]">Members</h3>
      <div className="mt-2 divide-y divide-[#edf0ec] overflow-hidden rounded-lg border border-[#e2e8e1]">
        {members.map((member) => {
          const memberIsAdmin = adminIds.includes(member._id);
          const isCurrentUser = member._id === currentUserId;

          return (
            <div
              key={member._id}
              className="flex items-center justify-between gap-3 px-3 py-3"
            >
              <div className="flex min-w-0 items-center gap-3">
                <ChatAvatar name={member.name} size="sm" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-[#263029]">
                    {member.name} {isCurrentUser ? "(you)" : ""}
                  </p>
                  <p className="text-xs text-[#7d887f]">
                    {member.phone}
                    {memberIsAdmin ? " · admin" : ""}
                  </p>
                </div>
              </div>
              {currentUserIsAdmin && !isCurrentUser ? (
                <div className="flex shrink-0 gap-2">
                  {!memberIsAdmin ? (
                    <button
                      type="button"
                      onClick={() => onPromote(member)}
                      disabled={isLoading}
                      className="text-xs font-semibold text-[#31833e] hover:text-[#246c31] disabled:opacity-60"
                    >
                      Make admin
                    </button>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => onRemove(member)}
                    disabled={isLoading}
                    className="text-xs font-semibold text-red-600 hover:text-red-700 disabled:opacity-60"
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
  );
}
