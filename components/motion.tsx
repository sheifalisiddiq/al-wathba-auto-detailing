"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export function MotionLayer({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const cursor = useRef<HTMLDivElement>(null);
  const cursorLabel = useRef<HTMLSpanElement>(null);
  const progress = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useGSAP(
    () => {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const reveals = gsap.utils.toArray<HTMLElement>("[data-reveal]");

      if (reduceMotion) {
        gsap.set(reveals, { opacity: 1, y: 0, clipPath: "inset(0 0 0% 0)" });
        return;
      }

      reveals.forEach((element) => {
        gsap.fromTo(
          element,
          { opacity: 0, y: 42, clipPath: "inset(0 0 14% 0)" },
          {
            opacity: 1,
            y: 0,
            clipPath: "inset(0 0 0% 0)",
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: element,
              start: "top 88%",
              once: true,
            },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((element) => {
        const speed = Number(element.dataset.speed ?? 12);
        gsap.fromTo(
          element,
          { yPercent: -speed / 2 },
          {
            yPercent: speed / 2,
            ease: "none",
            scrollTrigger: {
              trigger: element.parentElement ?? element,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.1,
            },
          },
        );
      });

      if (progress.current) {
        gsap.fromTo(
          progress.current,
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: "none",
            transformOrigin: "left center",
            scrollTrigger: { start: 0, end: "max", scrub: 0.2 },
          },
        );
      }

      requestAnimationFrame(() => ScrollTrigger.refresh());
    },
    { scope: root, dependencies: [pathname], revertOnUpdate: true },
  );

  useEffect(() => {
    const pointer = cursor.current;
    if (!pointer || window.matchMedia("(pointer: coarse)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const xTo = gsap.quickTo(pointer, "x", { duration: 0.28, ease: "power3" });
    const yTo = gsap.quickTo(pointer, "y", { duration: 0.28, ease: "power3" });
    const move = (event: PointerEvent) => {
      pointer.dataset.visible = "true";
      xTo(event.clientX);
      yTo(event.clientY);
    };
    const over = (event: PointerEvent) => {
      const target = (event.target as HTMLElement).closest<HTMLElement>("a, button, [data-cursor]");
      pointer.dataset.active = target ? "true" : "false";
      if (cursorLabel.current) cursorLabel.current.textContent = target?.dataset.cursor ?? "";
    };
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerover", over, { passive: true });
    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerover", over);
    };
  }, []);

  return (
    <div ref={root} className="site-root">
      <div ref={progress} className="scroll-progress" aria-hidden="true" />
      <div ref={cursor} className="custom-cursor" aria-hidden="true"><span ref={cursorLabel} /></div>
      {children}
    </div>
  );
}

export function Preloader() {
  const [visible, setVisible] = useState(true);
  const loader = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fallback = window.setTimeout(() => setVisible(false), 3500);
    return () => window.clearTimeout(fallback);
  }, []);

  useGSAP(() => {
    if (!visible || !loader.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(false);
      return;
    }
    const timeline = gsap.timeline({ onComplete: () => setVisible(false) });
    timeline
      .fromTo(".preloader-mark", { opacity: 0, scale: 0.86 }, { opacity: 1, scale: 1, duration: 0.65, ease: "power3.out" })
      .fromTo(".preloader-line span", { scaleX: 0 }, { scaleX: 1, duration: 0.75, ease: "power2.inOut" }, "-=0.2")
      .to(loader.current, { yPercent: -100, duration: 0.8, ease: "power4.inOut", delay: 0.1 });
  }, { scope: loader, dependencies: [visible] });

  if (!visible) return null;
  return (
    <div className="preloader" ref={loader} role="status" aria-label="Loading Al Wathbah">
      <Image className="preloader-mark" src="/logo-secondary.png" alt="" width={794} height={266} priority />
      <div className="preloader-line"><span /></div>
      <small>Precision in progress</small>
    </div>
  );
}

export function TiltCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  const card = useRef<HTMLDivElement>(null);
  const onMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (window.matchMedia("(pointer: coarse)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const rx = ((event.clientY - rect.top) / rect.height - 0.5) * -7;
    const ry = ((event.clientX - rect.left) / rect.width - 0.5) * 7;
    event.currentTarget.style.setProperty("--rx", `${rx}deg`);
    event.currentTarget.style.setProperty("--ry", `${ry}deg`);
  };
  const onLeave = (event: React.PointerEvent<HTMLDivElement>) => {
    event.currentTarget.style.setProperty("--rx", "0deg");
    event.currentTarget.style.setProperty("--ry", "0deg");
  };
  return <div ref={card} className={`tilt-card ${className}`} onPointerMove={onMove} onPointerLeave={onLeave}>{children}</div>;
}

export function Marquee({ items }: { items: string[] }) {
  const content = [...items, ...items];
  return (
    <div className="marquee" aria-label={items.join(", ")}>
      <div className="marquee-track">
        {content.map((item, index) => <span key={`${item}-${index}`}><i />{item}</span>)}
      </div>
    </div>
  );
}

export function AmbientGlow({ className = "" }: { className?: string }) {
  return <span className={`ambient-glow ${className}`} aria-hidden="true" style={{ "--glow": "#c8a365" } as CSSProperties} />;
}
