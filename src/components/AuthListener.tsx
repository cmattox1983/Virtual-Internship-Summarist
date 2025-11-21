"use client";
import { useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/Redux/Store";
import { setUser, clearUser } from "@/Redux/authStateSlice";
import { app } from "@/app/firebase";

export default function AuthListener() {
  const dispatch = useDispatch<AppDispatch>();
  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        dispatch(
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email ?? null,
            isAnonymous: firebaseUser.isAnonymous,
          })
        );
      } else {
        dispatch(clearUser());
      }
    });

    return unsubscribe;
  }, [dispatch, auth]);

  return null;
}
