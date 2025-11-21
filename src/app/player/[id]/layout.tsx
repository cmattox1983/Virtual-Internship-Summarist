"use client";

import Search from "@/components/Search";
import Sidebar from "@/components/Sidebar";
import React, { createContext, useState } from "react";

type FontSize = "sm" | "med" | "lg" | "xl";

export const FontContext = createContext({
  fontSize: "sm" as FontSize,
  setFontSize: (_: FontSize) => {},
});

export default function PlayerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [fontSize, setFontSize] = useState<FontSize>("sm");

  return (
    <FontContext.Provider value={{ fontSize, setFontSize }}>
      <Sidebar onChangeFont={setFontSize} />
      <div className="wrapper">
        <Search />
        <div className="summary">
          <div className="audio__book--summary">{children}</div>
        </div>
      </div>
    </FontContext.Provider>
  );
}
