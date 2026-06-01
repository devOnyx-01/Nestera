"use client";

import React, { useState } from "react";
import Image, { ImageProps } from "next/image";
import { useTheme } from "../context/ThemeContext";

interface ThemedImageProps extends Omit<ImageProps, "src"> {
  srcLight: string;
  srcDark: string;
  alt: string;
}

/**
 * Renders the correct image variant based on the active theme.
 * Falls back to a skeleton placeholder while loading.
 */
export default function ThemedImage({ srcLight, srcDark, alt, className, ...props }: ThemedImageProps) {
  const { resolvedTheme } = useTheme();
  const src = resolvedTheme === "dark" ? srcDark : srcLight;
  const [loaded, setLoaded] = useState(false);

  return (
    <span className="relative inline-block">
      {!loaded && (
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-inherit skeleton-shimmer"
        />
      )}
      <Image
        {...props}
        src={src}
        alt={alt}
        className={`transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"} ${className ?? ""}`}
        onLoad={() => setLoaded(true)}
      />
    </span>
  );
}
