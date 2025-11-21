"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/Redux/Store";
import {
  getPremiumStatus,
  type Subscription,
} from "@/app/Payment/GetPremiumStatus";

export function useSubscription() {
  const { user, authLoaded } = useSelector((state: RootState) => state.auth);

  const [subscription, setSubscription] = useState<Subscription | undefined>(
    undefined
  );

  useEffect(() => {
    if (!authLoaded) return;

    if (!user) {
      setSubscription(null);
      return;
    }

    const unsub = getPremiumStatus(user.uid, (sub) => {
      setSubscription(sub);
    });

    return () => unsub();
  }, [authLoaded, user]);

  return subscription;
}
