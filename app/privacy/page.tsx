import type { Metadata } from "next";
import Link from "next/link";
import styles from "../legal/legal.module.css";

export const metadata: Metadata = {
  title: "KosBiz Privacy Policy",
  description: "Privacy Policy for using the KosBiz platform.",
};

const sections = [
  { id: "introduction", label: "1. Introduction" },
  { id: "collect", label: "2. Information We Collect" },
  { id: "legal-basis", label: "3. Legal Basis for Processing" },
  { id: "use", label: "4. Use of Information" },
  { id: "sharing", label: "5. Data Sharing and Disclosure" },
  { id: "retention", label: "6. Data Retention" },
  { id: "security", label: "7. Data Security" },
  { id: "rights", label: "8. User Rights" },
  { id: "cookies", label: "9. Cookies and Tracking Technologies" },
  { id: "transfers", label: "10. International Data Transfers" },
  { id: "changes", label: "11. Changes to This Policy" },
  { id: "contact", label: "12. Contact Information" },
];

export default function PrivacyPage() {
  return (
    <main className={styles.legalPage}>
      <div className={styles.legalShell}>
        <header className={styles.legalHeader}>
          <h1>
            Privacy <span className={styles.accent}>Policy</span>
          </h1>
          <p>Last Updated: February 27, 2026</p>
          <p>
            <Link href="/">Back to Home</Link>
          </p>
        </header>

        <div className={styles.legalBody}>
          <nav className={styles.legalNav} aria-label="Privacy sections">
            <ul>
              {sections.map((item) => (
                <li key={item.id}>
                  <a href={`#${item.id}`}>{item.label}</a>
                </li>
              ))}
            </ul>
          </nav>

          <article className={styles.legalContent}>
            <section id="introduction" className={styles.legalSection}>
              <h2>1. Introduction</h2>
              <p>
                KosBiz respects your privacy and is committed to protecting your personal data in accordance with
                applicable data protection laws.
              </p>
              <p>
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information.
              </p>
            </section>

            <section id="collect" className={styles.legalSection}>
              <h2>2. Information We Collect</h2>
              <p>2.1 Personal Data</p>
              <p>We may collect:</p>
              <ul>
                <li>Full name</li>
                <li>Email address</li>
                <li>Account credentials</li>
                <li>Business contact information</li>
                <li>Any information voluntarily submitted through listings or forms</li>
              </ul>
              <p>2.2 Technical Data</p>
              <p>We may automatically collect:</p>
              <ul>
                <li>IP address</li>
                <li>Browser type and version</li>
                <li>Device information</li>
                <li>Usage data and analytics</li>
                <li>Cookies and tracking technologies</li>
              </ul>
            </section>

            <section id="legal-basis" className={styles.legalSection}>
              <h2>3. Legal Basis for Processing</h2>
              <p>We process personal data based on:</p>
              <ul>
                <li>Performance of a contract (account services);</li>
                <li>Legitimate business interests;</li>
                <li>Compliance with legal obligations;</li>
                <li>User consent where required.</li>
              </ul>
            </section>

            <section id="use" className={styles.legalSection}>
              <h2>4. Use of Information</h2>
              <p>We use personal data to:</p>
              <ul>
                <li>Provide and maintain our Services;</li>
                <li>Manage user accounts;</li>
                <li>Display and promote business listings;</li>
                <li>Improve platform performance;</li>
                <li>Communicate service-related information;</li>
                <li>Ensure security and prevent fraud.</li>
              </ul>
            </section>

            <section id="sharing" className={styles.legalSection}>
              <h2>5. Data Sharing and Disclosure</h2>
              <p>We do not sell personal data.</p>
              <p>We may share information with:</p>
              <ul>
                <li>Hosting and IT service providers;</li>
                <li>Analytics providers;</li>
                <li>Legal authorities where required by law;</li>
                <li>Business partners where necessary for service functionality.</li>
              </ul>
              <p>All third-party processors are required to maintain confidentiality and data security.</p>
            </section>

            <section id="retention" className={styles.legalSection}>
              <h2>6. Data Retention</h2>
              <p>
                We retain personal data only for as long as necessary to fulfill the purposes described in this Policy
                or comply with legal obligations.
              </p>
            </section>

            <section id="security" className={styles.legalSection}>
              <h2>7. Data Security</h2>
              <p>
                We implement appropriate technical and organizational measures to protect personal data from
                unauthorized access, alteration, disclosure, or destruction.
              </p>
              <p>However, no system can guarantee absolute security.</p>
            </section>

            <section id="rights" className={styles.legalSection}>
              <h2>8. User Rights</h2>
              <p>Subject to applicable law, you may have the right to:</p>
              <ul>
                <li>Access your personal data;</li>
                <li>Request correction;</li>
                <li>Request deletion;</li>
                <li>Restrict processing;</li>
                <li>Withdraw consent;</li>
                <li>Lodge a complaint with a supervisory authority.</li>
              </ul>
              <p>Requests may be submitted to:</p>
              <p className={styles.contactLine}>support@kosbiz.com</p>
            </section>

            <section id="cookies" className={styles.legalSection}>
              <h2>9. Cookies and Tracking Technologies</h2>
              <p>KosBiz uses cookies and similar technologies to:</p>
              <ul>
                <li>Maintain user sessions;</li>
                <li>Analyze website traffic;</li>
                <li>Improve user experience.</li>
              </ul>
              <p>Users may control cookies through browser settings.</p>
            </section>

            <section id="transfers" className={styles.legalSection}>
              <h2>10. International Data Transfers</h2>
              <p>
                If data is transferred outside your jurisdiction, we ensure appropriate safeguards are in place
                consistent with applicable data protection laws.
              </p>
            </section>

            <section id="changes" className={styles.legalSection}>
              <h2>11. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy periodically. The revised version will be posted with an updated
                effective date.
              </p>
            </section>

            <section id="contact" className={styles.legalSection}>
              <h2>12. Contact Information</h2>
              <p>For privacy-related questions:</p>
              <p className={styles.contactLine}>support@kosbiz.com</p>
            </section>
          </article>
        </div>
      </div>
    </main>
  );
}
