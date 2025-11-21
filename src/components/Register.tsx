"use client";
import React, { useState } from "react";
import styles from "./Login.module.css";
import { FaXmark } from "react-icons/fa6";
import { setView, close as closeAuth } from "@/Redux/authModalSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/Redux/Store";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { auth, googleProvider } from "@/app/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaCircleNotch } from "react-icons/fa";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const isOpen = useSelector((state: RootState) => state.authModal.isOpen);
  const router = useRouter();
  const [loadingRegister, setLoadingRegister] = useState(false);

  const handleSignUp = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setErrorMessage(null);
    setLoadingRegister(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      dispatch(closeAuth());
      const path = window.location.pathname;
      if (path === "/") {
        router.push("/for-you");
      } else if (path.includes("/book/${book.id}")) {
        router.push("/player/${book.id}");
      }
    } catch (err: any) {
      switch (err.code) {
        case "auth/invalid-email":
          setErrorMessage("Please enter a valid email address.");
          break;
        case "auth/password-does-not-meet-requirements":
          setErrorMessage("Password must be at least 6 characters.");
          break;
        case "auth/email-already-in-use":
          setErrorMessage("That email is already in use.");
          break;
        default:
          setErrorMessage("Something went wrong. Please try again.");
      }
    }
    setLoadingRegister(false);
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      dispatch(closeAuth());
      const path = window.location.pathname;
      if (path === "/") {
        router.push("/for-you");
      } else if (path.includes("/book/${book.id}")) {
        router.push("/player/${book.id}");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className={`${styles.wrapper} ${styles.wrapper__full}`}>
        <div
          className={`${styles.sidebar__overlay} ${
            !isOpen ? styles["sidebar__overlay--hidden"] : ""
          }`}
          onClick={() => dispatch(closeAuth())}
        ></div>
        <div className={styles.auth__wrapper}>
          <div className={styles.auth}>
            <div className={styles.auth__content}>
              <div className={styles.auth__title}>Sign up to Summarist</div>
              <Link
                href="/for-you"
                className={`btn ${styles["google__btn--wrapper"]}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleGoogleSignIn();
                }}
              >
                <figure className={styles["google__icon--mask"]}>
                  <img src="/assets-internship/google.png" alt="google" />
                </figure>
                <div>Sign up with Google</div>
              </Link>
              <div className={styles.auth__separator}>
                <span className={styles["auth__separator--text"]}>or</span>
              </div>
              <form
                className={styles.auth__main__form}
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSignUp();
                }}
              >
                {errorMessage && (
                  <div className="auth__error">{errorMessage}</div>
                )}

                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrorMessage(null);
                  }}
                  onKeyDown={(e) => {
                    e.key === "Enter" && handleSignUp();
                  }}
                  className={styles.auth__main__input}
                  placeholder="Email Address"
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrorMessage(null);
                  }}
                  onKeyDown={(e) => {
                    e.key === "Enter" && handleSignUp();
                  }}
                  className={styles.auth__main__input}
                  placeholder="Password"
                />
                <button type="submit" className="btn">
                  {loadingRegister ? (
                    <div className="spinner__icon--wrapper">
                      <FaCircleNotch className="spinner__icon--wrapper-svg" />
                    </div>
                  ) : (
                    <span>Sign up</span>
                  )}
                </button>
              </form>
            </div>
            <button
              className={styles["auth__switch--btn"]}
              onClick={() => dispatch(setView("login"))}
            >
              Already have an account?
            </button>
            <div
              className={styles["auth__close--btn"]}
              onClick={() => dispatch(closeAuth())}
            >
              <FaXmark size={28} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
