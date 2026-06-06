"use client";

import { useEffect, useState } from "react";

import { subscribeInspections } from "./inspections";
import type { Inspection } from "./types";

export function useInspections() {
  const [rows, setRows] = useState<Inspection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsub = subscribeInspections(
      (data) => {
        setRows(data);
        setLoading(false);
      },
      (e) => {
        setError(e instanceof Error ? e.message : "Failed to load inspections.");
        setLoading(false);
      },
    );
    return unsub;
  }, []);

  return { rows, loading, error };
}
