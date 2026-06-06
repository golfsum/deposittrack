"use client";

import { useState } from "react";

import { useInspections } from "@/lib/useInspections";
import {
  STATUS_COLOR,
  STATUS_LABEL,
  TYPE_LABEL,
  type InspectionStatus,
} from "@/lib/types";

function fmt(ms?: number) {
  if (!ms) return "—";
  return new Date(ms).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const FILTERS: { key: InspectionStatus | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "in_progress", label: "In progress" },
  { key: "awaiting_signatures", label: "Pending signatures" },
  { key: "completed", label: "Completed" },
  { key: "draft", label: "Draft" },
];

export default function InspectionsPage() {
  const { rows, loading, error } = useInspections();
  const [filter, setFilter] = useState<InspectionStatus | "all">("all");

  const filtered = filter === "all" ? rows : rows.filter((r) => r.status === filter);

  return (
    <div>
      <h1 className="dash-h1">Inspections</h1>

      {error && <p className="auth-error">{error}</p>}

      <div className="filters">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            className={`filter-chip${filter === f.key ? " active" : ""}`}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="panel">
        {loading ? (
          <p className="muted">Loading…</p>
        ) : filtered.length === 0 ? (
          <p className="muted">
            No inspections{filter !== "all" ? " in this status" : ""}. Inspections
            created in the mobile app sync here automatically.
          </p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Property</th>
                <th>Type</th>
                <th>Status</th>
                <th>Inspector</th>
                <th>Scheduled</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id}>
                  <td>
                    <strong>{r.propertyLabel}</strong>
                  </td>
                  <td>{TYPE_LABEL[r.type]}</td>
                  <td>
                    <span
                      className="badge"
                      style={{ background: STATUS_COLOR[r.status] }}
                    >
                      {STATUS_LABEL[r.status]}
                    </span>
                  </td>
                  <td className="muted">{r.assignedInspectorName ?? "—"}</td>
                  <td className="muted">{fmt(r.scheduledFor)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
