// Dashboard-facing subset of the shared domain model. Kept in sync with the app's
// src/types/models.ts (the two projects are intentionally independent).

export type InspectionType = "move_in" | "move_out" | "interim";

export type InspectionStatus =
  | "draft"
  | "in_progress"
  | "awaiting_signatures"
  | "completed";

export interface Inspection {
  id: string;
  propertyLabel: string;
  type: InspectionType;
  status: InspectionStatus;
  assignedInspectorName?: string;
  scheduledFor?: number; // epoch ms
  completedAt?: number;
  createdAt: number;
}

export const STATUS_LABEL: Record<InspectionStatus, string> = {
  draft: "Draft",
  in_progress: "In progress",
  awaiting_signatures: "Pending signatures",
  completed: "Completed",
};

export const STATUS_COLOR: Record<InspectionStatus, string> = {
  draft: "#5B6770",
  in_progress: "#1273D4",
  awaiting_signatures: "#B7791F",
  completed: "#1E8E5A",
};

export const TYPE_LABEL: Record<InspectionType, string> = {
  move_in: "Move-in",
  move_out: "Move-out",
  interim: "Interim",
};
