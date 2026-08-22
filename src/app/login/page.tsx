"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { BrandLogo } from "@/components/brand-logo";
import { getCurrentUser, loginUser } from "@/services/auth";

export default function LoginPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingToken, setIsCheckingToken] = useState(true);

  useEffect(() => {
    async function checkExistingToken() {
      const token = localStorage.getItem("token");

      if (!token) {
        setIsCheckingToken(false);
        return;
      }

      try {
        await getCurrentUser();
        router.replace("/chat");
      } catch {
        localStorage.removeItem("token");
        setIsCheckingToken(false);
      }
    }

    checkExistingToken();
  }, [router]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();

    if (!trimmedName || !trimmedPhone) {
      setError("Name and phone number are required.");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const data = await loginUser(trimmedName, trimmedPhone);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      router.push("/chat");
    } catch {
      setError("Login failed. Please check your details and try again.");
    } finally {
      setIsLoading(false);
    }
  }

  if (isCheckingToken) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6">
        <p className="text-sm text-slate-600">Checking session...</p>
      </main>
    );
  }

  return (
    <main className="grid h-dvh overflow-hidden bg-[#fbfcfa] lg:grid-cols-[1.04fr_0.96fr]">
      <section className="flex min-h-0 items-center justify-center overflow-y-auto px-6 py-10 sm:px-10 lg:px-14 xl:px-20">
        <div className="w-full max-w-md">
          <BrandLogo
            className="text-[#172019]"
            nameClassName="text-lg"
          />

          <div className="mt-12">
            <h1 className="max-w-sm text-4xl font-semibold leading-[1.08] tracking-normal text-[#172019] sm:text-[2.65rem]">
              Start a conversation.
            </h1>
            <p className="mt-4 max-w-sm text-base leading-7 text-[#768078]">
              Enter your name and phone number to continue.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-9 space-y-5">
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-semibold text-[#344038]"
              >
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="h-13 w-full rounded-xl border border-[#dce3db] bg-white px-4 text-sm text-[#263029] shadow-sm outline-none transition placeholder:text-[#a0a8a2] focus:border-[#85c590] focus:ring-3 focus:ring-[#dcefe0]"
                placeholder="Yeasin Miazi"
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="mb-2 block text-sm font-semibold text-[#344038]"
              >
                Phone number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                className="h-13 w-full rounded-xl border border-[#dce3db] bg-white px-4 text-sm text-[#263029] shadow-sm outline-none transition placeholder:text-[#a0a8a2] focus:border-[#85c590] focus:ring-3 focus:ring-[#dcefe0]"
                placeholder="+8801608072719"
              />
            </div>

            {error ? (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={isLoading}
              className="h-13 w-full rounded-xl bg-[#3bb74d] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#32a943] disabled:cursor-not-allowed disabled:bg-[#aeb9af]"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </section>

      <section className="relative hidden min-h-0 overflow-hidden bg-[#f2f6ef] lg:flex">
        <Image
          src="/images/loopchat-login.png"
          alt="A LoopChat user smiling while reading a message on her phone"
          fill
          priority
          sizes="48vw"
          className="object-contain object-bottom"
        />
      </section>
    </main>
  );
}
