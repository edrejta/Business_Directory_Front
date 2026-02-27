import Link from "next/link";
import "./howtouseuser.css";
import MarketingNavbar from "@/components/MarketingNavbar";

const steps = [
  {
    id: "01",
    title: "Kërko biznesin",
    subtitle: "Kërko biznesin",
    text: "Shkruaj emrin, kategorinë ose vendndodhjen e biznesit që dëshiron ta gjesh. Platforma jonë do të gjejë rezultate të sakta për ty.",
    bullets: ["Kërkim me fjalë kyçe", "Filtrim sipas kategorisë", "Rezultate të shpejta"],
    icon: "search",
  },
  {
    id: "02",
    title: "Eksploro & krahaso",
    subtitle: "Eksploro & krahaso",
    text: "Shiko detajet e bizneseve, krahasoji me njëri-tjetrin, dhe gjej informacionet si adresa, orari, dhe shërbimet.",
    bullets: ["Harta interaktive", "Detaje të plota", "Fotografi & review"],
    icon: "pin",
  },
  {
    id: "03",
    title: "Lidhu & vlerëso",
    subtitle: "Lidhu & vlerëso",
    text: "Kontakto biznesin drejtpërdrejt, lër vlerësimin tënd, dhe ndihmo komunitetin të gjejë bizneset më të mira.",
    bullets: ["Kontakt i drejtpërdrejtë", "Sistemi i vlerësimeve", "Ruaj favoritet"],
    icon: "star",
  },
] as const;

function StepIcon({ kind }: { kind: (typeof steps)[number]["icon"] }) {
  if (kind === "pin") {
    return (
      <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
        <path d="M12 2a7 7 0 0 0-7 7c0 4.9 5.5 10.8 6.1 11.4a1.2 1.2 0 0 0 1.8 0C13.5 19.8 19 13.9 19 9a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5Z" />
      </svg>
    );
  }

  if (kind === "star") {
    return (
      <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
        <path d="m12 3.2 2.5 5 5.5.8-4 3.9.9 5.5-4.9-2.6-4.9 2.6.9-5.5-4-3.9 5.5-.8Z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
      <path d="M10.5 3a7.5 7.5 0 0 1 5.9 12.1l4.3 4.3a1 1 0 0 1-1.4 1.4L15 16.5A7.5 7.5 0 1 1 10.5 3Zm0 2a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11Z" />
    </svg>
  );
}

function StepRow({
  step,
  reverse,
}: {
  step: (typeof steps)[number];
  reverse?: boolean;
}) {
  return (
    <section className={`htu-user-row ${reverse ? "reverse" : ""}`}>
      <article className="htu-user-copy">
        <div className="htu-user-step-head">
          <span>{step.id}</span>
          <i>
            <StepIcon kind={step.icon} />
          </i>
        </div>

        <h2>{step.title}</h2>
        <p>{step.text}</p>
        <ul>
          {step.bullets.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </article>

      <article className="htu-user-preview">
        <div className="htu-user-preview-icon">
          <StepIcon kind={step.icon} />
        </div>
        <h3>Hapi {step.id}</h3>
        <p>{step.subtitle}</p>
      </article>
    </section>
  );
}

export default function HowToUseUserPage() {
  return (
    <main className="htu-user-page">
      <MarketingNavbar />

      <section className="htu-user-hero">
        <span className="htu-user-bg-mark">U</span>
        <p className="htu-user-kicker">UDHËZUES PËR PËRDORUES</p>
        <h1>
          Si ta përdorësh
          <br />
          <em>Kos Biz</em>
        </h1>
        <p>Tre hapa të thjeshtë për të gjetur biznesin e duhur në Kosovë.</p>
      </section>

      <div className="htu-user-steps">
        <div className="htu-user-wrap">
          <StepRow step={steps[0]} />
          <StepRow step={steps[1]} reverse />
          <StepRow step={steps[2]} />
        </div>
      </div>

      <section className="htu-user-cta">
        <h2>Gati për të filluar?</h2>
        <p>Fillo kërkimin tënd tani dhe gjej bizneset më të mira në Kosovë.</p>
        <Link href="/homepage" className="htu-user-cta-btn">
          KERKO TANI <span aria-hidden="true">→</span>
        </Link>
      </section>

      <footer className="htu-user-footer">
        <div className="htu-user-wrap htu-user-footer-grid">
          <div>
            <h3>Contact</h3>
            <p>support@kosbiz.com</p>
            <p>+233 200 000 000</p>
            <p>About &nbsp;|&nbsp; Terms &nbsp;|&nbsp; Privacy</p>
          </div>

          <div>
            <h3>Live Counters</h3>
            <p>2 businesses listed</p>
            <p>2 categories</p>
          </div>

          <div>
            <div className="htu-user-footer-brand">
              <span>K</span>
              <strong>KosBiz</strong>
            </div>
            <p>Your trusted Kosovo business directory. Discover local businesses fast.</p>
          </div>
        </div>

        <div className="htu-user-copyright">© 2026 KosBiz. All rights reserved.</div>
      </footer>
    </main>
  );
}
