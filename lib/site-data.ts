export const business = {
  name: "AL WATHBAH",
  legalName: "AL WATHBAH Auto New Super Parts Tr. L.L.C.",
  tagline: "Where precision defines professionalism",
  email: "",
  phone: "",
  whatsapp: "",
  address: "",
  serviceArea: "Sharjah & Ajman, UAE",
  hours: "",
  instagram: "",
  mapEmbedUrl: "",
} as const;

export type Service = {
  slug: string;
  title: string;
  shortTitle: string;
  group: "Protection" | "Styling & Detailing";
  kicker: string;
  description: string;
  longDescription: string;
  image: string;
  imagePosition?: string;
  benefits: string[];
  options: string[];
  process: string[];
  faqs: { question: string; answer: string }[];
};

export const services: Service[] = [
  {
    slug: "ppf",
    title: "Paint Protection Film",
    shortTitle: "PPF",
    group: "Protection",
    kicker: "Invisible defence",
    description: "A carefully installed transparent layer designed to help shield high-impact painted surfaces from everyday road wear.",
    longDescription: "Paint protection film is for owners who want to preserve the finish of their vehicle without changing its visual character. Every installation begins with a close inspection, surface preparation, and a coverage discussion shaped around how the vehicle is driven.",
    image: "/images/land-cruiser.jpeg",
    imagePosition: "50% 72%",
    benefits: ["Helps protect exposed paintwork", "Maintains the vehicle’s original appearance", "Coverage tailored to the vehicle", "Careful edge and panel finishing"],
    options: ["High-impact area coverage", "Front-end coverage", "Full vehicle coverage", "Bespoke panel coverage"],
    process: ["Paintwork inspection", "Surface decontamination and preparation", "Pattern planning and film installation", "Edge review and final quality inspection"],
    faqs: [
      { question: "Which areas can be protected?", answer: "Coverage can be planned around selected high-impact panels, the front end, or the full vehicle. Final recommendations depend on the vehicle and the condition of its paintwork." },
      { question: "Will PPF change the look of my vehicle?", answer: "Transparent PPF is intended to preserve the existing appearance. The final visual result depends on the chosen finish and the condition of the surface beneath it." },
      { question: "How long does installation take?", answer: "Timing varies by vehicle, coverage, preparation needs, and film selection. We confirm a realistic handover window after assessing the vehicle." },
    ],
  },
  {
    slug: "color-ppf",
    title: "Color Paint Protection Film",
    shortTitle: "Color PPF",
    group: "Protection",
    kicker: "Protection, reimagined",
    description: "A finish-led transformation that combines protective film coverage with a considered new color or surface character.",
    longDescription: "Color PPF offers a visual transformation while adding a protective film layer over the vehicle’s painted panels. Our approach focuses on color selection, panel continuity, clean transitions, and a finish that feels intentional from every angle.",
    image: "/images/aqua-range-rover.jpeg",
    imagePosition: "50% 54%",
    benefits: ["Transforms the vehicle’s appearance", "Adds a protective film layer", "Reversible styling direction", "Detailed panel and edge finishing"],
    options: ["Full vehicle color change", "Two-tone concepts", "Accent panels", "Finish consultation"],
    process: ["Design and finish consultation", "Vehicle and paint assessment", "Surface preparation and installation", "Panel alignment and delivery inspection"],
    faqs: [
      { question: "How do I choose a color?", answer: "We review available finishes against the vehicle’s lines, trim, wheels, and your intended look before confirming the direction." },
      { question: "Is Color PPF the same as a vinyl wrap?", answer: "They are different material categories with different characteristics. We will explain the suitable route after understanding your priorities for protection, finish, and budget." },
      { question: "Can only selected panels be changed?", answer: "Yes. Accent areas and two-tone concepts can be considered, subject to panel layout and the intended overall design." },
    ],
  },
  {
    slug: "window-tinting",
    title: "Window Tinting",
    shortTitle: "Window Tinting",
    group: "Protection",
    kicker: "Comfort with clarity",
    description: "Precisely fitted automotive tinting selected around comfort, privacy, appearance, and applicable local requirements.",
    longDescription: "A quality tint installation should look integrated with the vehicle rather than added on. We assess the glass, discuss your preferred appearance, and complete the installation in a controlled environment with close attention to edges and visibility.",
    image: "/images/blue-mercedes.jpeg",
    imagePosition: "50% 48%",
    benefits: ["Enhanced cabin privacy", "A more composed exterior appearance", "Reduced glare in bright conditions", "Precision-cut installation"],
    options: ["Side and rear glass", "Full cabin glass package", "Shade consultation", "Existing film removal assessment"],
    process: ["Glass inspection", "Shade and compliance discussion", "Glass cleaning and film fitting", "Finish inspection and care guidance"],
    faqs: [
      { question: "Which tint shade should I choose?", answer: "The right shade depends on the desired appearance, privacy, visibility, and local regulations. We help compare appropriate options before installation." },
      { question: "Can old tint be removed?", answer: "Existing film can be assessed for removal. The condition of the film, adhesive, glass, and demister lines will guide the recommended approach." },
      { question: "When can the windows be used normally?", answer: "Care instructions and the recommended settling period depend on the selected film and conditions at installation; these are explained at handover." },
    ],
  },
  {
    slug: "ceramic-coatings",
    title: "Ceramic Coatings",
    shortTitle: "Ceramic Coating",
    group: "Protection",
    kicker: "Refined surface care",
    description: "A professionally prepared coating service designed to support easier maintenance and a rich, well-presented finish.",
    longDescription: "Ceramic coating is only as good as the surface beneath it. We begin by evaluating the paint, preparing it carefully, and recommending correction where appropriate before applying the selected coating system.",
    image: "/images/dodge-daytona.jpeg",
    imagePosition: "50% 62%",
    benefits: ["Supports easier routine cleaning", "Enhances gloss and visual depth", "Surface preparation matched to paint condition", "Controlled professional application"],
    options: ["Paint coating", "Wheel surface coating", "Glass coating", "Interior surface consultation"],
    process: ["Paint and surface assessment", "Wash, decontamination, and preparation", "Correction where agreed", "Coating application and curing review"],
    faqs: [
      { question: "Does the paint need polishing first?", answer: "Not every vehicle needs the same preparation. We inspect the finish and discuss whether polishing or paint correction would improve the result before coating." },
      { question: "Does a coating replace washing?", answer: "No. Coated vehicles still require appropriate maintenance. We provide care guidance suited to the completed service." },
      { question: "What surfaces can be coated?", answer: "Paint is the most common area, with additional options for wheels, glass, and selected surfaces depending on the vehicle and chosen system." },
    ],
  },
  {
    slug: "vehicle-wraps",
    title: "Vehicle Wraps",
    shortTitle: "Vehicle Wraps",
    group: "Styling & Detailing",
    kicker: "A new visual identity",
    description: "Considered color and finish transformations executed with close attention to body lines, joins, edges, and trim.",
    longDescription: "A vehicle wrap is a design decision as much as an installation. We guide the finish direction, assess the panels, plan transitions, and apply the material so the completed vehicle reads as one cohesive composition.",
    image: "/images/aqua-mercedes.jpeg",
    imagePosition: "50% 40%",
    benefits: ["Distinctive color and finish choices", "Reversible exterior restyling", "Design shaped around the vehicle", "Careful panel transitions and finishing"],
    options: ["Full color change", "Two-tone styling", "Roof and accent wraps", "Trim and detail treatments"],
    process: ["Creative consultation", "Vehicle and panel assessment", "Preparation, disassembly planning, and wrap", "Reassembly and detailed inspection"],
    faqs: [
      { question: "Can I wrap only part of the vehicle?", answer: "Yes. Roofs, mirrors, trim, and other accent areas can be considered as part of a balanced styling concept." },
      { question: "Can a wrapped vehicle be washed?", answer: "Yes, with appropriate methods. We explain the recommended care approach for the selected material at delivery." },
      { question: "Will you wrap over damaged paint?", answer: "Paint condition must be assessed first. Loose, repaired, or compromised paint may affect installation and removal, so we will advise honestly before proceeding." },
    ],
  },
  {
    slug: "interior-detailing",
    title: "Interior Detailing",
    shortTitle: "Interior Detailing",
    group: "Styling & Detailing",
    kicker: "Cabin, considered",
    description: "A methodical interior reset focused on materials, touchpoints, fine spaces, and an understated factory-fresh presentation.",
    longDescription: "Interior detailing is tailored to the cabin’s materials and condition. We assess high-contact areas, upholstery, trim, carpets, and confined spaces before defining the appropriate cleaning and finishing approach.",
    image: "/images/g-wagon.jpeg",
    imagePosition: "50% 60%",
    benefits: ["Material-conscious cleaning", "Attention to seams and confined spaces", "Refined, non-greasy presentation", "Service shaped around cabin condition"],
    options: ["Cabin refresh", "Deep interior detail", "Leather and trim care", "Carpet and fabric treatment assessment"],
    process: ["Cabin material inspection", "Vacuuming and dry preparation", "Targeted cleaning and detailing", "Final review and ventilation"],
    faqs: [
      { question: "Is every interior treated the same way?", answer: "No. Materials, condition, age, and previous treatments all affect the process. We select methods after inspection." },
      { question: "Can every stain be removed?", answer: "No responsible detailer can guarantee complete stain removal without inspection. We explain likely outcomes before treatment." },
      { question: "How long will the cabin need to dry?", answer: "Drying time depends on the materials and level of treatment. We confirm expected timing as part of the service plan." },
    ],
  },
  {
    slug: "exterior-polishing",
    title: "Exterior Polishing",
    shortTitle: "Exterior Polishing",
    group: "Styling & Detailing",
    kicker: "Clarity restored",
    description: "Measured paint enhancement designed to improve clarity, gloss, and consistency after a careful finish assessment.",
    longDescription: "Exterior polishing begins with diagnosis, not assumptions. We inspect the finish under suitable lighting, identify visible defects, and agree on a realistic enhancement approach before any machine work begins.",
    image: "/images/dodge-daytona.jpeg",
    imagePosition: "50% 72%",
    benefits: ["Improved gloss and paint clarity", "Process based on finish condition", "Careful panel-by-panel workmanship", "Preparation for selected protection services"],
    options: ["Gloss enhancement", "Targeted defect improvement", "Multi-stage correction assessment", "Polish and protection combination"],
    process: ["Paint inspection and lighting check", "Safe wash and decontamination", "Test section and polishing", "Finish review and protection discussion"],
    faqs: [
      { question: "Will polishing remove every scratch?", answer: "No. Results depend on defect depth, paint condition, and safe correction limits. We set expectations after inspection and a test section where appropriate." },
      { question: "Is polishing suitable for a new vehicle?", answer: "Some new vehicles benefit from light refinement while others need little intervention. We inspect first and recommend only what is useful." },
      { question: "Should protection be added afterwards?", answer: "A suitable protection step can help preserve the refined finish. Options are discussed according to your maintenance preferences." },
    ],
  },
  {
    slug: "vip-wash",
    title: "VIP Wash",
    shortTitle: "VIP Wash",
    group: "Styling & Detailing",
    kicker: "Maintenance, elevated",
    description: "A considered maintenance wash for owners who want careful handling and a consistently well-presented vehicle.",
    longDescription: "The VIP Wash is built around methodical care rather than speed. Exterior surfaces, wheels, details, and accessible cabin areas are treated with attention to the vehicle’s existing finishes and protection.",
    image: "/images/land-cruiser.jpeg",
    imagePosition: "50% 68%",
    benefits: ["Careful maintenance-focused wash", "Detail-led exterior finishing", "Attention to wheels and touchpoints", "Suitable for regularly maintained vehicles"],
    options: ["Exterior maintenance wash", "Exterior and cabin refresh", "Protected-vehicle maintenance", "Detailing assessment add-on"],
    process: ["Vehicle walkaround", "Exterior pre-clean and wash", "Wheel, detail, and cabin attention", "Drying and final presentation check"],
    faqs: [
      { question: "Is VIP Wash the same as detailing?", answer: "It is a premium maintenance service, while detailing generally involves deeper corrective or restorative work. We can advise which level suits the vehicle." },
      { question: "Can coated or wrapped vehicles be washed?", answer: "Yes. We adapt the wash approach to the vehicle’s known finishes and protection, and flag anything that needs assessment." },
      { question: "Do I need to book?", answer: "Advance booking is recommended so the right time and workspace can be reserved for your vehicle." },
    ],
  },
];

