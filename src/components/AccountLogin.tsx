"use client";
import Image from "next/image";
import React from "react";
import styles from "./AudioLogin.module.css";
import { useDispatch } from "react-redux";
import { open as openAuth } from "@/Redux/authModalSlice";

export default function AccountLogin() {
  const dispatch = useDispatch();

  return (
    <>
      <div className={styles["settings__login--wrapper"]}>
        <Image
          src="/assets-internship/login.png"
          alt="login"
          width={460}
          height={317}
          style={{ width: "100%", height: "auto" }}
          className={styles["settings__login--wrapper-img"]}
        />
        <div className={styles["settings__login--text"]}>
          "Log in to your account to see your details."
        </div>
        <button
          className={`${styles["settings__login--btn"]} btn`}
          onClick={() => dispatch(openAuth())}
        >
          Login
        </button>
      </div>
    </>
  );
}
