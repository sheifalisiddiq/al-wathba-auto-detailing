"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Check, ChevronDown,
  Clock3, Gauge, Images, MapPin, MessageCircle, Phone, ShieldCheck, Sparkles, Upload,
} from "lucide-react";
import { AmbientGlow, Marquee, TiltCard } from "@/components/motion";
import { ContactForm, QuoteForm } from "@/components/forms";
import { business, generalFaqs, projectImages, services, testimonials, type Service } from "@/lib/site-data";

const arrow = <ArrowUpRight size={18} aria-hidden="true" />;

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <span className="eyebrow"><i />{children}</span>;
}

function SectionHead({ eyebrow, title, copy, action }: { eyebrow: string; title: string; copy?: string; action?: { label: string; href: string } }) {
  return (
    <div className="section-head" data-reveal>
      <div><Eyebrow>{eyebrow}</Eyebrow><h2>{title}</h2></div>
      {(copy || action) && <div className="section-head-side">{copy && <p>{copy}</p>}{action && <Link className="text-link" href={action.href}>{action.label}{arrow}</Link>}</div>}
    </div>
  );
}

function ServiceCard({ service, index }: { service: Service; index: number }) {
  return (
    <TiltCard className="service-card" key={service.slug}>
      <Link href={`/services/${service.slug}`} data-cursor="VIEW">
        <div className="service-card-media">
          <Image src={service.image} alt={`${service.title} at Al Wathbah`} fill sizes="(max-width: 760px) 100vw, (max-width: 1100px) 50vw, 33vw" style={{ objectPosition: service.imagePosition }} />
          <span className="service-index">{String(index + 1).padStart(2, "0")}</span>
          <span className="service-arrow"><ArrowUpRight /></span>
        </div>
        <div className="service-card-copy"><span>{service.group}</span><h3>{service.title}</h3><p>{service.description}</p><b>Explore service <ArrowRight size={16} /></b></div>
      </Link>
    </TiltCard>
  );
}

function ImagePanel({ src, alt, position = "50% 50%", className = "" }: { src: string; alt: string; position?: string; className?: string }) {
  return <div className={`image-panel ${className}`}><Image data-parallax data-speed="10" src={src} alt={alt} fill sizes="(max-width: 800px) 100vw, 60vw" style={{ objectPosition: position }} /></div>;
}

