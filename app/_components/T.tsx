"use client";

import { useT } from "../../lib/i18n";

/**
 * Inline hand-written translation for server-rendered pages, used where
 * Google's machine translation gets the wording wrong. Google is told to leave
 * it alone so it never overrides the French we wrote.
 */
export function T({ en, fr }: { en: string; fr: string }) {
  const t = useT();
  return <span translate="no">{t(en, fr)}</span>;
}
