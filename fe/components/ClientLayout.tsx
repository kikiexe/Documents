"use client";

import React from "react";
import dynamic from "next/dynamic";

const Web3Provider = dynamic(
  () => import("../provider/wallet").then((mod) => mod.Web3Provider),
  { ssr: false }
);

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <Web3Provider>
      {children}
    </Web3Provider>
  );
}