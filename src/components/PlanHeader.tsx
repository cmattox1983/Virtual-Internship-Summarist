import Image from "next/image";
import React from "react";
import styles from "./PlanHeader.module.css";

export default function PlanHeader() {
  return (
    <>
      <div className={styles["plan__header--wrapper"]}>
        <div className={styles.plan__header}>
          <div className={styles.plan__title}>
            Get unlimited access to many amazing books to read
          </div>
          <div className={styles["plan__sub--title"]}>
            Turn ordinary moments into amazing learning opportunities
          </div>
          <figure className={styles["plan__img--mask"]}>
            <Image
              src="/assets-internship/pricing-top.png"
              alt="pricing"
              width={340}
              height={285}
              style={{ width: "100%", height: "100%" }}
            />
          </figure>
        </div>
      </div>
    </>
  );
}
