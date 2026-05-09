/** Web client config (safe to expose; protect data with Firestore / Storage rules). */
export const firebaseClientConfig = {
  apiKey:
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY ??
    "AIzaSyB2_4XF8oAxwQd9Hg6XWb1q8QWP6uYSKRE",
  authDomain:
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "clubs-8fcb2.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "clubs-8fcb2",
  storageBucket:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ??
    "clubs-8fcb2.firebasestorage.app",
  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "737809827285",
  appId:
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID ??
    "1:737809827285:web:4e3ba89ef95e20e517695c",
} as const;
