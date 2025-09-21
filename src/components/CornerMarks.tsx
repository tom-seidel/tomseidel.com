"use client";

import React from "react";

type CrossProps = {
  size?: number; // overall box size in px
  thickness?: number; // line thickness in px
  opacity?: number; // 0..100 tailwind opacity
};

function CrossTW({ size = 18, thickness = 1, opacity = 40 }: CrossProps) {
  // Tailwind doesn't interpolate numbers into arbitrary opacity directly, so we
  // pass the computed RGBA via CSS variable.
  const box = `${size}px`;
  const line = `${thickness}px`;
  return (
    <div className="relative" style={{ width: box, height: box }} aria-hidden>
      <div
        className="absolute left-0 right-0 top-1/2 -translate-y-1/2"
        style={{ height: line, background: `rgba(255,255,255, ${opacity / 100})` }}
      />
      <div
        className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2"
        style={{ width: line, background: `rgba(255,255,255, ${opacity / 100})` }}
      />
    </div>
  );
}

export default function CornerMarks() {
  return (
    <div className="pointer-events-none fixed inset-0 z-50">
      {/* top-left */}
      <div className="absolute left-4 top-4">
        <CrossTW />
      </div>
      {/* top-right */}
      <div className="absolute right-4 top-4">
        <CrossTW />
      </div>
      {/* bottom-left */}
      <div className="absolute bottom-4 left-4">
        <CrossTW />
      </div>
      {/* bottom-right */}
      <div className="absolute bottom-4 right-4">
        <CrossTW />
      </div>
    </div>
  );
}
