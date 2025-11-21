"use client";

import Link from "next/link";
import styles from "./Settings.module.css";

export default function SettingsBasic({ user }) {
  const displayEmail = user?.email ?? "N/A";

  return (
    <>
      <div className={styles.setting__content}>
        <div className={styles["settings__sub--title"]}>
          Your Subscription plan
        </div>
        <div className={styles.settings__text}>Basic</div>

        <Link
          href="/choose-plan"
          className={`btn ${styles["settings__upgrade--btn"]}`}
        >
          Upgrade to Premium
        </Link>
      </div>

      <div className={styles.setting__content}>
        <div className={styles["settings__sub--title"]}>Email</div>
        <div className={styles.settings__text}>{displayEmail}</div>
      </div>
    </>
  );
}
