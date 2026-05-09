import {
  type Auth,
  GoogleAuthProvider,
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  sendPasswordResetEmail,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  signOut,
  updateProfile,
  type User,
} from "firebase/auth";

import { getFirebaseApp } from "./clientApp";

export function getFirebaseAuth(): Auth {
  const auth = getAuth(getFirebaseApp());
  void setPersistence(auth, browserLocalPersistence);
  return auth;
}

export function mapFirebaseAuthError(err: unknown): string {
  if (err && typeof err === "object" && "code" in err) {
    const code = String((err as { code: string }).code);
    const map: Record<string, string> = {
      "auth/email-already-in-use": "That email is already registered.",
      "auth/invalid-email": "Enter a valid email address.",
      "auth/invalid-credential":
        "Invalid email or password. Check your credentials and try again.",
      "auth/user-not-found": "No account found for that email.",
      "auth/wrong-password": "Incorrect password.",
      "auth/weak-password": "Password should be at least 6 characters.",
      "auth/too-many-requests": "Too many attempts. Try again later.",
      "auth/popup-closed-by-user": "Sign-in was cancelled.",
      "auth/network-request-failed": "Network error. Check your connection.",
    };
    if (map[code]) return map[code];
  }
  return err instanceof Error ? err.message : String(err);
}

export async function signInEmailPassword(email: string, password: string) {
  const auth = getFirebaseAuth();
  await signInWithEmailAndPassword(auth, email, password);
}

export async function signUpEmailPassword(
  email: string,
  password: string,
  displayName: string,
) {
  const auth = getFirebaseAuth();
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  if (displayName.trim()) {
    await updateProfile(cred.user, { displayName: displayName.trim() });
  }
}

export async function signInWithGooglePopup() {
  const auth = getFirebaseAuth();
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  await signInWithPopup(auth, provider);
}

/** Useful when popups are blocked (mobile / embedded browsers). */
export async function signInWithGoogleRedirect() {
  const auth = getFirebaseAuth();
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  await signInWithRedirect(auth, provider);
}

export async function sendResetEmail(email: string, continueUrl: string) {
  const auth = getFirebaseAuth();
  await sendPasswordResetEmail(auth, email, {
    url: continueUrl,
    handleCodeInApp: false,
  });
}

export function subscribeAuth(
  callback: (user: User | null) => void,
): () => void {
  const auth = getFirebaseAuth();
  return onAuthStateChanged(auth, callback);
}

export async function signOutFirebase(): Promise<void> {
  const auth = getFirebaseAuth();
  await signOut(auth);
}
