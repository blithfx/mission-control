"use client";

import dynamic from "next/dynamic";
import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";

const ConvexClientProvider = dynamic(
  () => import("@/components/providers/ConvexClientProvider").then(mod => mod.ConvexClientProvider),
  { ssr: false }
);

export function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <ConvexClientProvider>
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 ml-64 p-8">
          {children}
        </main>
      </div>
    </ConvexClientProvider>
  );
}
