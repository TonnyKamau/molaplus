import { useSyncExternalStore } from "react";

/**
 * Site language (English default, French for the Côte d'Ivoire branch).
 *
 * The choice lives in Google Translate's `googtrans` cookie ("/en/fr"), which
 * the header switcher writes before reloading the page. Static marketing copy
 * is translated by Google; interactive components (order form, distributor
 * search, blog filters, feedback, toasts) render their own French through
 * `useT()` and are marked translate="no", so live values are always correct.
 */
export type Lang = "en" | "fr";

export function readLang(): Lang {
  if (typeof document === "undefined") return "en";
  const match = document.cookie.match(/(?:^|;\s*)googtrans=([^;]+)/);
  const value = match ? decodeURIComponent(match[1]) : "";
  return value.endsWith("/fr") ? "fr" : "en";
}

export function writeLang(lang: Lang) {
  const host = window.location.hostname;
  // Google may set the cookie on the bare host and on the parent domain, so
  // set/clear both or a stale copy wins.
  const domains = ["", host, host.includes(".") ? `.${host.split(".").slice(-2).join(".")}` : ""];
  for (const domain of new Set(domains)) {
    const scope = `path=/${domain ? `; domain=${domain}` : ""}`;
    if (lang === "en") {
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 GMT; ${scope}`;
    } else {
      document.cookie = `googtrans=/en/${lang}; max-age=31536000; ${scope}`;
    }
  }
  // Tell every component using useLang()/useT() to re-render now, in place.
  window.dispatchEvent(new Event(LANG_EVENT));
}

const LANG_EVENT = "mp-lang-change";

function subscribe(onChange: () => void) {
  window.addEventListener(LANG_EVENT, onChange);
  return () => window.removeEventListener(LANG_EVENT, onChange);
}

/** Current language; "en" during prerender, then live (switches without reload). */
export function useLang(): Lang {
  return useSyncExternalStore<Lang>(subscribe, readLang, () => "en");
}

/** `t("English", "Français")` picks the string for the current language. */
export function useT() {
  const lang = useLang();
  return Object.assign((en: string, fr: string) => (lang === "fr" ? fr : en), { lang });
}

/**
 * "1 product" / "3 products". French treats 0 and 1 as singular
 * ("0 commentaire"), English only 1 ("0 comments").
 */
export function plural(count: number, one: string, many: string, lang: Lang = "en") {
  const singular = lang === "fr" ? count <= 1 : count === 1;
  return `${count.toLocaleString(lang === "fr" ? "fr-FR" : "en-US")} ${singular ? one : many}`;
}
