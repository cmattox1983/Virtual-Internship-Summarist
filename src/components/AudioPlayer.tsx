"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import styles from "./AudioPlayer.module.css";
import { FaCirclePause, FaCirclePlay } from "react-icons/fa6";
import { MdForward10, MdReplay10 } from "react-icons/md";
import { formatTime } from "@/UI/formatTime";
import Skeleton from "@/UI/Skeleton";
import { useLibrary } from "@/UI/useLibrary";

type PlayerBook = {
  title: string;
  summary: string;
  author: string;
  imageLink: string;
  audioLink: string;
};

type PlayerBookProps = {
  book: PlayerBook;
};

export default function AudioPlayer({ book }: PlayerBookProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [timeProgress, setTimeProgress] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const { markFinished, isFinished } = useLibrary();
  const [showSkeleton, setShowSkeleton] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSkeleton(false), 400);
    return () => clearTimeout(timer);
  }, []);

  const onLoadedMetadata = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isFinite(audio.duration) && audio.duration > 0) {
      setDuration(audio.duration);
      if (barRef.current) barRef.current.max = audio.duration.toString();
    } else {
      setTimeout(() => {
        if (audioRef.current && isFinite(audioRef.current.duration)) {
          setDuration(audioRef.current.duration);
          if (barRef.current)
            barRef.current.max = audioRef.current.duration.toString();
        }
      }, 300);
    }
  };

  const progressFill = () => {
    if (!barRef.current) return;
    const value = Number(barRef.current.value) || 0;
    const max = Number(barRef.current.max) || 1;
    const pct = (value / max) * 100;
    barRef.current.style.setProperty("--range-progress", `${pct}%`);
  };

  const handleProgressChange = () => {
    if (audioRef.current && barRef.current) {
      const newTime = Number(barRef.current.value);
      audioRef.current.currentTime = newTime;
      setTimeProgress(newTime);
      barRef.current.style.setProperty(
        "--range-progress",
        `${(newTime / duration) * 100}%`
      );
    }
  };

  const updateProgress = useCallback(() => {
    if (audioRef.current && barRef.current && duration) {
      const currentTime = audioRef.current.currentTime;
      setTimeProgress(currentTime);
      barRef.current.value = currentTime.toString();
      barRef.current.style.setProperty(
        "--range-progress",
        `${(currentTime / duration) * 100}%`
      );
    }
  }, [duration, setTimeProgress, audioRef, barRef]);

  const startAnimation = useCallback(() => {
    if (audioRef.current && barRef.current && duration) {
      const animate = () => {
        updateProgress();
        playAnimationRef.current = requestAnimationFrame(animate);
      };
      playAnimationRef.current = requestAnimationFrame(animate);
    }
  }, [updateProgress, duration, audioRef, barRef]);

  const playAnimationRef = useRef<number | null>(null);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play();
      startAnimation();
    } else {
      audioRef.current?.pause();
      if (playAnimationRef.current !== null) {
        cancelAnimationFrame(playAnimationRef.current);
        playAnimationRef.current = null;
      }
      updateProgress();
    }
    return () => {
      if (playAnimationRef.current !== null) {
        cancelAnimationFrame(playAnimationRef.current);
      }
    };
  }, [isPlaying, startAnimation, updateProgress, audioRef]);

  const skipForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime += 10;
      updateProgress();
    }
  };

  const skipBackward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime -= 10;
      updateProgress();
    }
  };

  useEffect(() => {
    const update = () => {
      const height = wrapperRef.current?.offsetHeight ?? 0;
      document.documentElement.style.setProperty(
        "--audio-bar-height",
        `${height}px`
      );
    };
    update();
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("resize", update);
      document.documentElement.style.setProperty("--audio-bar-height", "0px");
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    const bar = barRef.current;

    if (!audio || !bar) return;

    const updateProgress = () => {
      bar.value = String(audio.currentTime);
      progressFill();

      if (audio.currentTime >= audio.duration && audio.duration > 0) {
        if (!isFinished(book.id)) {
          markFinished(book);
        }
      }
    };

    audio.addEventListener("timeupdate", updateProgress);

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
    };
  }, [book, markFinished, isFinished]);

  if (showSkeleton) {
    return (
      <>
        <div className={styles.audio__wrapper} ref={wrapperRef}>
          <div
            className={`${styles["audio__track--wrapper"]} ${styles["audio__wrapper--div"]}`}
          >
            <figure className={styles["audio__track--image-mask"]}>
              <figure className={styles["book__image--wrapper"]}>
                <Skeleton className={styles["skeleton__book-image"]} />
              </figure>
            </figure>
            <div className={styles["audio__track--details-wrapper"]}>
              <div className={styles["audio__track--title"]}>
                <Skeleton className={styles["skeleton__audio-track--text"]} />
              </div>
              <div className={styles["audio__track--author"]}>
                <Skeleton className={styles["skeleton__audio-track--text"]} />
              </div>
            </div>
          </div>

          <div
            className={`${styles["audio__controls--wrapper"]} ${styles["audio__wrapper--div"]}`}
          >
            <div className={styles.audio__controls}>
              <audio
                src={book.audioLink}
                ref={audioRef}
                onLoadedMetadata={onLoadedMetadata}
              />
              <button
                className={styles["audio__controls--btn"]}
                onClick={skipBackward}
              >
                <MdReplay10 className={styles["audio__controls--btn-svg"]} />
              </button>
              <button
                className={`${styles["audio__controls--btn"]} ${styles["audio__controls--btn-play"]}`}
                onClick={() => setIsPlaying((prev) => !prev)}
              >
                {isPlaying ? (
                  <FaCirclePause
                    className={styles["audio__controls--btn-svg"]}
                  />
                ) : (
                  <FaCirclePlay
                    className={styles["audio__controls--btn-svg"]}
                  />
                )}
              </button>
              <button
                className={styles["audio__controls--btn"]}
                onClick={skipForward}
              >
                <MdForward10 className={styles["audio__controls--btn-svg"]} />
              </button>
            </div>
          </div>

          <div
            className={`${styles["audio__progress--wrapper"]} ${styles["audio__wrapper--div"]}`}
          >
            <div className={styles.audio__time}>00:00</div>
            <input
              type="range"
              className={styles["audio__progress--bar"]}
              ref={barRef}
              defaultValue={0}
              onChange={handleProgressChange}
              min="0"
              max="204.048"
            />
            <div className={styles.audio__time}>00:00</div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className={styles.audio__wrapper} ref={wrapperRef}>
        <div
          className={`${styles["audio__track--wrapper"]} ${styles["audio__wrapper--div"]}`}
        >
          <figure className={styles["audio__track--image-mask"]}>
            <figure className={styles["book__image--wrapper"]}>
              <img src={book.imageLink} alt="" className={styles.book__image} />
            </figure>
          </figure>
          <div className={styles["audio__track--details-wrapper"]}>
            <div className={styles["audio__track--title"]}>{book.title}</div>
            <div className={styles["audio__track--author"]}>{book.author}</div>
          </div>
        </div>

        <div
          className={`${styles["audio__controls--wrapper"]} ${styles["audio__wrapper--div"]}`}
        >
          <div className={styles.audio__controls}>
            <audio
              src={book.audioLink}
              ref={audioRef}
              onLoadedMetadata={onLoadedMetadata}
            />
            <button
              className={styles["audio__controls--btn"]}
              onClick={skipBackward}
            >
              <MdReplay10 className={styles["audio__controls--btn-svg"]} />
            </button>
            <button
              className={`${styles["audio__controls--btn"]} ${styles["audio__controls--btn-play"]}`}
              onClick={() => setIsPlaying((prev) => !prev)}
            >
              {isPlaying ? (
                <FaCirclePause className={styles["audio__controls--btn-svg"]} />
              ) : (
                <FaCirclePlay className={styles["audio__controls--btn-svg"]} />
              )}
            </button>
            <button
              className={styles["audio__controls--btn"]}
              onClick={skipForward}
            >
              <MdForward10 className={styles["audio__controls--btn-svg"]} />
            </button>
          </div>
        </div>

        <div
          className={`${styles["audio__progress--wrapper"]} ${styles["audio__wrapper--div"]}`}
        >
          <div className={styles.audio__time}>{formatTime(timeProgress)}</div>
          <input
            type="range"
            className={styles["audio__progress--bar"]}
            ref={barRef}
            defaultValue={0}
            onChange={handleProgressChange}
            min="0"
            max="204.048"
          />
          <div className={styles.audio__time}>{formatTime(duration)}</div>
        </div>
      </div>
    </>
  );
}
