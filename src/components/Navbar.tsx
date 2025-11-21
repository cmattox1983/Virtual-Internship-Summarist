"use client";

import { useDispatch } from "react-redux";
import styles from "./Navbar.module.css";
import Image from "next/image";
import { open as openAuth } from "@/Redux/authModalSlice";

export default function Navbar() {
  const dispatch = useDispatch();
  return (
    <nav className={styles.nav}>
      <div className={styles.nav__wrapper}>
        <figure className={styles["nav__img--mask"]}>
          <Image
            className={styles.nav__img}
            src="/assets-internship/logo.png"
            alt="logo"
            width={200}
            height={46}
          />
        </figure>
        <ul className={styles["nav__list--wrapper"]}>
          <li
            className={`${styles.nav__list} ${styles["nav__list--login"]}`}
            onClick={() => dispatch(openAuth())}
          >
            Login
          </li>
          <li className={`${styles.nav__list} ${styles["nav__list--mobile"]}`}>
            About
          </li>
          <li className={`${styles.nav__list} ${styles["nav__list--mobile"]}`}>
            Contact
          </li>
          <li className={`${styles.nav__list} ${styles["nav__list--mobile"]}`}>
            Help
          </li>
        </ul>
      </div>
    </nav>
  );
}
