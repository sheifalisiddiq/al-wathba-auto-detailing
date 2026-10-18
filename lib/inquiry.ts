import { business } from "@/lib/site-data";

export type InquiryKind = "quote" | "contact";

export type InquiryResult =
  | { status: "sent" }
  | { status: "offline" }
  | { status: "error"; message: string };

/**
 * Sends a form to the inquiry dashboard. Until `business.inquiryEndpoint` is
 * configured, nothing is sent and the caller should point visitors to Instagram.
 */
export async function submitInquiry(kind: InquiryKind, form: HTMLFormElement): Promise<InquiryResult> {
  const endpoint = business.inquiryEndpoint as string;
  if (!endpoint) return { status: "offline" };

  const data = new FormData(form);
  data.set("kind", kind);
  data.set("source", typeof window === "undefined" ? "" : window.location.pathname);

  try {
    const response = await fetch(endpoint, { method: "POST", body: data });
    if (!response.ok) return { status: "error", message: "We could not send your request. Please try again or message us on Instagram." };
    return { status: "sent" };
  } catch {
    return { status: "error", message: "Connection lost. Please try again or message us on Instagram." };
  }
}
