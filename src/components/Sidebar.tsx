"use client";

import React, { useEffect } from "react";
import styles from "./Sidebar.module.css";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  FaHouse,
  FaBookmark,
  FaMagnifyingGlass,
  FaHighlighter,
  FaGear,
  FaCircleQuestion,
  FaArrowRightToBracket,
} from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { open as openAuth } from "@/Redux/authModalSlice";
import { close as closeSideBar } from "@/Redux/sideBarSlice";
import { RootState } from "@/Redux/Store";
import FontControls from "./FontControls";
import { signOut } from "firebase/auth";
import { auth } from "@/app/auth";

type NavItem = {
  href: string;
  label: string;
  Icon: React.ElementType;
  disabled?: boolean;
  showActive?: boolean;
};

const TOP_LINKS: NavItem[] = [
  { href: "/for-you", label: "For you", Icon: FaHouse, showActive: true },
  { href: "/library", label: "My Library", Icon: FaBookmark, showActive: true },
  {
    href: "/highlights",
    label: "Highlights",
    Icon: FaHighlighter,
    disabled: true,
  },
  { href: "/search", label: "Search", Icon: FaMagnifyingGlass, disabled: true },
];

const BOTTOM_LINKS: NavItem[] = [
  { href: "/settings", label: "Settings", Icon: FaGear, showActive: true },
  {
    href: "/help",
    label: "Help & Support",
    Icon: FaCircleQuestion,
    disabled: true,
  },
  {
    href: "/login",
    label: "Login",
    Icon: FaArrowRightToBracket,
    showActive: false,
  },
];

type FontSize = "sm" | "med" | "lg" | "xl";

export default function Sidebar({
  onChangeFont,
}: {
  onChangeFont: (size: FontSize) => void;
}) {
  const pathname = usePathname();

  const dispatch = useDispatch();

  const isOpen = useSelector((state: RootState) => state.sideBar.isOpen);

  const user = useSelector((state: RootState) => state.auth.user);

  const isLoggedIn = !!user;

  const displayedLabel = isLoggedIn ? "Logout" : "Login";

  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth <= 768) {
      dispatch(closeSideBar());
    }
  }, [pathname, dispatch]);

  const handleSignout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.log(error);
    }
  };

  const renderItem = ({ href, label, Icon, disabled, showActive }: NavItem) => {
    const active =
      !!showActive && (pathname === href || pathname.startsWith(href + "/"));

    const isLogin = href === "/login";

    const displayed = isLogin ? displayedLabel : label;

    const handleClick = (e: React.MouseEvent) => {
      if (isLogin && !isLoggedIn) {
        e.preventDefault();
        dispatch(openAuth());
        return;
      }

      if (isLogin && isLoggedIn) {
        e.preventDefault();
        handleSignout();
        return;
      }

      if (window.innerWidth <= 768) {
        dispatch(closeSideBar());
      }
    };

    const Wrapper: any = disabled || isLogin ? "div" : Link;

    return (
      <Wrapper
        key={href}
        href={disabled || isLogin ? undefined : href}
        onClick={handleClick}
        aria-current={active ? "page" : undefined}
        aria-disabled={disabled || undefined}
        tabIndex={disabled ? -1 : 0}
        className={`${styles["sidebar__link--wrapper"]} ${
          disabled ? styles["sidebar__link--not-allowed"] : ""
        }`}
      >
        <div
          className={`${styles["sidebar__link--line"]} ${
            active ? styles["active--tab"] : ""
          }`}
          aria-hidden="true"
        />
        <div className={styles["sidebar__icon--wrapper"]}>
          <Icon
            width={24}
            height={24}
            className={styles["sidebar__icon--wrapper-svg"]}
          />
        </div>
        <div className={styles["sidebar__link--text"]}>{displayed}</div>
      </Wrapper>
    );
  };

  return (
    <>
      <div
        className={`${styles.sidebar__overlay} ${
          isOpen ? styles["sidebar__overlay--visible"] : ""
        }`}
        onClick={() => dispatch(closeSideBar())}
      ></div>
      <div
        className={`${styles.sidebar} ${
          isOpen ? styles["sidebar--opened"] : ""
        }`}
      >
        <div className={styles.sidebar__logo}>
          <Image
            src="/assets-internship/logo.png"
            alt="logo"
            className={styles["sidebar__logo--img"]}
            width={200}
            height={46}
            priority
          />
        </div>

        <div className={styles.sidebar__wrapper}>
          <div className={styles.sidebar__top}>
            {TOP_LINKS.map(renderItem)}
            {pathname.startsWith("/player/") ? (
              <FontControls onChangeFont={onChangeFont} />
            ) : null}
          </div>
          <div className={styles.sidebar__bottom}>
            {BOTTOM_LINKS.map(renderItem)}
          </div>
        </div>
      </div>
    </>
  );
}
