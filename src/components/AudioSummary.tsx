"use client";
import React, { useContext, useEffect, useState } from "react";
import styles from "./AudioSummary.module.css";
import { FontContext } from "@/app/player/[id]/layout";
import { FaCircleNotch } from "react-icons/fa6";

type FontSize = "sm" | "med" | "lg" | "xl";

type PlayerBook = {
  title: string;
  summary: string;
  author: string;
  imageLink: string;
  audioLink: string;
};

export default function AudioSummary({ book }: { book: PlayerBook }) {
  const { fontSize } = useContext(FontContext);
  const sizeMap: Record<FontSize, number> = {
    sm: 16,
    med: 18,
    lg: 22,
    xl: 26,
  };

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className={styles["loading__audio-book--spinner-wrapper"]}>
        <FaCircleNotch className={styles["loading__audio-book--spinner-img"]} />
      </div>
    );
  }

  return (
    <div className="summmary">
      <div className="audio__book--summary">
        <div className="audio__book--summary-title">
          <b>{book.title}</b>
        </div>
        <div
          className={styles["audio__book--summary-text"]}
          style={{ fontSize: `${sizeMap[fontSize]}px`, lineHeight: 1.5 }}
        >
          {book.summary}
        </div>
      </div>
    </div>
  );
}
