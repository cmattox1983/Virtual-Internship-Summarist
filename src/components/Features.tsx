"use client";

import { AiFillAudio, AiFillBulb, AiFillFileText } from "react-icons/ai";
import styles from "./Features.module.css";
import { useEffect, useState } from "react";

export default function Features() {
  const firstItems = [
    "Enhance your knowledge",
    "Achieve greater success",
    "Improve your health",
    "Develop better parenting skills",
    "Increase happiness",
    "Be the best version of yourself!",
  ];

  const secondItems = [
    "Expand your learning",
    "Accomplish your goals",
    "Strengthn your vitality",
    "Become a better caregiver",
    "Improve your mood",
    "Maximize your abilities",
  ];

  const [active, setActive] = useState(0);

  const [activeSecond, setActiveSecond] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % firstItems.length);
      setActiveSecond((prev) => (prev + 1) % secondItems.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [firstItems.length, secondItems.length]);

  return (
    <>
      <div className="container">
        <div className="row">
          <div className="section__title">Understand books in few minutes</div>
          <div className={styles.features__wrapper}>
            <div className={styles.features}>
              <div className={styles.features__icon}>
                <AiFillFileText />
              </div>
              <div className={styles.features__title}>Read or listen</div>
              <div className={styles["features__sub--title"]}>
                Save time by getting the core ideas from the best books.
              </div>
            </div>
            <div className={styles.features}>
              <div className={styles.features__icon}>
                <AiFillBulb />
              </div>
              <div className={styles.features__title}>Find your next read</div>
              <div className={styles["features__sub--title"]}>
                Explore book lists and personalized recommendations.
              </div>
            </div>
            <div className={styles.features}>
              <div className={styles.features__icon}>
                <AiFillAudio />
              </div>
              <div className={styles.features__title}>Briefcasts</div>
              <div className={styles["features__sub--title"]}>
                Gain valuable insights from briefcasts
              </div>
            </div>
          </div>
          <div className={styles.statistics__wrapper}>
            <div className={styles["statistics__content--header"]}>
              {firstItems.map((firstItem, index) => (
                <div
                  key={firstItem}
                  className={`${styles.statistics__heading} ${
                    index === active ? styles.active : ""
                  }`}
                >
                  {firstItem}
                </div>
              ))}
            </div>
            <div className={styles["statistics__content--details"]}>
              <div className={styles.statistics__data}>
                <div className={styles["statistics__data--number"]}>93%</div>
                <div className={styles["statistics__data--title"]}>
                  of Summarist members <b>significantly increase</b> reading
                  frequency.
                </div>
              </div>
              <div className={styles.statistics__data}>
                <div className={styles["statistics__data--number"]}>96%</div>
                <div className={styles["statistics__data--title"]}>
                  of Summarist members <b>establish better</b> habits.
                </div>
              </div>
              <div className={styles.statistics__data}>
                <div className={styles["statistics__data--number"]}>90%</div>
                <div className={styles["statistics__data--title"]}>
                  have made <b>significant positive</b> change to their lives.
                </div>
              </div>
            </div>
          </div>
          <div className={styles.statistics__wrapper}>
            <div
              className={`${styles["statistics__content--details"]} ${styles["statistics__content--details-second"]}`}
            >
              <div className={styles.statistics__data}>
                <div className={styles["statistics__data--number"]}>91%</div>
                <div className={styles["statistics__data--title"]}>
                  of Summarist members <b>report feeling more productive</b>
                  after incorporating the service into their daily routine.
                </div>
              </div>
              <div className={styles.statistics__data}>
                <div className={styles["statistics__data--number"]}>94%</div>
                <div className={styles["statistics__data--title"]}>
                  of Summarist members have <b>noticed an improvement</b> in
                  their overall comprehension and retention of information.
                </div>
              </div>
              <div className={styles.statistics__data}>
                <div className={styles["statistics__data--number"]}>88%</div>
                <div className={styles["statistics__data--title"]}>
                  of Summarist members <b>feel more informed</b> about current
                  events and industry trends since using the platform.
                </div>
              </div>
            </div>
            <div
              className={`${styles["statistics__content--header"]} ${styles["statistics__content--header-second"]}`}
            >
              {secondItems.map((secondItem, index) => (
                <div
                  key={secondItem}
                  className={`${styles.statistics__heading} ${
                    index === activeSecond ? styles.active : ""
                  }`}
                >
                  {secondItem}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
