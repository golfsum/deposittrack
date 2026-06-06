import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '@/auth/AuthContext';
import { subscribeInspections } from '@/services/inspections';
import type { Inspection } from '@/types/models';
import type { InspectionStackScreen } from '@/navigation/types';
import { colors, radius, spacing } from '@/theme';

const STATUS_COLOR: Record<string, string> = {
  draft: colors.textMuted,
  in_progress: colors.accent,
  awaiting_signatures: colors.warning,
  completed: colors.success,
};

type Row = Inspection & { propertyLabel: string };

export function InspectionsListScreen({
  navigation,
}: InspectionStackScreen<'InspectionsList'>) {
  const { user } = useAuth();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const unsub = subscribeInspections(user.uid, (data) => {
      setRows(data);
      setLoading(false);
    });
    return unsub;
  }, [user]);

  return (
    <View style={styles.screen}>
      {loading ? (
        <ActivityIndicator
          style={{ marginTop: spacing.xl }}
          color={colors.primary}
        />
      ) : (
        <FlatList
          contentContainerStyle={{ padding: spacing.lg, gap: spacing.sm }}
          data={rows}
          keyExtractor={(r) => r.id}
          ListEmptyComponent={
            <Text style={styles.empty}>
              No inspections yet. Tap “New inspection” to start.
            </Text>
          }
          renderItem={({ item }) => {
            const photoCount = item.rooms.reduce(
              (n, r) => n + r.photos.length,
              0,
            );
            return (
              <Pressable
                style={styles.card}
                onPress={() =>
                  navigation.navigate('InspectionDetail', { id: item.id })
                }
              >
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardTitle}>{item.propertyLabel}</Text>
                  <Text style={styles.cardMeta}>
                    {item.type.replace('_', '-')} · {item.rooms.length} rooms ·{' '}
                    {photoCount} photos
                  </Text>
                </View>
                <View
                  style={[
                    styles.badge,
                    { backgroundColor: STATUS_COLOR[item.status] },
                  ]}
                >
                  <Text style={styles.badgeText}>
                    {item.status.replace('_', ' ')}
                  </Text>
                </View>
              </Pressable>
            );
          }}
        />
      )}

      <Pressable
        style={styles.fab}
        onPress={() => navigation.navigate('NewInspection')}
        accessibilityLabel="New inspection"
      >
        <Ionicons name="add" size={28} color={colors.white} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  empty: {
    textAlign: 'center',
    color: colors.textMuted,
    marginTop: spacing.xl,
    fontSize: 15,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  cardTitle: { fontSize: 16, fontWeight: '700', color: colors.text },
  cardMeta: { fontSize: 13, color: colors.textMuted, marginTop: 2 },
  badge: { borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 },
  badgeText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  fab: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
});
