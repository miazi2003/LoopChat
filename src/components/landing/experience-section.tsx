import { LockKeyhole, Users, Zap } from "lucide-react";
import { ProductShowcase } from "@/components/landing/product-showcase";
import { Reveal } from "@/components/shared/reveal";

export function ExperienceSection() {
  return (
    <section
      id="experience"
      className="scroll-mt-24 bg-[#082f35] text-white"
    >
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:px-10 lg:py-28">
        <Reveal direction="left" className="max-w-lg">
          <p className="text-sm font-semibold uppercase text-cyan-200">One clear experience</p>
          <h2 className="mt-4 text-4xl font-semibold leading-tight tracking-normal sm:text-5xl">
            Your conversations, right where you left them.
          </h2>
          <p className="mt-5 text-base leading-7 text-white/70">
            LoopChat keeps direct and group messages organized while live updates arrive
            quietly in the background.
          </p>
          <div className="mt-8 space-y-3 text-sm text-white/85">
            <Reveal delay={0.08}>
              <p className="flex items-center gap-3">
                <LockKeyhole size={17} className="text-lime-300" />
                Simple client-side sign in
              </p>
            </Reveal>
            <Reveal delay={0.14}>
              <p className="flex items-center gap-3">
                <Zap size={17} className="text-amber-300" />
                Instant Socket.io updates
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="flex items-center gap-3">
                <Users size={17} className="text-rose-300" />
                Direct and group conversations
              </p>
            </Reveal>
          </div>
        </Reveal>

        <Reveal direction="right" delay={0.1} scale={0.98} className="min-w-0">
          <ProductShowcase />
        </Reveal>
      </div>
    </section>
  );
}
