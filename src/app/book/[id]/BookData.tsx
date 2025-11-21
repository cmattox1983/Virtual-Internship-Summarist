"use client";

import Search from "@/components/Search";
import Sidebar from "@/components/Sidebar";
import React, { useEffect, useState } from "react";
import {
  FaRegBookmark,
  FaBookOpen,
  FaClock,
  FaLightbulb,
  FaMicrophone,
  FaStar,
} from "react-icons/fa";
import styles from "../BookData.module.css";
import { open as openAuth } from "@/Redux/authModalSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/Redux/Store";
import { useRouter } from "next/navigation";
import { FaBookmark } from "react-icons/fa6";
import { formatTime } from "@/UI/formatTime";
import { useSubscription } from "@/UI/useSubscription";
import Skeleton from "@/UI/Skeleton";
import { useLibrary } from "@/UI/useLibrary";

type BookId = {
  id: string;
  author: string;
  title: string;
  subTitle: string;
  imageLink: string;
  averageRating: number;
  subscriptionRequired: boolean;
  totalRating: number;
  keyIdeas: number;
  type: string;
  tags: string[];
  bookDescription: string;
  authorDescription: string;
  audioLink: string;
};

type BookProps = { book: BookId };

export default function BookData({ book }: BookProps) {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const router = useRouter();
  const [durations, setDurations] = useState<Record<string, number>>({});
  const subscription = useSubscription();

  const {
    loading: libraryLoading,
    saveBook,
    removeSavedBook,
    isSaved,
  } = useLibrary();

  const [showSkeleton, setShowSkeleton] = useState(true);

  type FontSize = "sm" | "med" | "lg" | "xl";
  const handleFontChange = (size: FontSize) => {};

  useEffect(() => {
    const timer = setTimeout(() => setShowSkeleton(false), 400);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!book?.id) return;
    if (durations[book.id] != null) return;

    const audio = new Audio(book.audioLink);
    audio.preload = "metadata";

    const onMeta = () => {
      setDurations((d) => ({ ...d, [book.id]: audio.duration || 0 }));
    };

    audio.addEventListener("loadedmetadata", onMeta);
    audio.load();

    return () => {
      audio.removeEventListener("loadedmetadata", onMeta);
      audio.src = "";
    };
  }, [book, durations]);

  const handleBook = () => {
    if (!user) {
      dispatch(openAuth());
      return;
    }

    if (user.isAnonymous) {
      router.push(`/player/${book.id}`);
      return;
    }

    if (subscription === undefined) {
      return;
    }

    if (subscription === null && book.subscriptionRequired) {
      router.push("/choose-plan");
      return;
    }

    router.push(`/player/${book.id}`);
  };

  const saved = isSaved(book.id);

  const handleToggleSaved = () => {
    if (!user) {
      dispatch(openAuth());
      return;
    }

    if (libraryLoading) return;

    if (saved) {
      removeSavedBook(book.id);
    } else {
      saveBook(book);
    }
  };

  if (showSkeleton) {
    return (
      <>
        <Sidebar onChangeFont={handleFontChange} />
        <div className="wrapper">
          <Search />
          <div className="row">
            <div className="container">
              <div className={styles.inner__wrapper}>
                <div className={styles.inner__book}>
                  <div className={styles["inner-book__title"]}>
                    <Skeleton className={styles["skeleton__title"]} />
                  </div>

                  <div className={styles["inner-book__author"]}>
                    <Skeleton className={styles["skeleton__author"]} />
                  </div>

                  <div className={styles["inner-book__sub--title"]}>
                    <Skeleton className={styles["skeleton__subtitle"]} />
                  </div>

                  <div className={styles["inner-book__wrapper"]}>
                    <div className={styles["inner-book__description--wrapper"]}>
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          className={styles["inner-book__description"]}
                          key={i}
                        >
                          <div className={styles["inner-book__icon"]}></div>
                          <Skeleton
                            className={styles["skeleton__short-line"]}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className={styles["inner-book__read--btn-wrapper"]}>
                    <Skeleton className={styles["skeleton__button"]} />
                    <Skeleton className={styles["skeleton__button"]} />
                  </div>

                  <div className={styles["inner-book__bookmark"]}>
                    <Skeleton className={styles["skeleton__bookmark"]} />
                  </div>

                  <div className={styles["inner-book__secondary--title"]}>
                    <Skeleton className={styles["skeleton__section-title"]} />
                  </div>

                  <div className={styles["inner-book__tags--wrapper"]}>
                    <Skeleton className={styles["skeleton__tag"]} />
                    <Skeleton className={styles["skeleton__tag"]} />
                  </div>

                  <div className={styles["inner-book__book--description"]}>
                    <Skeleton
                      className={styles["skeleton__big-block-description"]}
                    />
                  </div>

                  <h2 className={styles["inner-book__secondary--title"]}>
                    <Skeleton className={styles["skeleton__section-title"]} />
                  </h2>

                  <div className={styles["inner-book__author--description"]}>
                    <Skeleton
                      className={styles["skeleton__big-block-author"]}
                    />
                  </div>
                </div>

                <div className={styles["inner-book--img-wrapper"]}>
                  <figure className={styles["book__image--wrapper"]}>
                    <Skeleton className={styles["skeleton__image"]} />
                  </figure>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Sidebar onChangeFont={handleFontChange} />
      <div className="wrapper">
        <Search />
        <div className="row">
          <div className="container">
            <div className={styles.inner__wrapper}>
              <div className={styles.inner__book}>
                <div className={styles["inner-book__title"]}>
                  {book.title}
                  {(() => {
                    if (!user) {
                      return book.subscriptionRequired ? " (Premium)" : null;
                    }
                    if (subscription === undefined) return null;
                    if (user.isAnonymous) return null;
                    if (subscription !== null) return null;
                    return book.subscriptionRequired ? " (Premium)" : null;
                  })()}
                </div>

                <div className={styles["inner-book__author"]}>
                  {book.author}
                </div>

                <div className={styles["inner-book__sub--title"]}>
                  {book.subTitle}
                </div>

                <div className={styles["inner-book__wrapper"]}>
                  <div className={styles["inner-book__description--wrapper"]}>
                    <div className={styles["inner-book__description"]}>
                      <div className={styles["inner-book__icon"]}>
                        <FaStar />
                      </div>
                      <div className={styles["inner-book__overall--rating"]}>
                        {book.averageRating}&nbsp;
                      </div>
                      <div className={styles["inner-book__total--rating"]}>
                        ({book.totalRating} ratings)
                      </div>
                    </div>

                    <div className={styles["inner-book__description"]}>
                      <div className={styles["inner-book__icon"]}>
                        <FaClock />
                      </div>
                      <div className={styles["inner-book__duration"]}>
                        {formatTime(durations[book.id] ?? 0)}
                      </div>
                    </div>

                    <div className={styles["inner-book__description"]}>
                      <div className={styles["inner-book__icon"]}>
                        <FaMicrophone />
                      </div>
                      <div className={styles["inner-book__type"]}>
                        {book.type}
                      </div>
                    </div>

                    <div className={styles["inner-book__description"]}>
                      <div className={styles["inner-book__icon"]}>
                        <FaLightbulb />
                      </div>
                      <div className={styles["inner-book__key--ideas"]}>
                        {book.keyIdeas} Key Ideas
                      </div>
                    </div>
                  </div>
                </div>

                <div className={styles["inner-book__read--btn-wrapper"]}>
                  <button
                    className={styles["inner-book__read--btn"]}
                    onClick={handleBook}
                  >
                    <FaBookOpen />
                    <span>Read</span>
                  </button>

                  <button
                    className={styles["inner-book__read--btn"]}
                    onClick={handleBook}
                  >
                    <FaMicrophone />
                    <span>Listen</span>
                  </button>
                </div>

                <div
                  className={styles["inner-book__bookmark"]}
                  onClick={handleToggleSaved}
                >
                  {saved ? (
                    <FaBookmark
                      className={styles["inner-book__bookmark--icon-svg"]}
                    />
                  ) : (
                    <FaRegBookmark
                      className={styles["inner-book__bookmark--icon-svg"]}
                    />
                  )}
                  {saved ? "Saved to My Library" : "Add title to My Library"}
                </div>

                <div className={styles["inner-book__secondary--title"]}>
                  What's it about?
                </div>

                <div className={styles["inner-book__tags--wrapper"]}>
                  {book.tags?.map((tag) => (
                    <div
                      className={styles["inner-book__tag"]}
                      key={`${book.id}-${tag.trim().toLowerCase()}`}
                    >
                      {tag}
                    </div>
                  ))}
                </div>

                <div className={styles["inner-book__book--description"]}>
                  {book.bookDescription}
                </div>

                <h2 className={styles["inner-book__secondary--title"]}>
                  About the author
                </h2>

                <div className={styles["inner-book__author--description"]}>
                  {book.authorDescription}
                </div>
              </div>

              <div className={styles["inner-book--img-wrapper"]}>
                <figure className={styles["book__image--wrapper"]}>
                  <img
                    className={styles.book__image}
                    src={book.imageLink}
                    alt={book.title}
                  />
                </figure>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
