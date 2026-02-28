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
              
              <section id="t-intro" className={styles.legalSection}>
                <h2>1. Introduction</h2>
                <p>
                  These Terms of Service ("Terms", "Agreement") constitute a legally binding agreement between you
                  ("User", "you", "your") and KosBiz ("Company", "we", "us", "our"), governing your access to and use
                  of the KosBiz website, platform, and related services (collectively, the "Services").
                </p>
                <p>
                  By accessing or using the Services, creating an account, or submitting a business listing, you
                  acknowledge that you have read, understood, and agree to be bound by these Terms.
                </p>
                <p>If you do not agree to these Terms, you must not use the Services.</p>
              </section>

              <section id="t-eligibility" className={styles.legalSection}>
                <h2>2. Eligibility</h2>
                <p>
                  You must be at least eighteen (18) years of age and legally capable of entering into binding
                  agreements to use the Services.
                </p>
                <p>By using KosBiz, you represent and warrant that:</p>
                <ul>
                  <li>You meet the eligibility requirements;</li>
                  <li>All information provided by you is accurate and complete;</li>
                  <li>You have the legal authority to represent any business you list on the platform.</li>
                </ul>
              </section>

              <section id="t-account" className={styles.legalSection}>
                <h2>3. Account Registration and Security</h2>
                <p>To access certain features of the Services, you may be required to create an account.</p>
                <p>You agree to:</p>
                <ul>
                  <li>Provide accurate, current, and complete information;</li>
                  <li>Maintain the confidentiality of your login credentials;</li>
                  <li>Immediately notify us of any unauthorized use of your account.</li>
                </ul>
                <p>You are solely responsible for all activities conducted under your account.</p>
                <p>
                  KosBiz reserves the right to suspend or terminate accounts that violate these Terms or applicable law.
                </p>
              </section>

              <section id="t-listings" className={styles.legalSection}>
                <h2>4. Business Listings and User Content</h2>
                <p>
                  Users may submit business listings, descriptions, contact information, images, and related content
                  ("User Content").
                </p>
                <p>By submitting User Content, you represent and warrant that:</p>
                <ul>
                  <li>You own or have lawful rights to use and publish such content;</li>
                  <li>The content is accurate, lawful, and not misleading;</li>
                  <li>The content does not infringe any third-party rights.</li>
                </ul>
                <p>
                  You grant KosBiz a worldwide, non-exclusive, royalty-free license to use, display, reproduce, and
                  distribute such User Content solely for purposes related to operating and promoting the platform.
                </p>
                <p>
                  KosBiz reserves the right, at its sole discretion, to review, modify, reject, or remove any User
                  Content.
                </p>
              </section>

              <section id="t-prohibited" className={styles.legalSection}>
                <h2>5. Prohibited Conduct</h2>
                <p>You agree not to:</p>
                <ul>
                  <li>Use the Services for any unlawful purpose;</li>
                  <li>Submit false, fraudulent, defamatory, or harmful content;</li>
                  <li>Impersonate any person or business;</li>
                  <li>Attempt to gain unauthorized access to the platform;</li>
                  <li>Interfere with the integrity, security, or performance of the Services;</li>
                  <li>Use automated systems to extract data from the platform.</li>
                </ul>
                <p>Violation of this section may result in immediate termination of access and potential legal action.</p>
              </section>

              <section id="t-ip" className={styles.legalSection}>
                <h2>6. Intellectual Property Rights</h2>
                <p>
                  All intellectual property rights in the platform, including but not limited to design, software, logos,
                  trademarks, and content (excluding User Content), are the exclusive property of KosBiz or its
                  licensors.
                </p>
                <p>
                  No part of the Services may be copied, reproduced, modified, distributed, or exploited without prior
                  written consent.
                </p>
              </section>

              <section id="t-disclaimer" className={styles.legalSection}>
                <h2>7. Disclaimer of Warranties</h2>
                <p>The Services are provided on an "as is" and "as available" basis.</p>
                <p>KosBiz makes no warranties, express or implied, including but not limited to:</p>
                <ul>
                  <li>Accuracy or completeness of listings;</li>
                  <li>Reliability of businesses listed;</li>
                  <li>Continuous, secure, or error-free operation.</li>
                </ul>
                <p>KosBiz does not endorse or guarantee the quality of services offered by listed businesses.</p>
              </section>

              <section id="t-liability" className={styles.legalSection}>
                <h2>8. Limitation of Liability</h2>
                <p>To the maximum extent permitted by law, KosBiz shall not be liable for:</p>
                <ul>
                  <li>Indirect, incidental, or consequential damages;</li>
                  <li>Loss of profits, revenue, goodwill, or data;</li>
                  <li>Damages resulting from interactions between users and listed businesses.</li>
                </ul>
                <p>Your sole remedy for dissatisfaction with the Services is to discontinue use.</p>
              </section>

              <section id="t-indemnity" className={styles.legalSection}>
                <h2>9. Indemnification</h2>
                <p>
                  You agree to indemnify and hold harmless KosBiz, its directors, employees, and affiliates from any
                  claims, damages, liabilities, or expenses arising from:
                </p>
                <ul>
                  <li>Your use of the Services;</li>
                  <li>Your violation of these Terms;</li>
                  <li>Your infringement of third-party rights.</li>
                </ul>
              </section>

              <section id="t-termination" className={styles.legalSection}>
                <h2>10. Termination</h2>
                <p>
                  KosBiz reserves the right to suspend or terminate access to the Services at any time, without prior
                  notice, if you violate these Terms or applicable laws.
                </p>
              </section>

              <section id="t-law" className={styles.legalSection}>
                <h2>11. Governing Law</h2>
                <p>
                  These Terms shall be governed and interpreted in accordance with the laws of the Republic of Kosovo,
                  without regard to conflict of law principles.
                </p>
                <p>Any disputes shall be subject to the exclusive jurisdiction of the competent courts in Kosovo.</p>
              </section>

              <section id="t-amendments" className={styles.legalSection}>
                <h2>12. Amendments</h2>
                <p>
                  KosBiz reserves the right to modify these Terms at any time. Updated versions will be posted on the
                  website with a revised date.
                </p>
                <p>Continued use of the Services constitutes acceptance of the updated Terms.</p>
              </section>

              <section id="t-contact" className={styles.legalSection}>
                <h2>13. Contact Information</h2>
                <p>For legal inquiries regarding these Terms:</p>
                <p className={styles.contactLine}>support@kosbiz.com</p>
              </section>
            </section>

            {/* --- PRIVACY SECTION --- */}
            <section id="privacy" style={{ scrollMarginTop: "90px", marginTop: "40px" }}>
              <h2 style={{ fontSize: "32px", marginBottom: "32px", color: "#926f4e" }}>Section 2 — Privacy Policy</h2>

              <section id="p-intro" className={styles.legalSection}>
                <h2>1. Introduction</h2>
                <p>
                  KosBiz respects your privacy and is committed to protecting your personal data in accordance with
                  applicable data protection laws.
                </p>
                <p>
                  This Privacy Policy explains how we collect, use, disclose, and safeguard your information.
                </p>
              </section>

              <section id="p-collect" className={styles.legalSection}>
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

              <section id="p-legal" className={styles.legalSection}>
                <h2>3. Legal Basis for Processing</h2>
                <p>We process personal data based on:</p>
                <ul>
                  <li>Performance of a contract (account services);</li>
                  <li>Legitimate business interests;</li>
                  <li>Compliance with legal obligations;</li>
                  <li>User consent where required.</li>
                </ul>
              </section>

              <section id="p-use" className={styles.legalSection}>
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

              <section id="p-sharing" className={styles.legalSection}>
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

              <section id="p-retention" className={styles.legalSection}>
                <h2>6. Data Retention</h2>
                <p>
                  We retain personal data only for as long as necessary to fulfill the purposes described in this Policy
                  or comply with legal obligations.
                </p>
              </section>

              <section id="p-security" className={styles.legalSection}>
                <h2>7. Data Security</h2>
                <p>
                  We implement appropriate technical and organizational measures to protect personal data from
                  unauthorized access, alteration, disclosure, or destruction.
                </p>
                <p>However, no system can guarantee absolute security.</p>
              </section>

              <section id="p-rights" className={styles.legalSection}>
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

              <section id="p-cookies" className={styles.legalSection}>
                <h2>9. Cookies and Tracking Technologies</h2>
                <p>KosBiz uses cookies and similar technologies to:</p>
                <ul>
                  <li>Maintain user sessions;</li>
                  <li>Analyze website traffic;</li>
                  <li>Improve user experience.</li>
                </ul>
                <p>Users may control cookies through browser settings.</p>
              </section>

              <section id="p-transfers" className={styles.legalSection}>
                <h2>10. International Data Transfers</h2>
                <p>
                  If data is transferred outside your jurisdiction, we ensure appropriate safeguards are in place
                  consistent with applicable data protection laws.
                </p>
              </section>

              <section id="p-changes" className={styles.legalSection}>
                <h2>11. Changes to This Policy</h2>
                <p>
                  We may update this Privacy Policy periodically. The revised version will be posted with an updated
                  effective date.
                </p>
              </section>

              <section id="p-contact" className={styles.legalSection}>
                <h2>12. Contact Information</h2>
                <p>For privacy-related questions:</p>
                <p className={styles.contactLine}>support@kosbiz.com</p>
              </section>
            </section>
          </article>
        </div>
      </div>
    </main>
  );
}
