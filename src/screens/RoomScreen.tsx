import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '@/auth/AuthContext';
import { logAudit } from '@/services/audit';
import { subscribeInspection, updateRooms } from '@/services/inspections';
import { uploadInspectionPhoto } from '@/services/photos';
import { tryGetGps } from '@/services/location';
import { newId } from '@/lib/ids';
import type {
  Inspection,
  InspectionPhoto,
  Room,
  RoomCondition,
} from '@/types/models';
import type { InspectionStackScreen } from '@/navigation/types';
import { colors, radius, spacing } from '@/theme';

type Insp = Inspection & { propertyLabel: string };

const CONDITIONS: RoomCondition[] = [
  'excellent',
  'good',
  'fair',
  'poor',
  'damaged',
];

export function RoomScreen({
  route,
  navigation,
}: InspectionStackScreen<'Room'>) {
  const { inspectionId, roomId } = route.params;
  const { user } = useAuth();
  const [insp, setInsp] = useState<Insp | null>(null);
  const [busy, setBusy] = useState(false);
  const [notesDraft, setNotesDraft] = useState<string | null>(null);

  useEffect(() => {
    const unsub = subscribeInspection(inspectionId, setInsp);
    return unsub;
  }, [inspectionId]);

  const room = useMemo(
    () => insp?.rooms.find((r) => r.id === roomId) ?? null,
    [insp, roomId],
  );

  useEffect(() => {
    navigation.setOptions({ title: room?.name ?? 'Room' });
  }, [navigation, room?.name]);

  async function persist(updated: Room) {
    if (!insp) return;
    const rooms = insp.rooms.map((r) => (r.id === roomId ? updated : r));
    await updateRooms(inspectionId, rooms);
  }

  async function capture(fromCamera: boolean, checklistItem?: string) {
    if (!room) return;
    setBusy(true);
    try {
      const perm = fromCamera
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) {
        Alert.alert('Permission needed', 'Allow access to add a photo.');
        return;
      }
      const result = fromCamera
        ? await ImagePicker.launchCameraAsync({
            quality: 0.6,
            mediaTypes: ['images'],
          })
        : await ImagePicker.launchImageLibraryAsync({
            quality: 0.6,
            mediaTypes: ['images'],
          });
      if (result.canceled || !result.assets?.[0]) return;

      const localUri = result.assets[0].uri;
      const gps = await tryGetGps();
      const { storagePath, downloadUrl } = await uploadInspectionPhoto({
        inspectionId,
        roomId,
        localUri,
      });

      const photo: InspectionPhoto = {
        id: newId(),
        storagePath,
        downloadUrl,
        roomId,
        order: room.photos.length,
        capturedAt: Date.now(),
        gps: gps ?? undefined,
        checklistItem,
        syncStatus: 'fully_synced',
      };

      const photographedItems = checklistItem
        ? Array.from(new Set([...room.photographedItems, checklistItem]))
        : room.photographedItems;

      await persist({
        ...room,
        photos: [...room.photos, photo],
        photographedItems,
      });

      if (user) {
        await logAudit({
          inspectionId,
          userId: user.uid,
          userName: user.displayName ?? user.email ?? 'User',
          action: 'photo_added',
          detail: `added photo to ${room.name}${checklistItem ? ` (${checklistItem})` : ''}`,
        });
      }
    } catch (e) {
      Alert.alert('Upload failed', e instanceof Error ? e.message : 'Try again.');
    } finally {
      setBusy(false);
    }
  }

  if (!insp || !room) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  const total = room.checklist.length;
  const done = room.photographedItems.length;

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={{ padding: spacing.lg, gap: spacing.md }}
      keyboardShouldPersistTaps="handled"
    >
      {total > 0 && (
        <View style={styles.progress}>
          <Text style={styles.progressText}>
            {done} of {total} items photographed
          </Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${total ? (done / total) * 100 : 0}%` },
              ]}
            />
          </View>
        </View>
      )}

      <View style={styles.captureRow}>
        <Pressable
          style={[styles.captureBtn, busy && { opacity: 0.6 }]}
          disabled={busy}
          onPress={() => capture(true)}
        >
          <Ionicons name="camera" size={20} color={colors.white} />
          <Text style={styles.captureText}>Take photo</Text>
        </Pressable>
        <Pressable
          style={[styles.captureBtnAlt, busy && { opacity: 0.6 }]}
          disabled={busy}
          onPress={() => capture(false)}
        >
          <Ionicons name="images-outline" size={20} color={colors.primary} />
          <Text style={styles.captureTextAlt}>Library</Text>
        </Pressable>
      </View>
      {busy && <Text style={styles.muted}>Uploading…</Text>}

      {/* Condition */}
      <Text style={styles.label}>Condition</Text>
      <View style={styles.conditionRow}>
        {CONDITIONS.map((c) => (
          <Pressable
            key={c}
            style={[
              styles.condBtn,
              room.condition === c && styles.condBtnActive,
            ]}
            onPress={() => persist({ ...room, condition: c })}
          >
            <Text
              style={[
                styles.condText,
                room.condition === c && styles.condTextActive,
              ]}
            >
              {c}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Checklist */}
      {total > 0 && (
        <>
          <Text style={styles.label}>Checklist</Text>
          {room.checklist.map((item) => {
            const photographed = room.photographedItems.includes(item);
            return (
              <View key={item} style={styles.checkRow}>
                <Ionicons
                  name={photographed ? 'checkmark-circle' : 'ellipse-outline'}
                  size={20}
                  color={photographed ? colors.success : colors.textMuted}
                />
                <Text style={styles.checkItem}>{item}</Text>
                <Pressable
                  style={styles.checkCam}
                  disabled={busy}
                  onPress={() => capture(true, item)}
                >
                  <Ionicons name="camera-outline" size={18} color={colors.primary} />
                </Pressable>
              </View>
            );
          })}
        </>
      )}

      {/* Notes */}
      <Text style={styles.label}>Notes</Text>
      <TextInput
        style={styles.notes}
        multiline
        placeholder="Describe any damage or observations…"
        placeholderTextColor={colors.textMuted}
        value={notesDraft ?? room.notes ?? ''}
        onChangeText={setNotesDraft}
        onBlur={() => {
          if (notesDraft !== null && notesDraft !== room.notes) {
            persist({ ...room, notes: notesDraft });
          }
        }}
      />

      {/* Photo grid */}
      {room.photos.length > 0 && (
        <>
          <Text style={styles.label}>Photos ({room.photos.length})</Text>
          <View style={styles.grid}>
            {room.photos.map((p) => (
              <Image
                key={p.id}
                source={{ uri: p.downloadUrl }}
                style={styles.thumb}
                accessibilityLabel={`Photo${p.checklistItem ? ` of ${p.checklistItem}` : ''}`}
              />
            ))}
          </View>
        </>
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
  muted: { color: colors.textMuted, fontSize: 13 },
  label: { fontSize: 15, fontWeight: '700', color: colors.text },
  progress: { gap: spacing.xs },
  progressText: { fontSize: 14, fontWeight: '600', color: colors.text },
  progressBar: {
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
    overflow: 'hidden',
  },
  progressFill: { height: 8, backgroundColor: colors.primary },
  captureRow: { flexDirection: 'row', gap: spacing.sm },
  captureBtn: {
    flex: 1,
    flexDirection: 'row',
    gap: spacing.xs,
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureText: { color: colors.white, fontWeight: '700' },
  captureBtnAlt: {
    flexDirection: 'row',
    gap: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingVertical: 14,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureTextAlt: { color: colors.primary, fontWeight: '700' },
  conditionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  condBtn: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  condBtnActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  condText: { color: colors.textMuted, fontWeight: '600', textTransform: 'capitalize' },
  condTextActive: { color: colors.white },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: 6,
  },
  checkItem: { flex: 1, fontSize: 15, color: colors.text },
  checkCam: {
    padding: 8,
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
  },
  notes: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    minHeight: 90,
    textAlignVertical: 'top',
    fontSize: 15,
    color: colors.text,
    backgroundColor: colors.surface,
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  thumb: {
    width: 96,
    height: 96,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
});
