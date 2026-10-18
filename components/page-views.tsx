"use client";

import Image from "next/image";
import Link from "next/link";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { ArrowDown, ArrowRight, ArrowUpRight, Check, Droplets, Expand, Layers, MapPin, Phone, Plus, ScanSearch, ShieldCheck, Sparkles, Clock3 } from "lucide-react";
import { ContactForm, QuoteForm } from "@/components/forms";
import { Instagram } from "@/components/icons";
import { Flip, gsap, isFinePointer, prefersReducedMotion, useGSAP, whenIntroDone } from "@/components/motion/gsap";
import { useLightbox } from "@/components/motion/lightbox";
import { Marquee } from "@/components/motion/marquee";
import { Photo } from "@/components/motion/photo";
import { SpinBadge } from "@/components/motion/spin-badge";
import { business, generalFaqs, marques, projectImages, services, testimonials, type Service } from "@/lib/site-data";

const arrow = <ArrowUpRight size={18} aria-hidden="true" />;

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <span className="eyebrow"><i />{children}</span>;
}

function SectionHead({ eyebrow, title, copy, action }: { eyebrow: string; title: string; copy?: string; action?: { label: string; href: string } }) {
  return (
    <div className="section-head">
      <div><Eyebrow>{eyebrow}</Eyebrow><h2 data-split>{title}</h2></div>
      {(copy || action) && (
        <div className="section-head-side" data-reveal>
          {copy && <p>{copy}</p>}
          {action && <Link className="text-link" href={action.href}>{action.label}{arrow}</Link>}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Hero patterns                                                       */
/* ------------------------------------------------------------------ */

/** Portrait photos stay portrait: a framed tall image beside the copy, with the same photo as a blurred ambient backdrop. */
function HeroFrame({ src, alt, position = "50% 50%", caption, badge = false }: { src: string; alt: string; position?: string; caption?: string; badge?: boolean }) {
  return (
    <figure className="hero-figure" data-hero-figure data-parallax data-speed="-10" data-parallax-scope>
      <div className="hero-figure-media">
        <Photo src={src} alt={alt} fill priority quality={90} sizes="(max-width: 900px) 100vw, 42vw" style={{ objectPosition: position }} data-hero-image />
        <span className="led-frame" aria-hidden="true" />
      </div>
      {caption && <figcaption><span>In the studio</span><span>{caption}</span></figcaption>}
      {badge && <SpinBadge className="hero-badge" size={128} />}
    </figure>
  );
}

function HeroBackdrop({ src }: { src: string }) {
  return (
    <div className="hero-backdrop" aria-hidden="true">
      <Image src={src} alt="" fill sizes="30vw" quality={40} data-parallax data-speed="16" />
    </div>
  );
}

/** Intro choreography for heroes, played after the preloader finishes. */
function useHeroIntro(scope: React.RefObject<HTMLElement | null>) {
  useGSAP(() => {
    if (prefersReducedMotion()) return;
    const figure = scope.current?.querySelector(".hero-figure-media");
    const image = scope.current?.querySelector("[data-hero-image]");
    const fades = Array.from(scope.current?.querySelectorAll("[data-hero-fade]") ?? []);
    if (figure) gsap.set(figure, { clipPath: "inset(100% 0% 0% 0%)" });
    if (image) gsap.set(image, { scale: 1.4 });
    if (fades.length) gsap.set(fades, { autoAlpha: 0, y: 30 });
    return whenIntroDone(() => {
      const timeline = gsap.timeline({ delay: 0.1 });
      if (figure) timeline.to(figure, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.5, ease: "expo.inOut" }, 0);
      if (image) timeline.to(image, { scale: 1, duration: 2, ease: "expo.out" }, 0.2);
      if (fades.length) timeline.to(fades, { autoAlpha: 1, y: 0, duration: 1, stagger: 0.1, ease: "expo.out" }, figure ? 0.5 : 0);
    });
  }, { scope });
}

function PageHero({ eyebrow, title, copy, image, imagePosition = "50% 50%", caption }: { eyebrow: string; title: string; copy: string; image: string; imagePosition?: string; caption?: string }) {
  const root = useRef<HTMLElement>(null);
  useHeroIntro(root);
  return (
    <section className="page-hero" ref={root}>
      <HeroBackdrop src={image} />
      <div className="page-hero-grid container">
        <div className="page-hero-copy">
          <div data-hero-fade><Eyebrow>{eyebrow}</Eyebrow></div>
          <h1 data-split data-intro>{title}</h1>
          <p data-hero-fade>{copy}</p>
        </div>
        <HeroFrame src={image} alt="" position={imagePosition} caption={caption} />
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Shared sections                                                     */
/* ------------------------------------------------------------------ */

function ServiceCard({ service, index }: { service: Service; index: number }) {
  return (
    <article className="service-card" data-reveal data-parallax={index % 2 ? "" : undefined} data-speed="8">
      <Link href={`/services/${service.slug}`} data-cursor="VIEW">
        <div className="service-card-media">
          <Photo src={service.image} alt={`${service.title} at Al Wathbah`} fill sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 25vw" style={{ objectPosition: service.imagePosition }} />
          <span className="service-num">{String(index + 1).padStart(2, "0")}</span>
          <span className="service-arrow"><ArrowUpRight /></span>
        </div>
        <div className="service-card-copy">
          <span>{service.group}</span>
          <h3>{service.title}</h3>
          <p>{service.description}</p>
          <b>Explore service <ArrowRight size={16} /></b>
        </div>
      </Link>
    </article>
  );
}

function FaqList({ items }: { items: readonly { question: string; answer: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="faq-list">
      {items.map((item, index) => {
        const isOpen = open === index;
        return (
          <div className="faq-item" data-open={isOpen} key={item.question} data-reveal>
            <button type="button" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : index)}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{item.question}</strong>
              <i aria-hidden="true"><Plus /></i>
            </button>
            <div className="faq-answer"><div><p>{item.answer}</p></div></div>
          </div>
        );
      })}
    </div>
  );
}

function FinalCta({ eyebrow = "Start a conversation", title = "Your car deserves a more considered standard.", image = "/images/land-cruiser.jpeg" }: { eyebrow?: string; title?: string; image?: string }) {
  return (
    <section className="final-cta" data-parallax-scope>
      <HeroBackdrop src={image} />
      <div className="final-cta-grid container">
        <div className="final-cta-content">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h2 data-split>{title}</h2>
          <p data-reveal>Tell us the car and the result you want. We will inspect, advise honestly, and quote a scope that fits — no generic packages.</p>
          <div className="cta-actions" data-reveal>
            <Link className="button button-gold" href="/get-a-quote">Request a quote {arrow}</Link>
            <a className="button button-ghost" href={business.instagram} target="_blank" rel="noreferrer"><Instagram size={18} />Message on Instagram</a>
          </div>
        </div>
        <div className="cta-frame" data-zoom-through>
          <div className="cta-frame-media" data-zoom-media>
            <Photo src={image} alt="Car presented inside the Al Wathbah studio" fill sizes="(max-width: 900px) 100vw, 40vw" quality={90} />
          </div>
          <SpinBadge className="cta-badge" size={124} />
        </div>
      </div>
    </section>
  );
}

/** Pinned horizontal gallery on desktop, native swipe rail on touch. Click opens the lightbox. */
function WorkReel({ eyebrow = "Selected studio work", title = "Craft, seen from every angle." }: { eyebrow?: string; title?: string }) {
  const root = useRef<HTMLElement>(null);
  const { open, viewer } = useLightbox(projectImages);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(min-width: 901px) and (prefers-reduced-motion: no-preference)", () => {
      const track = root.current!.querySelector<HTMLElement>(".reel-track")!;
      const viewport = root.current!.querySelector<HTMLElement>(".reel-viewport")!;
      const distance = () => Math.max(0, track.scrollWidth - viewport.clientWidth);
      const tween = gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: () => `+=${distance()}`, pin: true, scrub: 0.8, invalidateOnRefresh: true, anticipatePin: 1 },
      });
      gsap.utils.toArray<HTMLElement>(".reel-media img", root.current).forEach((image) => {
        gsap.fromTo(image, { xPercent: -8 }, { xPercent: 8, ease: "none", scrollTrigger: { trigger: image.closest(".reel-card"), containerAnimation: tween, start: "left right", end: "right left", scrub: true } });
      });
    });
    return () => mm.revert();
  }, { scope: root });

  return (
    <section className="work-reel" ref={root}>
      <div className="container"><SectionHead eyebrow={eyebrow} title={title} copy="Real cars, photographed inside the Al Wathbah studio. Tap any frame to look closer." action={{ label: "Explore our work", href: "/our-work" }} /></div>
      <div className="reel-viewport">
        <div className="reel-track">
          {projectImages.map((project, index) => (
            <button type="button" className="reel-card" key={project.src} data-cursor="ZOOM" onClick={(event) => open(index, event.currentTarget.querySelector(".reel-media") ?? event.currentTarget)}>
              <div className="reel-media" style={{ aspectRatio: "3 / 4" }}>
                <Photo src={project.src} alt={project.alt} fill sizes="(max-width: 900px) 78vw, 30vw" />
                <span className="reel-zoom"><Expand size={16} /></span>
              </div>
              <div className="reel-copy"><span>{project.category}</span><h3>{project.title}</h3><b>{String(index + 1).padStart(2, "0")}</b></div>
            </button>
          ))}
          <Link className="reel-end" href="/our-work" data-cursor="OPEN">
            <SpinBadge size={140} text="VIEW THE FULL GALLERY • OUR WORK • " />
            <strong>See all work</strong>
          </Link>
        </div>
      </div>
      {viewer}
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Home                                                                */
/* ------------------------------------------------------------------ */

function HomeHero() {
  const root = useRef<HTMLElement>(null);
  useHeroIntro(root);
  return (
    <section className="home-hero" ref={root}>
      <HeroBackdrop src="/images/dodge-daytona.jpeg" />
      <span className="hero-arabic" aria-hidden="true" data-parallax data-axis="x" data-speed="18">الوثبة</span>
      <div className="home-hero-grid container">
        <div className="hero-copy" data-parallax data-speed="14">
          <div data-hero-fade><Eyebrow>Car detailing & protection studio · Sharjah & Ajman</Eyebrow></div>
          <h1 data-split="chars" data-intro><span>Precision</span> <span>in every</span> <em>detail.</em></h1>
          <p data-hero-fade>Paint protection film, colour change, ceramic coating and detailing for owners who notice every reflection. Because every part matters.</p>
          <div className="hero-actions" data-hero-fade>
            <Link className="button button-gold" href="/get-a-quote">Get a free quote {arrow}</Link>
            <Link className="button button-ghost" href="/our-work">See our work <ArrowRight size={18} /></Link>
          </div>
        </div>
        <HeroFrame src="/images/dodge-daytona.jpeg" alt="Gloss black Dodge Charger Daytona inside the Al Wathbah studio" position="50% 60%" caption="Dodge Charger Daytona" badge />
      </div>
      <a href="#introduction" className="scroll-cue" data-hero-fade><span>Scroll to discover</span><ArrowDown /></a>
    </section>
  );
}

function Manifesto() {
  return (
    <section className="manifesto section" id="introduction" data-parallax-scope>
      <span className="manifesto-ghost" aria-hidden="true" data-parallax data-axis="x" data-speed="-22">Because every part matters</span>
      <div className="manifesto-grid container">
        <div className="manifesto-copy">
          <Eyebrow>About Al Wathbah</Eyebrow>
          <p className="display-copy" data-scrub-text>We inspect before we touch, prepare before we protect, and finish every edge, seam and reflection as if it were the only one that mattered.</p>
          <div className="manifesto-foot" data-reveal>
            <p>From invisible paint protection to bold colour transformations, every car that enters our Sharjah studio gets the same discipline: understand the vehicle, respect the material, and hand it back better than the day it left the showroom.</p>
            <Link className="text-link" href="/about">Discover our approach {arrow}</Link>
          </div>
        </div>
        <div className="manifesto-media">
          <div className="manifesto-photo tall" data-reveal="clip-up" data-parallax data-speed="-12">
            <Photo src="/images/g-wagon.jpeg" alt="White Mercedes-AMG G 63 inside the Al Wathbah studio" fill sizes="(max-width: 900px) 60vw, 26vw" style={{ objectPosition: "50% 70%" }} />
          </div>
          <div className="manifesto-photo short" data-reveal="clip-down" data-parallax data-speed="14">
            <Photo src="/images/aqua-mercedes.jpeg" alt="Aqua Mercedes E-Class on the wrap bay floor" fill sizes="(max-width: 900px) 50vw, 20vw" />
          </div>
        </div>
      </div>
    </section>
  );
}

/** Desktop: oversized service index with a photo that follows the cursor. Touch: thumbnail rows. */
function ServiceIndex() {
  const root = useRef<HTMLDivElement>(null);
  const preview = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useGSAP((_context, contextSafe) => {
    if (!isFinePointer() || prefersReducedMotion() || !contextSafe) return;
    const element = preview.current!;
    const xTo = gsap.quickTo(element, "x", { duration: 0.7, ease: "power3" });
    const yTo = gsap.quickTo(element, "y", { duration: 0.7, ease: "power3" });
    const rotateTo = gsap.quickTo(element, "rotation", { duration: 0.9, ease: "power3" });
    let lastX = 0;
    const move = contextSafe((event: PointerEvent) => {
      const rect = root.current!.getBoundingClientRect();
      xTo(event.clientX - rect.left);
      yTo(event.clientY - rect.top);
      rotateTo(gsap.utils.clamp(-8, 8, (event.clientX - lastX) * 0.6));
      lastX = event.clientX;
    });
    root.current!.addEventListener("pointermove", move);
    return () => root.current?.removeEventListener("pointermove", move);
  }, { scope: root });

  return (
    <div className="service-index" ref={root}>
      <div className="service-preview" ref={preview} aria-hidden="true">
        {services.map((service, index) => (
          <div className="service-preview-item" data-active={index === active} key={service.slug}>
            <Image src={service.image} alt="" fill sizes="22vw" style={{ objectPosition: service.imagePosition }} />
          </div>
        ))}
      </div>
      {services.map((service, index) => (
        <Link className="service-row" href={`/services/${service.slug}`} key={service.slug} onPointerEnter={() => setActive(index)} onFocus={() => setActive(index)} data-cursor="EXPLORE" data-reveal>
          <span className="service-row-num">{String(index + 1).padStart(2, "0")}</span>
          <span className="service-row-thumb"><Image src={service.image} alt="" fill sizes="80px" style={{ objectPosition: service.imagePosition }} /></span>
          <span className="service-row-title">{service.title}</span>
          <span className="service-row-kicker">{service.kicker}</span>
          <span className="service-row-arrow"><ArrowUpRight /></span>
        </Link>
      ))}
    </div>
  );
}

function ProtectionFeature() {
  return (
    <section className="protection-feature section">
      <div className="container"><SectionHead eyebrow="Featured protection" title="Protect the finish. Redefine the presence." copy="Invisible film that keeps factory paint flawless — or colour film that transforms the car while protecting it." /></div>
      <div className="protection-panels container">
        {services.slice(0, 2).map((service, index) => (
          <Link href={`/services/${service.slug}`} className="protection-panel" key={service.slug} data-cursor="EXPLORE" data-reveal={index ? "clip-down" : "clip-up"} data-parallax-scope>
            <div className="protection-media"><Photo src={service.image} alt={service.title} fill sizes="(max-width: 900px) 100vw, 46vw" quality={90} data-parallax data-speed="12" /></div>
            <div className="panel-overlay" />
            <div className="panel-copy">
              <span>0{index + 1} / {service.kicker}</span>
              <h3>{service.shortTitle}</h3>
              <p>{service.description}</p>
              <b className="chip">Explore {service.shortTitle} {arrow}</b>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function WhySection() {
  const reasons = [
    [ScanSearch, "Assessment before action", "Every job starts under inspection lighting — we read the paint, the panels and your expectations before quoting."],
    [Layers, "Material-conscious craft", "Methods and films are chosen for your car's surfaces and how you drive it, never applied as a generic routine."],
    [Sparkles, "Detail-led execution", "Edges, seams, trim, badges and touchpoints get the same attention as the bonnet."],
    [ShieldCheck, "Honest handover", "We walk you through the result, the aftercare and any written terms before you drive away."],
  ] as const;
  return (
    <section className="why-section section container">
      <SectionHead eyebrow="Why Al Wathbah" title="The difference lives in the discipline." />
      <div className="why-layout">
        <div className="why-sticky">
          <p data-scrub-text>Premium work is not a claim. It is preparation, patience, controlled execution, and a final inspection that refuses to overlook the small things.</p>
          <Link className="button button-outline" href="/about" data-reveal>Our philosophy {arrow}</Link>
        </div>
        <div className="why-list">
          {reasons.map(([Icon, title, copy], index) => (
            <article key={title} data-reveal>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div className="why-icon"><Icon /></div>
              <div><h3>{title}</h3><p>{copy}</p></div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

const journeySteps = [
  { title: "Inspect", copy: "We study the paint under studio lighting, note every chip and swirl, and agree the result you want.", image: "/images/g-wagon.jpeg", position: "50% 72%" },
  { title: "Prepare", copy: "Wash, decontaminate, and correct where needed — the surface must be right before anything goes on it.", image: "/images/blue-mercedes.jpeg", position: "50% 60%" },
  { title: "Protect & style", copy: "Film, coating or tint is applied panel by panel, edges wrapped and checked in a controlled bay.", image: "/images/aqua-mercedes.jpeg", position: "50% 50%" },
  { title: "Deliver", copy: "A final inspection, a walk-around with you, and clear aftercare — then the keys are yours.", image: "/images/dodge-daytona.jpeg", position: "50% 62%" },
];

/** Pinned four-step story on desktop; stacked steps on touch. */
function ProcessJourney() {
  const root = useRef<HTMLElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(min-width: 901px) and (prefers-reduced-motion: no-preference)", () => {
      const steps = gsap.utils.toArray<HTMLElement>(".pj-step", root.current);
      const images = gsap.utils.toArray<HTMLElement>(".pj-image", root.current);
      const counters = gsap.utils.toArray<HTMLElement>(".pj-dots i", root.current);
      gsap.set(steps.slice(1), { autoAlpha: 0, y: 60 });
      gsap.set(images.slice(1), { clipPath: "inset(100% 0% 0% 0%)" });
      gsap.set(counters[0], { "--fill": 1 });
      const timeline = gsap.timeline({
        defaults: { ease: "power2.inOut" },
        scrollTrigger: { trigger: root.current, start: "top top", end: () => `+=${window.innerHeight * 2.6}`, pin: true, scrub: 0.8, anticipatePin: 1 },
      });
      timeline.fromTo(".pj-progress i", { scaleY: 0 }, { scaleY: 1, ease: "none", duration: steps.length - 1 }, 0);
      steps.slice(1).forEach((step, index) => {
        const at = index + 0.15;
        timeline
          .to(steps[index], { autoAlpha: 0, y: -60, duration: 0.45 }, at)
          .to(step, { autoAlpha: 1, y: 0, duration: 0.45 }, at + 0.3)
          .to(images[index + 1], { clipPath: "inset(0% 0% 0% 0%)", duration: 0.8 }, at)
          .fromTo(images[index + 1].querySelector("img"), { scale: 1.3 }, { scale: 1, duration: 0.9 }, at)
          .to(counters[index + 1], { "--fill": 1, duration: 0.4 }, at + 0.3);
      });
    });
    return () => mm.revert();
  }, { scope: root });

  return (
    <section className="process-journey" ref={root}>
      <div className="pj-inner container">
        <div className="pj-copy">
          <Eyebrow>How we work</Eyebrow>
          <h2 data-split>From first look to final handover.</h2>
          <div className="pj-steps">
            {journeySteps.map((step, index) => (
              <article className="pj-step" key={step.title}>
                <div className="pj-step-thumb"><Image src={step.image} alt="" fill sizes="90vw" style={{ objectPosition: step.position }} /></div>
                <span>Step {String(index + 1).padStart(2, "0")}</span>
                <h3>{step.title}</h3>
                <p>{step.copy}</p>
              </article>
            ))}
          </div>
          <div className="pj-dots" aria-hidden="true">{journeySteps.map((step) => <i key={step.title} />)}</div>
        </div>
        <div className="pj-media" aria-hidden="true">
          {journeySteps.map((step) => (
            <div className="pj-image" key={step.title}><Image src={step.image} alt="" fill sizes="38vw" quality={90} style={{ objectPosition: step.position }} /></div>
          ))}
          <span className="led-frame" />
          <div className="pj-progress"><i /></div>
        </div>
      </div>
    </section>
  );
}

function MarquesBand() {
  return (
    <section className="marques-band" aria-label="Marques we care for">
      <div className="container marques-head"><Eyebrow>Marques we care for</Eyebrow><p>From daily drivers to garage queens.</p></div>
      <Marquee items={marques} variant="large" speed={46} />
      <Marquee items={services.map((service) => service.shortTitle)} variant="outline" reverse speed={52} />
    </section>
  );
}

export function HomePage() {
  return (
    <>
      <HomeHero />
      <Marquee items={services.map((service) => service.title)} />
      <Manifesto />
      <section className="services-section section">
        <div className="container">
          <SectionHead eyebrow="Our expertise" title="Eight services. One exacting standard." copy="Hover a service to preview it, or tap to explore what is involved." action={{ label: "View all services", href: "/services" }} />
          <ServiceIndex />
        </div>
      </section>
      <ProtectionFeature />
      <WhySection />
      <ProcessJourney />
      <WorkReel />
      <MarquesBand />
      {testimonials.length > 0 && (
        <section className="testimonials-section section">
          <div className="container">
            <SectionHead eyebrow="Client voices" title="In their words." />
            <div className="testimonial-grid">{testimonials.map((item) => <blockquote key={item.name} data-reveal><p>“{item.quote}”</p><cite>{item.name} · {item.service}</cite></blockquote>)}</div>
          </div>
        </section>
      )}
      <section className="faq-section section container"><SectionHead eyebrow="Frequently asked" title="Good decisions start with clear answers." /><FaqList items={generalFaqs} /></section>
      <FinalCta />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Services                                                            */
/* ------------------------------------------------------------------ */

export function ServicesPage() {
  return (
    <>
      <PageHero eyebrow="Our services" title="Protection. Styling. Detail." copy="Eight specialist services for how your car looks, how it is protected, and how it is maintained." image="/images/blue-mercedes.jpeg" imagePosition="50% 62%" caption="Mercedes E-Class" />
      {(["Protection", "Styling & Detailing"] as const).map((group) => (
        <section className="section container service-group" key={group}>
          <SectionHead eyebrow={group === "Protection" ? "Keep it perfect" : "Make it yours"} title={group} />
          <div className="service-grid">{services.filter((service) => service.group === group).map((service) => <ServiceCard service={service} index={services.indexOf(service)} key={service.slug} />)}</div>
        </section>
      ))}
      <section className="service-guidance section container">
        <div><Eyebrow>Not sure what you need?</Eyebrow><h2 data-split>Start with the car, not a package.</h2></div>
        <p data-reveal>Share the condition, the result you want, and how you use the car. We will separate what is useful from what is unnecessary.</p>
        <Link className="button button-gold" href="/get-a-quote" data-reveal>Request guidance {arrow}</Link>
      </section>
      <FinalCta title="A better finish begins with a better conversation." image="/images/aqua-range-rover.jpeg" />
    </>
  );
}

export function ServiceDetailPage({ service }: { service: Service }) {
  const icons = [ShieldCheck, Sparkles, Droplets, Layers];
  return (
    <>
      <PageHero eyebrow={`${service.group} · ${service.kicker}`} title={service.title} copy={service.description} image={service.image} imagePosition={service.imagePosition} />
      <section className="service-intro section container">
        <div><Eyebrow>The service</Eyebrow><h2 data-split>Considered around your car.</h2></div>
        <div>
          <p className="lead" data-scrub-text>{service.longDescription}</p>
          <div className="inline-actions" data-reveal>
            <Link className="button button-gold" href={`/get-a-quote?service=${service.slug}`}>Request a quote {arrow}</Link>
            <a className="text-link" href={business.instagram} target="_blank" rel="noreferrer">Ask on Instagram <Instagram size={16} /></a>
          </div>
        </div>
      </section>
      <section className="benefits-section section container">
        <SectionHead eyebrow="Key benefits" title="What this service is designed to deliver." />
        <div className="benefit-grid">{service.benefits.map((benefit, index) => { const Icon = icons[index % icons.length]; return <article key={benefit} data-reveal><span>0{index + 1}</span><Icon /><h3>{benefit}</h3></article>; })}</div>
      </section>
      <section className="options-section section">
        <div className="container options-layout">
          <div className="options-media" data-reveal="clip-up" data-parallax-scope>
            <Photo src={service.image} alt={`${service.title} studio image`} fill sizes="(max-width: 900px) 100vw, 40vw" quality={90} style={{ objectPosition: service.imagePosition }} data-parallax data-speed="10" />
            <span className="led-frame" aria-hidden="true" />
          </div>
          <div className="options-copy">
            <Eyebrow>Available scope</Eyebrow>
            <h2 data-split>Tailored coverage and treatment options.</h2>
            <p data-reveal>Final scope and materials are confirmed after we inspect the car, so you only pay for what makes a difference.</p>
            <ul>{service.options.map((option) => <li key={option} data-reveal><Check />{option}</li>)}</ul>
          </div>
        </div>
      </section>
      <section className="section container">
        <SectionHead eyebrow="Professional process" title="A measured sequence, from assessment to delivery." />
        <ol className="timeline">{service.process.map((step, index) => <li key={step} data-reveal><span>0{index + 1}</span><h3>{step}</h3></li>)}</ol>
      </section>
      <WorkReel eyebrow="Studio gallery" title="Inside the Al Wathbah studio." />
      <section className="faq-section section container"><SectionHead eyebrow="Service FAQs" title="Before you book." /><FaqList items={service.faqs} /></section>
      <FinalCta eyebrow={service.shortTitle} title={`Discuss ${service.title.toLowerCase()} for your car.`} image={service.image} />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Our work                                                            */
/* ------------------------------------------------------------------ */

export function OurWorkPage() {
  const categories = useMemo(() => ["All", ...Array.from(new Set(projectImages.map((project) => project.category)))], []);
  const [active, setActive] = useState("All");
  const grid = useRef<HTMLDivElement>(null);
  const flipState = useRef<Flip.FlipState | null>(null);
  const filtered = active === "All" ? projectImages : projectImages.filter((project) => project.category === active);
  const { open, viewer } = useLightbox(filtered);

  const choose = (category: string) => {
    if (category === active) return;
    if (grid.current && !prefersReducedMotion()) flipState.current = Flip.getState(grid.current.querySelectorAll(".portfolio-card"));
    setActive(category);
  };

  useLayoutEffect(() => {
    if (!flipState.current) return;
    Flip.from(flipState.current, {
      duration: 0.8,
      ease: "expo.inOut",
      absolute: true,
      onEnter: (elements) => gsap.fromTo(elements, { autoAlpha: 0, scale: 0.88 }, { autoAlpha: 1, scale: 1, duration: 0.7, delay: 0.2 }),
    });
    flipState.current = null;
  }, [active]);

  return (
    <>
      <PageHero eyebrow="Our work" title="Proof lives in the finish." copy="Real cars photographed inside the Al Wathbah studio — colour transformations, gloss finishes and everyday perfection." image="/images/aqua-range-rover.jpeg" imagePosition="50% 62%" caption="Range Rover Sport SVR" />
      <section className="portfolio-section section container">
        <div className="filter-bar" data-reveal>
          {categories.map((category) => <button type="button" key={category} data-active={active === category} onClick={() => choose(category)}>{category}<sup>{category === "All" ? projectImages.length : projectImages.filter((project) => project.category === category).length}</sup></button>)}
        </div>
        <div className="portfolio-grid" ref={grid}>
          {filtered.map((project, index) => (
            <article className="portfolio-card" key={project.src} data-flip-id={project.src}>
              <button type="button" className="portfolio-media" style={{ aspectRatio: `${project.width} / ${project.height}` }} data-cursor="ZOOM" onClick={(event) => open(index, event.currentTarget)}>
                <Photo src={project.src} alt={project.alt} fill sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw" quality={90} />
                <span className="reel-zoom"><Expand size={16} /></span>
              </button>
              <span>{project.category}</span>
              <h2>{project.title}</h2>
            </article>
          ))}
        </div>
      </section>
      {viewer}
      <FinalCta title="Bring us the car. Tell us the vision." image="/images/aqua-mercedes.jpeg" />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* About                                                               */
/* ------------------------------------------------------------------ */

export function AboutPage() {
  const values = [
    [Sparkles, "Craft over shortcuts", "Preparation and finishing get the time they need for a result that holds up to close inspection."],
    [ShieldCheck, "Respect for materials", "The method follows the car's surfaces, condition and agreed scope — never a one-size routine."],
    [Clock3, "Clear expectations", "Outcomes, timing, aftercare and any written terms are discussed before handover."],
  ] as const;
  return (
    <>
      <PageHero eyebrow="About Al Wathbah" title="Professionalism, defined by precision." copy="A premium car detailing and protection studio in Sharjah & Ajman, built on one belief: every part matters." image="/images/g-wagon.jpeg" imagePosition="50% 72%" caption="Mercedes-AMG G 63" />
      <section className="about-manifesto section container">
        <div><Eyebrow>Our philosophy</Eyebrow><h2 data-split>Every part matters. Every decision shows in the result.</h2></div>
        <div>
          <p className="lead" data-scrub-text>Al Wathbah exists for owners who notice the difference between work that is simply finished and work that has been considered.</p>
          <p data-reveal>Our focus is the process: assessment, preparation, controlled execution, and a disciplined final check — whether the car is in for a VIP wash or a full colour change.</p>
        </div>
      </section>
      <section className="about-gallery container" data-parallax-scope>
        <div className="about-col" data-parallax data-speed="-10">
          <div className="about-photo" data-reveal="clip-up"><Photo src="/images/dodge-daytona.jpeg" alt="Dodge Charger Daytona in the Al Wathbah studio" fill sizes="(max-width: 900px) 100vw, 33vw" /></div>
        </div>
        <div className="about-col offset" data-parallax data-speed="14">
          <div className="about-photo" data-reveal="clip-down"><Photo src="/images/blue-mercedes.jpeg" alt="Blue Mercedes beside the studio wall of film rolls" fill sizes="(max-width: 900px) 100vw, 33vw" /></div>
        </div>
        <div className="about-col" data-parallax data-speed="-6">
          <div className="about-photo" data-reveal="clip-up"><Photo src="/images/land-cruiser.jpeg" alt="Toyota Land Cruiser under the studio neon" fill sizes="(max-width: 900px) 100vw, 33vw" /></div>
        </div>
      </section>
      <section className="values-section section container">
        <SectionHead eyebrow="What guides the work" title="A studio built around the details that remain." />
        <div className="value-grid">{values.map(([Icon, title, copy]) => <article key={title} data-reveal><Icon /><h3>{title}</h3><p>{copy}</p></article>)}</div>
      </section>
      <FinalCta />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Contact & quote                                                     */
/* ------------------------------------------------------------------ */

export function ContactPage() {
  return (
    <>
      <PageHero eyebrow="Contact" title="Let’s talk about your car." copy="Tell us what you want to protect, change or refine. We will help define the right next step." image="/images/land-cruiser.jpeg" imagePosition="50% 72%" caption="Toyota Land Cruiser" />
      <section className="contact-section section container">
        <div className="contact-details">
          <Eyebrow>Studio details</Eyebrow>
          <h2 data-split>Visit or message the studio.</h2>
          <div className="contact-list">
            <a href={business.instagram} target="_blank" rel="noreferrer" data-reveal><Instagram /><span><small>Instagram · fastest reply</small>{business.instagramHandle}</span><ArrowUpRight size={18} /></a>
            {business.phone && <a href={`tel:${business.phone}`} data-reveal><Phone /><span><small>Phone & WhatsApp</small>{business.phone}</span><ArrowUpRight size={18} /></a>}
            <div data-reveal><MapPin /><span><small>Studio</small>{business.address || business.serviceArea}</span></div>
            {business.hours && <div data-reveal><Clock3 /><span><small>Opening hours</small>{business.hours}</span></div>}
          </div>
        </div>
        <div data-reveal><ContactForm /></div>
      </section>
      {business.mapEmbedUrl && (
        <section className="map-section container" data-reveal="clip-up">
          <iframe src={business.mapEmbedUrl} title="Al Wathbah studio location" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
        </section>
      )}
      <FinalCta title="Precision starts with the right brief." image="/images/dodge-daytona.jpeg" />
    </>
  );
}

export function QuotePage({ service = "" }: { service?: string }) {
  const steps = ["Tell us about the car", "Add a few photos", "Receive a tailored scope"];
  const root = useRef<HTMLElement>(null);
  useHeroIntro(root);
  return (
    <>
      <section className="quote-hero container" ref={root}>
        <div>
          <div data-hero-fade><Eyebrow>Request a quotation</Eyebrow></div>
          <h1 data-split data-intro>Tell us about the car. We’ll shape the right scope.</h1>
          <p data-hero-fade>No generic packages or guesswork. Share the details and the studio will prepare a considered recommendation.</p>
        </div>
        <ol className="quote-steps">{steps.map((step, index) => <li key={step} data-hero-fade><span>{String(index + 1).padStart(2, "0")}</span><p>{step}</p></li>)}</ol>
      </section>
      <section className="quote-form-section container" data-reveal><QuoteForm defaultService={services.some((item) => item.slug === service) ? service : ""} /></section>
    </>
  );
}

export function LegalPage({ type }: { type: "privacy" | "terms" }) {
  const title = type === "privacy" ? "Privacy notice" : "Terms & conditions";
  return (
    <section className="legal-page container">
      <Eyebrow>Legal</Eyebrow>
      <h1 data-split>{title}</h1>
      <div data-reveal>
        <p>Our full {title.toLowerCase()} is being finalised and will be published here shortly.</p>
        <p>If you have any question about how we handle your information or the terms of a service, please message the studio and we will answer directly.</p>
        <a className="button button-outline" href={business.instagram} target="_blank" rel="noreferrer">Message the studio {arrow}</a>
      </div>
    </section>
  );
}
