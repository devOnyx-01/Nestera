"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export interface ShortcutDef {
  key: string;
  label: string;
  description: string;
  global?: boolean; // fires even inside inputs
}

export const SHORTCUTS: ShortcutDef[] = [
  { key: "Ctrl+K", label: "Ctrl+K", description: "Open search / command palette" },
  { key: "g d", label: "G then D", description: "Go to Dashboard" },
  { key: "g s", label: "G then S", description: "Go to Savings" },
  { key: "g p", label: "G then P", description: "Go to Portfolio" },
  { key: "g t", label: "G then T", description: "Go to Transactions" },
  { key: "?", label: "?", description: "Show keyboard shortcuts" },
  { key: "Escape", label: "Esc", description: "Close modals / dropdowns", global: true },
  { key: "Ctrl+/", label: "Ctrl+/", description: "Toggle theme" },
  { key: "n", label: "N", description: "New goal (on Savings page)" },
];

interface Options {
  onSearch?: () => void;
  onToggleTheme?: () => void;
  onShowHelp?: () => void;
  onNewGoal?: () => void;
  pathname?: string;
}

export function useKeyboardShortcuts({
  onSearch,
  onToggleTheme,
  onShowHelp,
  onNewGoal,
  pathname = "",
}: Options) {
  const router = useRouter();

  useEffect(() => {
    let pending: string | null = null;
    let pendingTimer: ReturnType<typeof setTimeout> | null = null;

    const clear = () => {
      pending = null;
      if (pendingTimer) clearTimeout(pendingTimer);
    };

    const handler = (e: KeyboardEvent) => {
      const active = document.activeElement;
      const inInput =
        active instanceof HTMLInputElement ||
        active instanceof HTMLTextAreaElement ||
        (active as HTMLElement)?.isContentEditable;

      // Ctrl+K — always fires
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        onSearch?.();
        return;
      }

      // Ctrl+/ — toggle theme
      if ((e.ctrlKey || e.metaKey) && e.key === "/") {
        e.preventDefault();
        onToggleTheme?.();
        return;
      }

      if (inInput) return;

      // ? — show help
      if (e.key === "?") {
        e.preventDefault();
        onShowHelp?.();
        return;
      }

      // N — new goal on savings page
      if (e.key === "n" && pathname.startsWith("/savings")) {
        e.preventDefault();
        onNewGoal?.();
        return;
      }

      // Two-key sequences: g then d/s/p/t
      if (e.key === "g") {
        pending = "g";
        pendingTimer = setTimeout(clear, 1000);
        return;
      }

      if (pending === "g") {
        clear();
        const routes: Record<string, string> = {
          d: "/dashboard",
          s: "/savings",
          p: "/dashboard/portfolio",
          t: "/dashboard/transactions",
        };
        const route = routes[e.key.toLowerCase()];
        if (route) {
          e.preventDefault();
          router.push(route);
        }
      }
    };

    document.addEventListener("keydown", handler);
    return () => {
      document.removeEventListener("keydown", handler);
      clear();
    };
  }, [onSearch, onToggleTheme, onShowHelp, onNewGoal, pathname, router]);
}
