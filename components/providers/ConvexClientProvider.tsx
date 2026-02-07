"use client";

import { ReactNode, useState, useEffect } from "react";

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  const [Provider, setProvider] = useState<React.ComponentType<{children: ReactNode}> | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_CONVEX_URL;
    
    if (!url) {
      setError("NEXT_PUBLIC_CONVEX_URL is not set");
      console.error("NEXT_PUBLIC_CONVEX_URL is not set. Check your environment variables.");
      return;
    }

    // Only import Convex on the client
    import("convex/react")
      .then(({ ConvexProvider, ConvexReactClient }) => {
        const client = new ConvexReactClient(url);
        setProvider(() => ({ children }: { children: ReactNode }) => (
          <ConvexProvider client={client}>{children}</ConvexProvider>
        ));
      })
      .catch((err) => {
        setError(err.message);
        console.error("Failed to load Convex:", err);
      });
  }, []);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-950 text-white">
        <div className="text-center p-8">
          <h1 className="text-xl font-bold text-red-500 mb-2">Configuration Error</h1>
          <p className="text-zinc-400">{error}</p>
        </div>
      </div>
    );
  }

  if (!Provider) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-950 text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-zinc-400">Loading...</p>
        </div>
      </div>
    );
  }
  
  return <Provider>{children}</Provider>;
}
