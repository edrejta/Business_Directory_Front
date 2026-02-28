import type { Metadata } from "next";
import Link from "next/link";
import styles from "../legal/legal.module.css";

export const metadata: Metadata = {
  title: "KosBiz Terms of Service",
  description: "Terms of Service for using the KosBiz platform.",
};

const sections = [
  { id: "introduction", label: "1. Introduction" },
  { id: "eligibility", label: "2. Eligibility" },
  { id: "account", label: "3. Account Registration and Security" },
  { id: "listings", label: "4. Business Listings and User Content" },
  { id: "prohibited", label: "5. Prohibited Conduct" },
  { id: "ip", label: "6. Intellectual Property Rights" },
  { id: "disclaimer", label: "7. Disclaimer of Warranties" },
  { id: "liability", label: "8. Limitation of Liability" },
  { id: "indemnification", label: "9. Indemnification" },
  { id: "termination", label: "10. Termination" },
  { id: "law", label: "11. Governing Law" },
  { id: "amendments", label: "12. Amendments" },
  { id: "contact", label: "13. Contact Information" },
];

export default function TermsPage() {
  return (
    <main className={styles.legalPage}>
      <div className={styles.legalShell}>
        <header className={styles.legalHeader}>
          <h1>
            Terms of <span className={styles.accent}>Service</span>
          </h1>
          <p>Last Updated: February 27, 2026</p>
          <p>
            <Link href="/">Back to Home</Link>
          </p>
        </header>

        <div className={styles.legalBody}>
          <nav className={styles.legalNav} aria-label="Terms sections">
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

            <section id="eligibility" className={styles.legalSection}>
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

            <section id="account" className={styles.legalSection}>
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

            <section id="listings" className={styles.legalSection}>
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

            <section id="prohibited" className={styles.legalSection}>
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

            <section id="ip" className={styles.legalSection}>
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

            <section id="disclaimer" className={styles.legalSection}>
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

            <section id="liability" className={styles.legalSection}>
              <h2>8. Limitation of Liability</h2>
              <p>To the maximum extent permitted by law, KosBiz shall not be liable for:</p>
              <ul>
                <li>Indirect, incidental, or consequential damages;</li>
                <li>Loss of profits, revenue, goodwill, or data;</li>
                <li>Damages resulting from interactions between users and listed businesses.</li>
              </ul>
              <p>Your sole remedy for dissatisfaction with the Services is to discontinue use.</p>
            </section>

            <section id="indemnification" className={styles.legalSection}>
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

            <section id="termination" className={styles.legalSection}>
              <h2>10. Termination</h2>
              <p>
                KosBiz reserves the right to suspend or terminate access to the Services at any time, without prior
                notice, if you violate these Terms or applicable laws.
              </p>
            </section>

            <section id="law" className={styles.legalSection}>
              <h2>11. Governing Law</h2>
              <p>
                These Terms shall be governed and interpreted in accordance with the laws of the Republic of Kosovo,
                without regard to conflict of law principles.
              </p>
              <p>Any disputes shall be subject to the exclusive jurisdiction of the competent courts in Kosovo.</p>
            </section>

            <section id="amendments" className={styles.legalSection}>
              <h2>12. Amendments</h2>
              <p>
                KosBiz reserves the right to modify these Terms at any time. Updated versions will be posted on the
                website with a revised date.
              </p>
              <p>Continued use of the Services constitutes acceptance of the updated Terms.</p>
            </section>

            <section id="contact" className={styles.legalSection}>
              <h2>13. Contact Information</h2>
              <p>For legal inquiries regarding these Terms:</p>
              <p className={styles.contactLine}>support@kosbiz.com</p>
            </section>
          </article>
        </div>
      </div>
    </main>
  );
}
