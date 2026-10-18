"use client";

import { useEffect, useRef } from "react";
import { gsap, isFinePointer, prefersReducedMotion } from "@/components/motion/gsap";

/**
 * Detailer's cursor: a gold point with a trailing ring. Interactive elements
 * grow the ring and show a label; photography turns it into a soft
 * swirl-finder torch. Every click scatters water beads, like a fresh coating.
 */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const torch = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const reduce = prefersReducedMotion();
    const fine = isFinePointer();
    const cleanups: (() => void)[] = [];

    if (fine && !reduce && dot.current && ring.current && torch.current) {
      document.documentElement.classList.add("has-custom-cursor");
      const dotX = gsap.quickTo(dot.current, "x", { duration: 0.08, ease: "power3" });
      const dotY = gsap.quickTo(dot.current, "y", { duration: 0.08, ease: "power3" });
      const ringX = gsap.quickTo(ring.current, "x", { duration: 0.45, ease: "power3" });
      const ringY = gsap.quickTo(ring.current, "y", { duration: 0.45, ease: "power3" });
      const torchX = gsap.quickTo(torch.current, "x", { duration: 0.7, ease: "power3" });
      const torchY = gsap.quickTo(torch.current, "y", { duration: 0.7, ease: "power3" });
      const ringEl = ring.current;
      const torchEl = torch.current;

      const move = (event: PointerEvent) => {
        document.documentElement.dataset.cursor = "on";
        dotX(event.clientX); dotY(event.clientY);
        ringX(event.clientX); ringY(event.clientY);
        torchX(event.clientX); torchY(event.clientY);
      };
      const over = (event: PointerEvent) => {
        const target = event.target as HTMLElement;
        const labelled = target.closest<HTMLElement>("[data-cursor]");
        const interactive = target.closest("a, button, summary, label, select, input, textarea, [role='button']");
        const photo = target.closest("img, [data-torch]");
        const text = labelled?.dataset.cursor ?? "";
        ringEl.dataset.state = text ? "label" : interactive ? "link" : "idle";
        torchEl.dataset.active = String(Boolean(photo));
        if (label.current) label.current.textContent = text;
      };
      const leave = () => { document.documentElement.dataset.cursor = "off"; };
      const down = () => ringEl.classList.add("is-pressed");
      const up = () => ringEl.classList.remove("is-pressed");

      window.addEventListener("pointermove", move, { passive: true });
      document.addEventListener("pointerover", over, { passive: true });
      document.documentElement.addEventListener("pointerleave", leave);
      window.addEventListener("pointerdown", down);
      window.addEventListener("pointerup", up);
      cleanups.push(() => {
        document.documentElement.classList.remove("has-custom-cursor");
        window.removeEventListener("pointermove", move);
        document.removeEventListener("pointerover", over);
        document.documentElement.removeEventListener("pointerleave", leave);
        window.removeEventListener("pointerdown", down);
        window.removeEventListener("pointerup", up);
      });
    }

    if (!reduce) {
      const burst = (event: PointerEvent) => {
        if (event.button !== 0) return;
        const button = (event.target as HTMLElement).closest<HTMLElement>(".button, .chip, .filter-bar button");
        if (button) {
          const rect = button.getBoundingClientRect();
          const ripple = document.createElement("span");
          ripple.className = "btn-ripple";
          ripple.style.left = `${event.clientX - rect.left}px`;
          ripple.style.top = `${event.clientY - rect.top}px`;
          button.appendChild(ripple);
          ripple.addEventListener("animationend", () => ripple.remove(), { once: true });
        }

        const layer = document.createElement("div");
        layer.className = "click-burst";
        layer.style.left = `${event.clientX}px`;
        layer.style.top = `${event.clientY}px`;
        const wave = document.createElement("i");
        wave.className = "click-wave";
        layer.appendChild(wave);
        const beads = Array.from({ length: 8 }, () => {
          const bead = document.createElement("b");
          layer.appendChild(bead);
          return bead;
        });
        document.body.appendChild(layer);

        const timeline = gsap.timeline({ onComplete: () => layer.remove() });
        timeline.fromTo(wave, { scale: 0, autoAlpha: 0.9 }, { scale: 1, autoAlpha: 0, duration: 0.7, ease: "expo.out" });
        beads.forEach((bead, index) => {
          const angle = (index / beads.length) * Math.PI * 2 + gsap.utils.random(-0.3, 0.3);
          const distance = gsap.utils.random(22, 46);
          const size = gsap.utils.random(3, 7);
          gsap.set(bead, { width: size, height: size });
          timeline.fromTo(bead, { x: 0, y: 0, autoAlpha: 1, scale: 1 }, {
            x: Math.cos(angle) * distance,
            y: Math.sin(angle) * distance + 10,
            autoAlpha: 0,
            scale: 0.4,
            duration: gsap.utils.random(0.55, 0.85),
            ease: "power3.out",
          }, 0);
        });
      };
      window.addEventListener("pointerdown", burst);
      cleanups.push(() => window.removeEventListener("pointerdown", burst));
    }

    return () => cleanups.forEach((cleanup) => cleanup());
  }, []);

  return (
    <>
      <div ref={torch} className="cursor-torch" aria-hidden="true" />
      <div ref={ring} className="cursor-ring" data-state="idle" aria-hidden="true"><span ref={label} /></div>
      <div ref={dot} className="cursor-dot" aria-hidden="true" />
    </>
  );
}
