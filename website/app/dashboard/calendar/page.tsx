"use client";

import { useMemo, useState } from "react";

import { useInspections } from "@/lib/useInspections";
import { STATUS_COLOR, TYPE_LABEL, type Inspection } from "@/lib/types";

type View = "month" | "week" | "day";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function sameDay(ms: number | undefined, d: Date) {
  if (!ms) return false;
  const x = new Date(ms);
  return (
    x.getFullYear() === d.getFullYear() &&
    x.getMonth() === d.getMonth() &&
    x.getDate() === d.getDate()
  );
}

function startOfWeek(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  x.setDate(x.getDate() - x.getDay());
  return x;
}

function addDays(d: Date, n: number) {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}

function EventChip({ insp }: { insp: Inspection }) {
  return (
    <span className="cal-event" style={{ borderLeftColor: STATUS_COLOR[insp.status] }}>
      {insp.propertyLabel}
      <em> · {TYPE_LABEL[insp.type]}</em>
    </span>
  );
}

export default function CalendarPage() {
  const { rows, loading } = useInspections();
  const [view, setView] = useState<View>("month");
  const [anchor, setAnchor] = useState(() => new Date());

  const eventsFor = useMemo(
    () => (d: Date) => rows.filter((r) => sameDay(r.scheduledFor, d)),
    [rows],
  );

  function shift(dir: -1 | 1) {
    const x = new Date(anchor);
    if (view === "month") x.setMonth(x.getMonth() + dir);
    else if (view === "week") x.setDate(x.getDate() + 7 * dir);
    else x.setDate(x.getDate() + dir);
    setAnchor(x);
  }

  const title =
    view === "day"
      ? anchor.toLocaleDateString(undefined, {
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric",
        })
      : anchor.toLocaleDateString(undefined, { month: "long", year: "numeric" });

  return (
    <div>
      <h1 className="dash-h1">Calendar</h1>

      <div className="cal-toolbar">
        <div className="cal-nav">
          <button className="btn btn-secondary btn-sm" onClick={() => shift(-1)}>
            ‹
          </button>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setAnchor(new Date())}
          >
            Today
          </button>
          <button className="btn btn-secondary btn-sm" onClick={() => shift(1)}>
            ›
          </button>
          <strong className="cal-title">{title}</strong>
        </div>
        <div className="cal-views">
          {(["day", "week", "month"] as View[]).map((v) => (
            <button
              key={v}
              className={`cal-view-btn${view === v ? " active" : ""}`}
              onClick={() => setView(v)}
            >
              {v[0].toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {loading && <p className="muted">Loading…</p>}

      {view === "month" && <MonthView anchor={anchor} eventsFor={eventsFor} />}
      {view === "week" && <WeekView anchor={anchor} eventsFor={eventsFor} />}
      {view === "day" && <DayView anchor={anchor} events={eventsFor(anchor)} />}
    </div>
  );
}

function MonthView({
  anchor,
  eventsFor,
}: {
  anchor: Date;
  eventsFor: (d: Date) => Inspection[];
}) {
  const first = new Date(anchor.getFullYear(), anchor.getMonth(), 1);
  const lead = first.getDay();
  const daysInMonth = new Date(
    anchor.getFullYear(),
    anchor.getMonth() + 1,
    0,
  ).getDate();
  const today = new Date();

  const cells: (Date | null)[] = [];
  for (let i = 0; i < lead; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++)
    cells.push(new Date(anchor.getFullYear(), anchor.getMonth(), d));
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div className="cal-month">
      <div className="cal-weekrow">
        {WEEKDAYS.map((w) => (
          <div key={w} className="cal-weekday">
            {w}
          </div>
        ))}
      </div>
      <div className="cal-grid">
        {cells.map((d, i) => (
          <div key={i} className={`cal-cell${d ? "" : " empty"}`}>
            {d && (
              <>
                <span
                  className={`cal-date${sameDay(today.getTime(), d) ? " today" : ""}`}
                >
                  {d.getDate()}
                </span>
                <div className="cal-events">
                  {eventsFor(d)
                    .slice(0, 3)
                    .map((e) => (
                      <EventChip key={e.id} insp={e} />
                    ))}
                  {eventsFor(d).length > 3 && (
                    <span className="muted cal-more">
                      +{eventsFor(d).length - 3} more
                    </span>
                  )}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function WeekView({
  anchor,
  eventsFor,
}: {
  anchor: Date;
  eventsFor: (d: Date) => Inspection[];
}) {
  const start = startOfWeek(anchor);
  const today = new Date();
  const days = Array.from({ length: 7 }, (_, i) => addDays(start, i));

  return (
    <div className="cal-week">
      {days.map((d) => (
        <div key={d.toISOString()} className="cal-weekcol">
          <div
            className={`cal-weekcol-head${sameDay(today.getTime(), d) ? " today" : ""}`}
          >
            {WEEKDAYS[d.getDay()]} {d.getDate()}
          </div>
          <div className="cal-weekcol-body">
            {eventsFor(d).length === 0 ? (
              <span className="muted cal-empty">—</span>
            ) : (
              eventsFor(d).map((e) => <EventChip key={e.id} insp={e} />)
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function DayView({ anchor, events }: { anchor: Date; events: Inspection[] }) {
  return (
    <div className="panel">
      {events.length === 0 ? (
        <p className="muted">No inspections scheduled for this day.</p>
      ) : (
        <ul className="list">
          {events.map((e) => (
            <li key={e.id} className="list-row">
              <div>
                <strong>{e.propertyLabel}</strong>
                <span className="muted"> · {TYPE_LABEL[e.type]}</span>
                {e.assignedInspectorName && (
                  <span className="muted"> · {e.assignedInspectorName}</span>
                )}
              </div>
              <span className="badge" style={{ background: STATUS_COLOR[e.status] }}>
                {e.status.replace("_", " ")}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
