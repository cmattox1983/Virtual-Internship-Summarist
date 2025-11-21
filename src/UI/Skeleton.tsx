"use client";

import React from "react";
import styles from "./Skeleton.module.css";

type SkeletonProps = {
  className?: string;
};

export default function Skeleton({ className }: SkeletonProps) {
  const combinedClassName = className
    ? `${styles["skeleton-box"]} ${className}`
    : styles["skeleton-box"];

  return <div className={combinedClassName} />;
}
