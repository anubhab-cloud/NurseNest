"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => setDark(document.documentElement.classList.contains("dark")), []);
  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try { localStorage.setItem("nn-theme", next ? "dark" : "light"); } catch { /* ignore */ }
  }
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle colour theme"
      data-testid="button-theme-toggle"
      className="grid h-9 w-9 place-items-center rounded-full border bg-card/60 text-foreground transition hover:bg-accent"
    >
      {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}
