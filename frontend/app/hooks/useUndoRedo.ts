"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const MAX_HISTORY = 20;

export function useUndoRedo<T>(initialState: T) {
  const [history, setHistory] = useState<T[]>([initialState]);
  const [index, setIndex] = useState(0);
  const key = useRef(`undo-redo-${Math.random().toString(36).slice(2)}`);

  const state = history[index];
  const canUndo = index > 0;
  const canRedo = index < history.length - 1;

  const addToHistory = useCallback((newState: T) => {
    setHistory((prev: T[]) => {
      const trimmed = prev.slice(0, index + 1);
      const next = [...trimmed, newState].slice(-MAX_HISTORY);
      try { sessionStorage.setItem(key.current, JSON.stringify(next)); } catch {}
      return next;
    });
    setIndex((prev: number) => Math.min(prev + 1, MAX_HISTORY - 1));
  }, [index]);

  const undo = useCallback(() => {
    if (canUndo) setIndex((i: number) => i - 1);
  }, [canUndo]);

  const redo = useCallback(() => {
    if (canRedo) setIndex((i: number) => i + 1);
  }, [canRedo]);

  // Ctrl+Z / Ctrl+Shift+Z / Ctrl+Y
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const active = document.activeElement;
      const inInput = active instanceof HTMLInputElement || active instanceof HTMLTextAreaElement;
      if (inInput) return;
      if ((e.ctrlKey || e.metaKey) && e.key === "z") {
        e.preventDefault();
        if (e.shiftKey) redo(); else undo();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "y") {
        e.preventDefault();
        redo();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [undo, redo]);

  return { state, addToHistory, undo, redo, canUndo, canRedo };
}
