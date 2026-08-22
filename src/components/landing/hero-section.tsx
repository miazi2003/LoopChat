"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
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
  const shouldReduceMotion = useReducedMotion();

  const enter = (delay: number, y = 16) => ({
    initial: shouldReduceMotion ? false : { opacity: 0, y },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: shouldReduceMotion ? 0 : 0.55,
      delay: shouldReduceMotion ? 0 : delay,
      ease: [0.22, 1, 0.36, 1] as const
    }
  });

  return (
    <div className="relative bg-[#fbf8f4] pb-16">
      <Navbar />
      <section
        className="relative h-[760px] min-h-[680px] w-full max-w-[100vw] overflow-hidden sm:h-[720px] lg:h-[min(820px,90svh)] lg:min-h-[650px]"
        style={{ clipPath: "ellipse(110% 100% at 50% 0%)" }}
      >
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.985 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: shouldReduceMotion ? 0 : 0.7,
            ease: [0.22, 1, 0.36, 1]
          }}
          className="absolute inset-0"
        >
          <Image
            src="/images/loopchat-hero.png"
            alt="A LoopChat user smiling while messaging from their phone"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[52%_center] sm:object-center"
          />
        </motion.div>
        <div className="absolute inset-0 bg-[#063f49]/15" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,40,48,0.9)_0%,rgba(2,48,57,0.52)_30%,rgba(2,48,57,0.06)_56%,rgba(2,40,48,0.52)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(1,33,39,0.74)_0%,transparent_38%)] lg:hidden" />

        <div className="relative z-10 mx-auto grid h-full w-full min-w-0 max-w-[100vw] grid-cols-[minmax(0,1fr)] grid-rows-[1fr_auto] px-5 pb-24 pt-28 sm:px-8 lg:max-w-7xl lg:grid-cols-[1fr_1.05fr_0.9fr] lg:grid-rows-1 lg:items-center lg:px-10 lg:pb-20 lg:pt-24">
          <div className="max-w-md self-center text-white lg:self-auto">
            <motion.p
              {...enter(0.04, 10)}
              className="mb-4 flex items-center gap-2 text-sm font-medium text-cyan-100"
            >
              <span className="h-2 w-2 rounded-full bg-lime-300" />
              Messaging that moves with you
            </motion.p>
            <motion.h1
              {...enter(0.09)}
              className="text-[clamp(2.7rem,6vw,5rem)] font-semibold leading-[1.02] tracking-normal text-white"
            >
              Talk now.
              <br />
              Stay in the loop.
            </motion.h1>
            <motion.p
              {...enter(0.15)}
              className="mt-5 max-w-sm text-base leading-7 text-white/78 sm:text-lg"
            >
              Direct chats, group conversations, and realtime delivery in one focused
              place built for everyday connection.
            </motion.p>
            <motion.div
              {...enter(0.21)}
              whileHover={shouldReduceMotion ? undefined : { scale: 1.02 }}
              whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
              className="mt-7 inline-flex"
            >
              <Link
                href="/login"
                className="inline-flex items-center gap-3 rounded-full border border-white/35 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white hover:text-[#083f48]"
              >
                Start a conversation
                <ArrowRight size={16} />
              </Link>
            </motion.div>
          </div>

          <div aria-hidden="true" className="hidden lg:block" />

          <motion.div
            initial={
              shouldReduceMotion
                ? false
                : { opacity: 0, scale: 0.97, y: 15 }
            }
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{
              duration: shouldReduceMotion ? 0 : 0.6,
              delay: shouldReduceMotion ? 0 : 0.24,
              ease: [0.22, 1, 0.36, 1]
            }}
            className="flex min-w-0 flex-col items-end gap-2 self-end pb-2 lg:w-auto lg:justify-center lg:gap-3 lg:self-auto lg:pb-0"
          >
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
          </motion.div>
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
