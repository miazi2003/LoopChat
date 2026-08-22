import { Send } from "lucide-react";
import type { FormEventHandler, KeyboardEventHandler } from "react";

type MessageInputProps = {
  value: string;
  error: string;
  isSending: boolean;
  onChange: (value: string) => void;
  onSubmit: FormEventHandler<HTMLFormElement>;
  onKeyDown: KeyboardEventHandler<HTMLTextAreaElement>;
};

export function MessageInput({
  value,
  error,
  isSending,
  onChange,
  onSubmit,
  onKeyDown
}: MessageInputProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="border-t border-[#e8ece7] bg-white px-4 py-3 sm:px-6 sm:py-4"
    >
      {error ? (
        <p className="mb-2 text-sm text-red-600">{error}</p>
      ) : null}
      <div className="flex min-h-14 items-end gap-2 rounded-2xl bg-[#f3f5f2] p-1.5 pl-4">
        <textarea
          rows={1}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={onKeyDown}
          className="max-h-32 min-h-10 min-w-0 flex-1 resize-none bg-transparent py-2.5 text-sm text-[#263029] outline-none placeholder:text-[#a0a8a2] focus-visible:!outline-none"
          placeholder="Type a message"
          aria-label="Message text"
        />
        <button
          type="submit"
          disabled={!value.trim() || isSending}
          aria-label={isSending ? "Sending message" : "Send message"}
          title={isSending ? "Sending message" : "Send message"}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#3bb74d] text-white shadow-sm transition hover:bg-[#32a944] disabled:cursor-not-allowed disabled:bg-[#b7c2b8]"
        >
          <Send size={17} />
        </button>
      </div>
    </form>
  );
}
