"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowUpRight, Check, ImagePlus } from "lucide-react";
import { Instagram } from "@/components/icons";
import { submitInquiry, type InquiryKind } from "@/lib/inquiry";
import { business, services } from "@/lib/site-data";

type FormState = { kind: "idle" | "sending" | "sent" | "offline" | "error"; message?: string };

function useInquiry(type: InquiryKind) {
  const [state, setState] = useState<FormState>({ kind: "idle" });
  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      setState({ kind: "error", message: "Please complete the highlighted fields." });
      return;
    }
    setState({ kind: "sending" });
    const result = await submitInquiry(type, form);
    if (result.status === "sent") form.reset();
    setState(result.status === "error" ? { kind: "error", message: result.message } : { kind: result.status });
  };
  return { state, submit };
}

function SubmitButton({ state, label }: { state: FormState; label: string }) {
  const sending = state.kind === "sending";
  return (
    <button className="button button-gold submit-button" type="submit" disabled={sending} data-state={state.kind}>
      {sending ? <><span className="loader-mark"><Image src="/logo-secondary.png" alt="" width={794} height={266} /></span>Sending</> : <>{label} <ArrowUpRight size={18} /></>}
    </button>
  );
}

function FormFeedback({ state }: { state: FormState }) {
  if (state.kind === "sent") {
    return <div className="form-notice" data-kind="sent" role="status"><Check size={18} /><p>Thank you — your request is with the studio. We will be in touch shortly.</p></div>;
  }
  if (state.kind === "offline") {
    return (
      <div className="form-notice" data-kind="info" role="status">
        <p>Online requests are opening soon. For the fastest reply, send your vehicle details to us on Instagram.</p>
        <a className="text-link" href={business.instagram} target="_blank" rel="noreferrer"><Instagram size={16} />Message {business.instagramHandle}</a>
      </div>
    );
  }
  if (state.kind === "error") return <div className="form-notice" data-kind="error" role="alert"><p>{state.message}</p></div>;
  return null;
}

export function QuoteForm({ defaultService = "" }: { defaultService?: string }) {
  const [files, setFiles] = useState<string[]>([]);
  const { state, submit } = useInquiry("quote");

  return (
    <form className="inquiry-form" onSubmit={submit} noValidate>
      <div className="form-grid">
        <label className="field">
          <input name="name" autoComplete="name" required placeholder=" " />
          <span>Your name *</span>
        </label>
        <label className="field">
          <input name="phone" autoComplete="tel" inputMode="tel" required placeholder=" " minLength={7} />
          <span>WhatsApp / phone *</span>
        </label>
        <label className="field">
          <input name="vehicleBrand" autoComplete="off" required placeholder=" " />
          <span>Vehicle brand *</span>
        </label>
        <label className="field">
          <input name="vehicleModel" autoComplete="off" required placeholder=" " />
          <span>Vehicle model *</span>
        </label>
        <label className="field">
          <input name="vehicleYear" type="number" inputMode="numeric" min="1980" max="2030" placeholder=" " />
          <span>Vehicle year</span>
        </label>
        <label className="field field-select">
          <select name="service" required defaultValue={defaultService}>
            <option value="" disabled>Select a service</option>
            {services.map((service) => <option value={service.slug} key={service.slug}>{service.title}</option>)}
            <option value="unsure">Not sure — advise me</option>
          </select>
          <span>Service required *</span>
        </label>
        <label className="field form-wide">
          <textarea name="message" rows={5} placeholder=" " />
          <span>Tell us about the finish, coverage or result you have in mind</span>
        </label>
        <label className="upload-field form-wide" data-cursor="UPLOAD">
          <input
            name="vehicleImages"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={(event) => setFiles(Array.from(event.target.files ?? []).map((file) => file.name))}
          />
          <ImagePlus />
          <span><strong>Add photos of your vehicle</strong><small>{files.length ? files.join(", ") : "JPG, PNG or WebP · optional, helps us quote accurately"}</small></span>
        </label>
      </div>
      <label className="consent"><input type="checkbox" name="consent" required /><span>I agree to be contacted about this inquiry. *</span></label>
      <div className="form-actions"><SubmitButton state={state} label="Send my request" /></div>
      <FormFeedback state={state} />
    </form>
  );
}

export function ContactForm() {
  const { state, submit } = useInquiry("contact");
  return (
    <form className="inquiry-form contact-form" onSubmit={submit} noValidate id="contact-form">
      <div className="form-grid">
        <label className="field"><input name="name" required autoComplete="name" placeholder=" " /><span>Name *</span></label>
        <label className="field"><input name="phone" required autoComplete="tel" inputMode="tel" placeholder=" " minLength={7} /><span>Phone / WhatsApp *</span></label>
        <label className="field form-wide"><input name="email" type="email" autoComplete="email" placeholder=" " /><span>Email</span></label>
        <label className="field form-wide"><textarea name="message" required rows={5} placeholder=" " /><span>How can we help? *</span></label>
      </div>
      <div className="form-actions"><SubmitButton state={state} label="Send message" /></div>
      <FormFeedback state={state} />
    </form>
  );
}
