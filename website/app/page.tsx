// DepositTrack marketing homepage. Copy & structure follow SPEC.md §15 (homepage),
// §12 (pricing), §9 (disclaimer), and the competitive differentiators.

const APP_STORE_URL = "https://apps.apple.com/app/deposittrack/id000000000";

const features = [
  {
    ico: "📷",
    title: "Verified photo evidence",
    body: "Every photo is timestamped and GPS-tagged so there's no dispute about when or where it was taken.",
  },
  {
    ico: "📝",
    title: "Move-in & move-out reports",
    body: "Document conditions room by room with guided checklists, then generate a professional PDF in minutes.",
  },
  {
    ico: "✍️",
    title: "Tenant & landlord signatures",
    body: "Capture ESIGN/UETA-compliant signatures with a full audit trail attached to every report.",
  },
  {
    ico: "📶",
    title: "Works offline",
    body: "Inspect anywhere — photos, notes, and signatures sync automatically when you're back online.",
  },
  {
    ico: "🔒",
    title: "Secure cloud storage",
    body: "Encrypted transmission and file storage, access controls, and a complete activity history.",
  },
  {
    ico: "📄",
    title: "Professional PDF reports",
    body: "Downloadable, shareable reports with photos, conditions, signatures, and inspection metadata.",
  },
];

const differentiators = [
  "Verified photos",
  "GPS capture",
  "Timestamp verification",
  "Simple workflow",
  "Tenant participation",
  "Fast report generation",
  "Affordable pricing",
];

const pricing = [
  { tier: "Free", amount: "$0", desc: "1 property · 1 report" },
  { tier: "Single Report", amount: "$4.99", desc: "One inspection report" },
  { tier: "Starter", amount: "$9", per: "/mo", desc: "For a couple of rentals" },
  { tier: "Pro", amount: "$29", per: "/mo", desc: "Growing portfolios", featured: true },
  { tier: "Property Manager", amount: "$99+", per: "/mo", desc: "Teams & inspectors" },
];

export default function Home() {
  return (
    <>
      <header className="site-header">
        <div className="container">
          <div className="brand">🛡️ DepositTrack</div>
          <nav className="nav">
            <a href="#features">Features</a>
            <a href="#pricing">Pricing</a>
            <a href="/login">Sign in</a>
            <a href={APP_STORE_URL} className="btn btn-primary btn-sm">
              Start Free Inspection
            </a>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="hero">
          <div className="container">
            <p className="hero-eyebrow">Take Photos · Generate Reports · Protect Deposits</p>
            <h1>Protect Security Deposits with Verified Photo Evidence</h1>
            <p className="sub">
              Create move-in and move-out inspection reports with photos, signatures,
              GPS verification, and downloadable PDFs.
            </p>
            <div className="hero-cta">
              <a href={APP_STORE_URL} className="btn btn-primary">
                Start Free Inspection
              </a>
              <a href="#demo" className="btn btn-secondary">
                ▶ Watch Demo
              </a>
            </div>
            <p className="tagline">Create move-in and move-out reports in minutes.</p>
          </div>
        </section>

        {/* Features */}
        <section id="features">
          <div className="container">
            <h2 className="section-title">Everything you need to protect a deposit</h2>
            <p className="section-lead">
              Built for landlords, tenants, and property managers — focused on
              inspections and deposit protection, not bloated property management.
            </p>
            <div className="grid">
              {features.map((f) => (
                <div className="card" key={f.title}>
                  <div className="ico" aria-hidden>
                    {f.ico}
                  </div>
                  <h3>{f.title}</h3>
                  <p>{f.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Differentiators */}
        <section id="demo" style={{ background: "var(--surface)" }}>
          <div className="container">
            <h2 className="section-title">Why DepositTrack</h2>
            <p className="section-lead">
              Most apps focus on enterprise portfolios and maintenance. We focus on one
              thing: protecting security deposits with evidence that holds up.
            </p>
            <div className="pills">
              {differentiators.map((d) => (
                <span className="pill" key={d}>
                  {d}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="pricing">
          <div className="container">
            <h2 className="section-title">Simple, fair pricing</h2>
            <p className="section-lead">
              Only have one or two rentals? Pay as you go. Managing more? Pick a plan.
            </p>
            <div className="price-grid">
              {pricing.map((p) => (
                <div
                  className={`price-card${p.featured ? " featured" : ""}`}
                  key={p.tier}
                >
                  <span className="tier">{p.tier}</span>
                  <span className="amount">
                    {p.amount}
                    {p.per ? <small>{p.per}</small> : null}
                  </span>
                  <span className="desc">{p.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA band */}
        <section className="cta-band">
          <div className="container">
            <h2>Protect your next deposit today</h2>
            <a href={APP_STORE_URL} className="btn btn-primary">
              Start Free Inspection
            </a>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container">
          <p className="disclaimer">
            This report is intended to document observable property conditions at the
            time of inspection. It is not a professional appraisal, warranty, code
            inspection, or legal determination.
          </p>
          <div className="footer-row">
            <span>© {new Date().getFullYear()} DepositTrack</span>
            <span>
              <a href="#features">Features</a> · <a href="#pricing">Pricing</a> ·{" "}
              <a href="/privacy">Privacy</a> · <a href="/terms">Terms</a> ·{" "}
              <a href={APP_STORE_URL}>Download</a>
            </span>
          </div>
        </div>
      </footer>
    </>
  );
}
