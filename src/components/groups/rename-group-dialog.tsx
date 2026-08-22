import type { FormEvent } from "react";
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

type RenameGroupDialogProps = {
  open: boolean;
  value: string;
  isLoading: boolean;
  onOpenChange: (open: boolean) => void;
  onValueChange: (value: string) => void;
  onRename: () => Promise<boolean>;
};

export function RenameGroupDialog({
  open,
  value,
  isLoading,
  onOpenChange,
  onValueChange,
  onRename
}: RenameGroupDialogProps) {
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (await onRename()) {
      onOpenChange(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl p-6">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-lg">Rename group</DialogTitle>
            <DialogDescription>
              Choose a new name for this conversation.
            </DialogDescription>
          </DialogHeader>
          <Input
            autoFocus
            value={value}
            onChange={(event) => onValueChange(event.target.value)}
            className="mt-5 h-11"
            aria-label="Group name"
          />
          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="lg"
              disabled={isLoading || !value.trim()}
            >
              {isLoading ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
