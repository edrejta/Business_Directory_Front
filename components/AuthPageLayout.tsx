"use client";

import Link from "next/link";

const CITY_BG_URL =
  "https://i.pinimg.com/1200x/19/02/a0/1902a0b6f1475ef606c1f9353edfa3db.jpg";

interface AuthPageLayoutProps {
  children: React.ReactNode;
}

export default function AuthPageLayout({ children }: AuthPageLayoutProps) {
  return (
    <main className="auth-page-bg relative flex min-h-screen items-center justify-center overflow-hidden p-6">
      <Link
        href="/homepage"
        className="absolute left-4 top-4 z-20 rounded-full border border-paper/60 bg-espresso/55 px-4 py-2 text-sm font-semibold text-paper backdrop-blur transition hover:bg-espresso/70 md:left-6 md:top-6"
      >
        Home
      </Link>

      {/* City skyline — zoom in on load */}
      <div
        className="auth-bg-kenburns animate-bg-zoom pointer-events-none absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${CITY_BG_URL})` }}
      />

      {/* Gradient overlay — sweep up */}
      <div className="animate-overlay-sweep pointer-events-none absolute inset-0 bg-gradient-to-b from-espresso/75 via-espresso/60 to-espresso/80" />

      {/* Water reflection shimmer */}
      <div className="auth-water-shimmer pointer-events-none absolute inset-0 opacity-30" />

      {/* Floating particles */}
      <div className="pointer-events-none absolute inset-0 z-[1]" aria-hidden>
        <span className="animate-float-particle absolute left-[15%] top-[20%] h-2 w-2 rounded-full bg-paper/50" style={{ animationDelay: "0s" }} />
        <span className="animate-float-particle absolute right-[20%] top-[35%] h-1.5 w-1.5 rounded-full bg-sand/60" style={{ animationDelay: "1.2s" }} />
        <span className="animate-float-particle absolute left-[25%] bottom-[30%] h-1 w-1 rounded-full bg-clay/40" style={{ animationDelay: "2.5s" }} />
      </div>

      {/* Card — perspective enter + glow; scrollable so button is always reachable */}
      <section className="animate-register-card animate-glow-border relative z-10 flex max-h-[calc(100vh-3rem)] w-full max-w-md flex-col overflow-hidden rounded-2xl border border-oak/40 bg-paper/95 shadow-panel backdrop-blur-md">
        <div className="flex flex-1 flex-col overflow-y-auto p-7">{children}</div>
      </section>
    </main>
  );
}
