"use client";

import {
  collection,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";

import { getDb } from "./firebase";
import type { Inspection } from "./types";

/**
 * Subscribe to the `inspections` collection in real time. Returns an unsubscribe
 * function. Documents are mapped defensively so missing fields don't crash the UI.
 */
export function subscribeInspections(
  onData: (rows: Inspection[]) => void,
  onError?: (e: unknown) => void,
): () => void {
  const q = query(collection(getDb(), "inspections"), orderBy("createdAt", "desc"));
  return onSnapshot(
    q,
    (snap) => {
      const rows: Inspection[] = snap.docs.map((d) => {
        const data = d.data() as Record<string, unknown>;
        return {
          id: d.id,
          propertyLabel: (data.propertyLabel as string) ?? "Untitled property",
          type: (data.type as Inspection["type"]) ?? "move_in",
          status: (data.status as Inspection["status"]) ?? "draft",
          assignedInspectorName: data.assignedInspectorName as string | undefined,
          scheduledFor: data.scheduledFor as number | undefined,
          completedAt: data.completedAt as number | undefined,
          createdAt: (data.createdAt as number) ?? 0,
        };
      });
      onData(rows);
    },
    (err) => onError?.(err),
  );
}
