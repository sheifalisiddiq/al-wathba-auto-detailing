"use client";

import { useRef, useState } from "react";
import { gsap, markIntroDone, prefersReducedMotion, useGSAP } from "@/components/motion/gsap";

const stages = ["Inspecting", "Decontaminating", "Correcting", "Sealing"];
const SESSION_KEY = "aw-intro-seen";

/**
 * "Inspection light" intro: the studio's LED frame draws itself, a light bar
 * sweeps across the matte WA mark and leaves gold gloss behind, then the frame
 * zooms through into the page. Plays once per browser session.
 */
export function Preloader() {
  const [visible, setVisible] = useState(true);
  const root = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const finish = () => {
      setVisible(false);
      markIntroDone();
    };

    let seen = false;
    try { seen = sessionStorage.getItem(SESSION_KEY) === "1"; } catch { /* storage unavailable */ }
    if (seen || prefersReducedMotion()) {
      finish();
      return;
    }
    try { sessionStorage.setItem(SESSION_KEY, "1"); } catch { /* storage unavailable */ }

    document.documentElement.classList.add("intro-running");
    const counter = { value: 0 };
    const count = root.current!.querySelector<HTMLElement>(".pl-count")!;
    const label = root.current!.querySelector<HTMLElement>(".pl-label")!;
    const fallback = window.setTimeout(finish, 7000);

    const timeline = gsap.timeline({
      onComplete: () => {
        window.clearTimeout(fallback);
        document.documentElement.classList.remove("intro-running");
        finish();
      },
    });

    timeline
      .fromTo(".pl-frame rect", { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.1, ease: "power2.inOut" })
      .fromTo(".pl-frame", { filter: "drop-shadow(0 0 0px rgba(255,255,255,0))" }, { filter: "drop-shadow(0 0 14px rgba(255,244,220,.75))", duration: 0.5 }, "-=0.35")
      .fromTo(".pl-mark", { autoAlpha: 0, scale: 0.92 }, { autoAlpha: 1, scale: 1, duration: 0.7, ease: "expo.out" }, "-=0.6")
      .addLabel("sweep")
      .fromTo(".pl-mark-gold", { "--sweep": "-15%" }, { "--sweep": "115%", duration: 1.5, ease: "power2.inOut" }, "sweep")
      .fromTo(".pl-lightbar", { left: "-12%", autoAlpha: 1 }, { left: "108%", duration: 1.5, ease: "power2.inOut" }, "sweep")
      .to(".pl-lightbar", { autoAlpha: 0, duration: 0.2 }, "-=0.2")
      .to(counter, {
        value: 100,
        duration: 2.6,
        ease: "power1.inOut",
        onUpdate: () => {
          const value = Math.round(counter.value);
          count.textContent = String(value).padStart(3, "0");
          label.textContent = stages[Math.min(stages.length - 1, Math.floor(value / 25))];
        },
      }, 0.2)
      .to(".pl-glint", { autoAlpha: 1, scale: 1, duration: 0.35, ease: "back.out(3)" }, "-=0.15")
      .to(".pl-glint", { autoAlpha: 0, rotate: 90, duration: 0.4 })
      .addLabel("exit", "-=0.1")
      .to(".pl-meta", { autoAlpha: 0, y: 12, duration: 0.4, ease: "power2.in" }, "exit")
      .to(".pl-stage", { scale: 7, duration: 1.1, ease: "expo.in" }, "exit")
      .to(".pl-mark", { autoAlpha: 0, duration: 0.35 }, "exit")
      .to(root.current, { autoAlpha: 0, duration: 0.45, ease: "power1.in" }, "exit+=0.75");

    return () => window.clearTimeout(fallback);
  }, { scope: root });

  if (!visible) return null;
  return (
    <div className="preloader" ref={root} role="status" aria-label="Loading Al Wathbah">
      <div className="pl-stage">
        <svg className="pl-frame" viewBox="0 0 420 270" preserveAspectRatio="none" aria-hidden="true">
          <rect x="2" y="2" width="416" height="266" rx="3" pathLength={1} />
        </svg>
        <div className="pl-mark">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="pl-mark-base" src="/logo-secondary.png" alt="" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="pl-mark-gold" src="/logo-secondary.png" alt="" />
          <span className="pl-lightbar" />
          <span className="pl-glint" />
        </div>
      </div>
      <div className="pl-meta">
        <span className="pl-label">Inspecting</span>
        <span className="pl-brand">Al Wathbah · Because every part matters</span>
        <span className="pl-count">000</span>
      </div>
    </div>
  );
}
