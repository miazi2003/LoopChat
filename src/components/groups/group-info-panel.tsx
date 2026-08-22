"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { ChatAvatar } from "@/components/chat/chat-avatar";
import { AddMemberPanel } from "@/components/groups/add-member-panel";
import { GroupActionsMenu } from "@/components/groups/group-actions-menu";
import { GroupMemberList } from "@/components/groups/group-member-list";
import { LeaveGroupDialog } from "@/components/groups/leave-group-dialog";
import { RenameGroupDialog } from "@/components/groups/rename-group-dialog";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
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
  isRenaming: boolean;
  isAddingMembers: boolean;
  removingMemberId: string | null;
  promotingMemberId: string | null;
  isLeaving: boolean;
  onClose: () => void;
  onOpenAddMemberPanel: () => void;
  onCloseAddMemberPanel: () => void;
  onRenameTextChange: (value: string) => void;
  onRename: () => Promise<boolean>;
  onPromote: (member: ChatUser) => Promise<boolean>;
  onRemove: (member: ChatUser) => Promise<boolean>;
  onAddMemberSearchChange: (value: string) => void;
  onSelectAddMember: (member: ChatUser) => void;
  onRemoveSelectedAddMember: (member: ChatUser) => void;
  onAddMembers: () => Promise<boolean>;
  onLeave: () => Promise<boolean>;
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
  isRenaming,
  isAddingMembers,
  removingMemberId,
  promotingMemberId,
  isLeaving,
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
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [isLeaveDialogOpen, setIsLeaveDialogOpen] = useState(false);
  const name = getConversationName(conversation);

  return (
    <>
      <Dialog open onOpenChange={(open) => !open && onClose()}>
        <DialogContent
          showCloseButton={false}
          className="max-h-[90vh] max-w-lg overflow-hidden rounded-2xl p-0 shadow-2xl shadow-black/10"
        >
          <div className="flex items-start justify-between gap-4 border-b bg-white px-5 py-5 sm:px-6">
            <div className="flex min-w-0 items-center gap-3">
              <ChatAvatar name={name} isGroup size="lg" />
              <div className="min-w-0">
                <h2 className="truncate text-lg font-semibold text-[#19221b]">
                  {name}
                </h2>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {conversation.participants?.length ?? 0} members
                </p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-1">
              <GroupActionsMenu
                isAdmin={currentUserIsAdmin}
                onRename={() => setIsRenameDialogOpen(true)}
                onAddMember={onOpenAddMemberPanel}
                onLeave={() => setIsLeaveDialogOpen(true)}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={onClose}
                aria-label="Close group info"
                title="Close"
                className="rounded-full text-[#68736b]"
              >
                <X />
              </Button>
            </div>
          </div>

          <div className="max-h-[calc(90vh-89px)] overflow-y-auto px-5 pb-6 sm:px-6">
            <GroupMemberList
              members={conversation.participants ?? []}
              adminIds={conversation.admins ?? []}
              currentUserId={currentUserId}
              currentUserIsAdmin={currentUserIsAdmin}
              removingMemberId={removingMemberId}
              promotingMemberId={promotingMemberId}
              onPromote={onPromote}
              onRemove={onRemove}
            />
          </div>
        </DialogContent>
      </Dialog>

      {currentUserIsAdmin ? (
        <RenameGroupDialog
          open={isRenameDialogOpen}
          value={renameText}
          isLoading={isRenaming}
          onOpenChange={setIsRenameDialogOpen}
          onValueChange={onRenameTextChange}
          onRename={onRename}
        />
      ) : null}

      {currentUserIsAdmin && isAddMemberPanelOpen ? (
        <AddMemberPanel
          searchText={addMemberSearchText}
          results={addMemberResults}
          selectedMembers={selectedAddMembers}
          isSearching={isAddMemberSearching}
          isLoading={isAddingMembers}
          onClose={onCloseAddMemberPanel}
          onSearchChange={onAddMemberSearchChange}
          onSelectMember={onSelectAddMember}
          onRemoveSelectedMember={onRemoveSelectedAddMember}
          onAddMembers={onAddMembers}
        />
      ) : null}

      <LeaveGroupDialog
        open={isLeaveDialogOpen}
        isLoading={isLeaving}
        onOpenChange={setIsLeaveDialogOpen}
        onLeave={onLeave}
      />
    </>
  );
}
