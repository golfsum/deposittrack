// Domain model for DepositTrack. Mirrors SPEC.md.
// All persisted documents live in Firestore; photo binaries live in Firebase Storage.

export type UserRole = 'tenant' | 'landlord' | 'property_manager' | 'inspector';

export type CollaborationMode = 'shared' | 'review_only' | 'comment_only';

export type SyncStatus = 'offline' | 'sync_pending' | 'fully_synced';

export type InspectionType = 'move_in' | 'move_out' | 'interim';

export type InspectionStatus =
  | 'draft'
  | 'in_progress'
  | 'awaiting_signatures'
  | 'completed';

export type RoomCondition = 'excellent' | 'good' | 'fair' | 'poor' | 'damaged';

export interface AppUser {
  id: string;
  email: string;
  displayName: string | null;
  role: UserRole;
  createdAt: number;
}

// --- Property & Lease ----------------------------------------------------

export interface Property {
  id: string;
  ownerId: string; // landlord or property manager
  label: string; // e.g. "123 Main St, Unit 4"
  addressLine1: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  createdAt: number;
}

// The Move-In Summary lives at the lease level (entered once, shared across the
// lease's move-in and move-out inspections). See SPEC.md §13. All fields optional.
export interface MoveInSummary {
  securityDeposit?: number; // currency, minor concerns validated >= 0
  monthlyRent?: number;
  moveInDate?: number; // epoch ms — lease/tenancy start
  leaseDurationMonths?: number; // used to derive leaseEndDate when absent
  leaseEndDate?: number; // explicit end date; wins over derived value
  updatedAt?: number;
}

export interface Lease {
  id: string;
  propertyId: string;
  ownerId: string;
  tenantId?: string;
  tenantName?: string;
  summary: MoveInSummary;
  createdAt: number;
}

// --- Inspection ----------------------------------------------------------

export interface InspectionPhoto {
  id: string;
  storagePath: string; // path in Firebase Storage
  downloadUrl?: string; // resolved when synced
  roomId: string;
  order: number;
  capturedAt: number;
  gps?: { latitude: number; longitude: number };
  checklistItem?: string; // optional checklist item this photo documents
  note?: string;
  syncStatus: SyncStatus;
}

export interface Room {
  id: string;
  name: string; // Kitchen, Bathroom, ...
  condition?: RoomCondition;
  notes?: string;
  checklist: string[]; // guided checklist items (SPEC §3)
  photographedItems: string[]; // checklist items that have a photo
  photos: InspectionPhoto[];
}

export interface Signature {
  id: string;
  storagePath: string; // captured signature image in Storage
  // ESIGN / UETA audit data (SPEC §9)
  signerName: string;
  signerRole: UserRole;
  signerUserId: string;
  signedAt: number;
  ipAddress?: string;
  deviceInfo?: string;
}

export interface Collaborator {
  userId: string;
  role: UserRole;
  mode: CollaborationMode;
  invitedAt: number;
}

export type AuditAction =
  | 'photo_added'
  | 'photo_removed'
  | 'photos_moved'
  | 'note_edited'
  | 'condition_changed'
  | 'comment_added'
  | 'signature_completed'
  | 'report_generated'
  | 'summary_edited'
  | 'inspection_created'
  | 'inspection_shared';

// Immutable activity log entry (SPEC §1 / §9). Never updated, only appended.
export interface AuditEntry {
  id: string;
  inspectionId: string;
  userId: string;
  userName: string;
  action: AuditAction;
  detail: string; // e.g. "added photo to Kitchen"
  timestamp: number;
}

export interface Inspection {
  id: string;
  propertyId: string;
  leaseId: string;
  ownerId: string;
  assignedInspectorId?: string;
  type: InspectionType;
  status: InspectionStatus;
  rooms: Room[];
  signatures: Signature[];
  collaborators: Collaborator[];
  scheduledFor?: number;
  completedAt?: number;
  createdAt: number;
  updatedAt: number;
  syncStatus: SyncStatus;
}

// --- Notifications (SPEC §5 / §14) --------------------------------------

export type NotificationType =
  | 'inspection_assigned'
  | 'inspection_shared'
  | 'inspection_tomorrow'
  | 'inspection_overdue'
  | 'signature_requested'
  | 'signature_completed'
  | 'report_generated'
  | 'upcoming_move_in'
  | 'upcoming_move_out'
  | 'missing_signatures'
  | 'missing_photos'
  | 'lease_ending_soon'; // pre-lease inspection reminder

export interface AppNotification {
  id: string;
  type: NotificationType;
  recipientUserId: string;
  recipientRole: UserRole;
  title: string;
  body: string;
  relatedInspectionId?: string;
  relatedLeaseId?: string;
  scheduledFor: number;
  sent: boolean;
  read: boolean;
  createdAt: number;
}
