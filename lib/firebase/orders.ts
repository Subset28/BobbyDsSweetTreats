/**
 * Order storage schema (Cloud Firestore).
 *
 * Path:   users/{uid}/orders/{orderId}
 *
 * Document fields:
 *   createdAt: Timestamp        — server timestamp set on create
 *   status:    "pending" | "paid" | "fulfilled" | "cancelled"
 *   currency:  string            — ISO currency code, e.g. "USD"
 *   total:     number            — total in major units (e.g. 25.99)
 *   items:     OrderItem[]       — line items snapshot from the cart at purchase time
 *
 * Suggested Firestore security rules (paste in Firebase console):
 *
 *   match /databases/{database}/documents {
 *     match /users/{uid}/orders/{orderId} {
 *       allow read:   if request.auth != null && request.auth.uid == uid;
 *       allow create: if request.auth != null && request.auth.uid == uid;
 *       allow update, delete: if false; // server-only via Admin SDK
 *     }
 *   }
 */
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  getDocs,
  type DocumentData,
  type QueryDocumentSnapshot,
} from "firebase/firestore";

import { getFirestoreDb } from "./firestore";

export type OrderStatus = "pending" | "paid" | "fulfilled" | "cancelled";

export type OrderItem = {
  slug: string;
  title: string;
  variantId: string;
  variantLabel: string;
  quantity: number;
  price: number;
  imageSrc?: string;
};

export type Order = {
  id: string;
  createdAt: Date | null;
  status: OrderStatus;
  currency: string;
  total: number;
  items: OrderItem[];
};

export type CreateOrderPayload = Omit<Order, "id" | "createdAt"> & {
  status?: OrderStatus;
};

function fromDoc(doc: QueryDocumentSnapshot<DocumentData>): Order {
  const data = doc.data();
  const createdAt =
    data.createdAt instanceof Timestamp ? data.createdAt.toDate() : null;
  const rawItems: unknown = data.items;
  const items: OrderItem[] = Array.isArray(rawItems)
    ? (rawItems as OrderItem[]).filter(
        (item): item is OrderItem =>
          !!item && typeof item === "object" && typeof item.title === "string",
      )
    : [];
  const statusRaw = typeof data.status === "string" ? data.status : "pending";
  const status: OrderStatus =
    statusRaw === "paid" ||
    statusRaw === "fulfilled" ||
    statusRaw === "cancelled"
      ? statusRaw
      : "pending";

  return {
    id: doc.id,
    createdAt,
    status,
    currency: typeof data.currency === "string" ? data.currency : "USD",
    total: typeof data.total === "number" ? data.total : 0,
    items,
  };
}

function ordersCollectionForUser(uid: string) {
  const db = getFirestoreDb();
  return collection(db, "users", uid, "orders");
}

/** Single fetch — returns the most-recent orders first. */
export async function listMyOrders(uid: string): Promise<Order[]> {
  const ref = ordersCollectionForUser(uid);
  const q = query(ref, orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map(fromDoc);
}

/** Live subscription — fires whenever the user's orders change. */
export function subscribeMyOrders(
  uid: string,
  cb: (orders: Order[]) => void,
  onError?: (err: Error) => void,
): () => void {
  const ref = ordersCollectionForUser(uid);
  const q = query(ref, orderBy("createdAt", "desc"));
  return onSnapshot(
    q,
    (snap) => {
      cb(snap.docs.map(fromDoc));
    },
    (err) => onError?.(err),
  );
}

/**
 * Create a new order document for the signed-in user.
 * Intended to be invoked by the checkout flow after successful payment.
 * Returns the new document id.
 */
export async function createOrder(
  uid: string,
  payload: CreateOrderPayload,
): Promise<string> {
  const ref = ordersCollectionForUser(uid);
  const doc = await addDoc(ref, {
    status: payload.status ?? "paid",
    currency: payload.currency,
    total: payload.total,
    items: payload.items,
    createdAt: serverTimestamp(),
  });
  return doc.id;
}
