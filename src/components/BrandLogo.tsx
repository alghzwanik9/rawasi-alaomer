import React from "react";
import Link from "next/link";

interface BrandLogoProps {
  className?: string;
  showSubtitle?: boolean;
  inverted?: boolean;
  href?: string;
}

export function BrandLogo({
  className = "h-10 w-auto",
  showSubtitle = true,
  inverted = false,
  href = "/",
}: BrandLogoProps) {
  const primaryColor = inverted ? "#FFFFFF" : "#163063";
  const subtitleColor = inverted ? "#E2ECF5" : "#526071";

  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-3 select-none group transition-opacity hover:opacity-95 ${className}`}
      aria-label="رواسي العمر"
    >
      {/* 4-Pillar Architectural Arch Symbol */}
      <svg
        className="h-10 w-auto shrink-0"
        viewBox="0 0 54 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Pillar 1: Deep Royal Navy */}
        <rect x="2" y="16" width="7" height="32" rx="3.5" fill="#163063" />
        {/* Pillar 2: Corporate Blue */}
        <rect x="14" y="8" width="7" height="40" rx="3.5" fill="#2360A5" />
        {/* Pillar 3: Bright Sky Cerulean */}
        <rect x="26" y="0" width="7" height="48" rx="3.5" fill="#3488C4" />
        {/* Pillar 4: Turquoise Teal */}
        <rect x="38" y="12" width="7" height="36" rx="3.5" fill="#47A3B8" />
        {/* Base Foundation Curve */}
        <path
          d="M0 46 C 14 43, 34 43, 48 46"
          stroke={inverted ? "#FFFFFF" : "#163063"}
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.3"
        />
      </svg>

      {/* Typography */}
      <div className="flex flex-col text-right leading-none">
        <span
          className="text-xl md:text-2xl font-bold tracking-tight font-arabic"
          style={{ color: primaryColor }}
        >
          رواسي العمر
        </span>
        {showSubtitle && (
          <span
            className="text-[10px] md:text-[11px] font-medium tracking-normal mt-1 font-arabic"
            style={{ color: subtitleColor }}
          >
            للتطوير والاستدامة المؤسسية
          </span>
        )}
      </div>
    </Link>
  );
}

export default BrandLogo;
