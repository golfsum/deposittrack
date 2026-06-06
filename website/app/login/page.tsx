"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";

import { getFirebaseAuth } from "@/lib/firebase";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function run(fn: () => Promise<unknown>) {
    setError(null);
    setBusy(true);
    try {
      await fn();
      router.push("/dashboard");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Sign-in failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="auth-wrap">
      <div className="auth-card">
        <Link href="/" className="brand" style={{ marginBottom: 8 }}>
          🛡️ DepositTrack
        </Link>
        <h1 className="auth-title">
          {mode === "signin" ? "Sign in to your dashboard" : "Create your account"}
        </h1>

        <label className="auth-label" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          className="auth-input"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label className="auth-label" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          className="auth-input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="auth-error">{error}</p>}

        <button
          className="btn btn-primary"
          style={{ width: "100%", marginTop: 8 }}
          disabled={busy}
          onClick={() =>
            run(() =>
              mode === "signin"
                ? signInWithEmailAndPassword(getFirebaseAuth(), email.trim(), password)
                : createUserWithEmailAndPassword(getFirebaseAuth(), email.trim(), password),
            )
          }
        >
          {busy ? "Please wait…" : mode === "signin" ? "Sign In" : "Create Account"}
        </button>

        <button
          className="auth-toggle"
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
        >
          {mode === "signin"
            ? "Need an account? Sign up"
            : "Already have an account? Sign in"}
        </button>

        <div className="auth-divider">
          <span />
          <em>or</em>
          <span />
        </div>

        <button
          className="btn btn-secondary"
          style={{ width: "100%" }}
          disabled={busy}
          onClick={() =>
            run(() => signInWithPopup(getFirebaseAuth(), new GoogleAuthProvider()))
          }
        >
          Continue with Google
        </button>
      </div>
    </main>
  );
}
