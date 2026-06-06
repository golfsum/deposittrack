import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '@/auth/AuthContext';
import { colors, radius, spacing } from '@/theme';

export function DashboardScreen() {
  const { user, signOut } = useAuth();

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={{ padding: spacing.lg, gap: spacing.md }}
    >
      <Text style={styles.greeting}>
        Welcome{user?.displayName ? `, ${user.displayName}` : ''}
      </Text>
      <Text style={styles.email}>{user?.email}</Text>

      <View style={styles.card}>
        <Ionicons name="camera-outline" size={24} color={colors.primary} />
        <Text style={styles.cardTitle}>Start a new inspection</Text>
        <Text style={styles.cardBody}>
          Take photos, capture conditions, add signatures — works offline.
        </Text>
      </View>

      <View style={styles.card}>
        <Ionicons name="document-text-outline" size={24} color={colors.primary} />
        <Text style={styles.cardTitle}>Move-In Summary</Text>
        <Text style={styles.cardBody}>
          Record deposit, rent and lease dates once per lease — shared across
          move-in and move-out reports.
        </Text>
      </View>

      <Pressable style={styles.signOut} onPress={() => signOut()}>
        <Ionicons name="log-out-outline" size={20} color={colors.danger} />
        <Text style={styles.signOutText}>Sign out</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  greeting: { fontSize: 24, fontWeight: '800', color: colors.text },
  email: { fontSize: 14, color: colors.textMuted, marginTop: -spacing.sm },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTitle: { fontSize: 17, fontWeight: '700', color: colors.text },
  cardBody: { fontSize: 14, color: colors.textMuted, lineHeight: 20 },
  signOut: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
  },
  signOutText: { color: colors.danger, fontSize: 16, fontWeight: '600' },
});
