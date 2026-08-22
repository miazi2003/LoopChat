import Link from "next/link";
import { ArrowRight, ChevronDown, MessagesSquare } from "lucide-react";

export function Navbar() {
  return (
    <header className="absolute inset-x-0 top-0 z-20">
      <nav className="mx-auto flex w-full min-w-0 max-w-[100vw] items-center justify-between px-5 py-5 sm:px-8 lg:max-w-7xl lg:px-10 lg:py-7">
        <Link href="/" className="flex items-center gap-2 text-xl font-semibold text-white">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-white text-[#075763]">
            <MessagesSquare size={18} strokeWidth={2.4} />
          </span>
          LoopChat
        </Link>

        <div className="hidden items-center gap-7 text-sm text-white/85 md:flex">
          <a href="#features" className="transition hover:text-white">
            Features
          </a>
          <a href="#experience" className="transition hover:text-white">
            Experience
          </a>
          <a href="#how-it-works" className="transition hover:text-white">
            How it works
          </a>
          <a href="#features" className="flex items-center gap-1 transition hover:text-white">
            More
            <ChevronDown size={14} />
          </a>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <Link
            href="/login"
            className="hidden text-sm font-medium text-white transition hover:text-white/75 sm:block"
          >
            Log in
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2.5 text-sm font-semibold text-[#083f48] shadow-sm transition hover:bg-cyan-50 sm:px-4"
          >
            Get started
            <ArrowRight size={15} />
          </Link>
        </div>
      </nav>
    </header>
  );
}
