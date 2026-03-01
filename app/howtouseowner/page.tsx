import Link from "next/link";
import "../howtouseuser/howtouseuser.css";
import MarketingNavbar from "@/components/MarketingNavbar";

const steps = [
  {
    id: "01",
    title: "Regjistro biznesin",
    subtitle: "Regjistro biznesin",
    text: "Krijo llogarine si pronar biznesi dhe ploteso profilin e biznesit tend me te dhena si emri, kategoria, adresa dhe kontakti.",
    bullets: ["Regjistrimi falas", "Profil i personalizuar", "Verifikim i shpejte"],
    icon: "userPlus",
  },
  {
    id: "02",
    title: "Personalizo faqen",
    subtitle: "Personalizo faqen",
    text: "Shto fotografi, pershkrim, orar pune, sherbime dhe cdo detaj tjeter qe e ben biznesin tend unik.",
    bullets: ["Galeri fotografish", "Orari i punes", "Lista e sherbimeve"],
    icon: "settings",
  },
  {
    id: "03",
    title: "Promovo dhe rrit",
    subtitle: "Promovo dhe rrit",
    text: "Perdor mjetet tona promocionale per te arritur me shume kliente. Publiko oferta, ndaj lajme dhe rrit prezencen online.",
    bullets: ["Oferta speciale", "Postime te reja", "Promocion i avancuar"],
    icon: "trending",
  },
] as const;

function StepIcon({ kind }: { kind: (typeof steps)[number]["icon"] }) {
  if (kind === "settings") {
    return (
      <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
        <path d="M9.7 3.2h4.6l.4 2.1a7 7 0 0 1 1.6.9l2-.8 2.3 4-1.7 1.4c.1.3.1.8.1 1.2s0 .8-.1 1.2l1.7 1.4-2.3 4-2-.8a7 7 0 0 1-1.6.9l-.4 2.1H9.7l-.4-2.1a7 7 0 0 1-1.6-.9l-2 .8-2.3-4 1.7-1.4a6.3 6.3 0 0 1 0-2.4L3.4 9.3l2.3-4 2 .8a7 7 0 0 1 1.6-.9Zm2.3 5a3.8 3.8 0 1 0 0 7.6 3.8 3.8 0 0 0 0-7.6Z" />
      </svg>
    );
  }

  if (kind === "trending") {
    return (
      <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
        <path d="M4 16.5 9.2 11l3.2 3.3 5.6-6V12h2V5h-7v2h3.1l-3.7 4-3.2-3.3L2.5 15Z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
      <path d="M12 3a3.5 3.5 0 1 1-3.5 3.5A3.5 3.5 0 0 1 12 3Zm0 8c-3.6 0-6.5 2.3-6.5 5v2h13v-2c0-2.7-2.9-5-6.5-5Z" />
      <path d="M18.5 6h2v2h-2v2h-2V8h-2V6h2V4h2Z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
      <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm5 7.6-5.6 6a1 1 0 0 1-1.5 0l-2.9-3a1 1 0 1 1 1.4-1.4l2.2 2.2 4.9-5.3A1 1 0 0 1 17 9.6Z" />
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
            <li key={item}>
              <span className="htu-owner-check" aria-hidden="true">
                <CheckIcon />
              </span>
              {item}
            </li>
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

export default function HowToUseOwnerPage() {
  return (
    <main className="htu-user-page htu-owner-page">
      <MarketingNavbar />

      <section className="htu-user-hero">
        <span className="htu-user-bg-mark">B</span>
        <p className="htu-user-kicker">UDHEZUES PER PRONAR BIZNESI</p>
        <h1>
          Rrit biznesin tend
          <br />
          me <em>Kos Biz</em>
        </h1>
        <p>Pese hapa per te regjistruar, promovuar dhe rritur biznesin tend ne platformen tone.</p>
      </section>

      <div className="htu-user-steps">
        <div className="htu-user-wrap">
          {steps.map((step, index) => (
            <StepRow key={step.id} step={step} reverse={index % 2 === 1} />
          ))}
        </div>
      </div>

      <section className="htu-user-cta">
        <h2>Gati per te regjistruar biznesin?</h2>
        <p>Bashkohu me qindra biznese te tjera ne Kosove dhe fillo rritjen tende sot.</p>
        <Link href="/register" className="htu-user-cta-btn">
          REGJISTROHU TANI <span aria-hidden="true">→</span>
        </Link>
      </section>

      <footer className="htu-user-footer" id="contact">
        <div className="htu-user-footer-shell htu-user-footer-grid">
          <div>
            <h3>Contact</h3>
            <p>support@kosbiz.com</p>
            <p>+233 200 000 000</p>
            <p>
              <Link href="/about">About</Link> &nbsp;|&nbsp; <Link href="/terms">Terms</Link> &nbsp;|&nbsp;{" "}
              <Link href="/terms#privacy">Privacy</Link>
            </p>
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
