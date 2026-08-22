"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

export function FinalCta() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id="how-it-works"
      className="scroll-mt-24 bg-[#f3c96b] px-5 py-20 text-[#15363a] sm:px-8 lg:py-24"
    >
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{
          duration: shouldReduceMotion ? 0 : 0.55,
          ease: [0.22, 1, 0.36, 1]
        }}
        className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-8 md:flex-row md:items-center"
      >
        <div>
          <p className="text-sm font-semibold uppercase">Ready when you are</p>
          <h2 className="mt-3 max-w-2xl text-4xl font-semibold leading-tight tracking-normal sm:text-5xl">
            Start the conversation. LoopChat keeps it moving.
          </h2>
        </div>
        <motion.div
          whileHover={shouldReduceMotion ? undefined : { scale: 1.02 }}
          whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
          className="shrink-0"
        >
          <Link
            href="/login"
            className="inline-flex items-center gap-3 rounded-full bg-[#0a3c43] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#062d33]"
          >
            Open LoopChat
            <ArrowRight size={17} />
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
