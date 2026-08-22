import Image from "next/image";
import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  ChevronDown,
  LockKeyhole,
  MessageCircle,
  MessagesSquare,
  Send,
  Sparkles,
  Users,
  Zap
} from "lucide-react";

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

const features = [
  {
    title: "Direct conversations",
    description: "Find people by name or phone and start talking in a few taps.",
    icon: MessageCircle,
    color: "bg-cyan-100 text-cyan-800"
  },
  {
    title: "Group spaces",
    description: "Bring people together, manage members, and keep every plan moving.",
    icon: Users,
    color: "bg-amber-100 text-amber-800"
  },
  {
    title: "Live delivery",
    description: "Messages arrive through Socket.io without refreshing the conversation.",
    icon: Zap,
    color: "bg-lime-100 text-lime-800"
  },
  {
    title: "Thoughtful scrolling",
    description: "Stay with what you are reading and jump to new messages when ready.",
    icon: Sparkles,
    color: "bg-rose-100 text-rose-800"
  }
];

export default function Home() {
  return (
    <main className="overflow-hidden bg-[#f8fbfa] text-[#11373c]">
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

      <section id="features" className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
        <div className="grid gap-8 border-b border-[#d4e1df] pb-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <p className="text-sm font-semibold uppercase text-[#158294]">Built for the conversation</p>
          <h2 className="max-w-3xl text-4xl font-semibold leading-tight tracking-normal text-[#0b343a] sm:text-5xl">
            Everything you need to keep people close and plans moving.
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <article
                key={feature.title}
                className="border-b border-[#d4e1df] py-8 sm:px-6 sm:first:pl-0 lg:border-b-0 lg:border-r lg:px-7 lg:last:border-r-0 lg:last:pr-0"
              >
                <span className={`flex h-11 w-11 items-center justify-center rounded-md ${feature.color}`}>
                  <Icon size={21} />
                </span>
                <h3 className="mt-6 text-lg font-semibold text-[#0b343a]">{feature.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#527278]">{feature.description}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section id="experience" className="bg-[#082f35] text-white">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:px-10 lg:py-28">
          <div className="max-w-lg">
            <p className="text-sm font-semibold uppercase text-cyan-200">One clear experience</p>
            <h2 className="mt-4 text-4xl font-semibold leading-tight tracking-normal sm:text-5xl">
              Your conversations, right where you left them.
            </h2>
            <p className="mt-5 text-base leading-7 text-white/70">
              LoopChat keeps direct and group messages organized while live updates arrive
              quietly in the background.
            </p>
            <div className="mt-8 space-y-3 text-sm text-white/85">
              <p className="flex items-center gap-3">
                <LockKeyhole size={17} className="text-lime-300" />
                Simple client-side sign in
              </p>
              <p className="flex items-center gap-3">
                <Zap size={17} className="text-amber-300" />
                Instant Socket.io updates
              </p>
              <p className="flex items-center gap-3">
                <Users size={17} className="text-rose-300" />
                Direct and group conversations
              </p>
            </div>
          </div>

          <ChatPreview />
        </div>
      </section>

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

      <footer className="bg-[#f8fbfa] px-5 py-8 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 text-sm text-[#527278] sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-center gap-2 font-semibold text-[#0b343a]">
            <MessagesSquare size={17} />
            LoopChat
          </p>
          <p>Realtime conversations, made simple.</p>
        </div>
      </footer>
    </main>
  );
}

function ChatPreview() {
  return (
    <div className="overflow-hidden rounded-lg border border-white/15 bg-[#f8fbfa] text-[#173b40] shadow-2xl shadow-black/20">
      <div className="flex items-center justify-between border-b border-[#d8e3e1] px-4 py-3">
        <div className="flex items-center gap-2">
          <MessagesSquare size={17} className="text-[#167b8b]" />
          <span className="text-sm font-semibold">LoopChat</span>
        </div>
        <span className="flex items-center gap-1.5 text-xs font-medium text-[#397078]">
          <span className="h-2 w-2 rounded-full bg-lime-500" />
          Live
        </span>
      </div>

      <div className="grid min-h-[390px] grid-cols-[130px_1fr] sm:grid-cols-[190px_1fr]">
        <aside className="border-r border-[#d8e3e1] bg-[#eef5f3] p-3 sm:p-4">
          <p className="mb-3 text-xs font-semibold uppercase text-[#668187]">Conversations</p>
          <PreviewConversation name="Maya" text="See you there!" active />
          <PreviewConversation name="Project group" text="Ari: Sounds good" />
          <PreviewConversation name="Rafi" text="Thanks!" />
        </aside>

        <div className="flex min-w-0 flex-col bg-white">
          <div className="border-b border-[#d8e3e1] px-4 py-3">
            <p className="text-sm font-semibold">Maya Rahman</p>
            <p className="text-xs text-[#6a858a]">Direct conversation</p>
          </div>
          <div className="flex-1 space-y-3 p-4 sm:p-5">
            <div className="max-w-[82%] rounded-lg bg-[#eef3f2] px-3 py-2 text-sm">
              Are we still meeting at six?
            </div>
            <div className="ml-auto max-w-[82%] rounded-lg bg-[#0c6875] px-3 py-2 text-sm text-white">
              Yes, I will send the details now.
            </div>
            <div className="max-w-[82%] rounded-lg bg-[#eef3f2] px-3 py-2 text-sm">
              Perfect. See you there!
            </div>
          </div>
          <div className="border-t border-[#d8e3e1] p-3">
            <div className="flex items-center gap-2 rounded-md border border-[#c9d8d5] px-3 py-2 text-xs text-[#71898d]">
              Type a message...
              <Send size={15} className="ml-auto text-[#0c6875]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PreviewConversation({
  name,
  text,
  active = false
}: {
  name: string;
  text: string;
  active?: boolean;
}) {
  return (
    <div className={`border-b border-[#d8e3e1] px-2 py-3 ${active ? "bg-white" : ""}`}>
      <p className="truncate text-sm font-semibold">{name}</p>
      <p className="mt-1 truncate text-xs text-[#71898d]">{text}</p>
    </div>
  );
}
