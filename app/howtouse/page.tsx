import Link from "next/link";
import "./howtouse.css";

export default function HowToUseSelectorPage() {
  return (
    <main className="htu-page">
      <header className="htu-topbar">
        <a className="htu-brand" href="/homepage">
          <span>K</span>
          <strong>KosBiz</strong>
        </a>

        <nav className="htu-nav">
          <a href="/about">About</a>
          <a href="/how-to-use">How To Use</a>
          <a className="htu-btn htu-btn-outline" href="/login">
            Login
          </a>
          <a className="htu-btn htu-btn-solid" href="/register">
            Signup
          </a>
        </nav>
      </header>

      <section className="htu-hero">
        <span className="htu-bg-mark">?</span>
        <p className="htu-kicker">UDHËZUES</p>
        <h1>
          Si të përdorësh
          <br />
          <em>Kos Biz</em>
        </h1>
        <p className="htu-subtitle">Zgjidh rolin tënd për të parë udhëzuesin e duhur.</p>

        <div className="htu-cards">
          <Link className="htu-card" href="/howtouseuser">
            <span className="htu-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M12 4a4 4 0 1 0 4 4 4 4 0 0 0-4-4Zm0 10c-3.3 0-6 2.1-6 4.7 0 .7.6 1.3 1.3 1.3h9.4c.7 0 1.3-.6 1.3-1.3C18 16.1 15.3 14 12 14Z" />
              </svg>
            </span>
            <h2>Përdorues</h2>
            <p>Mëso si të kërkosh, eksplorosh dhe vlerësosh bizneset më të mira në Kosovë.</p>
            <small>
              UDHËZUES PËR PËRDORUES <span aria-hidden="true">→</span>
            </small>
          </Link>

          <Link className="htu-card" href="/howtouseowner">
            <span className="htu-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M9 6V4.8A2.8 2.8 0 0 1 11.8 2h.4A2.8 2.8 0 0 1 15 4.8V6h3a2 2 0 0 1 2 2v10.2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Zm4-1.2a.8.8 0 0 0-.8-.8h-.4a.8.8 0 0 0-.8.8V6h2Z" />
              </svg>
            </span>
            <h2>Pronar Biznesi</h2>
            <p>Mëso si ta regjistrosh, promovosh dhe rrisësh biznesin tënd në Kos Biz.</p>
            <small>
              UDHËZUES PËR PRONARË <span aria-hidden="true">→</span>
            </small>
          </Link>
        </div>
      </section>

      <footer className="htu-footer">
        <div className="htu-wrap htu-footer-grid">
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
            <p>12 users online</p>
          </div>

          <div>
            <div className="htu-footer-brand">
              <span>K</span>
              <strong>KosBiz</strong>
            </div>
            <p>Your trusted Kosovo business directory. Discover local businesses fast.</p>
          </div>
        </div>
        <div className="htu-copyright">© 2026 KosBiz. All rights reserved.</div>
      </footer>
    </main>
  );
}

