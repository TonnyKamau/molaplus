"use client";

import { useEffect, useState } from "react";
import { useT } from "../../lib/i18n";
import { subscribeToasts, dismissToast, type ToastItem } from "../../lib/toast";

const ICON: Record<ToastItem["type"], string> = {
  error: "error",
  success: "check_circle",
  info: "info",
};

export function Toaster() {
  const tr = useT();
  const [items, setItems] = useState<ToastItem[]>([]);

  useEffect(() => subscribeToasts(setItems), []);

  if (items.length === 0) return null;

  return (
    <div className="toast-stack" role="region" aria-label={tr("Notifications", "Notifications")} translate="no">
      {items.map((t) => (
        <div key={t.id} className={`toast toast--${t.type}`} role={t.type === "error" ? "alert" : "status"}>
          <span className="toast__icon material-symbols-outlined notranslate" aria-hidden="true">{ICON[t.type]}</span>
          <span className="toast__msg">{t.message}</span>
          <button className="toast__close" type="button" aria-label={tr("Dismiss notification", "Fermer la notification")} onClick={() => dismissToast(t.id)}>
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
