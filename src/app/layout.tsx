import type { Metadata } from "next";
import { IBM_Plex_Sans_Arabic, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";

const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ibm-plex-arabic",
  display: "swap",
});

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ibm-plex-sans",
  display: "swap",
});

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
    <html
      lang="ar"
      dir="rtl"
      className={`scroll-smooth ${ibmPlexSansArabic.variable} ${ibmPlexSans.variable}`}
    >
      <body
        className={`min-h-screen bg-white text-[#0E1D2B] antialiased flex flex-col font-arabic ${ibmPlexSansArabic.className}`}
      >
        {children}
      </body>
    </html>
  );
}
