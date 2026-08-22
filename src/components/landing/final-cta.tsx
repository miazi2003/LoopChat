import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function FinalCta() {
  return (
    <section id="how-it-works" className="bg-[#f3c96b] px-5 py-20 text-[#15363a] sm:px-8 lg:py-24">
      <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-8 md:flex-row md:items-center">
        <div>
          <p className="text-sm font-semibold uppercase">Ready when you are</p>
          <h2 className="mt-3 max-w-2xl text-4xl font-semibold leading-tight tracking-normal sm:text-5xl">
            Start the conversation. LoopChat keeps it moving.
          </h2>
        </div>
        <Link
          href="/login"
          className="inline-flex shrink-0 items-center gap-3 rounded-full bg-[#0a3c43] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#062d33]"
        >
          Open LoopChat
          <ArrowRight size={17} />
        </Link>
      </div>
    </section>
  );
}
