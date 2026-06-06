"use client";

import Link from "next/link";

import { useInspections } from "@/lib/useInspections";
import { STATUS_COLOR, STATUS_LABEL, TYPE_LABEL } from "@/lib/types";

function fmt(ms?: number) {
  if (!ms) return "—";
  return new Date(ms).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function OverviewPage() {
  const { rows, loading, error } = useInspections();

  const now = Date.now();
  const upcoming = rows
    .filter((r) => r.scheduledFor && r.scheduledFor >= now && r.status !== "completed")
    .sort((a, b) => (a.scheduledFor ?? 0) - (b.scheduledFor ?? 0));
  const pendingSignatures = rows.filter((r) => r.status === "awaiting_signatures");
  const completed = rows.filter((r) => r.status === "completed");

  const stats = [
    { label: "Upcoming", value: upcoming.length, color: STATUS_COLOR.in_progress },
    {
      label: "Pending signatures",
      value: pendingSignatures.length,
      color: STATUS_COLOR.awaiting_signatures,
    },
    { label: "Completed", value: completed.length, color: STATUS_COLOR.completed },
    { label: "Total", value: rows.length, color: "#0E7C66" },
  ];

  return (
    <div>
      <h1 className="dash-h1">Overview</h1>

      {error && <p className="auth-error">{error}</p>}

      <div className="stat-grid">
        {stats.map((s) => (
          <div className="stat-card" key={s.label}>
            <span className="stat-value" style={{ color: s.color }}>
              {loading ? "—" : s.value}
            </span>
            <span className="stat-label">{s.label}</span>
          </div>
        ))}
      </div>

      <div className="panel">
        <div className="panel-head">
          <h2>Upcoming inspections</h2>
          <Link href="/dashboard/calendar" className="panel-link">
            View calendar →
          </Link>
        </div>
        {loading ? (
          <p className="muted">Loading…</p>
        ) : upcoming.length === 0 ? (
          <p className="muted">
            No upcoming inspections scheduled. Inspections created in the app appear
            here automatically.
          </p>
        ) : (
          <ul className="list">
            {upcoming.slice(0, 8).map((r) => (
              <li key={r.id} className="list-row">
                <div>
                  <strong>{r.propertyLabel}</strong>
                  <span className="muted"> · {TYPE_LABEL[r.type]}</span>
                </div>
                <div className="list-right">
                  <span
                    className="badge"
                    style={{ background: STATUS_COLOR[r.status] }}
                  >
                    {STATUS_LABEL[r.status]}
                  </span>
                  <span className="muted">{fmt(r.scheduledFor)}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
