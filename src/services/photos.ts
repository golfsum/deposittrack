import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

import { newId } from '@/lib/ids';
import { storage } from '@/lib/firebase';

/**
 * Upload a local photo (file:// or blob URI) to Firebase Storage and return the
 * storage path + download URL. Photos are namespaced by inspection so security
 * rules can scope access (see storage.rules).
 */
export async function uploadInspectionPhoto(params: {
  inspectionId: string;
  roomId: string;
  localUri: string;
}): Promise<{ storagePath: string; downloadUrl: string }> {
  const { inspectionId, roomId, localUri } = params;

  // fetch() works for file://, content://, and blob: URIs across web + native.
  const response = await fetch(localUri);
  const blob = await response.blob();

  const storagePath = `inspections/${inspectionId}/rooms/${roomId}/${newId()}.jpg`;
  const storageRef = ref(storage, storagePath);

  await uploadBytes(storageRef, blob, { contentType: 'image/jpeg' });
  const downloadUrl = await getDownloadURL(storageRef);

  return { storagePath, downloadUrl };
}

/** Upload a captured signature image to Storage under the inspection. */
export async function uploadSignature(params: {
  inspectionId: string;
  localUri: string;
}): Promise<{ storagePath: string; downloadUrl: string }> {
  const { inspectionId, localUri } = params;
  const response = await fetch(localUri);
  const blob = await response.blob();

  const storagePath = `inspections/${inspectionId}/signatures/${newId()}.png`;
  const storageRef = ref(storage, storagePath);
  await uploadBytes(storageRef, blob, { contentType: 'image/png' });
  const downloadUrl = await getDownloadURL(storageRef);

  return { storagePath, downloadUrl };
}
