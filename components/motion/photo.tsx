"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

/** next/image with a gloss-sweep skeleton that fades out once the photo has loaded. */
export function Photo({ className = "", onLoad, alt, ...props }: ImageProps) {
  const [loaded, setLoaded] = useState(false);
  return (
    <Image
      {...props}
      alt={alt}
      quality={props.quality ?? 85}
      className={`photo ${loaded ? "is-loaded" : ""} ${className}`}
      onLoad={(event) => {
        setLoaded(true);
        onLoad?.(event);
      }}
    />
  );
}
