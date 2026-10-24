"use client";

import { useEffect, useState } from "react";
import { io, type Socket } from "socket.io-client";
import type { ClientToServerEvents, ServerToClientEvents } from "@nursenest/types";
import { useSession } from "next-auth/react";

type AppSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

export function useSocket(): AppSocket | null {
  const { data: session } = useSession();
  const [activeSocket, setActiveSocket] = useState<AppSocket | null>(null);

  useEffect(() => {
    if (!session?.accessToken) return;

    const url = process.env["NEXT_PUBLIC_SOCKET_URL"] ?? window.location.origin;
    const socket: AppSocket = io(url, {
      auth: { token: session.accessToken },
      withCredentials: true,
    });
    setActiveSocket(socket);

    return () => {
      socket.disconnect();
      setActiveSocket(null);
    };
  }, [session?.accessToken]);

  return activeSocket;
}
