"use client";

import { useState } from "react";

/** Copies text and remembers which item was copied for a moment, so its button can say so. */
export function useCopy() {
  const [copied, setCopied] = useState<string | null>(null);
  const copy = async (text: string, key = text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      /* older browsers: nothing to fall back to without a visible input */
    }
    setCopied(key);
    setTimeout(() => setCopied(null), 1800);
  };
  return { copied, copy };
}