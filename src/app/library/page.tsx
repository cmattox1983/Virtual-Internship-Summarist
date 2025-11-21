"use client";
import AudioLogin from "@/components/AudioLogin";
import FinishedBooks from "@/components/FinishedBooks";
import SavedBooks from "@/components/SavedBooks";
import { RootState } from "@/Redux/Store";
import { useSubscription } from "@/UI/useSubscription";
import React from "react";
import { useSelector } from "react-redux";

export default function Library() {
  const { user, authLoaded } = useSelector((state: RootState) => state.auth);
  const subscription = useSubscription();
  const isLoading = !authLoaded || subscription === undefined;
  const isLoggedOut = authLoaded && !user;
  const isGuest = !!user && user.isAnonymous;
  const isPremium = !!user && !user.isAnonymous && subscription !== null;
  const isBasic = !!user && !user.isAnonymous && subscription === null;

  if (isLoading) return null;
  if (isLoggedOut) return <AudioLogin />;
  if (isGuest || isPremium || isBasic)
    return (
      <>
        <div>
          <SavedBooks />
          <FinishedBooks />
        </div>
      </>
    );
}
