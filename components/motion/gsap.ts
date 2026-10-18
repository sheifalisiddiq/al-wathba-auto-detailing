"use client";

import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, Flip, useGSAP);
  gsap.defaults({ ease: "power3.out" });
}

export { gsap, Flip, ScrollTrigger, SplitText, useGSAP };

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const isFinePointer = () =>
  typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches;

/** Runs `callback` once the intro preloader has finished (immediately if it already has). */
export function whenIntroDone(callback: () => void) {
  if (document.documentElement.dataset.intro === "done") {
    callback();
    return () => {};
  }
  const handler = () => callback();
  window.addEventListener("aw:intro-done", handler, { once: true });
  return () => window.removeEventListener("aw:intro-done", handler);
}

export function markIntroDone() {
  document.documentElement.dataset.intro = "done";
  window.dispatchEvent(new Event("aw:intro-done"));
}
