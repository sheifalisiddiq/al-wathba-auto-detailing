import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AboutPage, ContactPage, LegalPage, OurWorkPage, QuotePage, ServiceDetailPage, ServicesPage } from "@/components/page-views";
import { findService, services } from "@/lib/site-data";

type Props = { params: Promise<{ slug: string[] }> };

export function generateStaticParams() {
  return [
    { slug: ["services"] }, { slug: ["our-work"] }, { slug: ["about"] }, { slug: ["contact"] },
    { slug: ["get-a-quote"] }, { slug: ["privacy"] }, { slug: ["terms"] },
    ...services.map((service) => ({ slug: ["services", service.slug] })),
  ];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const path = slug.join("/");
  if (slug[0] === "services" && slug[1]) {
    const service = findService(slug[1]);
    if (service) return { title: service.title, description: service.description };
  }
  const map: Record<string, Metadata> = {
    services: { title: "Automotive Services", description: "Explore Al Wathbah vehicle protection, styling, and detailing services." },
    "our-work": { title: "Our Work", description: "Explore authentic automotive studio photography and completed vehicle presentation at Al Wathbah." },
    about: { title: "About Us", description: "Discover Al Wathbah’s precise, material-conscious approach to premium automotive care." },
    contact: { title: "Contact", description: "Contact Al Wathbah to discuss vehicle protection, styling, or detailing." },
    "get-a-quote": { title: "Get a Quote", description: "Request a tailored quotation for your vehicle and preferred automotive service." },
    privacy: { title: "Privacy Notice" }, terms: { title: "Terms & Conditions" },
  };
  return map[path] ?? { title: "Page Not Found" };
}

export default async function CatchAllPage({ params }: Props) {
  const { slug } = await params;
  const path = slug.join("/");
  if (path === "services") return <ServicesPage />;
  if (slug[0] === "services" && slug.length === 2) {
    const service = findService(slug[1]);
    return service ? <ServiceDetailPage service={service} /> : notFound();
  }
  if (path === "our-work") return <OurWorkPage />;
  if (path === "about") return <AboutPage />;
  if (path === "contact") return <ContactPage />;
  if (path === "get-a-quote") return <QuotePage />;
  if (path === "privacy" || path === "terms") return <LegalPage type={path} />;
  notFound();
}
