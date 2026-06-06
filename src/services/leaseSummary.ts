import type { MoveInSummary } from '@/types/models';

const MS_PER_DAY = 24 * 60 * 60 * 1000;

/**
 * Resolve the effective lease end date (SPEC §13).
 * An explicitly entered leaseEndDate always wins; otherwise derive it from
 * moveInDate + leaseDurationMonths. Returns { value, derived } or null.
 */
export function resolveLeaseEndDate(
  summary: MoveInSummary,
): { value: number; derived: boolean } | null {
  if (summary.leaseEndDate != null) {
    return { value: summary.leaseEndDate, derived: false };
  }
  if (summary.moveInDate != null && summary.leaseDurationMonths != null) {
    const start = new Date(summary.moveInDate);
    const end = new Date(start);
    end.setMonth(end.getMonth() + summary.leaseDurationMonths);
    return { value: end.getTime(), derived: true };
  }
  return null;
}

/** Validation warnings (non-blocking — figures may be entered out of order offline). */
export function validateSummary(summary: MoveInSummary): string[] {
  const warnings: string[] = [];
  if (summary.securityDeposit != null && summary.securityDeposit < 0) {
    warnings.push('Security deposit cannot be negative.');
  }
  if (summary.monthlyRent != null && summary.monthlyRent < 0) {
    warnings.push('Monthly rent cannot be negative.');
  }
  const end = resolveLeaseEndDate(summary);
  if (summary.moveInDate != null && end && end.value < summary.moveInDate) {
    warnings.push('Lease end date is before the move-in date.');
  }
  return warnings;
}

/** Day offsets (before lease end) at which to fire pre-lease reminders (SPEC §14). */
export const PRE_LEASE_REMINDER_OFFSETS_DAYS = [30, 7, 0];

/** Compute the scheduled timestamps for pre-lease inspection reminders. */
export function preLeaseReminderTimes(summary: MoveInSummary): number[] {
  const end = resolveLeaseEndDate(summary);
  if (!end) return [];
  return PRE_LEASE_REMINDER_OFFSETS_DAYS.map(
    (days) => end.value - days * MS_PER_DAY,
  );
}
