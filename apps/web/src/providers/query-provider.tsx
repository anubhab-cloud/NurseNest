"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const [client] = useState(() => new QueryClient());
  useEffect(() => { client.clear(); }, [client, session?.user?.id]);
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
