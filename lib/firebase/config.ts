/** Web client config (safe to expose; protect data with Firestore / Storage rules). */
export const firebaseClientConfig = {
  apiKey:
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY ??
    "AIzaSyBmjmLne7PCPI6aEs2ljEWu8m0pSMd6JhI",
  authDomain:
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "sweettreats-b000c.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "sweettreats-b000c",
  storageBucket:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ??
    "sweettreats-b000c.firebasestorage.app",
  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "199725193145",
  appId:
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID ??
    "1:199725193145:web:499fcb785909e8b36d0868",
} as const;
