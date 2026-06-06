import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '@/auth/AuthContext';
import { logAudit } from '@/services/audit';
import {
  setStatus,
  subscribeInspection,
  updateRooms,
} from '@/services/inspections';
import { newId } from '@/lib/ids';
import type { Inspection, Room } from '@/types/models';
import type { InspectionStackScreen } from '@/navigation/types';
import { colors, radius, spacing } from '@/theme';

type Insp = Inspection & { propertyLabel: string };

export function InspectionDetailScreen({
  route,
  navigation,
}: InspectionStackScreen<'InspectionDetail'>) {
  const { id } = route.params;
  const { user } = useAuth();
  const [insp, setInsp] = useState<Insp | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribeInspection(id, (data) => {
      setInsp(data);
      setLoading(false);
    });
    return unsub;
  }, [id]);

  useEffect(() => {
    navigation.setOptions({ title: insp?.propertyLabel ?? 'Inspection' });
  }, [navigation, insp?.propertyLabel]);

  async function addRoom() {
    if (!insp) return;
    const room: Room = {
      id: newId(),
      name: `Room ${insp.rooms.length + 1}`,
      checklist: [],
      photographedItems: [],
      photos: [],
    };
    await updateRooms(id, [...insp.rooms, room]);
  }

  async function complete() {
    await setStatus(id, 'completed');
    if (user) {
      await logAudit({
        inspectionId: id,
        userId: user.uid,
        userName: user.displayName ?? user.email ?? 'User',
        action: 'report_generated',
        detail: 'marked the inspection complete',
      });
    }
    Alert.alert('Inspection complete', 'It now shows as completed everywhere.');
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }
  if (!insp) {
    return (
      <View style={styles.center}>
        <Text style={styles.muted}>Inspection not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={{ padding: spacing.lg, gap: spacing.sm }}
    >
      <Text style={styles.status}>
        {insp.type.replace('_', '-')} · {insp.status.replace('_', ' ')}
      </Text>

      {insp.rooms.map((room) => {
        const total = room.checklist.length;
        const done = room.photographedItems.length;
        return (
          <Pressable
            key={room.id}
            style={styles.roomCard}
            onPress={() =>
              navigation.navigate('Room', {
                inspectionId: id,
                roomId: room.id,
              })
            }
          >
            <Ionicons name="camera-outline" size={22} color={colors.primary} />
            <View style={{ flex: 1 }}>
              <Text style={styles.roomName}>{room.name}</Text>
              <Text style={styles.roomMeta}>
                {room.photos.length} photos
                {total > 0 ? ` · ${done} of ${total} items photographed` : ''}
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.textMuted}
            />
          </Pressable>
        );
      })}

      <Pressable style={styles.addRoom} onPress={addRoom}>
        <Ionicons name="add" size={20} color={colors.primary} />
        <Text style={styles.addRoomText}>Add room</Text>
      </Pressable>

      {insp.status !== 'completed' && (
        <Pressable style={styles.complete} onPress={complete}>
          <Text style={styles.completeText}>Mark inspection complete</Text>
        </Pressable>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  muted: { color: colors.textMuted },
  status: {
    color: colors.textMuted,
    textTransform: 'capitalize',
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  roomCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  roomName: { fontSize: 16, fontWeight: '700', color: colors.text },
  roomMeta: { fontSize: 13, color: colors.textMuted, marginTop: 2 },
  addRoom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
    borderRadius: radius.lg,
    marginTop: spacing.xs,
  },
  addRoomText: { color: colors.primary, fontWeight: '700', fontSize: 15 },
  complete: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  completeText: { color: colors.white, fontWeight: '700', fontSize: 16 },
});
