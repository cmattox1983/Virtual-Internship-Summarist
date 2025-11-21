"use client";

import React, { useEffect, useState } from "react";
import { FaMagnifyingGlass, FaBars, FaClock } from "react-icons/fa6";
import { FaTimes } from "react-icons/fa";
import styles from "./Search.module.css";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { open as openSidebar } from "@/Redux/sideBarSlice";
import Skeleton from "@/UI/Skeleton";
import { formatTime } from "@/UI/formatTime";

type Book = {
  id: string;
  author: string;
  title: string;
  imageLink: string;
  audioLink: string;
};

export default function Search() {
  const dispatch = useDispatch();

  const [input, setInput] = useState("");
  const [showSkeleton, setShowSkeleton] = useState(false);
  const [results, setResults] = useState<Book[]>([]);
  const [durations, setDurations] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!input.trim()) {
      setResults([]);
      setShowSkeleton(false);
      return;
    }

    setShowSkeleton(true);

    const timeout = setTimeout(() => {
      fetchBooks();
    }, 300);

    return () => clearTimeout(timeout);
  }, [input]);

  async function fetchBooks() {
    try {
      const res = await fetch(
        `https://us-central1-summaristt.cloudfunctions.net/getBooksByAuthorOrTitle?search=${encodeURIComponent(
          input
        )}`,
        { cache: "no-store" }
      );

      const data = await res.json();
      setResults(data || []);
    } catch (e) {
      console.error(e);
      setResults([]);
    } finally {
      setShowSkeleton(false);
    }
  }

  useEffect(() => {
    const audios: HTMLAudioElement[] = [];

    results.forEach((book) => {
      if (durations[book.id] != null) return;

      const audio = new Audio(book.audioLink);
      audio.preload = "metadata";

      audio.addEventListener("loadedmetadata", () => {
        setDurations((prev) => ({
          ...prev,
          [book.id]: audio.duration || 0,
        }));
      });

      audios.push(audio);
    });

    return () => {
      audios.forEach((a) => (a.src = ""));
    };
  }, [results]);

  const clearInput = () => {
    setInput("");
    setResults([]);
  };

  return (
    <div className={styles.search__background}>
      <div className={styles.search__wrapper}>
        <figure></figure>

        <div className={styles.search__content}>
          <div className={styles.search}>
            <div className={styles["search__input--wrapper"]}>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Search for books"
                className={styles.search__input}
              />

              {input ? (
                <div className={styles.search__icon}>
                  <FaTimes
                    width={24}
                    height={24}
                    cursor="pointer"
                    style={{ color: "#03314b" }}
                    onClick={clearInput}
                  />
                </div>
              ) : (
                <div className={styles.search__icon}>
                  <FaMagnifyingGlass
                    width={24}
                    height={24}
                    style={{ color: "#03314b" }}
                  />
                </div>
              )}
            </div>
          </div>

          <div
            className={styles["sidebar__toggle--btn"]}
            onClick={() => dispatch(openSidebar())}
          >
            <FaBars className={styles["sidebar__toggle--btn-img"]} />
          </div>
        </div>

        {input && (
          <div className={styles["search__books--wrapper"]}>
            {showSkeleton &&
              Array.from({ length: 5 }).map((_, idx) => (
                <div key={idx} className={styles["search__book--link"]}>
                  <Skeleton className={styles["skeleton__search-book--link"]} />
                </div>
              ))}

            {!showSkeleton && results.length === 0 && (
              <div className={styles["no-results"]}>No results found</div>
            )}

            {!showSkeleton &&
              results.map((book) => (
                <Link
                  href={`/book/${book.id}`}
                  key={book.id}
                  className={styles["search__book--link"]}
                >
                  <figure className={styles["book__image--wrapper"]}>
                    <img
                      src={book.imageLink}
                      alt={book.title}
                      className={styles.book__image}
                    />
                  </figure>

                  <div>
                    <div className={styles["search__book--title"]}>
                      {book.title}
                    </div>

                    <div className={styles["search__book--author"]}>
                      {book.author}
                    </div>

                    <div>
                      <div className={styles["recommended__book--details"]}>
                        <div
                          className={styles["recommended__book--details-icon"]}
                        >
                          <FaClock
                            className={
                              styles["recommended__book--details-icon-svg"]
                            }
                          />
                        </div>

                        <div
                          className={styles["recommended__book--details-text"]}
                        >
                          {formatTime(durations[book.id] ?? 0)}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
