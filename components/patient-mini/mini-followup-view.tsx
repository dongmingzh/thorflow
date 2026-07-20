"use client";

import { Calendar, FlaskConical, Stethoscope } from "lucide-react";

import { useMiniPatient } from "@/components/patient-mini/use-mini-patient";

export function MiniFollowupView() {
  const { patient } = useMiniPatient();
  const plan = patient?.followupPlan;

  if (!patient) {
    return <p className="p-8 text-center text-sm text-slate-500">未找到患者</p>;
  }

  if (!plan || plan.templateName.includes("待病理")) {
    return (
      <div className="px-5 py-12 text-center">
        <Stethoscope className="mx-auto h-10 w-10 text-slate-300" />
        <p className="mt-4 font-medium text-slate-700">随访计划待生成</p>
        <p className="mt-2 text-sm text-slate-500">
          病理结果回报后，医生将为您制定个体化随访方案
        </p>
      </div>
    );
  }

  const treatments = [
    plan.needsChemo && "辅助化疗",
    plan.needsGeneTest && "基因检测",
    plan.needsTargeted && "靶向治疗",
    plan.needsImmunotherapy && "免疫治疗",
  ].filter(Boolean);

  return (
    <div className="px-5 py-6">
      <h2 className="text-lg font-semibold text-slate-800">我的随访计划</h2>
      <p className="mt-1 text-xs text-teal-600">{plan.templateName}</p>

      <section className="mt-5 rounded-3xl bg-gradient-to-br from-violet-50 to-indigo-50 p-4">
        <div className="flex items-center gap-3">
          <Calendar className="h-5 w-5 text-violet-600" />
          <div>
            <p className="text-xs text-slate-500">下次复查日期</p>
            <p className="font-semibold text-slate-800">{plan.nextVisitDate}</p>
          </div>
        </div>
        {plan.nextExam && (
          <p className="mt-3 text-sm text-slate-600">
            需要做的检查：<strong>{plan.nextExam}</strong>
          </p>
        )}
      </section>

      {treatments.length > 0 && (
        <section className="mt-4 rounded-2xl border border-amber-100 bg-amber-50/50 p-4">
          <div className="flex items-center gap-2 text-amber-800">
            <FlaskConical className="h-4 w-4" />
            <p className="text-sm font-semibold">辅助治疗提醒</p>
          </div>
          <p className="mt-2 text-sm text-slate-700">{treatments.join(" · ")}</p>
        </section>
      )}

      <section className="mt-4 rounded-2xl border border-slate-100 p-4">
        <p className="text-sm font-semibold text-slate-800">医生提醒</p>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          {plan.doctorNote}
        </p>
      </section>

      <ul className="mt-5 space-y-2">
        {plan.items.map((item) => (
          <li
            key={item.id}
            className="rounded-2xl border border-slate-100 bg-white px-4 py-3"
          >
            <p className="text-sm font-medium text-slate-800">{item.title}</p>
            <p className="text-xs text-slate-500">{item.dueDate}</p>
            {item.description && (
              <p className="mt-1 text-xs text-slate-600">{item.description}</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
