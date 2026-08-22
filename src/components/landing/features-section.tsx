"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import {
  ChevronDown,
  MessageSquareText,
  Users,
  Zap
} from "lucide-react";

const features = [
  {
    id: "direct-messages",
    icon: MessageSquareText,
    title: "Direct Messages",
    content:
      "Keep one-to-one conversations focused, personal, and easy to return to whenever you need them."
  },
  {
    id: "realtime-delivery",
    icon: Zap,
    title: "Realtime Delivery",
    content:
      "Messages arrive instantly across active conversations, with silent updates that keep every chat in sync."
  },
  {
    id: "group-chats",
    icon: Users,
    title: "Group Chats",
    content:
      "Bring people together in shared conversations with clear member roles and simple group management."
  }
];

export function FeaturesSection() {
  const shouldReduceMotion = useReducedMotion();
  const [openId, setOpenId] = useState<string | null>(
    "realtime-delivery"
  );

  return (
    <section
      id="features"
      className="scroll-mt-24 bg-[#fbf8f4] px-5 py-20 sm:px-8 lg:py-28"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <motion.div
          initial={
            shouldReduceMotion ? false : { opacity: 0, x: -20 }
          }
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{
            duration: shouldReduceMotion ? 0 : 0.6,
            ease: [0.22, 1, 0.36, 1]
          }}
          className="mx-auto w-full max-w-[520px] overflow-hidden rounded-lg"
        >
          <Image
            src="/images/loopchat-features-girl.png"
            alt="A LoopChat user smiling while messaging on her phone"
            width={1118}
            height={1408}
            sizes="(min-width: 1024px) 42vw, (min-width: 640px) 70vw, 100vw"
            className="h-auto w-full"
          />
        </motion.div>

        <motion.div
          initial={
            shouldReduceMotion ? false : { opacity: 0, x: 20 }
          }
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{
            duration: shouldReduceMotion ? 0 : 0.6,
            delay: shouldReduceMotion ? 0 : 0.06,
            ease: [0.22, 1, 0.36, 1]
          }}
          className="mx-auto w-full max-w-xl"
        >
          <p className="text-sm font-semibold uppercase text-[#d96049]">
            Built for conversation
          </p>
          <h2 className="mt-3 text-4xl font-semibold leading-tight tracking-normal text-[#10263b] sm:text-5xl">
            Discover what&apos;s included
          </h2>
          <p className="mt-4 text-base leading-7 text-[#647184] sm:text-lg">
            Everything you need to power seamless conversations with LoopChat.
          </p>

          <div className="mt-8 space-y-3">
            {features.map((feature, index) => {
              const isOpen = openId === feature.id;
              const Icon = feature.icon;

              return (
                <motion.div
                  key={feature.id}
                  initial={
                    shouldReduceMotion ? false : { opacity: 0, y: 12 }
                  }
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{
                    duration: shouldReduceMotion ? 0 : 0.4,
                    delay: shouldReduceMotion ? 0 : index * 0.06,
                    ease: [0.22, 1, 0.36, 1]
                  }}
                  className="overflow-hidden rounded-lg border border-[#e7e3de] bg-white shadow-sm transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-1 hover:border-[#ddd5cd] hover:shadow-md"
                >
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`${feature.id}-content`}
                    onClick={() =>
                      setOpenId((currentId) =>
                        currentId === feature.id ? null : feature.id
                      )
                    }
                    className="flex w-full items-center justify-between gap-4 p-5 text-left"
                  >
                    <span className="flex min-w-0 items-center gap-4">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#fdf0ec] text-[#df694f]">
                        <Icon size={20} strokeWidth={2.2} />
                      </span>
                      <span className="text-base font-semibold text-[#10263b] sm:text-lg">
                        {feature.title}
                      </span>
                    </span>
                    <ChevronDown
                      size={21}
                      className={`shrink-0 text-[#10263b] transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  <div
                    id={`${feature.id}-content`}
                    className={`overflow-hidden transition-[max-height,opacity] duration-300 ease-out ${
                      isOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <p className="border-t border-[#eeeae5] bg-[#fafafa] px-5 py-4 text-sm leading-6 text-[#647184] sm:pl-20">
                      {feature.content}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
