"use client";

import { useRef } from "react";
import { gsap, prefersReducedMotion, ScrollTrigger, useGSAP } from "@/components/motion/gsap";

/** Infinite ticker whose speed and direction respond to scroll velocity. */
export function Marquee({ items, reverse = false, variant = "default", speed = 38 }: { items: readonly string[]; reverse?: boolean; variant?: "default" | "outline" | "large"; speed?: number }) {
  const root = useRef<HTMLDivElement>(null);
  const content = [...items, ...items];

  useGSAP(() => {
    if (prefersReducedMotion()) return;
    const track = root.current!.querySelector(".marquee-track");
    const loop = gsap.fromTo(track, { xPercent: reverse ? -50 : 0 }, { xPercent: reverse ? 0 : -50, duration: speed, ease: "none", repeat: -1 });
    let settle: gsap.core.Tween | undefined;
    ScrollTrigger.create({
      trigger: root.current,
      start: "top bottom",
      end: "bottom top",
      onUpdate: (self) => {
        // Scrolling up runs the ticker backwards; faster scrolling spins it faster.
        const boost = 1 + gsap.utils.clamp(0, 4, Math.abs(self.getVelocity()) / 400);
        settle?.kill();
        loop.timeScale(boost * self.direction);
        settle = gsap.to(loop, { timeScale: self.direction, duration: 1, ease: "power2.out" });
      },
    });
  }, { scope: root });

  return (
    <div className={`marquee marquee-${variant}`} ref={root} aria-label={items.join(", ")}>
      <div className="marquee-track">
        {content.map((item, index) => <span key={`${item}-${index}`} aria-hidden={index >= items.length}><i />{item}</span>)}
      </div>
    </div>
  );
}
