"use client";

import { FaCircleNotch, FaUser } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import styles from "./Login.module.css";
import { useDispatch, useSelector } from "react-redux";
import { close as closeAuth, setView } from "@/Redux/authModalSlice";
import { AppDispatch, RootState } from "@/Redux/Store";
import { useState } from "react";
import {
  getAuth,
  signInAnonymously,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import Link from "next/link";
import { googleProvider } from "@/app/auth";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const isOpen = useSelector((state: RootState) => state.authModal.isOpen);
  const router = useRouter();
  const [loadingLogin, setLoadingLogin] = useState(false);
  const [loadingGuest, setLoadingGuest] = useState(false);

  const auth = getAuth();

  const handleLogin = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setErrorMessage(null);
    setLoadingLogin(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
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
        case "auth/user-not-found":
          setErrorMessage("Email not registered, please create an account.");
          break;
        case "auth/wrong-password":
          setErrorMessage("Invalid password.");
          break;
        default:
          setErrorMessage("Something went wrong. Please try again.");
      }
    }
    setLoadingLogin(false);
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

  const handleGuestLogin = async () => {
    setLoadingGuest(true);
    try {
      await signInAnonymously(auth);
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
    setLoadingGuest(false);
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
              <div className={styles.auth__title}>Log in to Summarist</div>
              {errorMessage && (
                <div className="auth__error">{errorMessage}</div>
              )}

              <Link
                href="/for-you"
                className={`btn ${styles["guest__btn--wrapper"]}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleGuestLogin();
                }}
              >
                <figure className={styles["guest__icon--mask"]}>
                  <FaUser size={24} />
                </figure>
                {loadingGuest ? (
                  <div className="spinner__icon--wrapper">
                    <FaCircleNotch className="spinner__icon--wrapper-svg" />
                  </div>
                ) : (
                  <div>Login as a Guest</div>
                )}
              </Link>
              <div className={styles.auth__separator}>
                <span className={styles["auth__separator--text"]}>or</span>
              </div>
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
                <div>Login with Google</div>
              </Link>
              <div className={styles.auth__separator}>
                <span className={styles["auth__separator--text"]}>or</span>
              </div>
              <form className={styles.auth__main__form}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrorMessage(null);
                  }}
                  onKeyDown={(e) => {
                    e.key === "Enter" && handleLogin();
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
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  className={styles.auth__main__input}
                  placeholder="Password"
                />
                <Link
                  href="/for-you"
                  className="btn"
                  onClick={(e) => {
                    e.preventDefault();
                    handleLogin();
                  }}
                >
                  {loadingLogin ? (
                    <div className="spinner__icon--wrapper">
                      <FaCircleNotch className="spinner__icon--wrapper-svg" />
                    </div>
                  ) : (
                    <span>Login</span>
                  )}
                </Link>
              </form>
            </div>
            <div
              className={styles["auth__forgot--password"]}
              onClick={() => dispatch(setView("reset"))}
            >
              Forgot your password?
            </div>
            <button
              className={styles["auth__switch--btn"]}
              onClick={() => dispatch(setView("register"))}
            >
              Don't have an account?
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
