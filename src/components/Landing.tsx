"use client";
import { useDispatch } from "react-redux";
import styles from "./Landing.module.css";
import Image from "next/image";
import { open as openAuth } from "@/Redux/authModalSlice";

export default function Landing() {
  const dispatch = useDispatch();
  return (
    <div className="container">
      <div className="row">
        <div className={styles.landing__wrapper}>
          <div className={styles.landing__content}>
            <div className={styles["landing__content__title"]}>
              Gain more knowledge <br className={styles["remove--tablet"]} />
              in less time
            </div>
            <div className={styles["landing__content__subtitle"]}>
              Great summaries for busy people,
              <br className={styles["remove--tablet"]} />
              individuals who barely have time to read,
              <br className={styles["remove--tablet"]} />
              and even people who don’t like to read.
            </div>
            <button
              className="btn home__cta--btn"
              onClick={() => dispatch(openAuth())}
            >
              Login
            </button>
          </div>
          <figure className={styles["landing__image--mask"]}>
            <Image
              src="/assets-internship/landing.png"
              alt="landing"
              width={400}
              height={379}
              style={{ width: "100%", height: "auto" }}
            />
          </figure>
        </div>
      </div>
    </div>
  );
}
