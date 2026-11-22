import { Suspense } from "react";
import { Metadata } from "next";
import { ProjectWizard } from "@/components/public/ProjectWizard";

export const metadata: Metadata = {
  title: "ابدأ مشروعك | معالج تأهيل ودراسة المشاريع - رواسي العمر",
  description:
    "معالج تفاعلي لتأهيل ودراسة المشاريع للجمعيات الأهلية، الأوقاف، والقطاع الخاص بالمملكة. حدد نوع كيانكم ومسارات الإسناد المطلوبة لتحصل على رقم مرجعي وخطة تنفيذية متكاملة.",
  keywords: [
    "ابدأ مشروعك",
    "تأهيل المشاريع",
    "رواسي العمر",
    "حوكمة جمعيات",
    "مقاولات أوقاف",
    "استشارات غير ربحية",
    "تسليم مفتاح",
  ],
};

function WizardLoading() {
  return (
    <div className="min-h-[600px] flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-[#2360A5]/20 border-t-[#2360A5] rounded-full animate-spin" />
        <span className="text-sm font-bold text-[#163063]">
          جاري تحميل معالج تأهيل المشروع...
        </span>
      </div>
    </div>
  );
}

export default function StartProjectPage() {
  return (
    <Suspense fallback={<WizardLoading />}>
      <ProjectWizard />
    </Suspense>
  );
}
