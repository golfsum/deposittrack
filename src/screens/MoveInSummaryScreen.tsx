import { useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import {
  PRE_LEASE_REMINDER_OFFSETS_DAYS,
  preLeaseReminderTimes,
  resolveLeaseEndDate,
  validateSummary,
} from '@/services/leaseSummary';
import type { MoveInSummary } from '@/types/models';
import { colors, radius, spacing } from '@/theme';

// Parse a YYYY-MM-DD string into epoch ms (local), or undefined.
function parseDate(s: string): number | undefined {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s.trim());
  if (!m) return undefined;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return Number.isNaN(d.getTime()) ? undefined : d.getTime();
}

function fmtDate(ms?: number): string {
  if (ms == null) return '—';
  return new Date(ms).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function fmtCurrency(n?: number): string {
  if (n == null) return '—';
  return n.toLocaleString(undefined, { style: 'currency', currency: 'USD' });
}

function toNumber(s: string): number | undefined {
  const n = Number(s.replace(/[^0-9.]/g, ''));
  return s.trim() === '' || Number.isNaN(n) ? undefined : n;
}

/**
 * Working Move-In Summary form (SPEC §13). Lives at the lease level; here it is
 * local state for demonstration — wire `summary` to Firestore via a leases service.
 */
export function MoveInSummaryScreen() {
  const [deposit, setDeposit] = useState('');
  const [rent, setRent] = useState('');
  const [moveIn, setMoveIn] = useState('');
  const [duration, setDuration] = useState('');
  const [endDate, setEndDate] = useState('');

  const summary: MoveInSummary = useMemo(
    () => ({
      securityDeposit: toNumber(deposit),
      monthlyRent: toNumber(rent),
      moveInDate: parseDate(moveIn),
      leaseDurationMonths: toNumber(duration),
      leaseEndDate: parseDate(endDate),
    }),
    [deposit, rent, moveIn, duration, endDate],
  );

  const resolvedEnd = resolveLeaseEndDate(summary);
  const warnings = validateSummary(summary);
  const reminders = preLeaseReminderTimes(summary);

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={{ padding: spacing.lg, gap: spacing.md }}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.heading}>Move-In Summary</Text>
      <Text style={styles.help}>
        All fields optional. Entered once per lease and shown on every report.
      </Text>

      <Field label="Security Deposit">
        <TextInput
          style={styles.input}
          placeholder="0.00"
          placeholderTextColor={colors.textMuted}
          keyboardType="decimal-pad"
          value={deposit}
          onChangeText={setDeposit}
          accessibilityLabel="Security deposit amount"
        />
      </Field>

      <Field label="Monthly Rent">
        <TextInput
          style={styles.input}
          placeholder="0.00"
          placeholderTextColor={colors.textMuted}
          keyboardType="decimal-pad"
          value={rent}
          onChangeText={setRent}
          accessibilityLabel="Monthly rent amount"
        />
      </Field>

      <Field label="Move-In Date (YYYY-MM-DD)">
        <TextInput
          style={styles.input}
          placeholder="2026-06-01"
          placeholderTextColor={colors.textMuted}
          autoCapitalize="none"
          value={moveIn}
          onChangeText={setMoveIn}
          accessibilityLabel="Move-in date"
        />
      </Field>

      <Field label="Lease Duration (months)">
        <TextInput
          style={styles.input}
          placeholder="12"
          placeholderTextColor={colors.textMuted}
          keyboardType="number-pad"
          value={duration}
          onChangeText={setDuration}
          accessibilityLabel="Lease duration in months"
        />
      </Field>

      <Field label="Lease End Date (optional — overrides derived)">
        <TextInput
          style={styles.input}
          placeholder="leave blank to derive"
          placeholderTextColor={colors.textMuted}
          autoCapitalize="none"
          value={endDate}
          onChangeText={setEndDate}
          accessibilityLabel="Lease end date"
        />
      </Field>

      {warnings.map((w) => (
        <Text key={w} style={styles.warning}>
          ⚠ {w}
        </Text>
      ))}

      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Summary</Text>
        <Row label="Security Deposit" value={fmtCurrency(summary.securityDeposit)} />
        <Row label="Monthly Rent" value={fmtCurrency(summary.monthlyRent)} />
        <Row label="Move-In Date" value={fmtDate(summary.moveInDate)} />
        <Row
          label="Lease End Date"
          value={
            resolvedEnd
              ? `${fmtDate(resolvedEnd.value)}${resolvedEnd.derived ? ' (derived)' : ''}`
              : '—'
          }
        />
      </View>

      {reminders.length > 0 && (
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Pre-lease inspection reminders</Text>
          {reminders.map((t, i) => (
            <Row
              key={t}
              label={
                PRE_LEASE_REMINDER_OFFSETS_DAYS[i] === 0
                  ? 'Day of lease end'
                  : `${PRE_LEASE_REMINDER_OFFSETS_DAYS[i]} days before`
              }
              value={fmtDate(t)}
            />
          ))}
          <Text style={styles.help}>
            Sent to the landlord / property manager (SPEC §5, §14).
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <View style={{ gap: spacing.xs }}>
      <Text style={styles.label}>{label}</Text>
      {children}
    </View>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  heading: { fontSize: 22, fontWeight: '800', color: colors.text },
  help: { fontSize: 13, color: colors.textMuted, lineHeight: 18 },
  label: { fontSize: 14, fontWeight: '600', color: colors.text },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.surface,
  },
  warning: { color: colors.warning, fontSize: 13 },
  summaryCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.xs,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  rowLabel: { fontSize: 14, color: colors.textMuted },
  rowValue: { fontSize: 14, fontWeight: '600', color: colors.text },
});
