"use client";

import { useEffect } from "react";

import { type Lang, readLang, useLang, writeLang } from "../../lib/i18n";

/**
 * EN / FR switcher for the Côte d'Ivoire audience.
 *
 * The site is a static export, so translation is done client-side with the
 * Google Website Translator. The chosen language is stored in Google's
 * `googtrans` cookie (e.g. "/en/fr"); the widget reads it on every page load
 * and translates the page automatically. Google's own banner/UI is hidden in
 * globals.css — this component is the only visible control.
 */

const LANGS: { code: Lang; label: string; name: string }[] = [
  { code: "en", label: "EN", name: "English" },
  { code: "fr", label: "FR", name: "Français" },
];

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: {
      translate?: {
        TranslateElement: new (options: Record<string, unknown>, id: string) => unknown;
      };
    };
    __mpDomPatched?: boolean;
  }
}

type TrackedText = Text & { __mpFont?: Element; __mpCopy?: TrackedText; __mpOwner?: TrackedText };

/**
 * Google Translate translates a text node by inserting a translated <font>
 * right before it and then removing the original. React still holds the
 * original node, so without help:
 *  - live values (basket counts, totals, messages) are written into a node
 *    that is no longer on the page, and the stale translation stays visible;
 *  - React removing/inserting around that node throws or leaves stale copies.
 * We remember what is currently shown in place of each React text node (its
 * <font>, or a fresh copy we inserted) and route React's operations to it.
 * Updated text is shown as a brand-new text node, because Google only
 * translates nodes it has not processed before.
 */
function patchDomForTranslation() {
  if (window.__mpDomPatched || typeof Node !== "function") return;
  window.__mpDomPatched = true;

  const isText = (node: Node): node is TrackedText => node.nodeType === Node.TEXT_NODE;
  const isGoogleFont = (node: Node | null): node is Element =>
    node instanceof Element && node.tagName === "FONT" && (node as HTMLElement).style.verticalAlign === "inherit";

  /** The node currently on the page on behalf of a React text node. */
  const shown = (node: Node): Node => {
    let current: Node = node;
    for (let hops = 0; hops < 8 && !current.isConnected && isText(current); hops++) {
      const next: Node | undefined = current.__mpCopy ?? current.__mpFont;
      if (!next) break;
      current = next;
    }
    return current.isConnected ? current : node;
  };

  /**
   * Google answered for a copy that a newer value has already replaced, and it
   * will not revisit the newer copy. Re-insert the current value as a fresh
   * node so it gets translated too.
   */
  const refreshLater = (stale: TrackedText) => {
    const owner = stale.__mpOwner;
    if (!owner) return;
    window.setTimeout(() => {
      const current = owner.__mpCopy;
      if (!current || !current.isConnected || current.__mpFont || !current.parentNode) return;
      const fresh = document.createTextNode(current.nodeValue ?? "") as TrackedText;
      fresh.__mpOwner = owner;
      current.parentNode.replaceChild(fresh, current);
      owner.__mpCopy = fresh;
    }, 60);
  };

  const originalRemove = Node.prototype.removeChild;
  Node.prototype.removeChild = function <T extends Node>(this: Node, child: T): T {
    if (child.parentNode !== this) {
      const stand = shown(child);
      if (stand !== child && stand.parentNode === this) originalRemove.call(this, stand);
      return child;
    }
    // Google removing a text node it has just replaced: remember the pair.
    if (isText(child) && isGoogleFont(child.previousSibling)) {
      const font = child.previousSibling as HTMLElement;
      child.__mpFont = font;
      // Google trims edge spaces ("4" + " units" -> "4unités"); keep the gap.
      const before = child.nodeValue ?? "";
      const after = font.textContent ?? "";
      if (/^\s/.test(before) && !/^\s/.test(after)) font.style.marginInlineStart = "0.25em";
      if (/\s$/.test(before) && !/\s$/.test(after)) font.style.marginInlineEnd = "0.25em";
    }
    return originalRemove.call(this, child) as T;
  };

  const originalInsert = Node.prototype.insertBefore;
  Node.prototype.insertBefore = function <T extends Node>(this: Node, node: T, ref: Node | null): T {
    if (ref && ref.parentNode !== this) {
      const stand = shown(ref);
      if (stand !== ref && stand.parentNode === this) return originalInsert.call(this, node, stand) as T;
      if (isText(ref) && ref.__mpOwner) refreshLater(ref);
      return node;
    }
    return originalInsert.call(this, node, ref) as T;
  };

  // React writes text updates through nodeValue (and sometimes data).
  const showUpdate = (text: TrackedText, value: string) => {
    if (text.isConnected) return;
    const stand = shown(text);
    if (stand === text || !stand.parentNode) return;
    const copy = document.createTextNode(value) as TrackedText;
    copy.__mpOwner = text;
    stand.parentNode.replaceChild(copy, stand);
    text.__mpCopy = copy;
    text.__mpFont = undefined;
  };
  for (const [proto, prop] of [[Node.prototype, "nodeValue"], [CharacterData.prototype, "data"]] as const) {
    const desc = Object.getOwnPropertyDescriptor(proto, prop);
    if (!desc?.set || !desc.get) continue;
    const { get, set } = desc;
    Object.defineProperty(proto, prop, {
      configurable: true,
      enumerable: desc.enumerable,
      get() {
        return get.call(this);
      },
      set(value: string) {
        set.call(this, value);
        if (isText(this as Node)) showUpdate(this as TrackedText, String(value));
      },
    });
  }
}

