"use client";
import { useDispatch, useSelector } from "react-redux";
import styles from "./Login.module.css";
import { FaXmark } from "react-icons/fa6";
import { setView, close as closeAuth } from "@/Redux/authModalSlice";
import { AppDispatch, RootState } from "@/Redux/Store";
import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/app/auth";
import { FaCircleNotch } from "react-icons/fa";

export default function ResetPassword() {
  const dispatch = useDispatch<AppDispatch>();
  const isOpen = useSelector((state: RootState) => state.authModal.isOpen);
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loadingReset, setLoadingReset] = useState(false);

  const handleResetPassword = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setErrorMessage(null);
    setLoadingReset(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setSuccessMessage("Your reset email has been sent!");
    } catch (err: any) {
      switch (err.code) {
        case "auth/invalid-email":
          setErrorMessage("Please enter a valid email address.");
          break;
        case "auth/user-not-found":
          setErrorMessage("Email not registered, please create an account.");
          break;
        default:
          setErrorMessage("Something went wrong. Please try again.");
      }
    }
    setLoadingReset(false);
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
              <div className={styles.auth__title}>Reset your password</div>

              <form
                className={styles.auth__main__form}
                onSubmit={(e) => {
                  e.preventDefault();
                  handleResetPassword();
                }}
              >
                {errorMessage ? (
                  <div className="auth__error">{errorMessage}</div>
                ) : (
                  <div className="auth__success">{successMessage}</div>
                )}
                <input
                  type="email"
                  className={styles.auth__main__input}
                  placeholder="Email address"
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrorMessage(null);
                    setSuccessMessage(null);
                  }}
                  onKeyDown={(e) => {
                    e.key === "Enter" && handleResetPassword();
                  }}
                />
                <button className="btn">
                  {loadingReset ? (
                    <div className="spinner__icon--wrapper">
                      <FaCircleNotch className="spinner__icon--wrapper-svg" />
                    </div>
                  ) : (
                    <span>Send reset password link</span>
                  )}
                </button>
              </form>
            </div>
            <button
              className={styles["auth__switch--btn"]}
              onClick={() => dispatch(setView("login"))}
            >
              Go to login
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
