"use client";

import { useEffect, useRef } from "react";
import { ART_SIZE, HOTSPOT, PolisherArt } from "@/components/polishing-cursor/polisher-art";
import { PolishTrail } from "@/components/polishing-cursor/trail";

const SIZE = 56;
const SCALE = SIZE / ART_SIZE;
const INTERACTIVE = "a, button, summary, label, [role='button']";
const TEXT_FIELD = "input, textarea, select, [contenteditable='true']";
const PHOTO = "img, video, [data-polish]";

/**
 * Signature cursor: a miniature black-and-gold rotary polisher whose pad spins
 * and leaves a fading glossy trail. Desktop (fine pointer + hover) only; touch,
 * reduced-motion and any init failure keep the native cursor. All per-frame work
 * runs in one rAF loop on refs, so pointer movement never re-renders React.
 */
export function PolishingCursor() {
  const root = useRef<HTMLDivElement>(null);
  const pad = useRef<SVGGElement>(null);
  const shine = useRef<HTMLDivElement>(null);
  const glint = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const rootEl = root.current;
    const padEl = pad.current;
    const canvasEl = canvas.current;
    if (!rootEl || !padEl || !canvasEl) return;

    const html = document.documentElement;
    // Gate on reduced-motion only: the move handler below already ignores
    // non-mouse pointer types, which is a more reliable touch/pen filter
    // than (hover: hover)/(pointer: fine) — some trackpad/touchscreen laptops
    // misreport those media features even with a real mouse attached.
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let teardown: (() => void) | null = null;

    const enable = () => {
      let trail: PolishTrail;
      try {
        trail = new PolishTrail(canvasEl);
      } catch {
        return; // native cursor stays
      }

      let targetX = 0, targetY = 0, x = 0, y = 0;
      let seen = false, link = false, photo = false, text = false, pressed = false;
      let angle = 0, boost = 0, last = performance.now(), frame = 0;

      const apply = () => {
        rootEl.dataset.link = String(link);
        rootEl.dataset.photo = String(photo);
        rootEl.dataset.hidden = String(!seen || text);
      };

      const move = (event: PointerEvent) => {
        if (event.pointerType !== "mouse") return;
        targetX = event.clientX;
        targetY = event.clientY;
        if (!seen) {
          x = targetX;
          y = targetY;
          seen = true;
          html.classList.add("has-custom-cursor");
          apply();
        }
      };
      const over = (event: PointerEvent) => {
        const target = event.target instanceof Element ? event.target : null;
        text = Boolean(target?.closest(TEXT_FIELD));
        link = !text && Boolean(target?.closest(INTERACTIVE));
        photo = !text && Boolean(target?.closest(PHOTO));
        apply();
      };
      const leave = () => { seen = false; trail.clear(); apply(); };
      const down = (event: PointerEvent) => {
        if (event.button !== 0 || event.pointerType !== "mouse" || text) return;
        pressed = true;
        boost = 1;
        rootEl.dataset.pressed = "true";
        shine.current?.animate(
          [{ transform: "translate(-50%,-50%) scale(.2)", opacity: 0.9 }, { transform: "translate(-50%,-50%) scale(1.5)", opacity: 0 }],
          { duration: 560, easing: "cubic-bezier(.16,1,.3,1)" },
        );
        glint.current?.animate(
          [{ transform: "translate(-50%,-50%) rotate(-30deg) scaleX(.1)", opacity: 0 }, { opacity: 1, offset: 0.3 }, { transform: "translate(-50%,-50%) rotate(-30deg) scaleX(1)", opacity: 0 }],
          { duration: 420, easing: "ease-out" },
        );
      };
      const up = () => { pressed = false; delete rootEl.dataset.pressed; };

      const tick = (now: number) => {
        const dt = Math.min(now - last, 64);
        last = now;
        const ease = 1 - Math.exp(-dt / 30);
        const px = x, py = y;
        x += (targetX - x) * ease;
        y += (targetY - y) * ease;
        const speed = dt ? Math.hypot(x - px, y - py) / dt : 0; // px per ms

        boost = Math.max(0, boost - dt / 320);
        angle = (angle + (dt / 1000) * (140 + Math.min(speed * 900, 700) + boost * 1100)) % 360;
        padEl.setAttribute("transform", `rotate(${angle.toFixed(1)})`);
        rootEl.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0)`;

        const intensity = link && !photo ? 0 : photo ? (link ? 0.9 : 1.5) : 1;
        if (seen && !text) trail.add(x, y, now, intensity * (pressed ? 1.2 : 1));
        trail.draw(now, intensity || 1);
        frame = requestAnimationFrame(tick);
      };

      const resize = () => trail.resize();
      window.addEventListener("pointermove", move, { passive: true });
      document.addEventListener("pointerover", over, { passive: true });
      window.addEventListener("pointerdown", down, { passive: true });
      window.addEventListener("pointerup", up, { passive: true });
      window.addEventListener("pointercancel", up, { passive: true });
      window.addEventListener("resize", resize, { passive: true });
      window.addEventListener("blur", leave);
      html.addEventListener("pointerleave", leave);
      frame = requestAnimationFrame(tick);

      teardown = () => {
        cancelAnimationFrame(frame);
        window.removeEventListener("pointermove", move);
        document.removeEventListener("pointerover", over);
        window.removeEventListener("pointerdown", down);
        window.removeEventListener("pointerup", up);
        window.removeEventListener("pointercancel", up);
        window.removeEventListener("resize", resize);
        window.removeEventListener("blur", leave);
        html.removeEventListener("pointerleave", leave);
        html.classList.remove("has-custom-cursor");
        trail.clear();
        rootEl.dataset.hidden = "true";
        teardown = null;
      };
    };

    const sync = () => {
      teardown?.();
      if (!reduced.matches) enable();
    };
    sync();
    reduced.addEventListener("change", sync);
    return () => {
      reduced.removeEventListener("change", sync);
      teardown?.();
    };
  }, []);

  return (
    <>
      <canvas ref={canvas} className="polish-trail" aria-hidden="true" />
      <div
        ref={root}
        className="polish-cursor"
        data-hidden="true"
        aria-hidden="true"
        style={{ "--art-x": `${-HOTSPOT.x * SCALE}px`, "--art-y": `${-HOTSPOT.y * SCALE}px` } as React.CSSProperties}
      >
        <div className="polish-reflect" />
        <div ref={shine} className="polish-shine" />
        <div ref={glint} className="polish-glint" />
        <PolisherArt padRef={pad} size={SIZE} />
      </div>
    </>
  );
}
