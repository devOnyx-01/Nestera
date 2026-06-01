"use client";

import React, { useRef } from "react";
import { X, Keyboard } from "lucide-react";
import { useFocusTrap } from "../hooks/useFocusTrap";
import { SHORTCUTS } from "../hooks/useKeyboardShortcuts";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function KeyboardShortcutsModal({ isOpen, onClose }: Props) {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useFocusTrap({ isOpen, containerRef: modalRef, initialFocusRef: closeRef, onEscape: onClose });

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="shortcuts-title"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        ref={modalRef}
        className="w-full max-w-md mx-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-strong)] shadow-2xl"
      >
        <div className="flex items-center justify-between p-5 border-b border-[var(--color-border)]">
          <div className="flex items-center gap-2 text-[var(--color-text)]">
            <Keyboard size={18} className="text-[var(--color-accent)]" />
            <h2 id="shortcuts-title" className="m-0 text-base font-semibold">
              Keyboard Shortcuts
            </h2>
          </div>
          <button
            ref={closeRef}
            onClick={onClose}
            aria-label="Close shortcuts modal"
            className="rounded-lg p-1.5 text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-subtle)]"
          >
            <X size={16} />
          </button>
        </div>

        <ul className="p-4 space-y-1 list-none m-0" role="list">
          {SHORTCUTS.map((s) => (
            <li
              key={s.key}
              className="flex items-center justify-between gap-4 rounded-xl px-3 py-2.5 hover:bg-[var(--color-surface-subtle)]"
            >
              <span className="text-sm text-[var(--color-text-muted)]">{s.description}</span>
              <kbd className="shrink-0 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-1 font-mono text-xs font-semibold text-[var(--color-accent)]">
                {s.label}
              </kbd>
            </li>
          ))}
        </ul>

        <p className="px-5 pb-4 text-xs text-[var(--color-text-soft)]">
          Shortcuts are disabled when focus is inside a text field.
        </p>
      </div>
    </div>
  );
}
