"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BrandLogo } from "@/components/BrandLogo";
import {
  LayoutDashboard,
  Inbox,
  BookOpenCheck,
  Users2,
  ExternalLink,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  ShieldAlert,
  Bell,
  CheckCircle2,
  Clock,
  Briefcase,
  Target,
  ShieldCheck,
} from "lucide-react";
import {
  DEMO_USERS,
  RoleId,
  UserProfile,
  getCurrentUser,
  signInAsRole,
  signOutCurrentUser,
  syncSessionUser,
} from "@/data/portalAuth";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<UserProfile>(
    DEMO_USERS.super_admin
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const [isSwitchingRole, setIsSwitchingRole] = useState(false);

  useEffect(() => {
    setCurrentUser(getCurrentUser());
    // Sync canonical staff profile from Supabase Auth session cookie (/api/auth/me)
    syncSessionUser().then((synced) => {
      if (synced) {
        setCurrentUser(synced);
      }
    });
    const onRoleChange = () => setCurrentUser(getCurrentUser());
    window.addEventListener("rao-role-changed", onRoleChange);
    return () => window.removeEventListener("rao-role-changed", onRoleChange);
  }, []);

  const handleRoleSwitch = async (roleId: RoleId) => {
    setIsSwitchingRole(true);
    setRoleMenuOpen(false);
    const result = await signInAsRole(roleId);
    if (result.success && result.user) {
      setCurrentUser(result.user);
      router.refresh();
    }
    setIsSwitchingRole(false);
  };

  const handleLogout = async () => {
    await signOutCurrentUser();
    router.push("/login?switch=1");
    router.refresh();
  };

  const navLinks = [
    {
      label: "نظرة عامة",
      href: "/dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />,
      exact: true,
    },
    {
      label: "طلبات المشاريع (CRM)",
      href: "/dashboard/leads",
      icon: <Inbox className="w-5 h-5" />,
    },
    {
      label: "الموارد البشرية والدوام",
      href: "/dashboard/hr",
      icon: <Clock className="w-5 h-5" />,
    },
    {
      label: "معرض المشاريع",
      href: "/dashboard/projects",
      icon: <Briefcase className="w-5 h-5" />,
    },
    {
      label: "المبادرات والأثر",
      href: "/dashboard/initiatives",
      icon: <Target className="w-5 h-5" />,
    },
    {
      label: "إدارة مرجع الجمعيات (CMS)",
      href: "/dashboard/marjea-cms",
      icon: <BookOpenCheck className="w-5 h-5" />,
    },
    {
      label: "الحوكمة والرقابة",
      href: "/dashboard/governance",
      icon: <ShieldCheck className="w-5 h-5" />,
    },
    {
      label: "فريق العمل والصلاحيات",
      href: "/dashboard/team",
      icon: <Users2 className="w-5 h-5" />,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F2F8FC] flex flex-col font-arabic text-[#163063]">
      {/* Top Header Bar */}
      <header className="h-16 bg-white border-b border-[#E2ECF5] sticky top-0 z-40 px-4 sm:px-6 flex items-center justify-between">
        {/* Right: Hamburger button for mobile & Portal title */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 rounded-lg text-[#163063] hover:bg-[#F2F8FC]"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-block w-2.5 h-2.5 rounded-full bg-[#47A3B8]" />
            <span className="text-sm font-bold text-[#163063]">
              لوحة التحكم الإدارية والتنفيذية
            </span>
            <span className="text-xs text-[#526071] hidden md:inline">
              | منظومة رواسي العمر
            </span>
          </div>
        </div>

        {/* Left: Role Switcher & User Profile Menu */}
        <div className="flex items-center gap-3">
          {/* 1-Click Role Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#F2F8FC] border border-[#2360A5]/30 hover:border-[#2360A5] text-xs font-bold text-[#163063] transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#3488C4]" />
              <span className="hidden sm:inline text-[#526071]">الدور الحالي:</span>
              <span className="font-bold text-[#2360A5]">
                {isSwitchingRole
                  ? "جاري تبديل جلسة Supabase..."
                  : `${currentUser.name.split(" ")[0]} (${currentUser.roleTitle})`}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-[#526071]" />
            </button>

            {roleMenuOpen && (
              <div className="absolute left-0 mt-2 w-72 bg-white rounded-2xl border border-[#E2ECF5] shadow-xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-3 py-2 border-b border-[#E2ECF5] mb-1">
                  <p className="text-[11px] font-bold text-[#526071]">
                    تبديل دور الموظف فورياً للاختبار:
                  </p>
                </div>
                {(Object.keys(DEMO_USERS) as RoleId[]).map((rId) => {
                  const u = DEMO_USERS[rId];
                  const isCurrent = currentUser.role === rId;
                  return (
                    <button
                      key={rId}
                      onClick={() => handleRoleSwitch(rId)}
                      className={`w-full text-right p-2.5 rounded-xl text-xs transition-colors flex items-center justify-between ${
                        isCurrent
                          ? "bg-[#2360A5]/10 font-bold text-[#2360A5]"
                          : "hover:bg-[#F2F8FC] text-[#163063]"
                      }`}
                    >
                      <div>
                        <p className="font-bold">{u.name}</p>
                        <p className="text-[11px] text-[#526071]">{u.roleTitle}</p>
                      </div>
                      {isCurrent && (
                        <CheckCircle2 className="w-4 h-4 text-[#2360A5]" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Logout */}
          <button
            type="button"
            onClick={handleLogout}
            title="تسجيل الخروج من الجلسة"
            className="p-2 rounded-lg text-[#526071] hover:text-[#163063] hover:bg-[#F2F8FC] transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      <div className="flex-1 flex">
        {/* RIGHT SIDEBAR (Deep Royal Navy #163063) */}
        <aside
          className={`fixed lg:sticky top-16 right-0 z-30 h-[calc(100vh-4rem)] w-68 bg-[#163063] text-white flex flex-col justify-between p-5 transition-transform duration-200 border-l border-[#2360A5]/30 ${
            sidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
          }`}
        >
          {/* Top Brand Logo & Active User Pill */}
          <div>
            <div className="pb-5 border-b border-white/10 mb-5">
              <BrandLogo inverted href="/dashboard" className="h-8 w-auto" />
            </div>

            {/* Active Role Card in Sidebar */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 mb-6">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-[#2360A5] text-white font-bold flex items-center justify-center text-xs shrink-0">
                  {currentUser.avatarInitials}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-white truncate">
                    {currentUser.name}
                  </p>
                  <span className="inline-block text-[10px] text-[#47A3B8] font-semibold truncate">
                    {currentUser.roleTitle}
                  </span>
                </div>
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="space-y-1.5" aria-label="أقسام لوحة التحكم">
              {navLinks.map((item) => {
                const isActive = item.exact
                  ? pathname === item.href
                  : pathname?.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                      isActive
                        ? "bg-[#2360A5] text-white shadow-sm"
                        : "text-slate-300 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Bottom Actions: Return to Public Site */}
          <div className="pt-4 border-t border-white/10 space-y-2">
            <Link
              href="/"
              target="_blank"
              className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
            >
              <span>معاينة الموقع العام</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/marjea"
              target="_blank"
              className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs text-[#47A3B8] hover:text-white hover:bg-white/5 transition-colors"
            >
              <span>فتح مرجع الجمعيات</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </aside>

        {/* Backdrop for mobile sidebar */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/40 z-20 lg:hidden"
          />
        )}

        {/* MAIN DASHBOARD CONTENT CANVAS */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
