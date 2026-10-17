# AL WATHBAH Automotive Studio

Production-ready Next.js website for AL WATHBAH, built around the client-provided logo PDFs and workshop photography.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Production checks

```bash
npm run lint
npm run build
npm start
```

## Content updates

Business details, services, FAQs, project imagery, and testimonials are centralized in [`lib/site-data.ts`](./lib/site-data.ts). Add verified details there rather than hard-coding them inside pages.

The supplied PDFs were converted into transparent web assets:

- `public/logo-primary.png` — full bilingual lockup
- `public/logo-secondary.png` — compact WA mark

Client photographs are copied into `public/images/` with readable filenames. The original WhatsApp exports remain untouched.

## Required before public launch

- Confirm phone and WhatsApp number.
- Confirm exact workshop address, Google Maps embed, and business hours.
- Confirm official social profile URLs and email address.
- Connect contact and quotation forms to an approved email, CRM, or server action.
- Supply verified testimonials before enabling the testimonial carousel.
- Supply matched before/after image pairs for the comparison module.
- Supply approved team biographies, company history, certifications, and partnerships if they should be published.
- Add client-approved privacy and terms documents.
- Set the production domain and add canonical URLs plus a sitemap.
- Confirm any product names, material specifications, and warranty terms in writing before publishing them.

Until those details are supplied, the interface clearly labels them as pending and never simulates a successful form submission.