/**
 * Product names must match the packaging, so keep short labels that carry a
 * product name (headings, cards, captions, order lines) in English. Long
 * sentences that merely mention a product are still translated. Setting an
 * attribute is safe for React, unlike rewriting its text nodes.
 */
const PRODUCT_NAME =
  /Super\s*Milk\s*Booster|Poultry\s*Microbes|Pig\s*Microbes|Livestock\s*Microbes|Mazao|Mineral\s*Lick|Calf-?\s*Weaner|Layer\s*Mash|Bovine\s*Meal|Steaming\s*Formula|V-EM|Mbolea/i;
const LABEL_TAGS = "h1,h2,h3,h4,h5,h6,p,span,a,button,li,option,label,td,th,strong,b,em,figcaption,small,dt,dd";

function protectProductNames(root: ParentNode) {
  const candidates = root instanceof Element ? [root, ...root.querySelectorAll(LABEL_TAGS)] : [...root.querySelectorAll(LABEL_TAGS)];
  for (const el of candidates) {
    if (!(el instanceof HTMLElement) || el.getAttribute("translate") === "no") continue;
    const text = el.textContent ?? "";
    if (text.length > 60 || !PRODUCT_NAME.test(text)) continue;
    const children = [...el.children] as HTMLElement[];
    // Only lock the smallest element that holds the name...
    if (children.some((c) => PRODUCT_NAME.test(c.textContent ?? ""))) continue;
    el.setAttribute("translate", "no");
    // ...and let its other parts (e.g. "Minerals + probiotics") translate.
    for (const c of children) {
      if (!c.classList.contains("notranslate") && (c.textContent ?? "").trim()) c.setAttribute("translate", "yes");
    }
  }
}

function watchProductNames() {
  protectProductNames(document.body);
  const observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
      for (const node of m.addedNodes) {
        if (node instanceof Element) protectProductNames(node);
      }
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
  return observer;
}

function loadTranslator() {
  if (document.getElementById("google-translate-script")) return;
  window.googleTranslateElementInit = () => {
    if (!window.google?.translate) return;
    new window.google.translate.TranslateElement(
      { pageLanguage: "en", includedLanguages: "en,fr", autoDisplay: false },
      "google_translate_element",
    );
  };
  const script = document.createElement("script");
  script.id = "google-translate-script";
  script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
  script.async = true;
  document.body.appendChild(script);
}

type Props = {
  className?: string;
  /** Visible "Language" caption, used inside the mobile menu. */
  label?: boolean;
  /**
   * Exactly one instance (the header) loads Google's widget and installs the
   * navigation listeners; extra instances are plain buttons.
   */
  host?: boolean;
};

export function LanguageSwitcher({ className = "", label = false, host = true }: Props) {
  const lang = useLang();

  useEffect(() => {
    if (!host) return;
    const current = readLang();
    // Only pull in Google's script when a translation is actually wanted.
    if (current === "en") return;
    patchDomForTranslation();
    // Mark product names before Google's script reads the page.
    const productObserver = watchProductNames();
    loadTranslator();

    // Google only translates the DOM on page load, so Next's client-side
    // route changes would show untranslated English. While translated, turn
    // internal link clicks and back/forward into full page loads instead.
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = (event.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!anchor || (anchor.target && anchor.target !== "_self") || anchor.hasAttribute("download")) return;
      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname && url.search === window.location.search && url.hash) return;
      event.preventDefault();
      event.stopPropagation();
      window.location.assign(url.href);
    };
    const onPopState = () => window.location.reload();
    document.addEventListener("click", onClick, true);
    window.addEventListener("popstate", onPopState);
    return () => {
      productObserver.disconnect();
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("popstate", onPopState);
    };
  }, [host]);

  const choose = (next: Lang) => {
    if (next === lang) return;
    writeLang(next);
    window.location.reload();
  };

  return (
    <div aria-label="Language / Langue" className={`lang-switch notranslate ${label ? "lang-switch--labelled" : ""} ${className}`} role="group" translate="no">
      {label && <span className="lang-switch__label">Language · Langue</span>}
      {LANGS.map((l) => (
        <button
          aria-label={l.name}
          aria-pressed={lang === l.code}
          className={lang === l.code ? "is-active" : ""}
          key={l.code}
          lang={l.code}
          onClick={() => choose(l.code)}
          title={l.name}
          type="button"
        >
          {l.label}
        </button>
      ))}
      {host && <div aria-hidden hidden id="google_translate_element" />}
    </div>
  );
}
