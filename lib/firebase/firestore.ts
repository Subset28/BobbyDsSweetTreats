import { getFirestore } from "firebase/firestore";

import { getFirebaseApp } from "./clientApp";

/** Firestore instance for client reads/writes (secure with rules in Firebase console). */
export function getFirestoreDb() {
  return getFirestore(getFirebaseApp());
}
