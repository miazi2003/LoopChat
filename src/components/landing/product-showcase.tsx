import { Send } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";

export function ProductShowcase() {
  return (
    <div className="overflow-hidden rounded-lg border border-white/15 bg-[#f8fbfa] text-[#173b40] shadow-2xl shadow-black/20">
      <div className="flex items-center justify-between border-b border-[#d8e3e1] px-4 py-3">
        <BrandLogo
          size="sm"
          className="text-[#173b40]"
          nameClassName="text-sm"
        />
        <span className="flex items-center gap-1.5 text-xs font-medium text-[#397078]">
          <span className="h-2 w-2 rounded-full bg-lime-500" />
          Live
        </span>
      </div>

      <div className="grid min-h-[390px] grid-cols-[130px_1fr] sm:grid-cols-[190px_1fr]">
        <aside className="border-r border-[#d8e3e1] bg-[#eef5f3] p-3 sm:p-4">
          <p className="mb-3 text-xs font-semibold uppercase text-[#668187]">Conversations</p>
          <PreviewConversation name="Maya" text="See you there!" active />
          <PreviewConversation name="Project group" text="Ari: Sounds good" />
          <PreviewConversation name="Rafi" text="Thanks!" />
        </aside>

        <div className="flex min-w-0 flex-col bg-white">
          <div className="border-b border-[#d8e3e1] px-4 py-3">
            <p className="text-sm font-semibold">Maya Rahman</p>
            <p className="text-xs text-[#6a858a]">Direct conversation</p>
          </div>
          <div className="flex-1 space-y-3 p-4 sm:p-5">
            <div className="max-w-[82%] rounded-lg bg-[#eef3f2] px-3 py-2 text-sm">
              Are we still meeting at six?
            </div>
            <div className="ml-auto max-w-[82%] rounded-lg bg-[#0c6875] px-3 py-2 text-sm text-white">
              Yes, I will send the details now.
            </div>
            <div className="max-w-[82%] rounded-lg bg-[#eef3f2] px-3 py-2 text-sm">
              Perfect. See you there!
            </div>
          </div>
          <div className="border-t border-[#d8e3e1] p-3">
            <div className="flex items-center gap-2 rounded-md border border-[#c9d8d5] px-3 py-2 text-xs text-[#71898d]">
              Type a message...
              <Send size={15} className="ml-auto text-[#0c6875]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PreviewConversation({
  name,
  text,
  active = false
}: {
  name: string;
  text: string;
  active?: boolean;
}) {
  return (
    <div className={`border-b border-[#d8e3e1] px-2 py-3 ${active ? "bg-white" : ""}`}>
      <p className="truncate text-sm font-semibold">{name}</p>
      <p className="mt-1 truncate text-xs text-[#71898d]">{text}</p>
    </div>
  );
}
