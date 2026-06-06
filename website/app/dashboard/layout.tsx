"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { AuthProvider, useAuth } from "@/lib/auth";

const NAV = [
  { href: "/dashboard", label: "Overview", icon: "▦" },
  { href: "/dashboard/calendar", label: "Calendar", icon: "🗓" },
  { href: "/dashboard/inspections", label: "Inspections", icon: "📋" },
];

function Shell({ children }: { children: React.ReactNode }) {
  const { user, initializing, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!initializing && !user) router.replace("/login");
  }, [initializing, user, router]);

  if (initializing || !user) {
    return <div className="dash-loading">Loading…</div>;
  }

  return (
    <div className="dash">
      <aside className="dash-sidebar">
        <Link href="/" className="brand" style={{ marginBottom: 24 }}>
          🛡️ DepositTrack
        </Link>
        <nav className="dash-nav">
          {NAV.map((item) => {
            const active =
              item.href === "/dashboard"
                ? pathname === item.href
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`dash-nav-item${active ? " active" : ""}`}
              >
                <span aria-hidden>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="dash-user">
          <span className="dash-email">{user.email}</span>
          <button className="dash-signout" onClick={() => signOut()}>
            Sign out
          </button>
        </div>
      </aside>
      <main className="dash-main">{children}</main>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <Shell>{children}</Shell>
    </AuthProvider>
  );
}
