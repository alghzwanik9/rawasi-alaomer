import React from "react";
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import { AIAssistantWidget } from "@/components/public/AIAssistantWidget";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <div className="flex-1 pt-20">{children}</div>
      <AIAssistantWidget />
      <Footer />
    </div>
  );
}
