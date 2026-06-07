import Link from "next/link";

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header className="site-header">
        <div className="container">
          <Link href="/" className="brand">
            🛡️ DepositTrack
          </Link>
          <nav className="nav">
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/" className="btn btn-secondary btn-sm">
              Home
            </Link>
          </nav>
        </div>
      </header>

      <main className="legal container">{children}</main>

      <footer className="site-footer">
        <div className="container">
          <div className="footer-row">
            <span>© 2026 DepositTrack</span>
            <span>
              <Link href="/privacy">Privacy</Link> ·{" "}
              <Link href="/terms">Terms</Link>
            </span>
          </div>
        </div>
      </footer>
    </>
  );
}
