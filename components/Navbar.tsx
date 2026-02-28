"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import NavbarAuth from "./NavbarAuth";

export default function Navbar() {
  // Render a static shell; the client `NavbarAuth` will handle auth UI.
  // Use the current pathname to highlight active links.
  const pathname = usePathname();
  const linkClasses = (active: boolean) =>
    [
      "rounded-full border border-oak/35 px-4 py-2 text-sm font-semibold transition",
      active ? "bg-espresso text-paper" : "bg-sand text-espresso hover:bg-[#efdfcd]",
    ]
      .filter(Boolean)
      .join(" ");

  return (
    <header className="animate-fade-up border-b border-oak/35 bg-mist/80 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link className="text-lg font-semibold tracking-tight text-espresso" href="/login">
          Business Directory
        </Link>

        <div className="stagger-fade flex items-center gap-3">
          <Link className={linkClasses(pathname === "/")} href="/">
            Home
          </Link>

          <Link className={linkClasses(pathname === "/about")} href="/about">
            About
          </Link>

          <NavbarAuth />
        </div>
      </nav>
    </header>
  );
}
