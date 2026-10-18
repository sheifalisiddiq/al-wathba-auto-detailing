import Image from "next/image";

/** Rotating circular wordmark with the WA mark at its centre. */
export function SpinBadge({ text = "AL WATHBAH • BECAUSE EVERY PART MATTERS • ", className = "", size = 132 }: { text?: string; className?: string; size?: number }) {
  return (
    <div className={`spin-badge ${className}`} style={{ width: size, height: size }} aria-hidden="true">
      <svg viewBox="0 0 200 200" className="spin-badge-ring">
        <defs>
          <path id="spin-badge-path" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
        </defs>
        <text><textPath href="#spin-badge-path" textLength="488">{text}</textPath></text>
      </svg>
      <Image className="spin-badge-mark" src="/logo-secondary.png" alt="" width={794} height={266} />
    </div>
  );
}
