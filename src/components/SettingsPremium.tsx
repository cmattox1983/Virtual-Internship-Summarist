"use client";

import styles from "./Settings.module.css";

export default function SettingsPremium({ user, subscription }) {
  const displayEmail = user?.isAnonymous
    ? "guest@gmail.com"
    : user?.email ?? "N/A";

  const interval =
    subscription?.items?.[0]?.plan?.interval ??
    (user?.isAnonymous ? "month" : null);

  const intervalLabel =
    interval === "month"
      ? "Premium"
      : interval === "year"
      ? "Premium Plus"
      : "Unknown";

  return (
    <>
      <div className={styles.setting__content}>
        <div className={styles["settings__sub--title"]}>
          Your Subscription plan
        </div>
        <div className={styles.settings__text}>{intervalLabel}</div>
      </div>

      <div className={styles.setting__content}>
        <div className={styles["settings__sub--title"]}>Email</div>
        <div className={styles.settings__text}>{displayEmail}</div>
      </div>
    </>
  );
}
