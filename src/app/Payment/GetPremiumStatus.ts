"use client";

import "@/app/firebase";

import {
  getFirestore,
  collection,
  query,
  where,
  onSnapshot,
  type DocumentData,
} from "firebase/firestore";

const db = getFirestore();

export type Subscription = (DocumentData & { id: string }) | null;

export function getPremiumStatus(
  uid: string,
  onChange: (subscription: Subscription) => void
) {
  const subRef = query(
    collection(db, "customers", uid, "subscriptions"),
    where("status", "in", ["trialing", "active"])
  );

  return onSnapshot(
    subRef,
    (snapshot) => {
      if (snapshot.empty) {
        onChange(null);
        return;
      }

      const doc = snapshot.docs[0];
      onChange({ id: doc.id, ...doc.data() });
    },
    (err) => {
      console.error("Subscription listener error:", err);
      onChange(null);
    }
  );
}
