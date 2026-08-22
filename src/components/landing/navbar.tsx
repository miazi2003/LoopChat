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

  return (
    <header className="absolute inset-x-0 top-0 z-20">
      <nav className="mx-auto flex w-full min-w-0 max-w-[100vw] items-center justify-between px-5 py-5 sm:px-8 lg:max-w-7xl lg:px-10 lg:py-7">
        <Link href="/" aria-label="LoopChat home">
          <BrandLogo
            size="sm"
            className="text-white"
            nameClassName="text-xl"
          />
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
        </div>

        <div className="flex w-auto shrink-0 justify-end">
          {authStatus === "loading" ? (
            <span aria-hidden="true" className="h-10 w-auto]" />
          ) : (
            <Link
              href={authStatus === "authenticated" ? "/chat" : "/login"}
              className=" inline-flex h-10 items-center gap-2 rounded-full bg-white px-4 text-sm font-semibold text-[#083f48] shadow-sm transition hover:bg-cyan-50"
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
