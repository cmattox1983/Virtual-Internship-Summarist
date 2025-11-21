"use client";
import React, { useEffect, useState } from "react";
import styles from "./Recommended.module.css";
import saved from "./SavedBooks.module.css";
import Link from "next/link";
import { FaClock, FaStar } from "react-icons/fa";
import Skeleton from "@/UI/Skeleton";
import { useLibrary } from "@/UI/useLibrary";
import { useSelector } from "react-redux";
import { RootState } from "@/Redux/Store";
import { useSubscription } from "@/UI/useSubscription";
import { formatTime } from "@/UI/formatTime";

export default function FinishedBooks() {
  const { finishedBooks, numberOfFinishedBooks } = useLibrary();
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

    finishedBooks.forEach((book) => {
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
  }, [finishedBooks, durations]);

  if (showSkeleton) {
    return (
      <div>
        <div className={styles["for-you__title"]}>Finished</div>
        <div className={styles["for-you__sub--title"]}>
          <Skeleton className={styles["card__for-you--sub-title"]} />
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
    <>
      <div className={styles["for-you__title"]}>Finished</div>
      <div className={styles["for-you__sub--title"]}>
        {numberOfFinishedBooks} items
      </div>
      {numberOfFinishedBooks === 0 && (
        <div className={saved["finished__books--block-wrapper"]}>
          <div className={saved["finished__books--title"]}>
            Done and dusted!
          </div>
          <div className={saved["finished__books--sub-title"]}>
            When you finish a book, you can find it here later.
          </div>
        </div>
      )}
      <div className={styles["for-you__recommended--books"]}>
        {finishedBooks.map((book) => (
          <Link
            href={`/book/${book.id}`}
            className={styles["for-you__recommended--books-link"]}
            key={book.id}
          >
            {(() => {
              if (!user) {
                return book.subscriptionRequired ? (
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

              if (book.subscriptionRequired) {
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
                src={book.imageLink}
                alt="rec_book"
              />
            </figure>

            <div className={styles["recommended__book--title"]}>
              {book.title}
            </div>
            <div className={styles["recommended__book--author"]}>
              {book.author}
            </div>
            <div className={styles["recommended__book--sub-title"]}>
              {book.subTitle}
            </div>

            <div className={styles["recommended__book--details-wrapper"]}>
              <div className={styles["recommended__book--details"]}>
                <div className={styles["recommended__book--details-icon"]}>
                  <FaClock />
                </div>
                <div className={styles["recommended__book--details-text"]}>
                  {formatTime(durations[book.id] ?? 0)}
                </div>
              </div>

              <div className={styles["recommended__book--details"]}>
                <div className={styles["recommended__book--details-icon"]}>
                  <FaStar />
                </div>
                <div className={styles["recommended__book--details-text"]}>
                  {book.averageRating}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
