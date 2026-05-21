"use client";

import { useEffect, useRef } from "react";
import { io, type Socket } from "socket.io-client";
import type { ClientToServerEvents, ServerToClientEvents } from "@nursenest/types";
import { useSession } from "next-auth/react";

type AppSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

export function useSocket(): AppSocket | null {
  const { data: session } = useSession();
  const socketRef = useRef<AppSocket | null>(null);

  useEffect(() => {
    if (!session?.accessToken) return;

    const url = process.env["NEXT_PUBLIC_SOCKET_URL"] ?? "http://localhost:3001";
    const socket: AppSocket = io(url, {
      auth: { token: session.accessToken },
      withCredentials: true,
    });
    socketRef.current = socket;

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [session?.accessToken]);

  return socketRef.current;
}
