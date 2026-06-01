"use client";

import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useKeyboardShortcuts } from "../hooks/useKeyboardShortcuts";
import { useTheme } from "../context/ThemeContext";
import KeyboardShortcutsModal from "../components/KeyboardShortcutsModal";

export default function KeyboardShortcutsProvider({ children }: { children: React.ReactNode }) {
  const [showHelp, setShowHelp] = useState(false);
  const { toggleTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();

  useKeyboardShortcuts({
    onSearch: () => {
      // Focus the first search input on the page, or open a future command palette
      const input = document.querySelector<HTMLInputElement>('input[type="search"], input[placeholder*="earch"]');
      input?.focus();
    },
    onToggleTheme: toggleTheme,
    onShowHelp: () => setShowHelp(true),
    onNewGoal: () => router.push("/savings/create-goal"),
    pathname,
  });

  return (
    <>
      {children}
      <KeyboardShortcutsModal isOpen={showHelp} onClose={() => setShowHelp(false)} />
    </>
  );
}
