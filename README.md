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
- Set `business.inquiryEndpoint` in `lib/site-data.ts` to the inquiry dashboard URL. Forms POST multipart form data (fields plus `kind` and `source`) there; until it is set, visitors are pointed to Instagram.
- Supply verified testimonials before enabling the testimonial carousel.
- Supply matched before/after image pairs for the comparison module.
- Supply approved team biographies, company history, certifications, and partnerships if they should be published.
- Add client-approved privacy and terms documents.
- Set the production domain and add canonical URLs plus a sitemap.
- Confirm any product names, material specifications, and warranty terms in writing before publishing them.

Until those details are supplied, the related sections stay hidden and forms never simulate a successful submission.

## Motion system

Animations are declarative. Add attributes in markup and `components/motion/motion-layer.tsx` wires them up on every route:

- `data-reveal` (`up`, `clip-up`, `clip-down`, `clip-left`, `clip-right`, `clip-center`, `zoom`)
- `data-split` (`lines` or `chars`, add `data-intro` to play after the preloader)
- `data-scrub-text`, `data-parallax` (+ `data-speed`, `data-axis`, `data-parallax-scope`), `data-zoom-through`, `data-magnetic`, `data-cursor="LABEL"`

The preloader plays once per browser session. Everything respects `prefers-reduced-motion`.

## Polishing cursor

`components/polishing-cursor/` holds the signature cursor (SVG art, canvas trail, rAF loop). It only activates for `(hover: hover) and (pointer: fine)` without `prefers-reduced-motion`; everything else keeps the native cursor. Add `data-polish` to any element to give it the photo-polish effect.
