import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { Platform } from 'react-native';
import * as AppleAuthentication from 'expo-apple-authentication';
import {
  OAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithCredential,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  updateProfile,
  type User,
} from 'firebase/auth';

import { auth } from '@/lib/firebase';

interface AuthContextValue {
  user: User | null;
  initializing: boolean;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (
    email: string,
    password: string,
    displayName?: string,
  ) => Promise<void>;
  signInWithApple: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setInitializing(false);
    });
    return unsub;
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      initializing,
      signInWithEmail: async (email, password) => {
        await signInWithEmailAndPassword(auth, email.trim(), password);
      },
      signUpWithEmail: async (email, password, displayName) => {
        const cred = await createUserWithEmailAndPassword(
          auth,
          email.trim(),
          password,
        );
        if (displayName) {
          await updateProfile(cred.user, { displayName });
        }
      },
      signInWithApple: async () => {
        if (Platform.OS !== 'ios') {
          throw new Error('Apple Sign-In is only available on iOS.');
        }
        const credential = await AppleAuthentication.signInAsync({
          requestedScopes: [
            AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
            AppleAuthentication.AppleAuthenticationScope.EMAIL,
          ],
        });
        if (!credential.identityToken) {
          throw new Error('Apple did not return an identity token.');
        }
        const provider = new OAuthProvider('apple.com');
        const firebaseCredential = provider.credential({
          idToken: credential.identityToken,
        });
        const result = await signInWithCredential(auth, firebaseCredential);
        // Apple only returns the name on first sign-in — capture it once.
        const fullName = credential.fullName;
        if (fullName?.givenName && !result.user.displayName) {
          await updateProfile(result.user, {
            displayName: [fullName.givenName, fullName.familyName]
              .filter(Boolean)
              .join(' '),
          });
        }
      },
      signOut: async () => {
        await fbSignOut(auth);
      },
    }),
    [user, initializing],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
