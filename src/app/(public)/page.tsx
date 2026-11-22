import React from "react";
import { HomeHero } from "@/components/public/HomeHero";
import { HomeMetrics } from "@/components/public/HomeMetrics";
import { HomeTracks } from "@/components/public/HomeTracks";
import { HomeSectors } from "@/components/public/HomeSectors";
import { HomeMethodology } from "@/components/public/HomeMethodology";
import { HomeCta } from "@/components/public/HomeCta";

export default function HomePage() {
  return (
    <main className="w-full bg-white flex flex-col">
      {/* 1. Hero Section */}
      <HomeHero />

      {/* 2. Startup Authority Metrics Bar */}
      <HomeMetrics />

      {/* 3. Dual-Track Gateway */}
      <HomeTracks />

      {/* 4. The 5 Integrated Sectors Bento Grid */}
      <HomeSectors />

      {/* 5. 5-Stage Execution Methodology */}
      <HomeMethodology />

      {/* 6. Call to Action Banner */}
      <HomeCta />
    </main>
  );
}
