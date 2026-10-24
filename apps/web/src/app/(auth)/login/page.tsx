"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ApiResponse, LoginResponseDto, Role } from "@nursenest/types";

const roleRedirect: Record<Role, string> = {
  PATIENT: "/dashboard/patient",
  NURSE: "/dashboard/nurse",
  ADMIN: "/dashboard/admin",
};

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email"));
    const password = String(form.get("password"));

    try {
      const result = await signIn("credentials", { email, password, redirect: false });
      if (result?.error) throw new Error("Invalid email or password.");
      const session = await getSession();
      if (!session?.user?.role) throw new Error("Could not start your session.");
      router.push(roleRedirect[session.user.role]);
      router.refresh();
    } catch {
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex w-full items-center justify-center p-4">
      <Card className="w-full max-w-md border-border/70 bg-card/90 shadow-[0_30px_60px_-30px_hsl(var(--primary)/0.35)] backdrop-blur">
        <CardHeader>
          <CardTitle>Sign in to NurseNest</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm">
            <Link href="/forgot-password" className="text-primary hover:underline">
              Forgot password?
            </Link>
          </p>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            No account?{" "}
            <Link href="/register" className="text-primary hover:underline">
              Register
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
