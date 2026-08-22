import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type LoopChatLoaderProps = {
  size?: "sm" | "md" | "lg";
  label?: string;
  fullScreen?: boolean;
  className?: string;
};

const loaderSizes = {
  sm: {
    outer: "size-6",
    center: "size-4",
    icon: "size-3",
    layout: "flex-row gap-2",
    label: "text-xs"
  },
  md: {
    outer: "size-11",
    center: "size-8",
    icon: "size-5",
    layout: "flex-col gap-2.5",
    label: "text-sm"
  },
  lg: {
    outer: "size-17",
    center: "size-12",
    icon: "size-7",
    layout: "flex-col gap-3",
    label: "text-sm"
  }
};

export function LoopChatLoader({
  size = "md",
  label,
  fullScreen = false,
  className
}: LoopChatLoaderProps) {
  const styles = loaderSizes[size];

  const loader = (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "inline-flex items-center justify-center text-[#35ad49]",
        styles.layout,
        className
      )}
    >
      <span className={cn("relative shrink-0", styles.outer)}>
        <span className="absolute inset-0 animate-spin rounded-full border-2 border-current/20 border-t-current motion-reduce:animate-none" />
        <span className="absolute inset-0 flex items-center justify-center">
          <span
            className={cn(
              "flex items-center justify-center rounded-full bg-[#edf8ef] text-[#35ad49]",
              styles.center
            )}
          >
            <MessageCircle className={styles.icon} strokeWidth={2.2} />
          </span>
        </span>
      </span>
      {label ? (
        <span className={cn("text-center font-medium", styles.label)}>
          {label}
        </span>
      ) : (
        <span className="sr-only">Loading</span>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-[#fbfcfa] px-6">
        {loader}
      </main>
    );
  }

  return loader;
}
