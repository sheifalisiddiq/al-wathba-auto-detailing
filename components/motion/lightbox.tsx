"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { gsap, prefersReducedMotion } from "@/components/motion/gsap";
import { lockScroll } from "@/components/motion/smooth-scroll";
import type { ProjectImage } from "@/lib/site-data";

type Origin = { index: number; rect: DOMRect };

/**
 * Full-screen photo viewer. Opens by zooming from the clicked thumbnail and
 * closes back into it. Supports keyboard arrows, Escape and horizontal swipe.
 */
export function useLightbox(images: readonly ProjectImage[]) {
  const [origin, setOrigin] = useState<Origin | null>(null);
  const open = useCallback((index: number, element: HTMLElement) => setOrigin({ index, rect: element.getBoundingClientRect() }), []);
  const close = useCallback(() => setOrigin(null), []);
  const viewer = origin ? <Lightbox images={images} origin={origin} onClose={close} /> : null;
  return { open, viewer };
}

function Lightbox({ images, origin, onClose }: { images: readonly ProjectImage[]; origin: Origin; onClose: () => void }) {
  const [index, setIndex] = useState(origin.index);
  const shell = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const swipe = useRef<number | null>(null);
  const closing = useRef(false);
  const image = images[index];

  const flipFromOrigin = useCallback((reverse: boolean, done?: () => void) => {
    const target = frame.current;
    if (!target || prefersReducedMotion()) { done?.(); return; }
    const end = target.getBoundingClientRect();
    const fromRect = origin.rect;
    const vars = {
      x: fromRect.left + fromRect.width / 2 - (end.left + end.width / 2),
      y: fromRect.top + fromRect.height / 2 - (end.top + end.height / 2),
      scaleX: fromRect.width / end.width,
      scaleY: fromRect.height / end.height,
    };
    if (reverse) {
      gsap.to(target, { ...vars, duration: 0.6, ease: "expo.inOut", onComplete: done });
      gsap.to(shell.current, { backgroundColor: "rgba(6,6,7,0)", duration: 0.5, delay: 0.1 });
    } else {
      gsap.fromTo(target, vars, { x: 0, y: 0, scaleX: 1, scaleY: 1, duration: 0.85, ease: "expo.out" });
      gsap.fromTo(shell.current, { backgroundColor: "rgba(6,6,7,0)" }, { backgroundColor: "rgba(6,6,7,.94)", duration: 0.5 });
      gsap.fromTo(".lightbox-ui", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5, delay: 0.35 });
    }
  }, [origin.rect]);

  const requestClose = useCallback(() => {
    if (closing.current) return;
    closing.current = true;
    gsap.to(".lightbox-ui", { autoAlpha: 0, duration: 0.2 });
    // Only fly back into the thumbnail if we're still on the photo that opened the viewer.
    if (index === origin.index) flipFromOrigin(true, onClose);
    else gsap.to(shell.current, { autoAlpha: 0, duration: 0.35, onComplete: onClose });
  }, [flipFromOrigin, index, onClose, origin.index]);

  const step = useCallback((direction: number) => {
    const next = (index + direction + images.length) % images.length;
    gsap.fromTo(frame.current, { autoAlpha: 0.2, x: direction * 60 }, { autoAlpha: 1, x: 0, duration: 0.6, ease: "expo.out" });
    setIndex(next);
  }, [images.length, index]);

  useEffect(() => {
    lockScroll(true);
    flipFromOrigin(false);
    return () => lockScroll(false);
    // Opening animation should only run once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") requestClose();
      if (event.key === "ArrowRight") step(1);
      if (event.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [requestClose, step]);

  return (
    <div
      className="lightbox"
      ref={shell}
      role="dialog"
      aria-modal="true"
      aria-label={image.title}
      onClick={(event) => { if (event.target === event.currentTarget) requestClose(); }}
      onPointerDown={(event) => { swipe.current = event.clientX; }}
      onPointerUp={(event) => {
        if (swipe.current === null) return;
        const delta = event.clientX - swipe.current;
        swipe.current = null;
        if (Math.abs(delta) > 60) step(delta < 0 ? 1 : -1);
      }}
    >
      <div className="lightbox-frame" ref={frame} style={{ aspectRatio: `${image.width} / ${image.height}` }}>
        <Image src={image.src} alt={image.alt} fill sizes="(max-width: 800px) 100vw, 60vw" quality={90} priority />
      </div>
      <div className="lightbox-ui">
        <div className="lightbox-caption"><span>{image.category}</span><strong>{image.title}</strong><small>{String(index + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}</small></div>
        <button type="button" className="lightbox-close" onClick={requestClose} aria-label="Close photo" data-cursor="CLOSE"><X /></button>
        <button type="button" className="lightbox-nav prev" onClick={() => step(-1)} aria-label="Previous photo"><ArrowLeft /></button>
        <button type="button" className="lightbox-nav next" onClick={() => step(1)} aria-label="Next photo"><ArrowRight /></button>
      </div>
    </div>
  );
}
