import { useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '@/auth/AuthContext';
import { ROOM_TEMPLATES } from '@/data/checklists';
import { createInspection } from '@/services/inspections';
import { logAudit } from '@/services/audit';
import type { InspectionType } from '@/types/models';
import type { InspectionStackScreen } from '@/navigation/types';
import { colors, radius, spacing } from '@/theme';

const TYPES: { key: InspectionType; label: string }[] = [
  { key: 'move_in', label: 'Move-in' },
  { key: 'move_out', label: 'Move-out' },
  { key: 'interim', label: 'Interim' },
];

export function NewInspectionScreen({
  navigation,
}: InspectionStackScreen<'NewInspection'>) {
  const { user, requireSignIn } = useAuth();
  const [label, setLabel] = useState('');
  const [type, setType] = useState<InspectionType>('move_in');
  const [selected, setSelected] = useState<Set<string>>(
    () => new Set(ROOM_TEMPLATES.map((t) => t.name)),
  );
  const [busy, setBusy] = useState(false);

  function toggle(name: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });
  }

  async function create() {
    if (!user) {
      Alert.alert(
        'Sign in to save',
        'Create a free account to save inspections and generate reports.',
        [
          { text: 'Not now', style: 'cancel' },
          { text: 'Sign in', onPress: () => requireSignIn() },
        ],
      );
      return;
    }
    if (!label.trim()) {
      Alert.alert('Add a property', 'Enter a property name or address.');
      return;
    }
    setBusy(true);
    try {
      const templates = ROOM_TEMPLATES.filter((t) => selected.has(t.name));
      const id = await createInspection({
        ownerId: user.uid,
        propertyLabel: label.trim(),
        type,
        templates,
      });
      await logAudit({
        inspectionId: id,
        userId: user.uid,
        userName: user.displayName ?? user.email ?? 'User',
        action: 'inspection_created',
        detail: `created a ${type.replace('_', '-')} inspection for ${label.trim()}`,
      });
      navigation.replace('InspectionDetail', { id });
    } catch (e) {
      Alert.alert('Could not create', e instanceof Error ? e.message : 'Try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={{ padding: spacing.lg, gap: spacing.md }}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.label}>Property name or address</Text>
      <TextInput
        style={styles.input}
        placeholder="123 Main St, Unit 4"
        placeholderTextColor={colors.textMuted}
        value={label}
        onChangeText={setLabel}
        accessibilityLabel="Property name or address"
      />

      <Text style={styles.label}>Inspection type</Text>
      <View style={styles.segment}>
        {TYPES.map((t) => (
          <Pressable
            key={t.key}
            style={[styles.segmentBtn, type === t.key && styles.segmentActive]}
            onPress={() => setType(t.key)}
          >
            <Text
              style={[
                styles.segmentText,
                type === t.key && styles.segmentTextActive,
              ]}
            >
              {t.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.label}>Rooms to include</Text>
      <Text style={styles.help}>
        Each room comes with a guided checklist (SPEC §3). You can add more later.
      </Text>
      {ROOM_TEMPLATES.map((t) => {
        const on = selected.has(t.name);
        return (
          <Pressable
            key={t.name}
            style={styles.roomRow}
            onPress={() => toggle(t.name)}
          >
            <Ionicons
              name={on ? 'checkbox' : 'square-outline'}
              size={22}
              color={on ? colors.primary : colors.textMuted}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.roomName}>{t.name}</Text>
              <Text style={styles.roomItems}>{t.checklist.join(' · ')}</Text>
            </View>
          </Pressable>
        );
      })}

      <Pressable
        style={[styles.createBtn, busy && { opacity: 0.6 }]}
        disabled={busy}
        onPress={create}
      >
        <Text style={styles.createText}>
          {busy ? 'Creating…' : 'Create inspection'}
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  label: { fontSize: 15, fontWeight: '700', color: colors.text },
  help: { fontSize: 13, color: colors.textMuted, marginTop: -spacing.xs },
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
  segment: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  segmentBtn: { flex: 1, paddingVertical: 12, alignItems: 'center' },
  segmentActive: { backgroundColor: colors.primary },
  segmentText: { fontWeight: '600', color: colors.textMuted },
  segmentTextActive: { color: colors.white },
  roomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  roomName: { fontSize: 15, fontWeight: '600', color: colors.text },
  roomItems: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  createBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  createText: { color: colors.white, fontSize: 16, fontWeight: '700' },
});
