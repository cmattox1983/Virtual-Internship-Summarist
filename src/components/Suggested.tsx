"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaClock, FaStar } from "react-icons/fa";
import styles from "./Suggested.module.css";
import { useSelector } from "react-redux";
import { RootState } from "@/Redux/Store";
import { formatTime } from "@/UI/formatTime";
import { useSubscription } from "@/UI/useSubscription";
import Skeleton from "@/UI/Skeleton";

type BookSuggested = {
  id: string;
  author: string;
  title: string;
  subTitle: string;
  imageLink: string;
  averageRating: number;
  subscriptionRequired: boolean;
  audioLink: string;
};

type SuggestedProps = {
  suggestedBooks: BookSuggested[];
};

export default function Suggested({ suggestedBooks }: SuggestedProps) {
  const user = useSelector((state: RootState) => state.auth.user);
  const subscription = useSubscription();
  const [durations, setDurations] = useState<Record<string, number>>({});
  const [showSkeleton, setShowSkeleton] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSkeleton(false), 400);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const audios: HTMLAudioElement[] = [];

    suggestedBooks.forEach((book) => {
      if (durations[book.id] != null) return;

      const audio = new Audio(book.audioLink);
      audio.preload = "metadata";
      const onMeta = () => {
        setDurations((d) => ({ ...d, [book.id]: audio.duration || 0 }));
      };
      audio.addEventListener("loadedmetadata", onMeta);
      audios.push(audio);
      audio.load();
    });

    return () => {
      audios.forEach((a) => {
        a.src = "";
        a.removeAttribute("src");
        a.load();
      });
    };
  }, [suggestedBooks, durations]);

  if (showSkeleton) {
    return (
      <div>
        <div className={styles["for-you__title"]}>Suggested Books</div>
        <div className={styles["for-you__sub--title"]}>Browse those books</div>

        <div className={styles["for-you__recommended--books"]}>
          {Array.from({ length: 5 }).map((_, idx) => (
            <div
              key={idx}
              className={styles["for-you__recommended--books-link"]}
            >
              <div className={styles["book__image--wrapper"]}>
                <Skeleton className={styles["card__skeleton-img"]} />
              </div>
              <Skeleton className={styles["card__skeleton-title"]} />
              <Skeleton className={styles["card__skeleton-subtitle"]} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className={styles["for-you__title"]}>Suggested Books</div>
      <div className={styles["for-you__sub--title"]}>Browse those books</div>

      <div className={styles["for-you__recommended--books"]}>
        {suggestedBooks.map((suggestedBook) => (
          <Link
            href={`/book/${suggestedBook.id}`}
            className={styles["for-you__recommended--books-link"]}
            key={suggestedBook.id}
          >
            {(() => {
              if (!user) {
                return suggestedBook.subscriptionRequired ? (
                  <div className={styles.book__pill}>Premium</div>
                ) : null;
              }

              if (subscription === undefined) return null;
              if (user.isAnonymous) return null;
              if (subscription !== null) return null;

              if (suggestedBook.subscriptionRequired) {
                return <div className={styles.book__pill}>Premium</div>;
              }

              return null;
            })()}

            <figure className={styles["book__image--wrapper"]}>
              <img
                className={styles["book__image"]}
                src={suggestedBook.imageLink}
                alt={suggestedBook.title}
              />
            </figure>

            <div className={styles["recommended__book--title"]}>
              {suggestedBook.title}
            </div>
            <div className={styles["recommended__book--author"]}>
              {suggestedBook.author}
            </div>
            <div className={styles["recommended__book--sub-title"]}>
              {suggestedBook.subTitle}
            </div>

            <div className={styles["recommended__book--details-wrapper"]}>
              <div className={styles["recommended__book--details"]}>
                <div className={styles["recommended__book--details-icon"]}>
                  <FaClock />
                </div>
                <div className={styles["recommended__book--details-text"]}>
                  {formatTime(durations[suggestedBook.id] ?? 0)}
                </div>
              </div>

              <div className={styles["recommended__book--details"]}>
                <div className={styles["recommended__book--details-icon"]}>
                  <FaStar />
                </div>
                <div className={styles["recommended__book--details-text"]}>
                  {suggestedBook.averageRating}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
