"use client";

import AccountLogin from "@/components/AccountLogin";
import SettingsBasic from "@/components/SettingsBasic";
import SettingsPremium from "@/components/SettingsPremium";
import { RootState } from "@/Redux/Store";
import { useSubscription } from "@/UI/useSubscription";
import React from "react";
import { useSelector } from "react-redux";

export default function Settings() {
  const { user, authLoaded } = useSelector((state: RootState) => state.auth);

  // force type to match SettingsPremium props
  const subscription = useSubscription() as any;

  const isLoading = !authLoaded || subscription === undefined;

  const isLoggedOut = authLoaded && !user;
  const isGuest = !!user && user.isAnonymous;

  const isBasic = !!user && !user.isAnonymous && subscription === null;
  const isPremium = !!user && !user.isAnonymous && subscription !== null;

  if (isLoading) return null;

  if (isLoggedOut) return <AccountLogin />;

  if (isGuest) return <SettingsPremium user={user} subscription={null} />;

  if (isBasic) return <SettingsBasic user={user} />;

  if (isPremium)
    return <SettingsPremium user={user} subscription={subscription} />;

  return null;
}
