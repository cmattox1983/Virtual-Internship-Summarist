"use client";

import { getAuth } from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
} from "firebase/firestore";

const db = getFirestore();

export async function getCheckoutURL(priceId: string) {
  const auth = getAuth();
  const currentUser = auth.currentUser;

  if (!currentUser) {
    throw new Error("User must be logged in to start checkout.");
  }

  const checkoutSessionRef = await addDoc(
    collection(db, "customers", currentUser.uid, "checkout_sessions"),
    {
      price: priceId,
      mode: "subscription",
      success_url: `${window.location.origin}/for-you`,
      cancel_url: `${window.location.origin}/for-you`,
      allow_promotion_codes: true,
      automatic_tax: { enabled: true },
    }
  );

  onSnapshot(checkoutSessionRef, (snap) => {
    const data = snap.data();

    if (data?.error) {
      console.error("Stripe checkout error: ", data.error);
      alert(`An error occurred: ${data.error.message}`);
    }

    if (data?.url) {
      window.location.assign(data.url);
    }
  });
}
