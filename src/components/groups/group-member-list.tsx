"use client";

import { useState } from "react";
import { Ellipsis, ShieldCheck, UserMinus } from "lucide-react";
import { ChatAvatar } from "@/components/chat/chat-avatar";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import type { ChatUser } from "@/types/chat";

type GroupMemberListProps = {
  members: ChatUser[];
  adminIds: string[];
  currentUserId: string;
  currentUserIsAdmin: boolean;
  removingMemberId: string | null;
  promotingMemberId: string | null;
  onPromote: (member: ChatUser) => Promise<boolean>;
  onRemove: (member: ChatUser) => Promise<boolean>;
};

export function GroupMemberList({
  members,
  adminIds,
  currentUserId,
  currentUserIsAdmin,
  removingMemberId,
  promotingMemberId,
  onPromote,
  onRemove
}: GroupMemberListProps) {
  const [memberToPromote, setMemberToPromote] = useState<ChatUser | null>(null);
  const [memberToRemove, setMemberToRemove] = useState<ChatUser | null>(null);

  async function handlePromote() {
    if (memberToPromote && (await onPromote(memberToPromote))) {
      setMemberToPromote(null);
    }
  }

  async function handleRemove() {
    if (memberToRemove && (await onRemove(memberToRemove))) {
      setMemberToRemove(null);
    }
  }

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[#39443c]">Members</h3>
        <span className="text-xs text-muted-foreground">{members.length}</span>
      </div>

      <div className="mt-2 divide-y divide-[#edf0ec] overflow-hidden rounded-lg border">
        {members.map((member) => {
          const memberIsAdmin = adminIds.includes(member._id);
          const isCurrentUser = member._id === currentUserId;

          return (
            <div
              key={member._id}
              className="flex min-h-16 items-center justify-between gap-3 px-3 py-3"
            >
              <div className="flex min-w-0 items-center gap-3">
                <ChatAvatar name={member.name} size="sm" />
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <p className="truncate text-sm font-semibold text-[#263029]">
                      {member.name}
                    </p>
                    {isCurrentUser ? (
                      <Badge
                        variant="secondary"
                        className="bg-[#f0f2ef] text-[#68736b]"
                      >
                        You
                      </Badge>
                    ) : null}
                    {memberIsAdmin ? (
                      <Badge className="bg-[#e7f5e9] text-[#2d7639]">
                        Admin
                      </Badge>
                    ) : null}
                  </div>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">
                    {member.phone} · {memberIsAdmin ? "Admin" : "Member"}
                  </p>
                </div>
              </div>

              {currentUserIsAdmin && !isCurrentUser ? (
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`Actions for ${member.name}`}
                        title={`Actions for ${member.name}`}
                        className="shrink-0 rounded-full text-[#748077]"
                      />
                    }
                  >
                    <Ellipsis />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40 p-1.5">
                    {!memberIsAdmin ? (
                      <DropdownMenuItem
                        onClick={() => setMemberToPromote(member)}
                        className="gap-2 px-2.5 py-2"
                      >
                        <ShieldCheck />
                        Make admin
                      </DropdownMenuItem>
                    ) : null}
                    {!memberIsAdmin ? <DropdownMenuSeparator /> : null}
                    <DropdownMenuItem
                      onClick={() => setMemberToRemove(member)}
                      variant="destructive"
                      className="gap-2 px-2.5 py-2"
                    >
                      <UserMinus />
                      Remove member
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : null}
            </div>
          );
        })}
      </div>

      <AlertDialog
        open={Boolean(memberToPromote)}
        onOpenChange={(open) => !open && setMemberToPromote(null)}
      >
        <AlertDialogContent className="rounded-2xl p-6">
          <AlertDialogHeader>
            <AlertDialogTitle>Make this member an admin?</AlertDialogTitle>
            <AlertDialogDescription>
              They will be able to rename the group and manage members.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-2">
            <AlertDialogCancel disabled={Boolean(promotingMemberId)}>
              Cancel
            </AlertDialogCancel>
            <Button
              type="button"
              onClick={handlePromote}
              disabled={Boolean(promotingMemberId)}
            >
              {promotingMemberId ? "Promoting..." : "Make admin"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={Boolean(memberToRemove)}
        onOpenChange={(open) => !open && setMemberToRemove(null)}
      >
        <AlertDialogContent className="rounded-2xl p-6">
          <AlertDialogHeader>
            <AlertDialogTitle>Remove member?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove {memberToRemove?.name ?? "this member"} from the
              group.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-2">
            <AlertDialogCancel disabled={Boolean(removingMemberId)}>
              Cancel
            </AlertDialogCancel>
            <Button
              type="button"
              variant="destructive"
              onClick={handleRemove}
              disabled={Boolean(removingMemberId)}
            >
              {removingMemberId ? "Removing..." : "Remove member"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
