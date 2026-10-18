"use client";

import { usePathname } from "next/navigation";
import { useRef, type ReactNode } from "react";
import { gsap, isFinePointer, prefersReducedMotion, ScrollTrigger, SplitText, useGSAP, whenIntroDone } from "@/components/motion/gsap";

const clipFrom: Record<string, string> = {
  "clip-up": "inset(100% 0% 0% 0%)",
  "clip-down": "inset(0% 0% 100% 0%)",
  "clip-left": "inset(0% 100% 0% 0%)",
  "clip-right": "inset(0% 0% 0% 100%)",
  "clip-center": "inset(18% 18% 18% 18%)",
};

/**
 * Wires every declarative motion attribute on the current page:
 * data-reveal, data-split, data-scrub-text, data-parallax, data-zoom-through, data-magnetic.
 * Re-runs on every route change.
 */
export function MotionLayer({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const progress = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useGSAP(
    (_context, contextSafe) => {
      const q = gsap.utils.selector(root);
      const reveals = q("[data-reveal]") as HTMLElement[];
      const splits = q("[data-split]") as HTMLElement[];

      if (prefersReducedMotion()) {
        if (reveals.length + splits.length) gsap.set([...reveals, ...splits], { autoAlpha: 1, clearProps: "transform,clipPath" });
        return;
      }

      // Fade-up reveals, batched so siblings stagger naturally.
      const ups = reveals.filter((element) => !element.dataset.reveal || element.dataset.reveal === "up");
      if (ups.length) gsap.set(ups, { autoAlpha: 0, y: 48 });
      if (ups.length) ScrollTrigger.batch(ups, {
        start: "top 90%",
        once: true,
        onEnter: (batch) => gsap.to(batch, { autoAlpha: 1, y: 0, duration: 1.1, stagger: 0.09, ease: "expo.out", overwrite: true }),
      });

      // Clip-path wipes, optionally with an inner image settling from a zoom.
      reveals.filter((element) => element.dataset.reveal && clipFrom[element.dataset.reveal]).forEach((element) => {
        const inner = element.querySelector("img");
        const timeline = gsap.timeline({ scrollTrigger: { trigger: element, start: "top 86%", once: true } });
        timeline.fromTo(element, { clipPath: clipFrom[element.dataset.reveal!] }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.35, ease: "expo.inOut" });
        if (inner) timeline.fromTo(inner, { scale: 1.35 }, { scale: 1, duration: 1.8, ease: "expo.out" }, 0);
      });

      reveals.filter((element) => element.dataset.reveal === "zoom").forEach((element) => {
        gsap.fromTo(element, { autoAlpha: 0, scale: 0.86 }, { autoAlpha: 1, scale: 1, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: element, start: "top 88%", once: true } });
      });

      // Masked line / character reveals for headlines.
      splits.forEach((element) => {
        const mode = element.dataset.split === "chars" ? "chars" : "lines";
        const intro = element.hasAttribute("data-intro");
        SplitText.create(element, {
          type: mode === "chars" ? "lines,chars" : "lines",
          mask: "lines",
          autoSplit: true,
          linesClass: "split-line",
          onSplit(self) {
            const targets = mode === "chars" ? self.chars : self.lines;
            const vars: gsap.TweenVars = {
              yPercent: 115,
              rotate: mode === "chars" ? 6 : 2,
              duration: mode === "chars" ? 1.2 : 1.25,
              stagger: mode === "chars" ? 0.028 : 0.11,
              ease: "expo.out",
            };
            if (intro) {
              gsap.set(targets, { yPercent: 115, rotate: vars.rotate });
              whenIntroDone(() => gsap.to(targets, { ...vars, yPercent: 0, rotate: 0, delay: 0.15 }));
              return;
            }
            return gsap.from(targets, { ...vars, scrollTrigger: { trigger: element, start: "top 88%", once: true } });
          },
        });
        gsap.set(element, { autoAlpha: 1 });
      });

      // Scroll-scrubbed word highlighting for statement paragraphs.
      (q("[data-scrub-text]") as HTMLElement[]).forEach((element) => {
        const split = SplitText.create(element, { type: "words", wordsClass: "scrub-word" });
        gsap.fromTo(split.words, { opacity: 0.14 }, {
          opacity: 1,
          stagger: 0.12,
          ease: "none",
          scrollTrigger: { trigger: element, start: "top 82%", end: "bottom 42%", scrub: 0.6 },
        });
      });

      // Parallax: speed is the total travel in percent of the element; axis x or y.
      (q("[data-parallax]") as HTMLElement[]).forEach((element) => {
        const speed = Number(element.dataset.speed ?? 12);
        const property = element.dataset.axis === "x" ? "xPercent" : "yPercent";
        const scope = element.closest<HTMLElement>("[data-parallax-scope]") ?? element.parentElement ?? element;
        gsap.fromTo(element, { [property]: -speed / 2 }, {
          [property]: speed / 2,
          ease: "none",
          scrollTrigger: { trigger: scope, start: "top bottom", end: "bottom top", scrub: true },
        });
      });

      // Zoom-through frames: the window opens up while the photo settles.
      (q("[data-zoom-through]") as HTMLElement[]).forEach((element) => {
        const media = element.querySelector("[data-zoom-media]") ?? element.querySelector("img");
        const timeline = gsap.timeline({ scrollTrigger: { trigger: element, start: "top 92%", end: "top 12%", scrub: true } });
        timeline.fromTo(element, { clipPath: "inset(14% 16% 14% 16% round 28px)" }, { clipPath: "inset(0% 0% 0% 0% round 0px)", ease: "none" });
        if (media) timeline.fromTo(media, { scale: 1.32 }, { scale: 1, ease: "none" }, 0);
      });

      if (progress.current) {
        gsap.fromTo(progress.current, { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: 0.2 } });
      }

      // Magnetic buttons on fine pointers.
      const cleanups: (() => void)[] = [];
      if (isFinePointer() && contextSafe) {
        (q(".button, [data-magnetic]") as HTMLElement[]).forEach((element) => {
          const xTo = gsap.quickTo(element, "x", { duration: 0.6, ease: "elastic.out(1, 0.45)" });
          const yTo = gsap.quickTo(element, "y", { duration: 0.6, ease: "elastic.out(1, 0.45)" });
          const strength = Number(element.dataset.magnetic || 0.28);
          const move = contextSafe((event: PointerEvent) => {
            const rect = element.getBoundingClientRect();
            xTo((event.clientX - rect.left - rect.width / 2) * strength);
            yTo((event.clientY - rect.top - rect.height / 2) * strength);
          });
          const leave = contextSafe(() => { xTo(0); yTo(0); });
          element.addEventListener("pointermove", move);
          element.addEventListener("pointerleave", leave);
          cleanups.push(() => {
            element.removeEventListener("pointermove", move);
            element.removeEventListener("pointerleave", leave);
          });
        });
      }

      const refresh = requestAnimationFrame(() => ScrollTrigger.refresh());
      return () => {
        cancelAnimationFrame(refresh);
        cleanups.forEach((cleanup) => cleanup());
      };
    },
    { scope: root, dependencies: [pathname], revertOnUpdate: true },
  );

  return (
    <div ref={root} className="site-root">
      <div ref={progress} className="scroll-progress" aria-hidden="true" />
      {children}
    </div>
  );
}
