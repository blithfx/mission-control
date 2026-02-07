"use client";

import { ReactNode, useState, useEffect } from "react";

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  const [Provider, setProvider] = useState<React.ComponentType<{children: ReactNode}> | null>(null);

  useEffect(() => {
    // Only import Convex on the client
    import("convex/react").then(({ ConvexProvider, ConvexReactClient }) => {
      const url = process.env.NEXT_PUBLIC_CONVEX_URL;
      if (url) {
        const client = new ConvexReactClient(url);
        setProvider(() => ({ children }: { children: ReactNode }) => (
          <ConvexProvider client={client}>{children}</ConvexProvider>
        ));
      }
    });
  }, []);

  if (!Provider) {
    return <>{children}</>;
  }
  
  return <Provider>{children}</Provider>;
}
