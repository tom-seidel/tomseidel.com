/* eslint-disable @next/next/no-img-element */
import * as React from "react";

type Props = React.ImgHTMLAttributes<HTMLImageElement>;

// Bluesky logo via Simple Icons CDN to ensure accurate glyph; kept as component to keep page code minimal
export function BlueskyLogoIcon({ className = "", ...props }: Props) {
  return (
    <img
      src="https://cdn.simpleicons.org/bluesky/ffffff"
      alt=""
      aria-hidden
      className={["inline-block h-5 w-5 sm:h-7 sm:w-7", className].filter(Boolean).join(" ")}
      width={28}
      height={28}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      {...props}
    />
  );
}
