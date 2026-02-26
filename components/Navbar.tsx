"use client";
import Link from "next/link";
import NavbarAuth from "./NavbarAuth";

export default function Navbar() {
  // Render a static shell; the client `NavbarAuth` will handle auth UI.
  return (
    <header className="animate-fade-up border-b border-oak/35 bg-mist/80 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link className="text-lg font-semibold tracking-tight text-espresso" href="/login">
          Business Directory
        </Link>

        <div className="stagger-fade flex items-center gap-3">
          <Link
            className="rounded-full border border-oak/35 bg-sand px-4 py-2 text-sm font-semibold text-espresso transition hover:bg-[#efdfcd]"
            href="/"
          >
            Home
          </Link>

          <NavbarAuth />
        </div>
      </nav>
    </header>
  );
}
