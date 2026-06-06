import * as Location from 'expo-location';

/**
 * Best-effort GPS for photo verification (SPEC differentiators). Returns null if
 * permission is denied or location is unavailable — capture should never block.
 */
export async function tryGetGps(): Promise<{
  latitude: number;
  longitude: number;
} | null> {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') return null;
    const pos = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
    return {
      latitude: pos.coords.latitude,
      longitude: pos.coords.longitude,
    };
  } catch {
    return null;
  }
}
