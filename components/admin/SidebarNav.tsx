"use client";

import Link from "next/link";

export type SidebarItem = {
  id: string;
  label: string;
};

type SidebarNavProps = {
  items: SidebarItem[];
};

function SidebarContent({ items }: { items: SidebarItem[] }) {
  return (
    <>
      <div className="mb-3 flex items-center">
        <span className="text-lg font-semibold">Business Directory</span>
      </div>

      <hr className="my-2 border-[var(--coffee-border)]" />

      <ul className="mt-2 flex flex-col gap-1">
        {items.map((item) => (
          <li key={item.id}>
            <Link
              href={`#${item.id}`}
              className="block rounded-md px-3 py-2 text-sm font-medium text-[var(--coffee-text)] transition-colors hover:bg-[var(--coffee-border)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--coffee-primary)]"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}

export default function SidebarNav({ items }: SidebarNavProps) {
  return (
    <aside
      className="admin-sidebar-fixed hidden min-h-screen w-[260px] shrink-0 border-r border-[var(--coffee-border)] bg-[var(--coffee-surface)] p-3 md:flex md:flex-col"
      aria-label="Admin sidebar"
    >
      <SidebarContent items={items} />
    </aside>
  );
}
