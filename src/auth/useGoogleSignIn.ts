import { useEffect } from 'react';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';

import { auth } from '@/lib/firebase';

// Required so the auth popup/redirect can complete and dismiss the in-app browser.
WebBrowser.maybeCompleteAuthSession();

/**
 * Google sign-in via expo-auth-session, exchanged for a Firebase credential.
 * Returns a `promptAsync` to trigger the flow and a `ready` flag.
 */
export function useGoogleSignIn(onError?: (e: unknown) => void) {
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
  });

  useEffect(() => {
    if (response?.type !== 'success') return;
    const idToken = response.params?.id_token;
    if (!idToken) return;
    const credential = GoogleAuthProvider.credential(idToken);
    signInWithCredential(auth, credential).catch((e) => onError?.(e));
  }, [response, onError]);

  return {
    ready: !!request,
    signInWithGoogle: () => promptAsync(),
  };
}
