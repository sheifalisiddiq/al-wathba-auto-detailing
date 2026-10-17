"use client";

import { useRef, useState } from "react";
import { ArrowUpRight, ImagePlus } from "lucide-react";
import { services } from "@/lib/site-data";

type FormNotice = { kind: "idle" | "error" | "info"; message: string };

export function QuoteForm({ compact = false }: { compact?: boolean }) {
  const form = useRef<HTMLFormElement>(null);
  const [files, setFiles] = useState<string[]>([]);
  const [notice, setNotice] = useState<FormNotice>({ kind: "idle", message: "" });

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!event.currentTarget.checkValidity()) {
      event.currentTarget.reportValidity();
      setNotice({ kind: "error", message: "Please complete the required fields before continuing." });
      return;
    }
    setNotice({ kind: "info", message: "Your details are complete. Submission is paused until the client’s email or CRM endpoint is connected." });
  };

  return (
    <form className={`inquiry-form ${compact ? "form-compact" : ""}`} ref={form} onSubmit={submit} noValidate>
      <div className="form-grid">
        <label>
          <span>Your name *</span>
          <input name="name" autoComplete="name" required placeholder="Full name" />
        </label>
        <label>
          <span>WhatsApp / phone *</span>
          <input name="phone" autoComplete="tel" inputMode="tel" required placeholder="+971" minLength={7} />
        </label>
        <label>
          <span>Vehicle brand *</span>
          <input name="vehicleBrand" autoComplete="off" required placeholder="e.g. Mercedes-Benz" />
        </label>
        <label>
          <span>Vehicle model *</span>
          <input name="vehicleModel" autoComplete="off" required placeholder="e.g. G-Class" />
        </label>
        <label>
          <span>Vehicle year</span>
          <input name="vehicleYear" type="number" inputMode="numeric" min="1980" max="2030" placeholder="2025" />
        </label>
        <label>
          <span>Service required *</span>
          <select name="service" required defaultValue="">
            <option value="" disabled>Select a service</option>
            {services.map((service) => <option value={service.slug} key={service.slug}>{service.title}</option>)}
            <option value="unsure">Not sure — advise me</option>
          </select>
        </label>
        <label className="form-wide">
          <span>Additional requirements</span>
          <textarea name="message" rows={compact ? 4 : 6} placeholder="Tell us about the finish, coverage, condition, or result you have in mind." />
        </label>
        {!compact && (
          <label className="upload-field form-wide">
            <input
              name="vehicleImages"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={(event) => setFiles(Array.from(event.target.files ?? []).map((file) => file.name))}
            />
            <ImagePlus />
            <span><strong>Add vehicle images</strong><small>{files.length ? files.join(", ") : "JPG, PNG or WebP · optional"}</small></span>
          </label>
        )}
      </div>
      <label className="consent"><input type="checkbox" name="consent" required /><span>I agree to be contacted about this inquiry. *</span></label>
      <div className="form-actions">
        <button className="button button-gold" type="submit">Prepare inquiry <ArrowUpRight size={18} /></button>
        <small>This form will not claim a successful submission until a backend is connected.</small>
      </div>
      {notice.kind !== "idle" && <p className="form-notice" data-kind={notice.kind} role="status">{notice.message}</p>}
    </form>
  );
}

export function ContactForm() {
  const [notice, setNotice] = useState<FormNotice>({ kind: "idle", message: "" });
  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!event.currentTarget.checkValidity()) {
      event.currentTarget.reportValidity();
      setNotice({ kind: "error", message: "Please complete all required fields." });
      return;
    }
    setNotice({ kind: "info", message: "Message prepared. Connect the client’s inbox or CRM endpoint to enable delivery." });
  };
  return (
    <form className="inquiry-form contact-form" onSubmit={submit} noValidate id="contact-form">
      <div className="form-grid">
        <label><span>Name *</span><input name="name" required autoComplete="name" placeholder="Your name" /></label>
        <label><span>Phone / WhatsApp *</span><input name="phone" required autoComplete="tel" inputMode="tel" placeholder="+971" minLength={7} /></label>
        <label className="form-wide"><span>Email</span><input name="email" type="email" autoComplete="email" placeholder="you@example.com" /></label>
        <label className="form-wide"><span>How can we help? *</span><textarea name="message" required rows={6} placeholder="Tell us about your vehicle and what you need." /></label>
      </div>
      <button className="button button-gold" type="submit">Prepare message <ArrowUpRight size={18} /></button>
      {notice.kind !== "idle" && <p className="form-notice" data-kind={notice.kind} role="status">{notice.message}</p>}
    </form>
  );
}
