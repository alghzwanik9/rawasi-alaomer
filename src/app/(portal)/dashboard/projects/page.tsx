"use client";

import React, { useState, useEffect } from "react";
import {
  Briefcase,
  Plus,
  Eye,
  EyeOff,
  CheckCircle2,
  Building2,
  MapPin,
  Coins,
  Layers,
  ArrowRightLeft,
  X,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { PortfolioProject, SEEDED_PORTFOLIO_PROJECTS } from "@/data/portalEnterpriseSeed";

export default function ProjectsShowcaseCMS() {
  const [projects, setProjects] = useState<PortfolioProject[]>(SEEDED_PORTFOLIO_PROJECTS);
  const [selectedSector, setSelectedSector] = useState<string>("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activePhotoView, setActivePhotoView] = useState<Record<string, "after" | "before">>({});
  const [successMsg, setSuccessMsg] = useState("");

  const [newProject, setNewProject] = useState({
    title: "",
    sectorSlug: "contracting",
    clientName: "",
    city: "الرياض",
    budgetRange: "1,000,000 ريال",
    summary: "",
    scopeText: "الأعمال الإنشائية والهيكلية\nالتشطيبات المعمارية الفاخرة\nاستيفاء أنظمة السلامة والدفاع المدني",
    beforeImage: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80",
    afterImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
    status: "completed",
    isPublished: true,
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/projects");
      const data = await res.json();
      if (data.projects) {
        setProjects(data.projects);
      }
    } catch {
      // Ignored
    }
  };

  const handleTogglePublish = async (id: string, currentStatus: boolean) => {
    const nextStatus = !currentStatus;
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isPublished: nextStatus } : p))
    );

    try {
      await fetch("/api/projects", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isPublished: nextStatus }),
      });
      setSuccessMsg(
        nextStatus
          ? "تم نشر المشروع في البوابة العامة بنجاح!"
          : "تم إخفاء المشروع من البوابة العامة بنجاح."
      );
      setTimeout(() => setSuccessMsg(""), 3500);
    } catch {
      // Offline fallback
    }
  };

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const scopeArray = newProject.scopeText
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);

      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newProject,
          scope: scopeArray,
        }),
      });
      const data = await res.json();
      if (data.success && data.project) {
        setProjects((prev) => [data.project, ...prev]);
        setSuccessMsg(`تمت إضافة المشروع (${newProject.title}) بنجاح!`);
        setTimeout(() => setSuccessMsg(""), 4000);
        setIsAddModalOpen(false);
        setNewProject({
          title: "",
          sectorSlug: "contracting",
          clientName: "",
          city: "الرياض",
          budgetRange: "1,000,000 ريال",
          summary: "",
          scopeText: "الأعمال الإنشائية والهيكلية\nالتشطيبات المعمارية الفاخرة\nاستيفاء أنظمة السلامة والدفاع المدني",
          beforeImage: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80",
          afterImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
          status: "completed",
          isPublished: true,
        });
      }
    } catch {
      // Offline
    }
  };

  const filteredProjects =
    selectedSector === "all"
      ? projects
      : projects.filter((p) => p.sectorSlug === selectedSector);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E2ECF5] shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#47A3B8] mb-1">
            <Briefcase className="w-4 h-4" />
            <span>محفظة المشاريع ونماذج تسليم المفتاح (Showcase CMS)</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#163063]">
            معرض المشاريع المنفذة وإدارة النشر
          </h1>
          <p className="text-xs sm:text-sm text-[#526071] mt-1">
            إضافة وتوثيق مشاريع المقاولات والتوريد، استعراض صور قبل وبعد، وإدارة النشر بالبوابة العامة
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-[#163063] hover:bg-[#2360A5] text-white px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shadow-xs transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة مشروع جديد للمحفظة</span>
        </button>
      </div>

      {/* Success Notification */}
      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-xs sm:text-sm flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#E2ECF5] shadow-xs">
          <div className="text-xs text-slate-500 font-semibold mb-1">إجمالي المشاريع الموثقة</div>
          <div className="text-2xl font-bold text-[#163063]">{projects.length}</div>
          <div className="text-[11px] text-slate-400 mt-1">عبر كافة القطاعات الخمسة</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E2ECF5] shadow-xs">
          <div className="text-xs text-slate-500 font-semibold mb-1">المشاريع المكتملة</div>
          <div className="text-2xl font-bold text-emerald-600">
            {projects.filter((p) => p.status === "completed").length}
          </div>
          <div className="text-[11px] text-emerald-700 mt-1">مسلّمة بنموذج تمام في الختام</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E2ECF5] shadow-xs">
          <div className="text-xs text-slate-500 font-semibold mb-1">قيد التنفيذ الميداني</div>
          <div className="text-2xl font-bold text-[#2360A5]">
            {projects.filter((p) => p.status === "in_progress").length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">متابعة نسب الإنجاز أسبوعياً</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E2ECF5] shadow-xs">
          <div className="text-xs text-slate-500 font-semibold mb-1">معروضة بالبوابة العامة</div>
          <div className="text-2xl font-bold text-[#47A3B8]">
            {projects.filter((p) => p.isPublished).length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">ظاهرة للعملاء في /impact و /sectors</div>
        </div>
      </div>

      {/* Sector Filter Bar */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#E2ECF5] pb-3">
        {[
          { id: "all", label: "كافة القطاعات" },
          { id: "contracting", label: "المقاولات والإنشاء" },
          { id: "supply", label: "التجهيز والتوريد" },
          { id: "tech", label: "التقنية والحلول الذكية" },
          { id: "operations", label: "التشغيل والصيانة" },
          { id: "community", label: "التنمية غير الربحية" },
        ].map((sec) => (
          <button
            key={sec.id}
            onClick={() => setSelectedSector(sec.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedSector === sec.id
                ? "bg-[#163063] text-white shadow-xs"
                : "bg-white text-slate-600 border border-[#E2ECF5] hover:bg-[#F2F8FC]"
            }`}
          >
            {sec.label}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((p) => {
          const photoMode = activePhotoView[p.id] || "after";

          return (
            <div
              key={p.id}
              className="bg-white rounded-2xl border border-[#E2ECF5] shadow-xs overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                {/* Photo with Before/After Toggle */}
                <div className="relative h-48 bg-slate-100 overflow-hidden group">
                  <img
                    src={photoMode === "after" ? p.afterImage : p.beforeImage}
                    alt={p.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Sector Badge */}
                  <div className="absolute top-3 right-3 bg-[#163063]/90 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full border border-white/20">
                    {p.sectorName}
                  </div>

                  {/* Before / After toggle pills */}
                  <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md rounded-lg p-1 flex items-center gap-1 shadow-sm border border-slate-200 text-[10px]">
                    <button
                      onClick={() =>
                        setActivePhotoView((prev) => ({ ...prev, [p.id]: "before" }))
                      }
                      className={`px-2 py-0.5 rounded font-bold transition-colors cursor-pointer ${
                        photoMode === "before"
                          ? "bg-slate-700 text-white"
                          : "text-slate-600 hover:text-black"
                      }`}
                    >
                      قبل
                    </button>
                    <button
                      onClick={() =>
                        setActivePhotoView((prev) => ({ ...prev, [p.id]: "after" }))
                      }
                      className={`px-2 py-0.5 rounded font-bold transition-colors cursor-pointer ${
                        photoMode === "after"
                          ? "bg-[#163063] text-white"
                          : "text-slate-600 hover:text-black"
                      }`}
                    >
                      بعد التسليم
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-3">
                  <div>
                    <h3 className="font-bold text-[#163063] text-sm leading-snug line-clamp-2">
                      {p.title}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-2">
                      <span className="flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-[#2360A5]" />
                        <span>{p.clientName}</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{p.city}</span>
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-[#526071] leading-relaxed line-clamp-2">
                    {p.summary}
                  </p>

                  {/* Scope bullets */}
                  <div className="bg-[#F2F8FC] p-3 rounded-xl border border-[#E2ECF5] text-[11px] space-y-1">
                    <div className="font-bold text-[#163063] mb-1">نطاق الأعمال المنفذة:</div>
                    {p.scope.slice(0, 3).map((item, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-slate-600">
                        <span className="text-[#47A3B8]">✓</span>
                        <span className="truncate">{item}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-xs font-semibold text-slate-600 pt-1">
                    <span>القيمة التعاقدية:</span>
                    <span className="font-mono text-[#163063] font-bold">{p.budgetRange}</span>
                  </div>
                </div>
              </div>

              {/* Card Footer: Publish Toggle & Status */}
              <div className="p-4 bg-slate-50 border-t border-[#E2ECF5] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      p.status === "completed" ? "bg-emerald-500" : "bg-blue-500"
                    }`}
                  />
                  <span className="text-xs font-bold text-slate-700">
                    {p.status === "completed" ? "مكتمل ومسلّم" : "قيد التنفيذ"}
                  </span>
                </div>

                <button
                  onClick={() => handleTogglePublish(p.id, p.isPublished)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer border ${
                    p.isPublished
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                      : "bg-slate-100 text-slate-600 border-slate-300 hover:bg-slate-200"
                  }`}
                >
                  {p.isPublished ? (
                    <>
                      <Eye className="w-3.5 h-3.5" />
                      <span>منشور بالبوابة</span>
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>مخفي</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Add Project */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-[#E2ECF5] overflow-hidden animate-in fade-in zoom-in-95 max-h-[90vh] flex flex-col">
            <div className="bg-[#163063] p-4 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-[#47A3B8]" />
                <h3 className="font-bold text-sm">إضافة مشروع جديد لمحفظة رواسي العمر</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-white/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddProject} className="p-5 space-y-4 text-xs overflow-y-auto">
              <div>
                <label className="block text-slate-700 font-bold mb-1">عنوان المشروع:</label>
                <input
                  type="text"
                  required
                  value={newProject.title}
                  onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                  placeholder="مثال: تأهيل وترميم المقر الوقفي المركزي"
                  className="w-full bg-[#F2F8FC] border border-[#E2ECF5] rounded-xl p-2.5 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">القطاع التنفيذي:</label>
                  <select
                    value={newProject.sectorSlug}
                    onChange={(e) => setNewProject({ ...newProject, sectorSlug: e.target.value })}
                    className="w-full bg-[#F2F8FC] border border-[#E2ECF5] rounded-xl p-2.5 focus:bg-white"
                  >
                    <option value="contracting">المقاولات والتطوير الإنشائي</option>
                    <option value="supply">التجهيز والتوريد المتكامل</option>
                    <option value="tech">التقنية والحلول الذكية</option>
                    <option value="operations">التشغيل والصيانة</option>
                    <option value="community">التنمية غير الربحية</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">اسم العميل / الجهة:</label>
                  <input
                    type="text"
                    required
                    value={newProject.clientName}
                    onChange={(e) => setNewProject({ ...newProject, clientName: e.target.value })}
                    placeholder="وقف الشيخ ... أو جمعية ..."
                    className="w-full bg-[#F2F8FC] border border-[#E2ECF5] rounded-xl p-2.5 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">المدينة:</label>
                  <input
                    type="text"
                    required
                    value={newProject.city}
                    onChange={(e) => setNewProject({ ...newProject, city: e.target.value })}
                    placeholder="الرياض، جدة، الدمام..."
                    className="w-full bg-[#F2F8FC] border border-[#E2ECF5] rounded-xl p-2.5 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">القيمة التقديرية (BOQ):</label>
                  <input
                    type="text"
                    required
                    value={newProject.budgetRange}
                    onChange={(e) => setNewProject({ ...newProject, budgetRange: e.target.value })}
                    placeholder="مثال: 1,200,000 ريال"
                    className="w-full bg-[#F2F8FC] border border-[#E2ECF5] rounded-xl p-2.5 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">نبذة عن المشروع:</label>
                <textarea
                  rows={2}
                  required
                  value={newProject.summary}
                  onChange={(e) => setNewProject({ ...newProject, summary: e.target.value })}
                  placeholder="وصف موجز للمشروع والأثر الهندسي بعد التسليم..."
                  className="w-full bg-[#F2F8FC] border border-[#E2ECF5] rounded-xl p-2.5 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  نطاق العمل (بند في كل سطر):
                </label>
                <textarea
                  rows={3}
                  required
                  value={newProject.scopeText}
                  onChange={(e) => setNewProject({ ...newProject, scopeText: e.target.value })}
                  className="w-full bg-[#F2F8FC] border border-[#E2ECF5] rounded-xl p-2.5 focus:bg-white font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">رابط صورة (قبل):</label>
                  <input
                    type="url"
                    required
                    value={newProject.beforeImage}
                    onChange={(e) => setNewProject({ ...newProject, beforeImage: e.target.value })}
                    className="w-full bg-[#F2F8FC] border border-[#E2ECF5] rounded-xl p-2.5 font-mono focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">رابط صورة (بعد التسليم):</label>
                  <input
                    type="url"
                    required
                    value={newProject.afterImage}
                    onChange={(e) => setNewProject({ ...newProject, afterImage: e.target.value })}
                    className="w-full bg-[#F2F8FC] border border-[#E2ECF5] rounded-xl p-2.5 font-mono focus:bg-white"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-500 hover:bg-slate-100 font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="bg-[#163063] hover:bg-[#2360A5] text-white px-5 py-2 rounded-xl font-bold transition-colors cursor-pointer"
                >
                  حفظ ونشر المشروع
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
