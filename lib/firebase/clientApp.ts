import { type FirebaseApp, getApp, getApps, initializeApp } from "firebase/app";

import { firebaseClientConfig } from "./config";

let app: FirebaseApp | undefined;

export function getFirebaseApp(): FirebaseApp {
  if (typeof window === "undefined") {
    throw new Error("Firebase client SDK must run in the browser.");
  }
  if (!app) {
    app = getApps().length ? getApp() : initializeApp(firebaseClientConfig);
  }
  return app;
}
