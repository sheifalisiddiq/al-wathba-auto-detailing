"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowUpRight, ChevronDown, Menu, MessageCircle, X } from "lucide-react";
import { business, services } from "@/lib/site-data";
import { MotionLayer, Preloader } from "@/components/motion";

const mainLinks = [
  { href: "/", label: "Home" },
  { href: "/our-work", label: "Our Work" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
];

const serviceGroups = ["Protection", "Styling & Detailing"] as const;

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <MotionLayer>
      <Preloader />
      <Header />
      <main id="main-content">{children}</main>
      <Footer />
      <FloatingContact />
    </MotionLayer>
  );
}

function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    document.body.classList.toggle("menu-open", mobileOpen);
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
        setServicesOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.classList.remove("menu-open");
      window.removeEventListener("keydown", onKey);
    };
  }, [mobileOpen]);

  const isActive = (href: string) => href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="site-header">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <nav className="nav-shell" aria-label="Primary navigation" ref={navRef}>
        <Link href="/" className="brand" aria-label="Al Wathbah home">
          <Image src="/logo-primary.png" alt="Al Wathbah" width={1309} height={290} priority />
        </Link>

        <div className="desktop-nav">
          <Link href="/" data-active={isActive("/")}>Home</Link>
          <div
            className="services-nav"
            onMouseEnter={() => setServicesOpen(true)}
            onMouseLeave={() => setServicesOpen(false)}
            onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setServicesOpen(false); }}
          >
            <button type="button" aria-expanded={servicesOpen} aria-controls="services-mega-menu" onClick={() => setServicesOpen((value) => !value)}>
              Services <ChevronDown size={14} />
            </button>
            <div id="services-mega-menu" className="mega-menu" data-open={servicesOpen}>
              <div className="mega-intro">
                <span className="eyebrow">Our expertise</span>
                <strong>Protection, styling, and detail—considered as one.</strong>
                <Link href="/services">View all services <ArrowUpRight size={16} /></Link>
              </div>
              {serviceGroups.map((group) => (
                <div className="mega-group" key={group}>
                  <span>{group}</span>
                  {services.filter((service) => service.group === group).map((service) => (
                    <Link href={`/services/${service.slug}`} key={service.slug}>{service.shortTitle}<ArrowUpRight size={13} /></Link>
                  ))}
                </div>
              ))}
            </div>
          </div>
          {mainLinks.slice(1).map((link) => <Link key={link.href} href={link.href} data-active={isActive(link.href)}>{link.label}</Link>)}
        </div>

        <Link className="button button-small nav-quote" href="/get-a-quote"><span>Get a Quote</span><ArrowUpRight size={16} /></Link>
        <button className="menu-toggle" type="button" onClick={() => setMobileOpen(true)} aria-label="Open navigation" aria-expanded={mobileOpen}>
          <Menu />
        </button>
      </nav>

      <div className="mobile-menu" data-open={mobileOpen} aria-hidden={!mobileOpen}>
        <div className="mobile-menu-head">
          <Image src="/logo-secondary.png" alt="" width={794} height={266} />
          <button type="button" aria-label="Close navigation" onClick={() => setMobileOpen(false)}><X /></button>
        </div>
        <div className="mobile-links">
          <Link href="/" onClick={() => setMobileOpen(false)}><span>01</span>Home</Link>
          <Link href="/services" onClick={() => setMobileOpen(false)}><span>02</span>Services</Link>
          <Link href="/our-work" onClick={() => setMobileOpen(false)}><span>03</span>Our Work</Link>
          <Link href="/about" onClick={() => setMobileOpen(false)}><span>04</span>About Us</Link>
          <Link href="/contact" onClick={() => setMobileOpen(false)}><span>05</span>Contact</Link>
        </div>
        <div className="mobile-service-list">
          {services.map((service) => <Link key={service.slug} href={`/services/${service.slug}`} onClick={() => setMobileOpen(false)}>{service.shortTitle}</Link>)}
        </div>
        <Link className="button button-gold" href="/get-a-quote" onClick={() => setMobileOpen(false)}>Request a quotation <ArrowUpRight size={18} /></Link>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-statement" data-reveal>
        <span>Ready when you are.</span>
        <Link href="/get-a-quote">Let’s discuss your vehicle <ArrowUpRight /></Link>
      </div>
      <div className="footer-grid">
        <div className="footer-brand" data-reveal>
          <Image src="/logo-primary.png" alt="Al Wathbah" width={1309} height={290} />
          <p>Premium vehicle protection, styling, and detailing delivered with a precise, considered approach.</p>
        </div>
        <div data-reveal>
          <span className="footer-label">Navigate</span>
          <Link href="/">Home</Link><Link href="/services">Services</Link><Link href="/our-work">Our Work</Link><Link href="/about">About Us</Link><Link href="/contact">Contact</Link>
        </div>
        <div data-reveal>
          <span className="footer-label">Services</span>
          {services.slice(0, 6).map((service) => <Link href={`/services/${service.slug}`} key={service.slug}>{service.shortTitle}</Link>)}
        </div>
        <div data-reveal>
          <span className="footer-label">Studio</span>
          <p>{business.address || "Workshop address to be confirmed"}</p>
          <p>{business.phone || "Phone & WhatsApp to be confirmed"}</p>
          <p>{business.hours || "Business hours to be confirmed"}</p>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} {business.name}. All rights reserved.</span>
        <div><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link></div>
        <span>{business.serviceArea}</span>
      </div>
    </footer>
  );
}

function FloatingContact() {
  const href = business.whatsapp ? `https://wa.me/${business.whatsapp}` : "/contact#contact-form";
  return (
    <Link className="floating-contact" href={href} data-cursor="CHAT" aria-label={business.whatsapp ? "Chat with Al Wathbah on WhatsApp" : "Contact Al Wathbah"}>
      <MessageCircle />
      <span>{business.whatsapp ? "WhatsApp" : "Contact"}</span>
    </Link>
  );
}
