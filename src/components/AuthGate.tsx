"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/Redux/Store";
import "@/UI/Skeleton.module.css";

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const { authLoaded } = useSelector((state: RootState) => state.auth);

  return <>{children}</>;
}
