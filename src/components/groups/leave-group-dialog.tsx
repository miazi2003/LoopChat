import { LoopChatLoader } from "@/components/shared/loopchat-loader";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";

type LeaveGroupDialogProps = {
  open: boolean;
  isLoading: boolean;
  onOpenChange: (open: boolean) => void;
  onLeave: () => Promise<boolean>;
};

export function LeaveGroupDialog({
  open,
  isLoading,
  onOpenChange,
  onLeave
}: LeaveGroupDialogProps) {
  async function handleLeave() {
    await onLeave();
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="rounded-2xl p-6">
        <AlertDialogHeader>
          <AlertDialogTitle>Leave this group?</AlertDialogTitle>
          <AlertDialogDescription>
            You will no longer receive messages from this group unless you are
            added again.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-2">
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <Button
            type="button"
            variant="destructive"
            onClick={handleLeave}
            disabled={isLoading}
          >
            {isLoading ? (
              <LoopChatLoader
                size="sm"
                label="Leaving..."
                className="text-white"
              />
            ) : (
              "Leave group"
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
