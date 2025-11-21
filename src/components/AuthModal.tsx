"use client";
import Login from "./Login";
import Register from "./Register";
import ResetPassword from "./ResetPassword";
import { useAppSelector, useAppDispatch } from "@/Redux/Hooks";

export default function AuthModal() {
  const dispatch = useAppDispatch();
  const { isOpen, view } = useAppSelector((state) => state.authModal);

  return (
    <div>
      {isOpen &&
        (view === "login" ? (
          <Login />
        ) : view === "register" ? (
          <Register />
        ) : (
          <ResetPassword />
        ))}
    </div>
  );
}
