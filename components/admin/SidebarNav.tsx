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
      <div className="d-flex align-items-center mb-3">
        <span className="fs-5 fw-semibold">Business Directory</span>
      </div>
      <hr className="my-2" />
      <ul className="nav nav-pills flex-column gap-1 mb-auto mt-2">
        {items.map((item) => (
          <li className="nav-item" key={item.id}>
            <Link href={`#${item.id}`} className="nav-link">
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
      className="admin-sidebar-fixed d-none d-md-flex flex-column flex-shrink-0 p-3 border-end bg-body-tertiary"
      style={{ width: 260, minHeight: "100vh" }}
    >
      <SidebarContent items={items} />
    </aside>
  );
}
