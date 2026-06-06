// Dynamic Expo config for DepositTrack.
// Reads environment variables (EXPO_PUBLIC_* are also bundled into the JS app).
// Firebase web config + Google OAuth client IDs are supplied via env so no secrets
// live in source control. See .env.example.

const iosGoogleClientId = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID || '';
const easProjectId = process.env.EXPO_PUBLIC_EAS_PROJECT_ID || '00000000-0000-0000-0000-000000000000';
const appleTeamId = process.env.APPLE_TEAM_ID || '';

// Google Sign-In on iOS needs a reversed-client-id URL scheme registered.
function reversedClientId(clientId) {
  if (!clientId) return null;
  return clientId.split('.').reverse().join('.');
}
const iosReversedClientId = reversedClientId(iosGoogleClientId);

module.exports = function (env) {
  const config = env.config;

  const urlTypes = [];
  if (iosReversedClientId) {
    urlTypes.push({ CFBundleURLSchemes: [iosReversedClientId] });
  }

  return {
    ...config,
    name: 'DepositTrack',
    slug: 'deposittrack',
    scheme: 'deposittrack',
    version: '1.0.0',
    orientation: 'portrait',
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.deposittrack.app',
      buildNumber: '1',
      ...(appleTeamId ? { appleTeamId } : {}),
      usesAppleSignIn: true,
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
        NSCameraUsageDescription:
          'DepositTrack uses the camera to photograph property conditions during inspections.',
        NSPhotoLibraryUsageDescription:
          'DepositTrack uses your photo library to attach existing photos to inspections.',
        NSLocationWhenInUseUsageDescription:
          'DepositTrack records GPS location to verify where inspection photos were taken.',
        ...(urlTypes.length > 0 ? { CFBundleURLTypes: urlTypes } : {}),
      },
    },
    android: {
      package: 'com.deposittrack.app',
      softwareKeyboardLayoutMode: 'pan',
      adaptiveIcon: {
        backgroundColor: '#0E7C66',
      },
      permissions: [
        'android.permission.CAMERA',
        'android.permission.READ_EXTERNAL_STORAGE',
        'android.permission.WRITE_EXTERNAL_STORAGE',
        'android.permission.ACCESS_FINE_LOCATION',
        'android.permission.ACCESS_COARSE_LOCATION',
      ],
    },
    web: {
      bundler: 'metro',
      output: 'single',
    },
    extra: {
      ...(config.extra || {}),
      eas: {
        ...((config.extra && config.extra.eas) || {}),
        projectId: easProjectId,
      },
    },
    plugins: [
      [
        'expo-image-picker',
        {
          photosPermission:
            'DepositTrack uses your photos to attach existing images to inspections.',
          cameraPermission:
            'DepositTrack uses the camera to photograph property conditions.',
        },
      ],
      [
        'expo-location',
        {
          locationWhenInUsePermission:
            'DepositTrack records GPS location to verify inspection photos.',
        },
      ],
      'expo-notifications',
      'expo-apple-authentication',
      'expo-web-browser',
      '@react-native-community/datetimepicker',
      'expo-font',
    ],
  };
};
