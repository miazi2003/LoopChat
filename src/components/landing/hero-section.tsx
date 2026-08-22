import Image from "next/image";
import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  MessageCircle,
  Sparkles,
  Users,
  Zap
} from "lucide-react";
import { Navbar } from "@/components/landing/navbar";

const heroSignals = [
  {
    label: "Direct messages",
    icon: MessageCircle,
    iconClassName: "bg-cyan-300 text-cyan-950",
    positionClassName: "lg:-translate-x-3 lg:rotate-[3deg]"
  },
  {
    label: "Group conversations",
    icon: Users,
    iconClassName: "bg-amber-300 text-amber-950",
    positionClassName: "lg:translate-x-4 lg:-rotate-[2deg]"
  },
  {
    label: "Realtime delivery",
    icon: Zap,
    iconClassName: "bg-lime-300 text-lime-950",
    positionClassName: "lg:-translate-x-1 lg:rotate-[2deg]"
  },
  {
    label: "Smart updates",
    icon: Sparkles,
    iconClassName: "bg-rose-300 text-rose-950",
    positionClassName: "lg:translate-x-6 lg:-rotate-[3deg]"
  }
];

export function HeroSection() {
  return (
    <div className="relative bg-[#f8fbfa] pb-16">
      <section
        className="relative h-[760px] min-h-[680px] w-full max-w-[100vw] overflow-hidden sm:h-[720px] lg:h-[min(820px,90svh)] lg:min-h-[650px]"
        style={{ clipPath: "ellipse(110% 100% at 50% 0%)" }}
      >
        <Image
          src="/images/loopchat-hero.png"
          alt="A LoopChat user smiling while messaging from their phone"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[52%_center] sm:object-center"
        />
        <div className="absolute inset-0 bg-[#063f49]/15" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,40,48,0.9)_0%,rgba(2,48,57,0.52)_30%,rgba(2,48,57,0.06)_56%,rgba(2,40,48,0.52)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(1,33,39,0.74)_0%,transparent_38%)] lg:hidden" />

        <Navbar />

        <div className="relative z-10 mx-auto grid h-full w-full min-w-0 max-w-[100vw] grid-cols-[minmax(0,1fr)] grid-rows-[1fr_auto] px-5 pb-24 pt-28 sm:px-8 lg:max-w-7xl lg:grid-cols-[1fr_1.05fr_0.9fr] lg:grid-rows-1 lg:items-center lg:px-10 lg:pb-20 lg:pt-24">
          <div className="max-w-md self-center text-white lg:self-auto">
            <p className="mb-4 flex items-center gap-2 text-sm font-medium text-cyan-100">
              <span className="h-2 w-2 rounded-full bg-lime-300" />
              Messaging that moves with you
            </p>
            <h1 className="text-[clamp(2.7rem,6vw,5rem)] font-semibold leading-[1.02] tracking-normal text-white">
              Talk now.
              <br />
              Stay in the loop.
            </h1>
            <p className="mt-5 max-w-sm text-base leading-7 text-white/78 sm:text-lg">
              Direct chats, group conversations, and realtime delivery in one focused
              place built for everyday connection.
            </p>
            <Link
              href="/login"
              className="mt-7 inline-flex items-center gap-3 rounded-full border border-white/35 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white hover:text-[#083f48]"
            >
              Start a conversation
              <ArrowRight size={16} />
            </Link>
          </div>

          <div aria-hidden="true" className="hidden lg:block" />

          <div className="flex min-w-0 flex-col items-end gap-2 self-end pb-2 lg:w-auto lg:justify-center lg:gap-3 lg:self-auto lg:pb-0">
            {heroSignals.map((signal) => {
              const Icon = signal.icon;

              return (
                <div
                  key={signal.label}
                  className={`flex min-w-0 items-center gap-2 rounded-full border border-white/40 bg-white/90 py-1.5 pl-1.5 pr-2 text-[11px] font-semibold text-[#123b40] shadow-lg shadow-[#012f38]/15 backdrop-blur sm:pr-3 sm:text-xs ${signal.positionClassName}`}
                >
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-full ${signal.iconClassName}`}
                  >
                    <Icon size={14} />
                  </span>
                  <span>{signal.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <a
        href="#features"
        aria-label="Scroll to explore"
        className="absolute bottom-2 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1 text-[11px] font-medium text-[#527278] transition hover:text-[#0b4f59]"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full border border-[#b7c9c9] bg-white">
          <ArrowDown size={14} />
        </span>
        Scroll to explore
      </a>
    </div>
  );
}
