"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, Mail, Siren } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageIntro } from "@/components/common/page-intro";
import { apiFetch } from "@/lib/api";

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [reply, setReply] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setStatus("sending");
    setError("");
    try {
      const data = await apiFetch<{ message: string }>("/api/v1/contact", {
        method: "POST",
        body: JSON.stringify({ name: String(form.get("name")), email: String(form.get("email")), message: String(form.get("message")) }),
      });
      setReply(data.message);
      setStatus("sent");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send your message. Please try again.");
      setStatus("idle");
    }
  }

  return (
    <>
      <PageIntro eyebrow="Contact" title="Write to us.">Questions about services, nurse registration or an existing booking.</PageIntro>
      <div className="container mx-auto grid gap-10 px-4 py-14 lg:grid-cols-[1fr_1.3fr]">
        <div className="space-y-5">
          <div className="rounded-3xl border bg-card p-6">
            <Mail className="h-5 w-5 text-[hsl(var(--clay))]" />
            <h2 className="mt-3 text-xl">Messages reach our team</h2>
            <p className="mt-1 text-sm text-muted-foreground">Signed-in patients can also message about a specific booking from their dashboard.</p>
          </div>
          <div className="rounded-3xl border border-destructive/30 bg-destructive/5 p-6">
            <Siren className="h-5 w-5 text-destructive" />
            <h2 className="mt-3 text-xl">Not for emergencies</h2>
            <p className="mt-1 text-sm text-muted-foreground">If someone needs urgent medical help, call 112 or go to the nearest hospital.</p>
          </div>
        </div>
        <div className="rounded-[2rem] border bg-card p-7 md:p-10">
          {status === "sent" ? (
            <div className="py-10 text-center" data-testid="status-contact-sent">
              <CheckCircle2 className="mx-auto h-10 w-10 text-[hsl(var(--sage))]" />
              <h2 className="mt-4 text-2xl">Message received</h2>
              <p className="mt-2 text-muted-foreground">{reply || "Thank you. We will reply by email."}</p>
              <Button variant="outline" className="mt-6 rounded-full" onClick={() => setStatus("idle")}>Send another</Button>
            </div>
          ) : (
            <form className="space-y-5" onSubmit={onSubmit}>
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2"><Label htmlFor="name">Name</Label><Input id="name" name="name" required minLength={2} data-testid="input-name" /></div>
                <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" name="email" type="email" required data-testid="input-email" /></div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <textarea id="message" name="message" required minLength={10} data-testid="input-message"
                  className="flex min-h-[160px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
              </div>
              {error && <p className="text-sm text-destructive" data-testid="text-contact-error">{error}</p>}
              <Button type="submit" size="lg" className="w-full rounded-full" disabled={status === "sending"} data-testid="button-send-contact">
                {status === "sending" ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending</> : "Send message"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
