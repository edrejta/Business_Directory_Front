import type { Metadata } from "next";
import Link from "next/link";
import styles from "../legal/legal.module.css";

export const metadata: Metadata = {
  title: "KosBiz Terms & Privacy Policy",
  description: "Terms of Service and Privacy Policy for using the KosBiz platform.",
};

const termsSections = [
  { id: "t-intro", label: "1. Introduction" },
  { id: "t-eligibility", label: "2. Eligibility" },
  { id: "t-account", label: "3. Account Security" },
  { id: "t-listings", label: "4. Business Listings" },
  { id: "t-prohibited", label: "5. Prohibited Conduct" },
  { id: "t-ip", label: "6. Intellectual Property" },
  { id: "t-disclaimer", label: "7. Disclaimer" },
  { id: "t-liability", label: "8. Liability" },
  { id: "t-indemnity", label: "9. Indemnification" },
  { id: "t-termination", label: "10. Termination" },
  { id: "t-law", label: "11. Governing Law" },
  { id: "t-amendments", label: "12. Amendments" },
  { id: "t-contact", label: "13. Contact" },
];

const privacySections = [
  { id: "p-intro", label: "1. Introduction" },
  { id: "p-collect", label: "2. Information We Collect" },
  { id: "p-legal", label: "3. Legal Basis" },
  { id: "p-use", label: "4. Use of Information" },
  { id: "p-sharing", label: "5. Data Sharing" },
  { id: "p-retention", label: "6. Data Retention" },
  { id: "p-security", label: "7. Data Security" },
  { id: "p-rights", label: "8. User Rights" },
  { id: "p-cookies", label: "9. Cookies" },
  { id: "p-transfers", label: "10. Data Transfers" },
  { id: "p-changes", label: "11. Changes" },
  { id: "p-contact", label: "12. Contact" },
];

export default function LegalInfoPage() {
  return (
    <main className={styles.legalPage}>
      <div className={styles.legalShell}>
        <header className={styles.legalHeader}>
          <h1>
            Terms & <span className={styles.accent}>Privacy</span>
          </h1>
          <p>Last Updated: February 27, 2026</p>
          <p>
            <Link href="/">Back to Home</Link>
          </p>
        </header>

        <div className={styles.legalBody}>
          <nav className={styles.legalNav} aria-label="Legal sections">
            <h3 style={{ fontSize: "16px", marginBottom: "12px", color: "#3a2c28" }}>Terms of Service</h3>
            <ul style={{ marginBottom: "24px" }}>
              {termsSections.map((item) => (
                <li key={item.id}>
                  <a href={`#${item.id}`}>{item.label}</a>
                </li>
              ))}
            </ul>
            <h3 style={{ fontSize: "16px", marginBottom: "12px", color: "#3a2c28" }}>Privacy Policy</h3>
            <ul>
              {privacySections.map((item) => (
                <li key={item.id}>
                  <a href={`#${item.id}`}>{item.label}</a>
                </li>
              ))}
            </ul>
          </nav>

          <article className={styles.legalContent}>
            {/* --- TERMS SECTION --- */}
            <section id="terms" style={{ scrollMarginTop: "90px" }}>
              <h2 style={{ fontSize: "32px", marginBottom: "32px", color: "#926f4e" }}>Section 1 — Terms of Service</h2>
              
              {/* Content to be added later */}
            </section>

            {/* --- PRIVACY SECTION --- */}
            <section id="privacy" style={{ scrollMarginTop: "90px", marginTop: "40px" }}>
              <h2 style={{ fontSize: "32px", marginBottom: "32px", color: "#926f4e" }}>Section 2 — Privacy Policy</h2>

              {/* Content to be added later */}
            </section>
          </article>
        </div>
      </div>
    </main>
  );
}
