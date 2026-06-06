import { addDoc, collection } from 'firebase/firestore';

import { db } from '@/lib/firebase';
import { newId } from '@/lib/ids';
import type { AuditAction } from '@/types/models';

/**
 * Append an immutable audit entry under inspections/{id}/audit (SPEC §1, §9).
 * Audit docs are create-only per firestore.rules.
 */
export async function logAudit(params: {
  inspectionId: string;
  userId: string;
  userName: string;
  action: AuditAction;
  detail: string;
}): Promise<void> {
  const { inspectionId, ...rest } = params;
  await addDoc(collection(db, 'inspections', inspectionId, 'audit'), {
    id: newId(),
    inspectionId,
    timestamp: Date.now(),
    ...rest,
  });
}
