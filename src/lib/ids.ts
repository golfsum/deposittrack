import * as Crypto from 'expo-crypto';

/** Collision-resistant id for client-generated documents (works offline). */
export function newId(): string {
  return Crypto.randomUUID();
}
