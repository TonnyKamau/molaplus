"use client";

import { useEffect, useRef } from "react";

export function StaticHtmlPage({ html }: { html: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) {
      return;
    }

    const scripts = Array.from(root.querySelectorAll("script"));
    const mountedScripts = scripts.map((script) => {
      const executableScript = document.createElement("script");
      for (const attribute of Array.from(script.attributes)) {
        executableScript.setAttribute(attribute.name, attribute.value);
      }
      executableScript.textContent = script.textContent;
      document.body.appendChild(executableScript);
      return executableScript;
    });

    return () => {
      mountedScripts.forEach((script) => script.remove());
    };
  }, [html]);

  return (
    <div
      className="static-html-page"
      ref={ref}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
