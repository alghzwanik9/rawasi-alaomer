import { Metadata } from "next";
import { MarjeaClient } from "@/components/marjea/MarjeaClient";
import { PROCEDURES_DATA } from "@/data/marjeaSeed";

export const metadata: Metadata = {
  title: "مرجع الجمعيات | المنصة الإجرائية والمعرفية للقطاع غير الربحي - رواسي العمر",
  description:
    "دليلك الإجرائي الشامل لتأسيس وتشغيل وحوكمة الجمعيات الأهلية والأوقاف في المملكة العربية السعودية، وفق أحدث تنظيمات المركز الوطني لتنمية القطاع غير الربحي.",
  keywords: [
    "مرجع الجمعيات",
    "تأسيس جمعية أهلية",
    "عقد جمعية عمومية",
    "انتخاب مجلس إدارة جمعية",
    "حوكمة الجمعيات",
    "المركز الوطني لتنمية القطاع غير الربحي",
    "نماذج لوائح الجمعيات",
    "فتح حساب بنكي جمعية",
    "منصة إحسان",
  ],
};

export default function MarjeaPage() {
  return <MarjeaClient initialProcedures={PROCEDURES_DATA} />;
}
