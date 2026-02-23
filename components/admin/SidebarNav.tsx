"use client";

import Link from "next/link";

export type SidebarItem = {
  id: string;
  label: string;
};

type SidebarNavProps = {
  items: SidebarItem[];
};

function SidebarContent({ items, mobile }: { items: SidebarItem[]; mobile: boolean }) {
  return (
    <>
      <div className="d-flex align-items-center mb-3">
        <span className="fs-5 fw-semibold">Business Directory</span>
      </div>
      <hr className="my-2" />
      <ul className="nav nav-pills flex-column gap-1 mb-auto mt-2">
        {items.map((item) => (
          <li className="nav-item" key={item.id}>
            <Link
              href={`#${item.id}`}
              className="nav-link"
              {...(mobile ? { "data-bs-dismiss": "offcanvas" } : {})}
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
    <>
      <aside className="admin-sidebar-desktop d-none d-lg-flex flex-column flex-shrink-0 p-3 border-end bg-body-tertiary">
        <SidebarContent items={items} mobile={false} />
      </aside>

      <div className="offcanvas offcanvas-start" tabIndex={-1} id="adminSidebarOffcanvas" aria-labelledby="adminSidebarOffcanvasLabel">
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="adminSidebarOffcanvasLabel">
            Navigation
          </h5>
          <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close" />
        </div>
        <div className="offcanvas-body">
          <SidebarContent items={items} mobile />
        </div>
      </div>
    </>
  );
}
