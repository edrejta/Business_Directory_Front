"use client";

import Link from "next/link";
import { useMemo, useState, useSyncExternalStore } from "react";
import { useAuth } from "@/context/AuthContext";
import styles from "./MarketingNavbar.module.css";

const subscribeNoop = () => () => {};
const getClientHydrationSnapshot = () => true;
const getServerHydrationSnapshot = () => false;

export default function MarketingNavbar() {
  const { user, logoutUser, getRedirectPath } = useAuth();
  const [open, setOpen] = useState(false);
  const isHydrated = useSyncExternalStore(subscribeNoop, getClientHydrationSnapshot, getServerHydrationSnapshot);
  const safeUser = isHydrated ? user : null;

  const dashboardHref = useMemo(() => (safeUser ? getRedirectPath(safeUser.role) : "/login"), [safeUser, getRedirectPath]);

  return (
    <header className={styles.shell}>
      <div className={styles.bar}>
        <Link className={styles.brand} href="/homepage">
          <span className={styles.badge}>K</span>
          <strong className={styles.brandText}>KosBiz</strong>
        </Link>

        <button
          type="button"
          className={styles.menuButton}
          aria-expanded={open}
          aria-controls="marketing-nav"
          onClick={() => setOpen((value) => !value)}
        >
          Menu
        </button>

        <nav id="marketing-nav" className={`${styles.nav} ${open ? styles.open : ""}`}>
          <Link className={styles.link} href="/about" onClick={() => setOpen(false)}>
            About
          </Link>
          <Link className={styles.link} href="/how-to-use" onClick={() => setOpen(false)}>
            How To Use
          </Link>
          <a className={styles.link} href="#contact" onClick={() => setOpen(false)}>
            Contact
          </a>
          {safeUser ? (
            <>
              <Link className={`${styles.btn} ${styles.btnOutline}`} href={dashboardHref} onClick={() => setOpen(false)}>
                Dashboard
              </Link>
              <button
                className={`${styles.btn} ${styles.btnSolid}`}
                onClick={() => {
                  setOpen(false);
                  logoutUser();
                }}
                type="button"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link className={`${styles.btn} ${styles.btnOutline}`} href="/login" onClick={() => setOpen(false)}>
                Login
              </Link>
              <Link className={`${styles.btn} ${styles.btnSolid}`} href="/register" onClick={() => setOpen(false)}>
                Signup
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
