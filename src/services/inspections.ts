import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';

import { db } from '@/lib/firebase';
import { newId } from '@/lib/ids';
import type { RoomTemplate } from '@/data/checklists';
import type {
  Inspection,
  InspectionStatus,
  InspectionType,
  Room,
} from '@/types/models';

const COLLECTION = 'inspections';

function roomFromTemplate(t: RoomTemplate): Room {
  return {
    id: newId(),
    name: t.name,
    checklist: t.checklist,
    photographedItems: [],
    photos: [],
  };
}

/** Create a new inspection document. Returns the new id. */
export async function createInspection(params: {
  ownerId: string;
  propertyLabel: string;
  type: InspectionType;
  templates: RoomTemplate[];
  scheduledFor?: number;
}): Promise<string> {
  const id = newId();
  const now = Date.now();
  const inspection: Inspection = {
    id,
    propertyId: '',
    leaseId: '',
    ownerId: params.ownerId,
    type: params.type,
    status: 'in_progress',
    rooms: params.templates.map(roomFromTemplate),
    signatures: [],
    collaborators: [],
    scheduledFor: params.scheduledFor,
    createdAt: now,
    updatedAt: now,
    syncStatus: 'sync_pending',
  };
  // Stored alongside a denormalised propertyLabel so the web dashboard can list
  // inspections without a join.
  await setDoc(doc(db, COLLECTION, id), {
    ...inspection,
    propertyLabel: params.propertyLabel,
  });
  return id;
}

/** Live list of inspections owned by a user (newest first). */
export function subscribeInspections(
  ownerId: string,
  onData: (rows: (Inspection & { propertyLabel: string })[]) => void,
): () => void {
  const q = query(
    collection(db, COLLECTION),
    where('ownerId', '==', ownerId),
    orderBy('createdAt', 'desc'),
  );
  return onSnapshot(q, (snap) => {
    onData(
      snap.docs.map((d) => d.data() as Inspection & { propertyLabel: string }),
    );
  });
}

/** Live single inspection. */
export function subscribeInspection(
  id: string,
  onData: (insp: (Inspection & { propertyLabel: string }) | null) => void,
): () => void {
  return onSnapshot(doc(db, COLLECTION, id), (snap) => {
    onData(
      snap.exists()
        ? (snap.data() as Inspection & { propertyLabel: string })
        : null,
    );
  });
}

export async function updateRooms(id: string, rooms: Room[]): Promise<void> {
  await updateDoc(doc(db, COLLECTION, id), {
    rooms,
    updatedAt: Date.now(),
    syncStatus: 'fully_synced',
  });
}

export async function setStatus(
  id: string,
  status: InspectionStatus,
): Promise<void> {
  await updateDoc(doc(db, COLLECTION, id), {
    status,
    updatedAt: Date.now(),
    ...(status === 'completed' ? { completedAt: Date.now() } : {}),
  });
}
