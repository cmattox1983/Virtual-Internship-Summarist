"use client";
import React, { useContext } from "react";
import styles from "./FontControls.module.css";
import { FaFont } from "react-icons/fa";
import { FontContext } from "@/app/player/[id]/layout";

type FontSize = "sm" | "med" | "lg" | "xl";

export default function FontControls({
  onChangeFont,
}: {
  onChangeFont: (size: FontSize) => void;
}) {
  const { fontSize } = useContext(FontContext);
  return (
    <>
      <div
        className={`${styles["sidebar__link--wrapper"]} ${styles["sidebar__font--size-wrapper"]}`}
      >
        <div
          className={`${styles["sidebar__link--text"]} ${
            styles["sidebar__font--size-icon"]
          } ${
            fontSize === "sm" ? styles["sidebar__font--size-icon--active"] : ""
          }`}
          onClick={() => onChangeFont("sm")}
        >
          <FaFont className={styles["sidebar__font--size-icon-small"]} />
        </div>

        <div
          className={`${styles["sidebar__link--text"]} ${
            styles["sidebar__font--size-icon"]
          } ${
            fontSize === "med" ? styles["sidebar__font--size-icon--active"] : ""
          }`}
          onClick={() => onChangeFont("med")}
        >
          <FaFont className={styles["sidebar__font--size-icon-medium"]} />
        </div>

        <div
          className={`${styles["sidebar__link--text"]} ${
            styles["sidebar__font--size-icon"]
          } ${
            fontSize === "lg" ? styles["sidebar__font--size-icon--active"] : ""
          }`}
          onClick={() => onChangeFont("lg")}
        >
          <FaFont className={styles["sidebar__font--size-icon-large"]} />
        </div>

        <div
          className={`${styles["sidebar__link--text"]} ${
            styles["sidebar__font--size-icon"]
          } ${
            fontSize === "xl" ? styles["sidebar__font--size-icon--active"] : ""
          }`}
          onClick={() => onChangeFont("xl")}
        >
          <FaFont className={styles["sidebar__font--size-icon-xlarge"]} />
        </div>
      </div>
    </>
  );
}
