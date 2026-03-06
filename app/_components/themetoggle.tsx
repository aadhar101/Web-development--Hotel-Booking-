"use client";
import { useEffect, useState } from "react";
export default function ThemeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored === "dark" || (!stored && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      document.documentElement.classList.add("dark"); setDark(true);
    }
  }, []);
  const toggle = () => {
    const next = !dark; setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };
  return <button onClick={toggle} aria-label="Toggle theme" className="h-8 w-8 rounded-md border border-black/10 dark:border-white/10 flex items-center justify-center text-sm hover:bg-black/5 dark:hover:bg-white/5">{dark ? "☀️" : "🌙"}</button>;
}