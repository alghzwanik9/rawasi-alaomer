import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "رواسي العمر | جهة واحدة، مسار واضح للتطوير والتنفيذ",
  description:
    "منظومة سعودية متكاملة تجمع بين التخطيط الاستشاري، الحوكمة المؤسسية، والتنفيذ الميداني الشامل تحت مظلة واحدة وفق مستهدفات رؤية 2030.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&family=IBM+Plex+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-white text-[#0E1D2B] antialiased flex flex-col font-arabic">
        {children}
      </body>
    </html>
  );
}
