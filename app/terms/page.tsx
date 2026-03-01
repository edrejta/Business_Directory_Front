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

const termsContent = [
  {
    id: "t-intro",
    title: "1. Introduction",
    body: [
      "These Terms govern access to and use of the KosBiz platform and any related services.",
      "By using the platform, you agree to comply with these Terms and all applicable laws.",
    ],
  },
  {
    id: "t-eligibility",
    title: "2. Eligibility",
    body: [
      "You must be at least 18 years old or have permission from a legal guardian to use the platform.",
      "You are responsible for ensuring your use is lawful in your jurisdiction.",
    ],
  },
  {
    id: "t-account",
    title: "3. Account Security",
    body: [
      "You are responsible for maintaining the confidentiality of your account credentials.",
      "Notify us immediately if you suspect unauthorized access to your account.",
    ],
  },
  {
    id: "t-listings",
    title: "4. Business Listings",
    body: [
      "Listings must be accurate, current, and not misleading.",
      "We may review, edit, or remove listings that violate these Terms.",
    ],
  },
  {
    id: "t-prohibited",
    title: "5. Prohibited Conduct",
    body: [
      "Do not misuse the platform, including attempting to gain unauthorized access or disrupt services.",
      "Do not submit content that is unlawful, infringing, or harmful.",
    ],
  },
  {
    id: "t-ip",
    title: "6. Intellectual Property",
    body: [
      "KosBiz and its content are protected by intellectual property laws.",
      "You may not copy, modify, or distribute content without permission.",
    ],
  },
  {
    id: "t-disclaimer",
    title: "7. Disclaimer",
    body: [
      "The platform is provided on an \"as is\" basis without warranties of any kind.",
      "We do not guarantee availability, accuracy, or suitability for any purpose.",
    ],
  },
  {
    id: "t-liability",
    title: "8. Liability",
    body: [
      "KosBiz is not liable for indirect, incidental, or consequential damages.",
      "Our total liability is limited to the maximum extent permitted by law.",
    ],
  },
  {
    id: "t-indemnity",
    title: "9. Indemnification",
    body: [
      "You agree to indemnify and hold KosBiz harmless from claims arising from your use of the platform.",
    ],
  },
  {
    id: "t-termination",
    title: "10. Termination",
    body: [
      "We may suspend or terminate access for violations of these Terms.",
      "You may stop using the platform at any time.",
    ],
  },
  {
    id: "t-law",
    title: "11. Governing Law",
    body: [
      "These Terms are governed by the laws applicable to KosBiz’s operating jurisdiction.",
    ],
  },
  {
    id: "t-amendments",
    title: "12. Amendments",
    body: [
      "We may update these Terms from time to time and will post changes on this page.",
    ],
  },
  {
    id: "t-contact",
    title: "13. Contact",
    body: ["Questions about these Terms? Contact us at support@kosbiz.com."],
  },
];

const privacyContent = [
  {
    id: "p-intro",
    title: "1. Introduction",
    body: ["This Privacy Policy explains how we collect, use, and protect personal information."],
  },
  {
    id: "p-collect",
    title: "2. Information We Collect",
    body: [
      "Information you provide directly (e.g., name, email, business details).",
      "Usage data such as pages visited and interactions on the platform.",
    ],
  },
  {
    id: "p-legal",
    title: "3. Legal Basis",
    body: [
      "We process data to provide our services, comply with legal obligations, and improve the platform.",
    ],
  },
  {
    id: "p-use",
    title: "4. Use of Information",
    body: [
      "To operate and maintain the platform.",
      "To communicate updates, support requests, and service notifications.",
    ],
  },
  {
    id: "p-sharing",
    title: "5. Data Sharing",
    body: [
      "We do not sell personal data.",
      "We may share data with service providers who help us operate the platform.",
    ],
  },
  {
    id: "p-retention",
    title: "6. Data Retention",
    body: [
      "We retain data only as long as necessary for the purposes described in this policy.",
    ],
  },
  {
    id: "p-security",
    title: "7. Data Security",
    body: [
      "We use reasonable security measures to protect your information.",
      "No system is completely secure, and we cannot guarantee absolute security.",
    ],
  },
  {
    id: "p-rights",
    title: "8. User Rights",
    body: [
      "You may request access, correction, or deletion of your data where applicable.",
    ],
  },
  {
    id: "p-cookies",
    title: "9. Cookies",
    body: [
      "We may use cookies to remember preferences and improve site performance.",
      "You can control cookies through your browser settings.",
    ],
  },
  {
    id: "p-transfers",
    title: "10. Data Transfers",
    body: [
      "Your data may be processed in countries other than your own, with appropriate safeguards.",
    ],
  },
  {
    id: "p-changes",
    title: "11. Changes",
    body: ["We may update this policy and will post changes on this page."],
  },
  {
    id: "p-contact",
    title: "12. Contact",
    body: ["Questions about privacy? Contact us at support@kosbiz.com."],
  },
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
              {termsContent.map((section) => (
                <div key={section.id} id={section.id} className={styles.legalSection}>
                  <h3>{section.title}</h3>
                  {section.body.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              ))}
            </section>

            {/* --- PRIVACY SECTION --- */}
            <section id="privacy" style={{ scrollMarginTop: "90px", marginTop: "40px" }}>
              <h2 style={{ fontSize: "32px", marginBottom: "32px", color: "#926f4e" }}>Section 2 — Privacy Policy</h2>
              {privacyContent.map((section) => (
                <div key={section.id} id={section.id} className={styles.legalSection}>
                  <h3>{section.title}</h3>
                  {section.body.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              ))}
            </section>
          </article>
        </div>
      </div>
    </main>
  );
}
