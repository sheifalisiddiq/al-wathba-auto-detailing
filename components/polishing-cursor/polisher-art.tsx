import type { Ref } from "react";

/** Pointer hotspot inside the 64×64 artwork: the centre of the polishing pad. */
export const HOTSPOT = { x: 18, y: 49 } as const;
export const ART_SIZE = 64;

/**
 * Miniature dual-action polisher in brand black and gold, tilted like the
 * concept art. Only the pad group (`padRef`) is animated; everything else is static.
 */
export function PolisherArt({ padRef, size }: { padRef: Ref<SVGGElement>; size: number }) {
  return (
    <svg className="polish-art" width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="pc-body" x1="0" y1="-1" x2="0" y2="1">
          <stop offset="0" stopColor="#2a2b30" />
          <stop offset=".45" stopColor="#0D0E10" />
          <stop offset="1" stopColor="#050506" />
        </linearGradient>
        <linearGradient id="pc-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#E5D1A6" />
          <stop offset=".5" stopColor="#C8A365" />
          <stop offset="1" stopColor="#8a6526" />
        </linearGradient>
        <radialGradient id="pc-pad" cx=".42" cy=".38" r=".75">
          <stop offset="0" stopColor="#F4E7C4" />
          <stop offset=".6" stopColor="#E5D1A6" />
          <stop offset="1" stopColor="#C8A365" />
        </radialGradient>
        <radialGradient id="pc-glow" cx=".5" cy=".5" r=".5">
          <stop offset="0" stopColor="#E5D1A6" stopOpacity=".55" />
          <stop offset="1" stopColor="#C8A365" stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse className="polish-art-glow" cx="18" cy="50" rx="24" ry="14" fill="url(#pc-glow)" />

      {/* pad foam edge + face (face spins; squashed for perspective) */}
      <ellipse cx="18" cy="52" rx="15" ry="7.5" fill="#8a6526" />
      <g transform="translate(18 49) scale(1 .5)">
        <circle r="15" fill="url(#pc-pad)" />
        <g ref={padRef}>
          <circle r="10.5" fill="none" stroke="#8a6526" strokeOpacity=".55" strokeWidth="1" />
          {[0, 60, 120, 180, 240, 300].map((angle) => (
            <line key={angle} x1="4.5" y1="0" x2="14" y2="0" stroke="#8a6526" strokeOpacity=".7" strokeWidth="1.6" strokeLinecap="round" transform={`rotate(${angle})`} />
          ))}
          <circle r="3.4" fill="#0D0E10" stroke="#C8A365" strokeWidth="1" />
        </g>
        <circle r="15" fill="none" stroke="#fff6dc" strokeOpacity=".55" strokeWidth=".8" />
      </g>

      {/* housing */}
      <ellipse cx="18" cy="43.5" rx="10" ry="4.2" fill="#050506" stroke="url(#pc-gold)" strokeWidth="1.4" />
      <ellipse cx="18" cy="39.5" rx="9.2" ry="7" fill="url(#pc-body)" />

      {/* tilted body */}
      <g transform="translate(19 36) rotate(-42)">
        <rect x="-1" y="-7.4" width="36" height="14.8" rx="7.4" fill="url(#pc-body)" />
        <rect x="3" y="-7.4" width="2" height="14.8" fill="url(#pc-gold)" />
        <rect x="26" y="-7.4" width="1.6" height="14.8" fill="url(#pc-gold)" />
        <path d="M7 -5.6 H29" stroke="#E5D1A6" strokeOpacity=".55" strokeWidth="1" strokeLinecap="round" />
        <path d="M12.5 3.4 L15.5 -3.4 L18.5 3.4 M13.7 1.2 H17.3" fill="none" stroke="url(#pc-gold)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="34" y="-2.4" width="3.4" height="4.8" rx="1.2" fill="url(#pc-gold)" />
        <path d="M37 0 Q42 1 45 5" fill="none" stroke="#3a3b40" strokeWidth="1.1" strokeLinecap="round" />
      </g>
    </svg>
  );
}
