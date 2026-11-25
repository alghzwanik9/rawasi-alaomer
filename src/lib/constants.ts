/**
 * Official Company Contact Constants for Rawasi Al-Omar
 * Can be configured via environment variables
 */
export const OFFICIAL_CONTACT = {
  raw: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "966575999956",
  display: process.env.NEXT_PUBLIC_WHATSAPP_DISPLAY || "+966 57 599 9956",
  local: "0575999956",
  email: "info@rawasialomar.sa",
  telUrl: `tel:+${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "966575999956"}`,
  whatsappBaseUrl: `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "966575999956"}`,
  getWhatsappUrl: (text?: string) => {
    const num = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "966575999956";
    if (!text) return `https://wa.me/${num}`;
    return `https://wa.me/${num}?text=${encodeURIComponent(text)}`;
  },
};
