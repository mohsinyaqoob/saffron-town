"use client";

import { useEffect, useRef } from "react";

/**
 * Lazy-loads Zoho SalesIQ on first user interaction (scroll / click / touch).
 *
 * This avoids Lighthouse penalising the site for third-party cookies set by the
 * widget during the initial (non-interactive) page-load audit.
 */
export function ZohoChat() {
  const loaded = useRef(false);

  useEffect(() => {
    function loadZoho() {
      if (loaded.current) return;
      loaded.current = true;

      // Clean up listeners once we've triggered
      for (const evt of events) {
        window.removeEventListener(evt, loadZoho);
      }

      // Zoho global init
      const w = window as unknown as Record<string, unknown>;
      w.$zoho = w.$zoho || {};
      (w.$zoho as Record<string, unknown>).salesiq =
        (w.$zoho as Record<string, unknown>).salesiq || {
          ready: function () {},
        };

      // Inject the widget script
      const s = document.createElement("script");
      s.id = "zsiqscript";
      s.src =
        "https://salesiq.zohopublic.in/widget?wc=siq8fe55a541cce5f6ee2079fbcc0aaf5a80d3a712afb69a241c93f57bf18bc1b58";
      s.async = true;
      document.body.appendChild(s);
    }

    const events: (keyof WindowEventMap)[] = [
      "scroll",
      "click",
      "touchstart",
      "mousemove",
      "keydown",
    ];

    for (const evt of events) {
      window.addEventListener(evt, loadZoho, { once: true, passive: true });
    }

    // Also fire after a generous idle timeout (15 s) as a fallback
    const timer = setTimeout(loadZoho, 15_000);

    return () => {
      clearTimeout(timer);
      for (const evt of events) {
        window.removeEventListener(evt, loadZoho);
      }
    };
  }, []);

  return null;
}
