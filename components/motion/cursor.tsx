"use client";

import { useEffect } from "react";
import { prefersReducedMotion } from "@/components/motion/gsap";

/** Click ripple inside buttons, chips and filters. The cursor itself lives in polishing-cursor. */
export function ButtonRipple() {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ripple = (event: PointerEvent) => {
      if (event.button !== 0) return;
      const button = (event.target as HTMLElement).closest<HTMLElement>(".button, .chip, .filter-bar button");
      if (!button) return;
      const rect = button.getBoundingClientRect();
      const span = document.createElement("span");
      span.className = "btn-ripple";
      span.style.left = `${event.clientX - rect.left}px`;
      span.style.top = `${event.clientY - rect.top}px`;
      button.appendChild(span);
      span.addEventListener("animationend", () => span.remove(), { once: true });
    };
    window.addEventListener("pointerdown", ripple);
    return () => window.removeEventListener("pointerdown", ripple);
  }, []);

  return null;
}
