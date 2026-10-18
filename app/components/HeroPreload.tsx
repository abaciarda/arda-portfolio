"use client";

import { preload } from "react-dom";

export default function HeroPreload() {
  preload("/assets/images/splash-bg.webp", {
    as: "image",
    fetchPriority: "high",
  });
  return null;
}
