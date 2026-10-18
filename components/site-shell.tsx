"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowUpRight, ChevronDown, Menu, X } from "lucide-react";
import { Instagram } from "@/components/icons";
import { business, services } from "@/lib/site-data";
import { ButtonRipple } from "@/components/motion/cursor";
import { PolishingCursor } from "@/components/polishing-cursor/polishing-cursor";
import { MotionLayer } from "@/components/motion/motion-layer";
import { Preloader } from "@/components/motion/preloader";
import { lockScroll, SmoothScroll } from "@/components/motion/smooth-scroll";
import { SpinBadge } from "@/components/motion/spin-badge";

const mainLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/our-work", label: "Our Work" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const serviceGroups = ["Protection", "Styling & Detailing"] as const;

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <SmoothScroll>
      <MotionLayer>
        <Preloader />
        <ButtonRipple />
        <PolishingCursor />
        <Header />
        <main id="main-content" className="site-main">{children}</main>
        <Footer />
        <MobileActionBar />
      </MotionLayer>
    </SmoothScroll>
  );
}

function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const header = useRef<HTMLElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);

  const isActive = useCallback((href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href)), [pathname]);

  // Glass capsule hides while scrolling down, returns on the way up, compacts once scrolled.
  useEffect(() => {
    let last = window.scrollY;
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const element = header.current;
      if (!element) return;
      element.dataset.scrolled = String(y > 40);
      if (Math.abs(y - last) > 6) element.dataset.hidden = String(y > last && y > 240);
      last = y;
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(frame); };
  }, []);

  useEffect(() => {
    lockScroll(mobileOpen);
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setMobileOpen(false); setServicesOpen(false); }
    };
    window.addEventListener("keydown", onKey);
    return () => { lockScroll(false); window.removeEventListener("keydown", onKey); };
  }, [mobileOpen]);

  // Liquid indicator: glides to the hovered link and settles back on the active page.
  const moveIndicator = useCallback((target?: HTMLElement | null) => {
    const container = linksRef.current;
    if (!container) return;
    const element = target ?? container.querySelector<HTMLElement>("[data-active='true']");
    if (!element) { container.style.setProperty("--pill-o", "0"); return; }
    container.style.setProperty("--pill-x", `${element.offsetLeft}px`);
    container.style.setProperty("--pill-w", `${element.offsetWidth}px`);
    container.style.setProperty("--pill-o", "1");
  }, []);

  useEffect(() => {
    const frame = requestAnimationFrame(() => moveIndicator());
    return () => cancelAnimationFrame(frame);
  }, [pathname, moveIndicator]);

  const closeMenus = () => { setMobileOpen(false); setServicesOpen(false); };

  return (
    <header className="site-header" ref={header} data-menu={mobileOpen}>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <nav className="nav-shell" aria-label="Primary navigation">
        <span className="nav-glass" aria-hidden="true" />
        <Link href="/" className="brand" aria-label="Al Wathbah home" onClick={closeMenus}>
          <Image src="/logo-primary.png" alt="Al Wathbah" width={1309} height={290} priority />
        </Link>

        <div className="desktop-nav" ref={linksRef} onMouseLeave={() => moveIndicator()}>
          <span className="nav-pill" aria-hidden="true" />
          {mainLinks.map((link) => link.href === "/services" ? (
            <div
              key={link.href}
              className="services-nav"
              data-active={isActive(link.href)}
              onMouseEnter={(event) => { setServicesOpen(true); moveIndicator(event.currentTarget); }}
              onMouseLeave={() => setServicesOpen(false)}
              onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setServicesOpen(false); }}
            >
              <button type="button" aria-expanded={servicesOpen} aria-controls="services-mega-menu" onClick={() => setServicesOpen((value) => !value)}>
                Services <ChevronDown size={14} />
              </button>
              <div id="services-mega-menu" className="mega-menu" data-open={servicesOpen}>
                <div className="mega-intro">
                  <span className="eyebrow"><i />Our expertise</span>
                  <strong>Protection, styling and detail — considered as one.</strong>
                  <Link href="/services" onClick={closeMenus}>View all services <ArrowUpRight size={16} /></Link>
                </div>
                {serviceGroups.map((group) => (
                  <div className="mega-group" key={group}>
                    <span>{group}</span>
                    {services.filter((service) => service.group === group).map((service) => (
                      <Link href={`/services/${service.slug}`} key={service.slug} onClick={closeMenus}>{service.shortTitle}<ArrowUpRight size={14} /></Link>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <Link key={link.href} href={link.href} data-active={isActive(link.href)} onMouseEnter={(event) => moveIndicator(event.currentTarget)}>{link.label}</Link>
          ))}
        </div>

        <Link className="button button-small button-gold nav-quote" href="/get-a-quote"><span>Get a Quote</span><ArrowUpRight size={16} /></Link>
        <button className="menu-toggle" type="button" onClick={() => setMobileOpen((open) => !open)} aria-label={mobileOpen ? "Close navigation" : "Open navigation"} aria-expanded={mobileOpen} aria-controls="mobile-menu">
          {mobileOpen ? <X /> : <Menu />}
        </button>
      </nav>

      <div id="mobile-menu" className="mobile-menu" data-open={mobileOpen} aria-hidden={!mobileOpen} inert={!mobileOpen}>
        <div className="mobile-links">
          {mainLinks.map((link, index) => (
            <Link key={link.href} href={link.href} onClick={closeMenus} data-active={isActive(link.href)} style={{ transitionDelay: mobileOpen ? `${0.18 + index * 0.06}s` : "0s" }}>
              <span>{String(index + 1).padStart(2, "0")}</span>{link.label}
            </Link>
          ))}
        </div>
        <div className="mobile-service-list">
          {services.map((service) => <Link key={service.slug} href={`/services/${service.slug}`} onClick={closeMenus}>{service.shortTitle}</Link>)}
        </div>
        <div className="mobile-menu-actions">
          <Link className="button button-gold" href="/get-a-quote" onClick={closeMenus}>Request a quote <ArrowUpRight size={18} /></Link>
          <a className="button button-ghost" href={business.instagram} target="_blank" rel="noreferrer"><Instagram size={18} /> {business.instagramHandle}</a>
        </div>
        <span className="mobile-menu-arabic" aria-hidden="true">الوثبة</span>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-statement">
          <span className="eyebrow"><i />Ready when you are</span>
          <Link href="/get-a-quote" data-cursor="QUOTE"><span>Let’s talk about <em>your car</em></span> <ArrowUpRight /></Link>
        </div>
        <div className="footer-grid">
          <div className="footer-brand">
            <Image src="/logo-primary.png" alt="Al Wathbah" width={1309} height={290} />
            <p>Premium car detailing, paint protection and styling studio in Sharjah & Ajman — because every part matters.</p>
            <a className="footer-instagram" href={business.instagram} target="_blank" rel="noreferrer" data-cursor="FOLLOW"><Instagram size={18} />{business.instagramHandle}</a>
          </div>
          <div>
            <span className="footer-label">Navigate</span>
            {mainLinks.map((link) => <Link key={link.href} href={link.href}>{link.label}</Link>)}
            <Link href="/get-a-quote">Get a Quote</Link>
          </div>
          <div>
            <span className="footer-label">Services</span>
            {services.map((service) => <Link href={`/services/${service.slug}`} key={service.slug}>{service.shortTitle}</Link>)}
          </div>
          <div className="footer-badge-col">
            <span className="footer-label">Studio</span>
            <p>{business.serviceArea}</p>
            {business.address && <p>{business.address}</p>}
            {business.phone && <a href={`tel:${business.phone}`}>{business.phone}</a>}
            {business.hours && <p>{business.hours}</p>}
            <SpinBadge className="footer-badge" size={118} />
          </div>
        </div>
        <div className="footer-wordmark" aria-hidden="true"><span data-parallax data-axis="x" data-speed="12">AL WATHBAH</span></div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} {business.legalName}</span>
          <div><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link></div>
        </div>
      </div>
    </footer>
  );
}

function MobileActionBar() {
  return (
    <>
      <a className="floating-contact" href={business.instagram} target="_blank" rel="noreferrer" data-cursor="DM US" aria-label="Message Al Wathbah on Instagram">
        <SpinBadge className="floating-ring" size={96} text="MESSAGE US • INSTAGRAM • " />
        <Instagram />
      </a>
      <div className="mobile-action-bar">
        <a href={business.instagram} target="_blank" rel="noreferrer"><Instagram size={18} />Message us</a>
        <Link href="/get-a-quote">Get a quote <ArrowUpRight size={18} /></Link>
      </div>
    </>
  );
}
