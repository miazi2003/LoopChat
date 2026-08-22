import Link from "next/link";
import {
  ArrowRight,
  ChevronRight,
  MessageCircle,
  MessagesSquare,
  Search,
  Send,
  Sparkles,
  Users,
  Zap
} from "lucide-react";

const features = [
  {
    title: "Realtime Messaging",
    description: "Messages arrive instantly through Socket.io, keeping active chats in sync.",
    icon: Zap
  },
  {
    title: "Direct Conversations",
    description: "Search by name or phone and start one-to-one conversations quickly.",
    icon: MessageCircle
  },
  {
    title: "Group Conversations",
    description: "Create groups, manage members, promote admins, and keep teams aligned.",
    icon: Users
  },
  {
    title: "Smart Auto-Scroll",
    description: "New messages stay visible when you are at the bottom, without interrupting reading.",
    icon: Sparkles
  }
];

const flow = [
  { label: "Search user", icon: Search },
  { label: "Start conversation", icon: MessageCircle },
  { label: "Send message", icon: Send },
  { label: "Realtime delivery", icon: Zap }
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_20%_10%,rgba(20,184,166,0.18),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(99,102,241,0.2),transparent_28%),linear-gradient(180deg,#020617,#0f172a_52%,#020617)]" />

      <header className="sticky top-0 z-10 border-b border-white/10 bg-slate-950/80 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <Link href="/" className="text-lg font-semibold tracking-normal">
            LoopChat
          </Link>
          <div className="hidden items-center gap-6 text-sm text-slate-300 sm:flex">
            <a href="#features" className="transition hover:text-white">
              Features
            </a>
            <a href="#experience" className="transition hover:text-white">
              Experience
            </a>
          </div>
          <Link
            href="/login"
            className="rounded-full border border-white/15 bg-white px-4 py-2 text-sm font-medium text-slate-950 transition hover:bg-slate-200"
          >
            Open LoopChat
          </Link>
        </nav>
      </header>

      <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-16 md:grid-cols-[1fr_0.95fr] md:py-24">
        <div>
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-teal-300/20 bg-teal-300/10 px-3 py-1 text-sm text-teal-100">
            <span className="h-2 w-2 rounded-full bg-teal-300" />
            Realtime chat for direct and group conversations
          </p>
          <h1 className="max-w-3xl text-5xl font-semibold leading-tight tracking-normal text-white md:text-6xl">
            Conversations that stay in sync.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
            LoopChat brings direct chats, group conversations, and realtime delivery
            into a focused messaging experience that feels quick, clear, and easy to use.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-teal-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-teal-200"
            >
              Start chatting
              <ArrowRight size={16} />
            </Link>
            <a
              href="#features"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Explore features
              <ChevronRight size={16} />
            </a>
          </div>
        </div>

        <ProductPreview />
      </section>

      <section className="mx-auto max-w-6xl px-5 py-8">
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4 shadow-2xl shadow-slate-950/40 md:p-6">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold">Product Showcase</h2>
              <p className="mt-1 text-sm text-slate-400">
                A static preview inspired by the working chat app.
              </p>
            </div>
            <span className="rounded-full bg-emerald-300/10 px-3 py-1 text-xs font-medium text-emerald-200">
              Live ready
            </span>
          </div>
          <ProductPreview large />
        </div>
      </section>

      <section id="features" className="mx-auto max-w-6xl px-5 py-20">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-normal">
            Built around the core chat moments.
          </h2>
          <p className="mt-3 text-slate-300">
            The essentials are clear, responsive, and connected to verified API behavior.
          </p>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <article
                key={feature.title}
                className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition hover:-translate-y-1 hover:bg-white/[0.07]"
              >
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-teal-300/10 text-teal-200">
                  <Icon size={21} />
                </div>
                <h3 className="font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  {feature.description}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <section id="experience" className="mx-auto max-w-6xl px-5 py-10">
        <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 md:p-8">
          <div className="grid gap-8 md:grid-cols-[0.8fr_1.2fr] md:items-center">
            <div>
              <h2 className="text-3xl font-semibold tracking-normal">
                From discovery to delivery in one clean loop.
              </h2>
              <p className="mt-3 leading-7 text-slate-300">
                LoopChat keeps the path simple: find someone, open the conversation,
                send the message, and watch updates arrive without refreshing.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-4">
              {flow.map((step, index) => {
                const Icon = step.icon;

                return (
                  <div key={step.label} className="relative">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-300/10 text-indigo-200">
                        <Icon size={20} />
                      </div>
                      <p className="text-sm font-medium">{step.label}</p>
                    </div>
                    {index < flow.length - 1 ? (
                      <ArrowRight
                        size={18}
                        className="absolute -right-5 top-1/2 hidden -translate-y-1/2 text-slate-500 sm:block"
                      />
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 py-20 text-center">
        <h2 className="text-4xl font-semibold tracking-normal">
          Ready to start a conversation?
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-slate-300">
          Open LoopChat, sign in with a phone number, and jump into direct or group
          messaging.
        </p>
        <Link
          href="/login"
          className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
        >
          Open LoopChat
          <ArrowRight size={16} />
        </Link>
      </section>

      <footer className="border-t border-white/10 px-5 py-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-semibold text-white">LoopChat</p>
          <p>Realtime conversations, made simple.</p>
        </div>
      </footer>
    </main>
  );
}

function ProductPreview({ large = false }: { large?: boolean }) {
  return (
    <div
      className={`relative rounded-3xl border border-white/10 bg-slate-900/90 p-3 shadow-2xl shadow-teal-950/20 ${
        large ? "md:p-4" : ""
      }`}
    >
      <div className="absolute -right-5 -top-5 h-24 w-24 rounded-full bg-teal-300/20 blur-2xl" />
      <div className="relative grid overflow-hidden rounded-2xl border border-white/10 bg-slate-950 md:grid-cols-[220px_1fr]">
        <aside className="border-b border-white/10 bg-white/[0.03] p-4 md:border-b-0 md:border-r">
          <div className="mb-5 flex items-center gap-2">
            <MessagesSquare size={18} className="text-teal-200" />
            <span className="text-sm font-semibold">LoopChat</span>
          </div>
          <div className="space-y-2">
            <PreviewConversation name="Maya Rahman" text="Message received just now" active />
            <PreviewConversation name="Frontend Team" text="4 members · group" group />
            <PreviewConversation name="Ari Khan" text="Let me check that" />
          </div>
        </aside>

        <section className="min-h-[360px] p-4">
          <div className="mb-5 flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h3 className="font-semibold">Maya Rahman</h3>
              <p className="text-xs text-slate-400">Direct conversation</p>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-300/10 px-3 py-1 text-xs text-emerald-200">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-300" />
              realtime
            </span>
          </div>

          <div className="space-y-3">
            <div className="max-w-[78%] rounded-2xl rounded-bl-md bg-white/10 px-4 py-3 text-sm text-slate-100">
              Can we create a group for the project?
              <p className="mt-1 text-right text-[11px] text-slate-400">10:22</p>
            </div>
            <div className="ml-auto max-w-[78%] rounded-2xl rounded-br-md bg-teal-300 px-4 py-3 text-sm text-slate-950">
              Already done. Everyone is in sync.
              <p className="mt-1 text-right text-[11px] text-slate-700">10:23</p>
            </div>
            <div className="ml-auto max-w-[78%] rounded-2xl rounded-br-md bg-teal-300 px-4 py-3 text-sm text-slate-950">
              Messages are arriving in realtime too.
              <p className="mt-1 text-right text-[11px] text-slate-700">10:24</p>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-400">
            Type a message...
            <Send size={16} className="ml-auto text-teal-200" />
          </div>
        </section>
      </div>
    </div>
  );
}

function PreviewConversation({
  name,
  text,
  active = false,
  group = false
}: {
  name: string;
  text: string;
  active?: boolean;
  group?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border px-3 py-3 ${
        active
          ? "border-teal-300/30 bg-teal-300/10"
          : "border-white/10 bg-white/[0.03]"
      }`}
    >
      <div className="flex items-center gap-2">
        {group ? (
          <span className="rounded bg-indigo-300/10 px-1.5 py-0.5 text-[10px] uppercase text-indigo-200">
            Group
          </span>
        ) : null}
        <p className="truncate text-sm font-medium">{name}</p>
      </div>
      <p className="mt-1 truncate text-xs text-slate-400">{text}</p>
    </div>
  );
}
