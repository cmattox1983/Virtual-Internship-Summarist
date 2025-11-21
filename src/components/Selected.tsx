"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaCirclePlay } from "react-icons/fa6";
import styles from "./Selected.module.css";
import { formatTime } from "@/UI/formatTime";
import Skeleton from "@/UI/Skeleton";

type BookSelected = {
  id: string;
  author: string;
  title: string;
  subTitle: string;
  imageLink: string;
  averageRating: number;
  subscriptionRequired: boolean;
  audioLink: string;
};

type SelectedProps = {
  selectedBooks: BookSelected[];
};

export default function Selected({ selectedBooks }: SelectedProps) {
  const [durations, setDurations] = useState<Record<string, number>>({});
  const [showSkeleton, setShowSkeleton] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSkeleton(false), 400);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const audios: HTMLAudioElement[] = [];

    selectedBooks.forEach((book) => {
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
  }, [selectedBooks, durations]);

  if (showSkeleton) {
    return (
      <>
        <div className={styles["for-you__title"]}>Selected just for you</div>
        <div className={styles["selected__skeleton-wrapper"]}>
          <Skeleton className={styles["selected__skeleton"]} />
        </div>
      </>
    );
  }

  return (
    <>
      <div className={styles["for-you__title"]}>Selected just for you</div>
      {selectedBooks.map((selectedBook) => (
        <Link
          href={`/book/${selectedBook.id}`}
          className={styles.selected__book}
          key={selectedBook.id}
        >
          <div className={styles["selected__book--sub-title"]}>
            {selectedBook.subTitle}
          </div>
          <div className={styles["selected__book--line"]}></div>
          <div className={styles["selected__book--content"]}>
            <figure className={styles["book__image--wrapper"]}>
              <img
                src={selectedBook.imageLink}
                alt={selectedBook.title}
                className={styles.book__image}
              />
            </figure>
            <div className={styles["selected__book--text"]}>
              <div className={styles["selected__book--title"]}>
                {selectedBook.title}
              </div>
              <div className={styles["selected__book--author"]}>
                {selectedBook.author}
              </div>
              <div className={styles["selected__book--duration-wrapper"]}>
                <div className={styles["selected__book--icon"]}>
                  <FaCirclePlay
                    className={styles["selected__book--icon-img"]}
                  />
                </div>
                <div className={styles["selected__book--duration"]}>
                  {formatTime(durations[selectedBook.id] ?? 0)}
                </div>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </>
  );
}