function ProjectCarousel() {
  const rail = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const move = (direction: number) => rail.current?.scrollBy({ left: direction * rail.current.clientWidth * 0.72, behavior: "smooth" });
  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      const element = rail.current;
      if (!element) return;
      const atEnd = element.scrollLeft + element.clientWidth >= element.scrollWidth - 20;
      element.scrollTo({ left: atEnd ? 0 : element.scrollLeft + element.clientWidth * 0.72, behavior: "smooth" });
    }, 4800);
    return () => window.clearInterval(timer);
  }, [paused]);
  return (
    <div className="project-carousel" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="carousel-controls"><button onClick={() => move(-1)} aria-label="Previous projects"><ArrowLeft /></button><button onClick={() => move(1)} aria-label="Next projects"><ArrowRight /></button></div>
      <div className="project-rail" ref={rail}>
        {projectImages.map((project, index) => (
          <Link className="project-slide" href="/our-work" key={project.src} data-cursor="OPEN">
            <Image src={project.src} alt={project.alt} fill sizes="(max-width: 760px) 88vw, 55vw" style={{ objectPosition: index === 0 ? "50% 55%" : "50% 50%" }} />
            <div className="project-slide-copy"><span>{project.category}</span><h3>{project.title}</h3><b>{String(index + 1).padStart(2, "0")}</b></div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function FaqList({ items }: { items: readonly { question: string; answer: string }[] }) {
  return <div className="faq-list">{items.map((item, index) => <details key={item.question} data-reveal><summary><span>{String(index + 1).padStart(2, "0")}</span><strong>{item.question}</strong><ChevronDown /></summary><p>{item.answer}</p></details>)}</div>;
}

function FinalCta({ eyebrow = "Start a conversation", title = "Your vehicle deserves a more considered standard." }: { eyebrow?: string; title?: string }) {
  return (
    <section className="final-cta">
      <Image data-parallax data-speed="8" src="/images/dodge-daytona.jpeg" alt="Black Dodge Daytona inside the Al Wathbah studio" fill sizes="100vw" />
      <div className="final-cta-overlay" />
      <div className="final-cta-content" data-reveal><Eyebrow>{eyebrow}</Eyebrow><h2>{title}</h2><div><Link className="button button-gold" href="/get-a-quote">Request a quote {arrow}</Link><Link className="button button-ghost" href="/contact">Contact the studio <MessageCircle size={18} /></Link></div></div>
    </section>
  );
}

export function HomePage() {
  return (
    <>
      <section className="hero home-hero">
        <Image className="hero-media" data-parallax data-speed="9" src="/images/land-cruiser.jpeg" alt="Toyota Land Cruiser presented in the Al Wathbah workshop" fill priority sizes="100vw" />
        <div className="hero-shade" /><AmbientGlow className="hero-glow" />
        <div className="hero-grid container">
          <div className="hero-copy">
            <Eyebrow>Premium automotive studio · UAE</Eyebrow>
            <h1><span>Precision</span><span>in every <em>detail.</em></span></h1>
            <p>Vehicle protection, styling, and detailing—executed with discipline and presented without compromise.</p>
            <div className="hero-actions"><Link className="button button-gold" href="/services">Explore services {arrow}</Link><Link className="button button-ghost" href="/our-work">View our work <ArrowRight size={18} /></Link></div>
          </div>
          <div className="hero-aside"><span>01</span><p>Protection<br />Styling<br />Detailing</p></div>
          <a href="#introduction" className="scroll-cue"><span>Scroll to discover</span><ArrowDown /></a>
        </div>
      </section>

      <Marquee items={["Paint Protection", "Color PPF", "Vehicle Wraps", "Detailing", "Ceramic Coating", "Window Tinting"]} />

      <section className="brand-intro container section" id="introduction">
        <div className="brand-intro-copy" data-reveal>
          <Eyebrow>About Al Wathbah</Eyebrow>
          <p className="display-copy">Where careful craft meets a distinctly <em>modern</em> standard of automotive care.</p>
          <div className="intro-bottom"><p>From discreet paint protection to bold visual transformations, our work begins with the same principle: understand the vehicle, respect the material, and finish every visible detail with intent.</p><Link className="text-link" href="/about">Discover our approach {arrow}</Link></div>
        </div>
        <div className="brand-intro-media" data-reveal>
          <ImagePanel src="/images/g-wagon.jpeg" alt="Mercedes G-Class inside the Al Wathbah workshop" position="50% 58%" />
          <div className="image-caption"><span>Inside the studio</span><span>Sharjah & Ajman, UAE</span></div>
        </div>
      </section>

      <section className="services-section section">
        <div className="container"><SectionHead eyebrow="Our expertise" title="Eight services. One exacting standard." copy="A focused menu for preserving, transforming, and maintaining the vehicles you care about." action={{ label: "View all services", href: "/services" }} /></div>
        <div className="service-grid container">{services.map((service, index) => <ServiceCard service={service} index={index} key={service.slug} />)}</div>
      </section>

      <section className="protection-feature section">
        <div className="container"><SectionHead eyebrow="Featured protection" title="Protect the finish. Redefine the presence." copy="Explore transparent and color protection routes shaped around your vehicle and the way you use it." /></div>
        <div className="protection-panels container">
          {services.slice(0, 2).map((service, index) => <Link href={`/services/${service.slug}`} className="protection-panel" key={service.slug} data-cursor="EXPLORE" data-reveal><Image data-parallax data-speed="8" src={service.image} alt={service.title} fill sizes="(max-width: 800px) 100vw, 50vw" style={{ objectPosition: service.imagePosition }} /><div className="panel-overlay" /><div className="panel-copy"><span>0{index + 1} / Protection</span><h3>{service.shortTitle}</h3><p>{service.description}</p><b>Explore protection {arrow}</b></div></Link>)}
        </div>
      </section>

      <section className="why-section section container">
        <SectionHead eyebrow="Why Al Wathbah" title="The difference lives in the discipline." />
        <div className="why-layout">
          <div className="why-sticky" data-reveal><p>Premium work is not a claim. It is the sum of preparation, patience, controlled execution, and a final inspection that refuses to overlook the small things.</p><Link className="button button-outline" href="/about">Our philosophy {arrow}</Link></div>
          <div className="why-list">
            {[['01','Assessment before action','Every service begins by understanding the vehicle, finish, and intended result.'],['02','Material-conscious craft','Methods are selected around the surface and scope—not applied as a generic routine.'],['03','Detail-led execution','Edges, transitions, trim, reflections, and touchpoints receive the same close attention.'],['04','Honest handover','Care guidance and any applicable terms are explained clearly at delivery.']].map(([number,title,copy]) => <article key={number} data-reveal><span>{number}</span><div><h3>{title}</h3><p>{copy}</p></div></article>)}
          </div>
        </div>
      </section>

      <section className="projects-section section">
        <div className="container"><SectionHead eyebrow="Selected studio work" title="Craft, seen from every angle." copy="Authentic imagery supplied by the Al Wathbah studio." action={{ label: "Explore our work", href: "/our-work" }} /></div>
        <ProjectCarousel />
      </section>

      <section className="process-section section container">
        <SectionHead eyebrow="Our process" title="Clear from first conversation to final handover." />
        <div className="process-grid">{[
          ["01", "Consultation", "Tell us what you want to protect, refine, or transform."],
          ["02", "Vehicle assessment", "We inspect the relevant surfaces and define an appropriate scope."],
          ["03", "Service execution", "The agreed work is completed in a controlled, detail-led sequence."],
          ["04", "Quality check & delivery", "We inspect the result, explain care, and hand the vehicle back."],
        ].map(([number, title, copy]) => <article key={number} data-reveal><span>{number}</span><div className="process-icon"><i /><Gauge /></div><h3>{title}</h3><p>{copy}</p></article>)}</div>
      </section>

      <section className="testimonials-section section">
        <div className="container"><SectionHead eyebrow="Client voices" title="Trust should be documented, not invented." copy="Verified customer feedback will be published here once supplied or connected to an approved review source." /></div>
        {testimonials.length ? <div /> : <div className="testimonial-empty container" data-reveal><div className="quote-mark">“</div><p>Reserved for verified Al Wathbah customer reviews.</p><span>No placeholder endorsements. No fabricated names.</span></div>}
      </section>

      <section className="faq-section section container"><SectionHead eyebrow="Frequently asked" title="Good decisions start with clear answers." /><FaqList items={generalFaqs} /></section>
      <FinalCta />
    </>
  );
}

function PageHero({ eyebrow, title, copy, image, imagePosition = "50% 50%" }: { eyebrow: string; title: string; copy: string; image: string; imagePosition?: string }) {
  return (
    <section className="page-hero">
      <Image className="hero-media" data-parallax data-speed="8" src={image} alt="" fill priority sizes="100vw" style={{ objectPosition: imagePosition }} />
      <div className="hero-shade" />
      <div className="page-hero-copy container"><Eyebrow>{eyebrow}</Eyebrow><h1>{title}</h1><p>{copy}</p></div>
    </section>
  );
}

export function ServicesPage() {
  return <><PageHero eyebrow="Our services" title="Protection. Styling. Detail." copy="A complete, carefully structured approach to how your vehicle looks, feels, and is maintained." image="/images/blue-mercedes.jpeg" imagePosition="50% 55%" /><section className="section container"><SectionHead eyebrow="The complete range" title="Choose your direction." copy="If you are unsure where to begin, request a consultation and we will help define the right scope." /><div className="service-grid overview-grid">{services.map((service, index) => <ServiceCard service={service} index={index} key={service.slug} />)}</div></section><section className="service-guidance section container" data-reveal><div><Eyebrow>Not sure what you need?</Eyebrow><h2>Start with the vehicle, not a package.</h2></div><p>Share the condition, the result you want, and how you use the vehicle. We will help separate what is useful from what is unnecessary.</p><Link className="button button-gold" href="/get-a-quote">Request guidance {arrow}</Link></section><FinalCta title="A better finish begins with a better conversation." /></>;
}

export function ServiceDetailPage({ service }: { service: Service }) {
  return (
    <>
      <PageHero eyebrow={`${service.group} · ${service.kicker}`} title={service.title} copy={service.description} image={service.image} imagePosition={service.imagePosition} />
      <section className="service-intro section container"><div data-reveal><Eyebrow>The service</Eyebrow><h2>Considered around your vehicle.</h2></div><div data-reveal><p className="lead">{service.longDescription}</p><div className="inline-actions"><Link className="button button-gold" href={`/get-a-quote?service=${service.slug}`}>Request a quote {arrow}</Link><Link className="text-link" href="/contact">Ask a question <MessageCircle size={17} /></Link></div></div></section>
      <section className="benefits-section section container"><SectionHead eyebrow="Key benefits" title="What this service is designed to deliver." /><div className="benefit-grid">{service.benefits.map((benefit, index) => <article key={benefit} data-reveal><span>0{index + 1}</span><ShieldCheck /><h3>{benefit}</h3></article>)}</div></section>
      <section className="options-section section"><div className="container options-layout"><ImagePanel src={service.image} alt={`${service.title} studio image`} position={service.imagePosition} /><div className="options-copy" data-reveal><Eyebrow>Available scope</Eyebrow><h2>Tailored coverage and treatment options.</h2><p>Final availability and material selection are confirmed after inspection. We do not publish unverified product specifications, packages, or warranty terms.</p><ul>{service.options.map((option) => <li key={option}><Check />{option}</li>)}</ul></div></div></section>
      <section className="process-section section container"><SectionHead eyebrow="Professional process" title="A measured sequence, from assessment to delivery." /><div className="process-grid compact-process">{service.process.map((step, index) => <article key={step} data-reveal><span>0{index + 1}</span><h3>{step}</h3></article>)}</div></section>
      <section className="service-gallery section"><div className="container"><SectionHead eyebrow="Studio gallery" title="Inside the Al Wathbah environment." copy="Client-supplied photography is shown as authentic studio imagery; no image is assigned a technical treatment that has not been verified." /></div><ProjectCarousel /></section>
      <section className="faq-section section container"><SectionHead eyebrow="Service FAQs" title="Before you book." /><FaqList items={service.faqs} /></section>
      <FinalCta eyebrow={service.shortTitle} title={`Discuss ${service.title.toLowerCase()} for your vehicle.`} />
    </>
  );
}

function ComparisonPlaceholder() {
  const [position, setPosition] = useState(50);
  return (
    <div className="comparison-module" data-reveal>
      <div className="comparison-stage">
        <div className="comparison-side comparison-before"><Upload /><span>Matched “before” image required</span></div>
        <div className="comparison-side comparison-after" style={{ clipPath: `inset(0 0 0 ${position}%)` }}><Images /><span>Matched “after” image required</span></div>
        <div className="comparison-divider" style={{ left: `${position}%` }}><i><ArrowLeft size={14} /><ArrowRight size={14} /></i></div>
        <input type="range" min="10" max="90" value={position} onChange={(event) => setPosition(Number(event.target.value))} aria-label="Preview before and after image comparison" />
      </div>
      <div className="comparison-note"><strong>Before / after comparison module</strong><p>Interaction is production-ready. Publish it when a verified, matched image pair is supplied.</p></div>
    </div>
  );
}

export function OurWorkPage() {
  const categories = useMemo(() => ["All", ...Array.from(new Set(projectImages.map((project) => project.category)))], []);
  const [active, setActive] = useState("All");
  const filtered = active === "All" ? projectImages : projectImages.filter((project) => project.category === active);
  return (
    <><PageHero eyebrow="Our work" title="Proof lives in the finish." copy="A visual record of vehicles inside the Al Wathbah studio, using authentic client-supplied photography." image="/images/aqua-range-rover.jpeg" imagePosition="50% 58%" />
      <section className="portfolio-section section container"><div className="filter-bar" data-reveal>{categories.map((category) => <button key={category} data-active={active === category} onClick={() => setActive(category)}>{category}</button>)}</div><div className="portfolio-grid">{filtered.map((project, index) => <article className={`portfolio-card ${index % 3 === 0 ? "wide" : ""}`} key={project.src} data-reveal><div><Image src={project.src} alt={project.alt} fill sizes="(max-width: 760px) 100vw, 50vw" /></div><span>{project.category}</span><h2>{project.title}</h2><p>Client-supplied studio photograph. Detailed service notes can be added when the project record is verified.</p></article>)}</div></section>
      <section className="comparison-section section container"><SectionHead eyebrow="Transformations" title="Built for honest before-and-after storytelling." copy="A matched comparison requires two verified images of the same vehicle and angle. The supplied set does not include that pair, so the interface remains clearly marked until assets arrive." /><ComparisonPlaceholder /></section>
      <FinalCta title="Bring us the vehicle. Tell us the vision." />
    </>
  );
}

export function AboutPage() {
  return (
    <><PageHero eyebrow="About Al Wathbah" title="Professionalism, defined by precision." copy="A premium UAE automotive studio focused on protection, customization, and detail-led presentation." image="/images/g-wagon.jpeg" imagePosition="50% 58%" />
      <section className="about-manifesto section container"><div data-reveal><Eyebrow>Our philosophy</Eyebrow><h2>Every part matters. Every decision should be visible in the result.</h2></div><div data-reveal><p>Al Wathbah exists for owners who notice the difference between work that is simply complete and work that has been considered. Our focus is the process: assessment, preparation, controlled execution, and a disciplined final check.</p><p>Company history, founding details, team biographies, certifications, and verified partnerships can be added here when approved by the client.</p></div></section>
      <section className="about-gallery section container"><div className="tall" data-reveal><Image src="/images/dodge-daytona.jpeg" alt="Dodge Daytona in the Al Wathbah studio" fill sizes="55vw" /></div><div data-reveal><Image src="/images/blue-mercedes.jpeg" alt="Blue Mercedes in the workshop" fill sizes="40vw" /></div><div data-reveal><Image src="/images/aqua-mercedes.jpeg" alt="Aqua Mercedes in the workshop" fill sizes="40vw" /></div></section>
      <section className="values-section section container"><SectionHead eyebrow="What guides the work" title="A studio built around the details that remain." /><div className="value-grid">{[[Sparkles,"Craft over shortcuts","Preparation and finishing receive the time needed for a considered result."],[ShieldCheck,"Respect for materials","The method follows the vehicle’s surfaces, condition, and agreed service scope."],[Gauge,"Clear expectations","Outcomes, timing, care, and applicable terms are discussed before handover."]].map(([Icon,title,copy]) => { const ValueIcon = Icon as typeof Sparkles; return <article key={String(title)} data-reveal><ValueIcon /><h3>{String(title)}</h3><p>{String(copy)}</p></article>; })}</div></section>
      <section className="team-placeholder section container" data-reveal><div><Eyebrow>People behind the finish</Eyebrow><h2>Team profiles awaiting client approval.</h2></div><p>This space is prepared for real workshop portraits, names, roles, and experience. No team identity or credential has been fabricated for launch.</p></section>
      <FinalCta />
    </>
  );
}

export function ContactPage() {
  return (
    <><PageHero eyebrow="Contact" title="Let’s talk about your vehicle." copy="Share what you want to protect, change, or refine. We will help define the next step." image="/images/land-cruiser.jpeg" imagePosition="50% 68%" />
      <section className="contact-section section container"><div className="contact-details" data-reveal><Eyebrow>Studio details</Eyebrow><h2>Plan your visit.</h2><div className="contact-list"><div><Phone /><span><small>Phone & WhatsApp</small>{business.phone || "To be confirmed"}</span></div><div><MapPin /><span><small>Workshop address</small>{business.address || "Exact address to be confirmed"}</span></div><div><Clock3 /><span><small>Business hours</small>{business.hours || "To be confirmed"}</span></div></div><p className="data-note">These details are intentionally not guessed. Update them once the client confirms the official phone number, address, opening hours, map, and social profiles.</p></div><ContactForm /></section>
      <section className="map-placeholder container" data-reveal><MapPin /><h2>Google Maps embed ready</h2><p>Add the confirmed workshop map URL in the centralized business configuration to activate this area.</p></section>
      <FinalCta title="Precision starts with the right brief." />
    </>
  );
}

export function QuotePage() {
  return (
    <><section className="quote-hero container"><div><Eyebrow>Request a quotation</Eyebrow><h1>Tell us about the vehicle. We’ll shape the right scope.</h1><p>No generic packages or invented prices. Share the details and the studio can prepare a considered recommendation.</p></div><div className="quote-hero-aside"><span>01</span><p>Complete the vehicle details</p><span>02</span><p>Add images where useful</p><span>03</span><p>Connect the submission endpoint</p></div></section><section className="quote-form-section container"><QuoteForm /></section></>
  );
}

export function LegalPage({ type }: { type: "privacy" | "terms" }) {
  const title = type === "privacy" ? "Privacy notice" : "Terms & conditions";
  return <section className="legal-page container"><Eyebrow>Legal</Eyebrow><h1>{title}</h1><div><p>This page is reserved for the client-approved {title.toLowerCase()}.</p><p>Legal content has not been fabricated. Publish the applicable UAE-compliant document before enabling production form submissions or analytics that collect personal data.</p><Link className="button button-outline" href="/contact">Contact the studio {arrow}</Link></div></section>;
}
