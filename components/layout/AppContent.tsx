"use client";

import { ReactNode, useState, useEffect } from "react";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { Sidebar } from "./Sidebar";
import { MobileNav } from "./MobileNav";

export function AppContent({ children }: { children: ReactNode }) {
  const [convex, setConvex] = useState<ConvexReactClient | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Hardcoded temporarily - env var not working in Vercel
    const url = process.env.NEXT_PUBLIC_CONVEX_URL || "https://effervescent-giraffe-131.convex.cloud";
    
    if (!url) {
      setError("NEXT_PUBLIC_CONVEX_URL is not configured");
      return;
    }

    try {
      const client = new ConvexReactClient(url);
      setConvex(client);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to initialize Convex");
    }
  }, []);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-950 text-white">
        <div className="text-center p-8 max-w-md">
          <h1 className="text-xl font-bold text-red-500 mb-2">Configuration Error</h1>
          <p className="text-zinc-400 mb-4">{error}</p>
          <p className="text-sm text-zinc-500">Check that NEXT_PUBLIC_CONVEX_URL is set in Vercel environment variables.</p>
        </div>
      </div>
    );
  }

  if (!convex) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-950 text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-zinc-400">Connecting...</p>
        </div>
      </div>
    );
  }

  return (
    <ConvexProvider client={convex}>
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 md:ml-64 p-4 md:p-8 pb-20 md:pb-8">
          {children}
        </main>
        <MobileNav />
      </div>
    </ConvexProvider>
  );
}
