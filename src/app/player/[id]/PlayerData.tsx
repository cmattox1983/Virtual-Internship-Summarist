"use client";

import AudioLogin from "@/components/AudioLogin";
import AudioSummary from "@/components/AudioSummary";
import AudioPlayer from "@/components/AudioPlayer";
import { RootState } from "@/Redux/Store";
import { useSelector } from "react-redux";
import { useSubscription } from "@/UI/useSubscription";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

type PlayerBook = {
  id: string;
  title: string;
  summary: string;
  author: string;
  imageLink: string;
  audioLink: string;
  subscriptionRequired: boolean;
};

export default function PlayerData({ book }: { book: PlayerBook }) {
  const { user, authLoaded } = useSelector((state: RootState) => state.auth);
  const subscription = useSubscription();
  const router = useRouter();

  const isLoading = !authLoaded || subscription === undefined;

  const isLoggedOut = authLoaded && !user;
  const isGuest = !!user && user.isAnonymous;
  const isPremium = !!user && !user.isAnonymous && subscription !== null;
  const isBasic = !!user && !user.isAnonymous && subscription === null;

  useEffect(() => {
    if (!authLoaded) return;
    if (isBasic && book.subscriptionRequired) {
      router.push("/choose-plan");
    }
  }, [authLoaded, isBasic, book.subscriptionRequired, router]);

  if (isLoading) return null;

  if (isLoggedOut) {
    return (
      <>
        <AudioLogin />
        <AudioPlayer book={book} />
      </>
    );
  }

  if (isBasic && !book.subscriptionRequired) {
    return (
      <>
        <AudioSummary book={book} />
        <AudioPlayer book={book} />
      </>
    );
  }

  if (isGuest || isPremium) {
    return (
      <>
        <AudioSummary book={book} />
        <AudioPlayer book={book} />
      </>
    );
  }

  return null;
}