export const projectImages = [
  { src: "/images/aqua-range-rover.jpeg", title: "Aqua Range Rover", category: "Color Transformations", alt: "Aqua-finished Range Rover inside the Al Wathbah workshop" },
  { src: "/images/aqua-mercedes.jpeg", title: "Aqua Mercedes", category: "Color Transformations", alt: "Aqua-finished Mercedes photographed inside the workshop" },
  { src: "/images/dodge-daytona.jpeg", title: "Dodge Daytona", category: "Paint Finish", alt: "Black Dodge Daytona under studio inspection lights" },
  { src: "/images/land-cruiser.jpeg", title: "Land Cruiser", category: "Studio Work", alt: "Toyota Land Cruiser presented in the Al Wathbah workshop" },
  { src: "/images/blue-mercedes.jpeg", title: "Mercedes Sedan", category: "Studio Work", alt: "Blue Mercedes sedan in the wrap bay" },
  { src: "/images/g-wagon.jpeg", title: "Mercedes G-Class", category: "Studio Work", alt: "White Mercedes G-Class inside the detailing studio" },
] as const;

export const testimonials: { quote: string; name: string; service: string }[] = [];

export const generalFaqs = [
  { question: "How do I know which service my vehicle needs?", answer: "Start with a consultation. We assess the vehicle, listen to your priorities, and explain the suitable options before any work is booked." },
  { question: "Can I request several services together?", answer: "Yes. Protection, styling, and detailing can be planned as one coordinated booking when the service sequence and vehicle condition allow it." },
  { question: "Do you provide prices online?", answer: "Pricing is confirmed after the vehicle, coverage, material choice, and preparation requirements are understood. This avoids presenting a misleading one-size-fits-all figure." },
  { question: "Are warranties included?", answer: "Any applicable product or workmanship terms are confirmed in writing for the selected service before work begins. No warranty term should be assumed until it is documented in your quotation." },
] as const;

export const findService = (slug: string) => services.find((service) => service.slug === slug);
