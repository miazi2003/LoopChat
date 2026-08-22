import { Ellipsis, LogOut, Pencil, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

type GroupActionsMenuProps = {
  isAdmin: boolean;
  onRename: () => void;
  onAddMember: () => void;
  onLeave: () => void;
};

export function GroupActionsMenu({
  isAdmin,
  onRename,
  onAddMember,
  onLeave
}: GroupActionsMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            aria-label="Group actions"
            title="Group actions"
            className="rounded-full text-[#68736b]"
          />
        }
      >
        <Ellipsis />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44 p-1.5">
        {isAdmin ? (
          <>
            <DropdownMenuItem onClick={onRename} className="gap-2 px-2.5 py-2">
              <Pencil />
              Rename group
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={onAddMember}
              className="gap-2 px-2.5 py-2"
            >
              <UserPlus />
              Add member
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        ) : null}
        <DropdownMenuItem
          onClick={onLeave}
          variant="destructive"
          className="gap-2 px-2.5 py-2"
        >
          <LogOut />
          Leave group
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
