import Link from "next/link";
import "./about.css";
import MarketingNavbar from "@/components/MarketingNavbar";
import heroMainImage from "@/src/assets/image (7).jpg";
import marketImage from "@/src/assets/image (2).jpg";

const featureItems = [
  {
    id: "01",
    title: "Lidhim me mundësitë",
    text: "Ndihmojmë bizneset të lidhen me klientët, partnerët dhe komunitetin e duhur.",
    icon: "⌁",
  },
  {
    id: "02",
    title: "Platformë e thjeshtë",
    text: "Gjej, promovoi dhe zgjero biznesin tënd lehtësisht me platformën tonë të azhurnuar.",
    icon: "⚡",
  },
  {
    id: "03",
    title: "Rritje dhe sukses",
    text: "Transformojmë idetë në mundësi reale dhe histori frymëzuese.",
    icon: "↗",
  },
];

export default function AboutPage() {
  return (
    <main className="ab-page">
      <MarketingNavbar />

      <section className="ab-hero">
        <span className="ab-bg-letter">Q</span>
        <div className="ab-hero-copy">
          <p className="ab-kicker">RRETH NESH</p>
          <h1>
            Rreth
            <br />
            <em>Kos Biz</em>
          </h1>
          <p>
            Kos Biz është platforma që lidh bizneset e Kosovës me mundësitë reale për rritje dhe sukses. Qoftë një
            start-up kreativ, një kompani tradicionale apo një shërbim unik lokal, ne ofrojmë një vend ku çdo biznes
            mund të gjendet, të lidhet dhe të zhvillohet.
          </p>
        </div>

        <div className="ab-hero-media">
          <img className="ab-main-image" src={heroMainImage.src} alt="KosBiz mission" />
          <article className="ab-mission-card">
            <p>MISIONI YNË</p>
            <span>Lidhim çdo biznes me mundësinë e duhur për rritje.</span>
          </article>
        </div>
      </section>

      <section className="ab-dark-features">
        <div className="ab-wrap">
          <p className="ab-kicker">PIKAT KRYESORE</p>
          <h2>
            Çfarë na bën të
            <br />
            <em>veçantë.</em>
          </h2>

          <div className="ab-features-grid">
            {featureItems.map((item) => (
              <article key={item.id} className="ab-feature-card">
                <div className="ab-feature-top">
                  <span>{item.id}</span>
                  <i>{item.icon}</i>
                </div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="ab-split">
        <img src={marketImage.src} alt="Kosovo market" />
        <div className="ab-split-copy">
          <p className="ab-kicker">PËRMBYLLJE</p>
          <h2>
            Partneri juaj drejt
            <br />
            <em>rritjes.</em>
          </h2>
          <p>
            Me Kos Biz, çdo biznes ka një hapësirë për të rritur ndikimin, për të krijuar lidhje dhe për të shndërruar
            çdo ide në sukses të prekshëm. Ne nuk jemi thjesht një platformë, jemi partneri juaj drejt rritjes.
          </p>
          <Link href="/homepage" className="ab-cta">
            EKSPLORO BIZNESET <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

      <footer className="ab-footer" id="contact">
        <div className="ab-footer-shell ab-footer-grid">
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
            <div className="ab-footer-brand">
              <span>K</span>
              <strong>KosBiz</strong>
            </div>
            <p>Your trusted Kosovo business directory. Discover local businesses fast.</p>
          </div>
        </div>

        <div className="ab-copyright">© 2026 KosBiz. All rights reserved.</div>
      </footer>
    </main>
  );
}
