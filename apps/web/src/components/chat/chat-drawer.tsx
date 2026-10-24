"use client";

import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { Loader2, RefreshCw, Send } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { cn, formatDate } from "@/lib/utils";

export interface ChatMessage {
  id: string;
  bookingId: string;
  senderId: string;
  body: string;
  createdAt: string;
}

export function ChatDrawer({ bookingId, title }: { bookingId: string; title?: string }) {
  const qc = useQueryClient();
  const { data: session } = useSession();
  const myId = (session?.user as { id?: string } | undefined)?.id;
  const [text, setText] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  const key = ["chat", bookingId];

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: key,
    queryFn: () => apiFetch<{ messages: ChatMessage[] }>(`/api/v1/chat/${bookingId}`),
    refetchInterval: 15000,
  });
  const messages = data?.messages ?? [];

  const send = useMutation({
    mutationFn: (body: string) => apiFetch<ChatMessage>(`/api/v1/chat/${bookingId}`, { method: "POST", body: JSON.stringify({ body }) }),
    onSuccess: (msg) => {
      setText("");
      qc.setQueryData<{ messages: ChatMessage[] }>(key, (old) => ({ messages: [...(old?.messages ?? []), msg] }));
    },
  });

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages.length]);

  return (
    <div className="flex h-[min(70dvh,640px)] flex-col overflow-hidden rounded-3xl border bg-card">
      <div className="flex items-center justify-between border-b px-5 py-4">
        <div><p className="eyebrow">Booking conversation</p><h3 className="text-lg">{title ?? "Messages"}</h3></div>
        <Button variant="ghost" size="sm" onClick={() => void refetch()} aria-label="Refresh messages"><RefreshCw className="h-4 w-4" /></Button>
      </div>
      <div className="kolam-bg flex-1 space-y-3 overflow-y-auto p-5" data-testid="list-chat-messages">
        {isLoading && [0, 1, 2].map((i) => <div key={i} className={cn("h-12 w-2/3 animate-pulse rounded-2xl bg-muted", i % 2 && "ml-auto")} />)}
        {isError && (
          <div className="rounded-2xl border bg-card p-4 text-sm">
            Messages could not be loaded. <button className="font-medium underline" onClick={() => void refetch()}>Retry</button>
          </div>
        )}
        {!isLoading && !isError && messages.length === 0 && (
          <p className="mx-auto mt-10 max-w-xs text-center text-sm text-muted-foreground">No messages yet. Questions about this visit can be written here; replies are not instant.</p>
        )}
        {messages.map((m) => {
          const mine = m.senderId === myId;
          return (
            <div key={m.id} className={cn("max-w-[80%] rounded-2xl px-4 py-2.5 text-sm", mine ? "ml-auto rounded-br-sm bg-primary text-primary-foreground" : "rounded-bl-sm border bg-card")}>
              <p className="whitespace-pre-wrap">{m.body}</p>
              <p className={cn("mt-1 text-[10px]", mine ? "opacity-70" : "text-muted-foreground")}>{formatDate(m.createdAt)}</p>
            </div>
          );
        })}
        <div ref={endRef} />
      </div>
      <form className="flex gap-2 border-t p-3" onSubmit={(e) => { e.preventDefault(); const b = text.trim(); if (b) send.mutate(b); }}>
        <textarea value={text} onChange={(e) => setText(e.target.value)} rows={1} placeholder="Write a message" maxLength={2000}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); const b = text.trim(); if (b) send.mutate(b); } }}
          className="min-h-[44px] flex-1 resize-none rounded-xl border border-input bg-background px-3 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" data-testid="input-chat" />
        <Button type="submit" disabled={send.isPending || !text.trim()} className="h-11 rounded-xl" data-testid="button-chat-send">
          {send.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </form>
      {send.isError && <p className="px-4 pb-3 text-xs text-destructive">{send.error.message}</p>}
    </div>
  );
}
