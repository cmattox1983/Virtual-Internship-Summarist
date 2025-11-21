"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaClock, FaStar } from "react-icons/fa";
import styles from "./Recommended.module.css";
import { useSelector } from "react-redux";
import { RootState } from "@/Redux/Store";
import { formatTime } from "@/UI/formatTime";
import { useSubscription } from "@/UI/useSubscription";
import Skeleton from "@/UI/Skeleton";

type BookRecommended = {
  id: string;
  author: string;
  title: string;
  subTitle: string;
  imageLink: string;
  averageRating: number;
  subscriptionRequired: boolean;
  audioLink: string;
};

type RecommendedProps = {
  recommendedBooks: BookRecommended[];
};

export default function Recommended({ recommendedBooks }: RecommendedProps) {
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

    recommendedBooks.forEach((book) => {
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
  }, [recommendedBooks, durations]);

  if (showSkeleton) {
    return (
      <div>
        <div className={styles["for-you__title"]}>Recommended For You</div>
        <div className={styles["for-you__sub--title"]}>
          We think you&apos;ll like these
        </div>

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
      <div className={styles["for-you__title"]}>Recommended For You</div>
      <div className={styles["for-you__sub--title"]}>
        We think you&apos;ll like these
      </div>

      <div className={styles["for-you__recommended--books"]}>
        {recommendedBooks.map((recommendedBook) => (
          <Link
            href={`/book/${recommendedBook.id}`}
            className={styles["for-you__recommended--books-link"]}
            key={recommendedBook.id}
          >
            {(() => {
              if (!user) {
                return recommendedBook.subscriptionRequired ? (
                  <div
                    className={`${styles.book__pill} ${styles["book__pill--subscription-required"]}`}
                  >
                    Premium
                  </div>
                ) : null;
              }

              if (subscription === undefined) return null;

              if (user.isAnonymous) return null;

              if (subscription !== null) return null;

              if (recommendedBook.subscriptionRequired) {
                return (
                  <div
                    className={`${styles.book__pill} ${styles["book__pill--subscription-required"]}`}
                  >
                    Premium
                  </div>
                );
              }

              return null;
            })()}

            <figure className={styles["book__image--wrapper"]}>
              <img
                className={styles["book__image"]}
                src={recommendedBook.imageLink}
                alt="rec_book"
              />
            </figure>

            <div className={styles["recommended__book--title"]}>
              {recommendedBook.title}
            </div>
            <div className={styles["recommended__book--author"]}>
              {recommendedBook.author}
            </div>
            <div className={styles["recommended__book--sub-title"]}>
              {recommendedBook.subTitle}
            </div>

            <div className={styles["recommended__book--details-wrapper"]}>
              <div className={styles["recommended__book--details"]}>
                <div className={styles["recommended__book--details-icon"]}>
                  <FaClock />
                </div>
                <div className={styles["recommended__book--details-text"]}>
                  {formatTime(durations[recommendedBook.id] ?? 0)}
                </div>
              </div>

              <div className={styles["recommended__book--details"]}>
                <div className={styles["recommended__book--details-icon"]}>
                  <FaStar />
                </div>
                <div className={styles["recommended__book--details-text"]}>
                  {recommendedBook.averageRating}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
