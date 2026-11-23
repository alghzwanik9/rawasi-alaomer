"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { BrandLogo } from "@/components/BrandLogo";
import {
  ShieldCheck,
  ArrowLeft,
  Sparkles,
  Lock,
  Mail,
  ArrowRight,
  Briefcase,
  FileText,
  Scale,
  AlertCircle,
  CheckCircle2,
  KeyRound,
} from "lucide-react";
import {
  DEMO_STAFF_PASSWORD,
  DEMO_USERS,
  RoleId,
  signInAsRole,
  signInWithEmailPassword,
} from "@/data/portalAuth";

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/dashboard";
  const urlError = searchParams.get("error");

  const [selectedRole, setSelectedRole] = useState<RoleId>("super_admin");
  const [email, setEmail] = useState(DEMO_USERS.super_admin.email);
  const [password, setPassword] = useState(DEMO_STAFF_PASSWORD);
  const [isLoading, setIsLoading] = useState(false);
  const [activeQuickRole, setActiveQuickRole] = useState<RoleId | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(
    urlError === "unauthorized_staff"
      ? "هذا الحساب غير مصرح له بالدخول إلى لوحة التحكم الداخلية."
      : null
  );
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleQuickAuthLogin = async (roleId: RoleId) => {
    const targetUser = DEMO_USERS[roleId];
    setSelectedRole(roleId);
    setEmail(targetUser.email);
    setPassword(DEMO_STAFF_PASSWORD);
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);
    setActiveQuickRole(roleId);

    const result = await signInAsRole(roleId);
    if (!result.success) {
      setErrorMessage(result.error || "تعذر تسجيل الدخول عبر Supabase Auth.");
      setIsLoading(false);
      setActiveQuickRole(null);
      return;
    }

    setSuccessMessage(
      `تم توثيق الجلسة عبر Supabase Auth باسم: ${result.user?.name} (${result.user?.roleTitle})`
    );
    router.push(redirectTo);
    router.refresh();
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    const result = await signInWithEmailPassword(email, password);
    if (!result.success) {
      setErrorMessage(result.error || "بيانات الدخول غير صحيحة.");
      setIsLoading(false);
      return;
    }

    setSuccessMessage(
      `تم تسجيل الدخول بنجاح: ${result.user?.name} (${result.user?.roleTitle})`
    );
    router.push(redirectTo);
    router.refresh();
  };

  return (
    <div className="w-full max-w-xl relative z-10 space-y-6">
      {/* 1-CLICK LIVE SUPABASE AUTH ROLE SWITCHER */}
      <div className="bg-white rounded-2xl border-2 border-[#2360A5]/30 p-5 shadow-lg shadow-[#163063]/5">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3 border-b border-[#E2ECF5] pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#3488C4]" />
            <span className="text-xs font-bold text-[#163063]">
              الدخول الفوري بحسابات الموظفين (Live Supabase Auth + RBAC):
            </span>
          </div>
          <span className="text-[11px] font-semibold text-[#2360A5] bg-[#F2F8FC] px-2.5 py-0.5 rounded-full border border-[#E2ECF5]">
            كلمة المرور الموحدة: <code dir="ltr">{DEMO_STAFF_PASSWORD}</code>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {/* Role 1: super_admin */}
          <button
            type="button"
            disabled={isLoading}
            onClick={() => handleQuickAuthLogin("super_admin")}
            className={`p-3 rounded-xl border text-right transition-all flex items-start gap-3 group ${
              selectedRole === "super_admin"
                ? "border-[#163063] bg-[#F2F8FC]"
                : "border-[#E2ECF5] hover:border-[#163063] bg-white hover:bg-[#F2F8FC]"
            }`}
          >
            <div className="w-8 h-8 rounded-lg bg-[#163063] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-[#163063] group-hover:text-[#2360A5]">
                  المدير العام
                </h4>
                <span className="text-[10px] font-semibold text-[#526071]">
                  super_admin
                </span>
              </div>
              <p className="text-[11px] text-[#526071] truncate mt-0.5">
                {activeQuickRole === "super_admin"
                  ? "جاري توثيق الجلسة..."
                  : "ceo@rawasialomar.sa"}
              </p>
            </div>
          </button>

          {/* Role 2: sector_manager */}
          <button
            type="button"
            disabled={isLoading}
            onClick={() => handleQuickAuthLogin("sector_manager")}
            className={`p-3 rounded-xl border text-right transition-all flex items-start gap-3 group ${
              selectedRole === "sector_manager"
                ? "border-[#2360A5] bg-[#F2F8FC]"
                : "border-[#E2ECF5] hover:border-[#2360A5] bg-white hover:bg-[#F2F8FC]"
            }`}
          >
            <div className="w-8 h-8 rounded-lg bg-[#2360A5] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
              <Briefcase className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-[#163063] group-hover:text-[#2360A5]">
                  مدير قطاع / مبيعات
                </h4>
                <span className="text-[10px] font-semibold text-[#526071]">
                  sector_mgr
                </span>
              </div>
              <p className="text-[11px] text-[#526071] truncate mt-0.5">
                {activeQuickRole === "sector_manager"
                  ? "جاري توثيق الجلسة..."
                  : "f.harbi@rawasialomar.sa"}
              </p>
            </div>
          </button>

          {/* Role 3: marjea_editor */}
          <button
            type="button"
            disabled={isLoading}
            onClick={() => handleQuickAuthLogin("marjea_editor")}
            className={`p-3 rounded-xl border text-right transition-all flex items-start gap-3 group ${
              selectedRole === "marjea_editor"
                ? "border-[#3488C4] bg-[#F2F8FC]"
                : "border-[#E2ECF5] hover:border-[#3488C4] bg-white hover:bg-[#F2F8FC]"
            }`}
          >
            <div className="w-8 h-8 rounded-lg bg-[#3488C4] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
              <FileText className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-[#163063] group-hover:text-[#2360A5]">
                  محرر المعرفة
                </h4>
                <span className="text-[10px] font-semibold text-[#526071]">
                  maker
                </span>
              </div>
              <p className="text-[11px] text-[#526071] truncate mt-0.5">
                {activeQuickRole === "marjea_editor"
                  ? "جاري توثيق الجلسة..."
                  : "n.qahtani@rawasialomar.sa"}
              </p>
            </div>
          </button>

          {/* Role 4: governance_reviewer */}
          <button
            type="button"
            disabled={isLoading}
            onClick={() => handleQuickAuthLogin("governance_reviewer")}
            className={`p-3 rounded-xl border text-right transition-all flex items-start gap-3 group ${
              selectedRole === "governance_reviewer"
                ? "border-[#47A3B8] bg-[#F2F8FC]"
                : "border-[#E2ECF5] hover:border-[#47A3B8] bg-white hover:bg-[#F2F8FC]"
            }`}
          >
            <div className="w-8 h-8 rounded-lg bg-[#47A3B8] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
              <Scale className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-[#163063] group-hover:text-[#2360A5]">
                  مراجع الحوكمة
                </h4>
                <span className="text-[10px] font-semibold text-[#526071]">
                  checker
                </span>
              </div>
              <p className="text-[11px] text-[#526071] truncate mt-0.5">
                {activeQuickRole === "governance_reviewer"
                  ? "جاري توثيق الجلسة..."
                  : "a.ghamdi@rawasialomar.sa"}
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Feedback Alerts */}
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-3.5 text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span className="font-bold">{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-3.5 text-xs flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-bold">{successMessage}</span>
        </div>
      )}

      {/* Traditional Supabase Auth Form Card */}
      <div className="bg-white rounded-2xl border border-[#E2ECF5] p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-bold text-[#2360A5] mb-4 pb-3 border-b border-[#E2ECF5]">
          <KeyRound className="w-4 h-4 text-[#47A3B8]" />
          <span>نموذج المصادقة المباشرة عبر Supabase Auth (`signInWithPassword`)</span>
        </div>

        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-bold text-[#163063] mb-1.5"
            >
              البريد الإلكتروني المهني (@rawasialomar.sa):
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-[#526071]">
                <Mail className="w-4 h-4" />
              </span>
              <input
                id="email"
                type="email"
                dir="ltr"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pr-10 pl-3.5 py-2.5 rounded-xl border border-[#E2ECF5] text-sm text-[#163063] focus:border-[#2360A5] focus:ring-1 focus:ring-[#2360A5] text-right"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-xs font-bold text-[#163063] mb-1.5"
            >
              كلمة المرور:
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-[#526071]">
                <Lock className="w-4 h-4" />
              </span>
              <input
                id="password"
                type="password"
                dir="ltr"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pr-10 pl-3.5 py-2.5 rounded-xl border border-[#E2ECF5] text-sm text-[#163063] focus:border-[#2360A5] focus:ring-1 focus:ring-[#2360A5] text-right"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#163063] hover:bg-[#2360A5] disabled:bg-slate-300 text-white font-bold text-sm shadow-md transition-all group mt-2"
          >
            {isLoading ? (
              <span>جاري التحقق من الجلسة في Supabase Auth...</span>
            ) : (
              <>
                <span>تسجيل الدخول إلى المنظومة</span>
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              </>
            )}
          </button>
        </form>
      </div>

      {/* Back to Public Site */}
      <div className="text-center pt-2">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#526071] hover:text-[#163063] transition-colors"
        >
          <ArrowRight className="w-4 h-4" />
          <span>العودة إلى الموقع العام لشركة رواسي العمر</span>
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#F2F8FC] flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 font-arabic relative overflow-hidden">
      {/* Background Architectural Watermark */}
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full border-[32px] border-[#2360A5]/5 pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full border-[32px] border-[#3488C4]/5 pointer-events-none" />

      {/* Top Header & Logo */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-6 relative z-10">
        <div className="mb-4 flex justify-center">
          <BrandLogo className="h-12 w-auto" />
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E2ECF5] text-xs font-bold text-[#2360A5] mb-2 shadow-xs">
          <ShieldCheck className="w-4 h-4 text-[#47A3B8]" />
          <span>بوابة المنظومة الإدارية والتنفيذية الداخلية</span>
        </div>
        <h1 className="text-2xl font-bold text-[#163063] leading-tight">
          تسجيل الدخول لمنسوبي رواسي العمر
        </h1>
        <p className="text-xs text-[#526071] mt-1.5">
          الوصول الموحد المحمي عبر Supabase Auth وجدول الصلاحيات (RBAC)
        </p>
      </div>

      <Suspense
        fallback={
          <div className="w-full max-w-xl bg-white rounded-2xl border border-[#E2ECF5] p-8 text-center text-xs text-[#526071]">
            جاري تحميل بوابة الدخول...
          </div>
        }
      >
        <LoginFormContent />
      </Suspense>
    </div>
  );
}
