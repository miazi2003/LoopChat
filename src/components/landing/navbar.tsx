"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { getCurrentUser } from "@/services/auth";

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

export function Navbar() {
  const [authStatus, setAuthStatus] = useState<AuthStatus>("loading");

  useEffect(() => {
    let isMounted = true;

    async function checkAuthentication() {
      const token = localStorage.getItem("token");

      if (!token) {
        setAuthStatus("unauthenticated");
        return;
      }

      try {
        await getCurrentUser();

        if (isMounted) {
          setAuthStatus("authenticated");
        }
      } catch {
        localStorage.removeItem("token");

        if (isMounted) {
          setAuthStatus("unauthenticated");
        }
      }
    }

    void checkAuthentication();

    return () => {
      isMounted = false;
    };
  }, []);

  function scrollToSection(
    event: React.MouseEvent<HTMLAnchorElement>,
    id: string
  ) {
    event.preventDefault();

    const section = document.getElementById(id);

    if (!section) {
      return;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    section.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start"
    });
    window.history.replaceState(null, "", `#${id}`);
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#063f49]/75 backdrop-blur-xl">
      <nav className="mx-auto flex w-full min-w-0 max-w-[100vw] items-center justify-between px-5 py-3.5 sm:px-8 lg:max-w-7xl lg:px-10">
        <Link href="/" aria-label="LoopChat home">
          <BrandLogo
            size="sm"
            className="text-white"
            nameClassName="text-xl"
          />
        </Link>

        <div className="hidden items-center gap-7 text-sm text-white/85 md:flex">
          <a
            href="#features"
            onClick={(event) => scrollToSection(event, "features")}
            className="relative py-2 transition hover:text-white after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-left after:scale-x-0 after:bg-white after:transition-transform hover:after:scale-x-100"
          >
            Features
          </a>
          <a
            href="#experience"
            onClick={(event) => scrollToSection(event, "experience")}
            className="relative py-2 transition hover:text-white after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-left after:scale-x-0 after:bg-white after:transition-transform hover:after:scale-x-100"
          >
            Experience
          </a>
          <a
            href="#how-it-works"
            onClick={(event) => scrollToSection(event, "how-it-works")}
            className="relative py-2 transition hover:text-white after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-left after:scale-x-0 after:bg-white after:transition-transform hover:after:scale-x-100"
          >
            How it works
          </a>
        </div>

        <div className="flex w-auto shrink-0 justify-end">
          {authStatus === "loading" ? (
            <span aria-hidden="true" className="h-10 w-auto" />
          ) : (
            <Link
              href={authStatus === "authenticated" ? "/chat" : "/login"}
              className="inline-flex h-10 items-center gap-2 rounded-full bg-white px-4 text-sm font-semibold text-[#083f48] shadow-sm transition hover:bg-cyan-50"
            >
              {authStatus === "authenticated" ? "Open Chat" : "Login"}
              <ArrowRight size={15} />
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
