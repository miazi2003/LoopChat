import { MessagesSquare } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#f8fbfa] px-5 py-8 sm:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 text-sm text-[#527278] sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-center gap-2 font-semibold text-[#0b343a]">
          <MessagesSquare size={17} />
          LoopChat
        </p>
        <p>Realtime conversations, made simple.</p>
      </div>
    </footer>
  );
}
