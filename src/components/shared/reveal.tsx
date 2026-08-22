"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "left" | "right" | "none";
  scale?: number;
};

const offsets = {
  up: { x: 0, y: 24 },
  left: { x: -20, y: 0 },
  right: { x: 20, y: 0 },
  none: { x: 0, y: 0 }
};

export function Reveal({
  children,
  className,
  delay = 0,
  direction = "up",
  scale = 1
}: RevealProps) {
  const shouldReduceMotion = useReducedMotion();
  const offset = offsets[direction];

  return (
    <motion.div
      initial={
        shouldReduceMotion
          ? false
          : { opacity: 0, scale, x: offset.x, y: offset.y }
      }
      whileInView={{ opacity: 1, scale: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: shouldReduceMotion ? 0 : 0.55,
        delay: shouldReduceMotion ? 0 : delay,
        ease: [0.22, 1, 0.36, 1]
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
