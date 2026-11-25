"use client";

import React, { useState, useEffect } from "react";
import {
  Target,
  Plus,
  Sparkles,
  Users2,
  TrendingUp,
  Award,
  CheckCircle2,
  Building,
  Calendar,
  X,
  Layers,
} from "lucide-react";
import { InitiativeRecord, SEEDED_INITIATIVES } from "@/data/portalEnterpriseSeed";

export default function InitiativesDashboard() {
  const [initiatives, setInitiatives] = useState<InitiativeRecord[]>(SEEDED_INITIATIVES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const [newInitiative, setNewInitiative] = useState({
    title: "",
    partnerName: "",
    sector: "الحوكمة والتمكين",
    targetBeneficiaries: 25,
    achievedBeneficiaries: 5,
    progressPct: 20,
    sroiScore: "1 : 4.0 ر.س أثر اجتماعي",
    budget: "500,000 ريال",
    milestone1: "التشخيص وحصر الاحتياج الميداني",
    milestone2: "تنفيذ الورش والبرامج التدريبية والاستشارية",
    milestone3: "إصدار تقرير قياس الأثر والاعتماد الرسمي",
  });

  useEffect(() => {
    fetchInitiatives();
  }, []);

  const fetchInitiatives = async () => {
    try {
      const res = await fetch("/api/initiatives");
      const data = await res.json();
      if (data.initiatives) setInitiatives(data.initiatives);
    } catch {
      // Ignored
    }
  };

  const handleToggleMilestone = async (id: string, milestoneIdx: number) => {
    try {
      const res = await fetch("/api/initiatives", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, milestoneIdx }),
      });
      const data = await res.json();
      if (data.success && data.updated) {
        setInitiatives((prev) =>
          prev.map((item) => (item.id === id ? data.updated : item))
        );
      }
    } catch {
      // Offline fallback
    }
  };

  const handleCreateInitiative = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const milestones = [
        { title: newInitiative.milestone1, completed: true },
        { title: newInitiative.milestone2, completed: false },
        { title: newInitiative.milestone3, completed: false },
      ].filter((m) => Boolean(m.title));

      const res = await fetch("/api/initiatives", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newInitiative.title,
          partnerName: newInitiative.partnerName,
          sector: newInitiative.sector,
          targetBeneficiaries: newInitiative.targetBeneficiaries,
          achievedBeneficiaries: newInitiative.achievedBeneficiaries,
          progressPct: newInitiative.progressPct,
          sroiScore: newInitiative.sroiScore,
          budget: newInitiative.budget,
          milestones,
        }),
      });

      const data = await res.json();
      if (data.success && data.initiative) {
        setInitiatives((prev) => [data.initiative, ...prev]);
        setSuccessMsg(`تم إطلاق المبادرة (${newInitiative.title}) بنجاح!`);
        setTimeout(() => setSuccessMsg(""), 4000);
        setIsModalOpen(false);
        setNewInitiative({
          title: "",
          partnerName: "",
          sector: "الحوكمة والتمكين",
          targetBeneficiaries: 25,
          achievedBeneficiaries: 5,
          progressPct: 20,
          sroiScore: "1 : 4.0 ر.س أثر اجتماعي",
          budget: "500,000 ريال",
          milestone1: "التشخيص وحصر الاحتياج الميداني",
          milestone2: "تنفيذ الورش والبرامج التدريبية والاستشارية",
          milestone3: "إصدار تقرير قياس الأثر والاعتماد الرسمي",
        });
      }
    } catch {
      // Offline
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E2ECF5] shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#47A3B8] mb-1">
            <Target className="w-4 h-4" />
            <span>مختبر المبادرات والأثر التنموي (SROI Impact Lab)</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#163063]">
            إدارة المبادرات المجتمعية وقياس العائد التنموي
          </h1>
          <p className="text-xs sm:text-sm text-[#526071] mt-1">
            متابعة برامج تمكين الجمعيات والأوقاف، نسب الإنجاز الميداني، ومؤشرات العائد على الاستثمار (SROI)
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#163063] hover:bg-[#2360A5] text-white px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shadow-xs transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>إطلاق مبادرة جديدة</span>
        </button>
      </div>

      {/* Success Notification */}
      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-xs sm:text-sm flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#E2ECF5] shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">المبادرات النشطة</span>
            <Target className="w-5 h-5 text-[#2360A5]" />
          </div>
          <div className="text-2xl font-bold text-[#163063]">{initiatives.length}</div>
          <div className="text-[11px] text-emerald-600 mt-1 font-medium">
            تغطي 4 مسارات استراتيجية
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E2ECF5] shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">المستفيدون المحققون</span>
            <Users2 className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-[#163063]">
            {initiatives.reduce((sum, i) => sum + i.achievedBeneficiaries, 0)} جهة
          </div>
          <div className="text-[11px] text-slate-400 mt-1">جمعيات ومؤسسات وأوقاف</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E2ECF5] shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">متوسط مؤشر SROI</span>
            <TrendingUp className="w-5 h-5 text-[#47A3B8]" />
          </div>
          <div className="text-2xl font-bold text-[#163063]">1 : 4.6 ر.س</div>
          <div className="text-[11px] text-[#47A3B8] font-bold mt-1">عائد اجتماعي مضاعف</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E2ECF5] shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">الميزانية التنموية الملتزم بها</span>
            <Award className="w-5 h-5 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-[#163063]">1.45 م.ر</div>
          <div className="text-[11px] text-slate-500 mt-1">تمويل تشاركي ومؤسسي</div>
        </div>
      </div>

      {/* Initiatives Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {initiatives.map((item) => (
          <div
            key={item.id}
            className="bg-white p-6 rounded-2xl border border-[#E2ECF5] shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow"
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="bg-[#163063]/10 text-[#163063] text-[10px] font-bold px-2.5 py-1 rounded-full">
                    {item.sector}
                  </span>
                  <h3 className="text-base font-bold text-[#163063] mt-2 leading-snug">
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                    <Building className="w-3.5 h-3.5 text-[#2360A5]" />
                    <span>الشريك: {item.partnerName}</span>
                  </div>
                </div>

                <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold px-2.5 py-1 rounded-xl shrink-0">
                  {item.sroiScore}
                </span>
              </div>

              {/* Progress Bar */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                  <span className="text-slate-600">نسبة الإنجاز الميداني:</span>
                  <span className="font-mono text-[#163063] font-bold">
                    {item.progressPct}% ({item.achievedBeneficiaries} من {item.targetBeneficiaries} جهة)
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#2360A5] to-[#47A3B8] transition-all duration-500"
                    style={{ width: `${item.progressPct}%` }}
                  />
                </div>
              </div>

              {/* Milestones Checklist */}
              <div className="bg-[#F2F8FC] p-4 rounded-xl border border-[#E2ECF5] space-y-2">
                <div className="text-xs font-bold text-[#163063] mb-1">
                  المحطات التنفيذية (انقر لتحديث الإنجاز):
                </div>
                {item.milestones.map((m, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleToggleMilestone(item.id, idx)}
                    className="w-full flex items-center justify-between text-right p-2 rounded-lg bg-white border border-[#E2ECF5] hover:border-[#2360A5] transition-colors cursor-pointer text-xs"
                  >
                    <span className={m.completed ? "line-through text-slate-400" : "text-slate-800 font-medium"}>
                      {m.title}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        m.completed
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {m.completed ? "منجز ✓" : "قيد التنفيذ"}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-semibold">
              <span>الموازنة المخصصة: <strong className="text-[#163063] font-mono">{item.budget}</strong></span>
              <span className="text-emerald-700 font-bold">● نشطة ومتابعة ميدانياً</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Add Initiative */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-[#E2ECF5] overflow-hidden animate-in fade-in zoom-in-95">
            <div className="bg-[#163063] p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-[#47A3B8]" />
                <h3 className="font-bold text-sm">إطلاق مبادرة تنموية ومجتمعية جديدة</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateInitiative} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">اسم المبادرة:</label>
                <input
                  type="text"
                  required
                  value={newInitiative.title}
                  onChange={(e) => setNewInitiative({ ...newInitiative, title: e.target.value })}
                  placeholder="مثال: مبادرة تأهيل الأوقاف السكنية"
                  className="w-full bg-[#F2F8FC] border border-[#E2ECF5] rounded-xl p-2.5 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">الجهة الشريكة / الداعمة:</label>
                  <input
                    type="text"
                    required
                    value={newInitiative.partnerName}
                    onChange={(e) => setNewInitiative({ ...newInitiative, partnerName: e.target.value })}
                    placeholder="المركز الوطني، منصة إحسان..."
                    className="w-full bg-[#F2F8FC] border border-[#E2ECF5] rounded-xl p-2.5 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">المسار / المجال:</label>
                  <input
                    type="text"
                    required
                    value={newInitiative.sector}
                    onChange={(e) => setNewInitiative({ ...newInitiative, sector: e.target.value })}
                    className="w-full bg-[#F2F8FC] border border-[#E2ECF5] rounded-xl p-2.5 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">المستهدفون (جهة):</label>
                  <input
                    type="number"
                    required
                    value={newInitiative.targetBeneficiaries}
                    onChange={(e) => setNewInitiative({ ...newInitiative, targetBeneficiaries: Number(e.target.value) })}
                    className="w-full bg-[#F2F8FC] border border-[#E2ECF5] rounded-xl p-2.5 font-mono focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">المحقق حالياً:</label>
                  <input
                    type="number"
                    required
                    value={newInitiative.achievedBeneficiaries}
                    onChange={(e) => setNewInitiative({ ...newInitiative, achievedBeneficiaries: Number(e.target.value) })}
                    className="w-full bg-[#F2F8FC] border border-[#E2ECF5] rounded-xl p-2.5 font-mono focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">مؤشر SROI:</label>
                  <input
                    type="text"
                    required
                    value={newInitiative.sroiScore}
                    onChange={(e) => setNewInitiative({ ...newInitiative, sroiScore: e.target.value })}
                    className="w-full bg-[#F2F8FC] border border-[#E2ECF5] rounded-xl p-2.5 font-mono focus:bg-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-slate-700 font-bold">المحطات التنفيذية الـ 3:</label>
                <input
                  type="text"
                  required
                  value={newInitiative.milestone1}
                  onChange={(e) => setNewInitiative({ ...newInitiative, milestone1: e.target.value })}
                  placeholder="المرحلة 1: حصر وتشخيص الاحتياج"
                  className="w-full bg-[#F2F8FC] border border-[#E2ECF5] rounded-xl p-2 focus:bg-white"
                />
                <input
                  type="text"
                  required
                  value={newInitiative.milestone2}
                  onChange={(e) => setNewInitiative({ ...newInitiative, milestone2: e.target.value })}
                  placeholder="المرحلة 2: التدريب والتأهيل الميداني"
                  className="w-full bg-[#F2F8FC] border border-[#E2ECF5] rounded-xl p-2 focus:bg-white"
                />
                <input
                  type="text"
                  required
                  value={newInitiative.milestone3}
                  onChange={(e) => setNewInitiative({ ...newInitiative, milestone3: e.target.value })}
                  placeholder="المرحلة 3: قياس الأثر واعتماد المخرجات"
                  className="w-full bg-[#F2F8FC] border border-[#E2ECF5] rounded-xl p-2 focus:bg-white"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-500 hover:bg-slate-100 font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="bg-[#163063] hover:bg-[#2360A5] text-white px-5 py-2 rounded-xl font-bold transition-colors cursor-pointer"
                >
                  اعتماد وإطلاق المبادرة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
