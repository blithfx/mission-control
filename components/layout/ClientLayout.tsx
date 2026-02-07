"use client";

import dynamic from "next/dynamic";
import { ReactNode, useState, useEffect } from "react";

// Dynamically import everything that needs Convex
const AppContent = dynamic(
  () => import("./AppContent").then(mod => mod.AppContent),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center min-h-screen bg-zinc-950 text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-zinc-400">Loading Mission Control...</p>
        </div>
      </div>
    )
  }
);

export function ClientLayout({ children }: { children: ReactNode }) {
  return <AppContent>{children}</AppContent>;
}
