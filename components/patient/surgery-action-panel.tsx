"use client";

import { Activity, Bed, HeartPulse, Scissors } from "lucide-react";

import { usePatientWorkflow } from "@/components/providers/patient-workflow-provider";
import type { Patient } from "@/lib/mock-data";

interface SurgeryActionPanelProps {
  patient: Patient;
}

const actions = [
  {
    key: "in_or" as const,
    label: "标记进入手术室",
    icon: Scissors,
    tone: "bg-violet-50 text-violet-700 hover:bg-violet-100",
  },
  {
    key: "completed" as const,
    label: "标记手术完成",
    icon: Activity,
    tone: "bg-amber-50 text-amber-700 hover:bg-amber-100",
  },
  {
    key: "icu" as const,
    label: "标记转入 ICU/监护室",
    icon: HeartPulse,
    tone: "bg-rose-50 text-rose-700 hover:bg-rose-100",
  },
  {
    key: "ward" as const,
    label: "标记转回病房",
    icon: Bed,
    tone: "bg-emerald-50 text-emerald-700 hover:bg-emerald-100",
  },
];

export function SurgeryActionPanel({ patient }: SurgeryActionPanelProps) {
  const { markSurgeryMilestone } = usePatientWorkflow();

  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-foreground">
        手术与 ICU 关键节点
      </h3>
      <p className="mt-1 text-xs text-muted">
        每次操作将写入 Timeline 并推送患者端通知
      </p>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {actions.map(({ key, label, icon: Icon, tone }) => (
          <button
            key={key}
            type="button"
            onClick={() => markSurgeryMilestone(patient.id, key)}
            className={`flex items-center gap-2 rounded-2xl px-4 py-3 text-left text-sm font-medium transition ${tone}`}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </button>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted">
        {patient.surgery.inOR && (
          <span className="rounded-full bg-violet-100 px-2 py-0.5 text-violet-700">
            术中
          </span>
        )}
        {patient.surgery.completed && (
          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-amber-700">
            手术完成
          </span>
        )}
        {patient.surgery.inICU && (
          <span className="rounded-full bg-rose-100 px-2 py-0.5 text-rose-700">
            ICU 监护
          </span>
        )}
        {patient.surgery.backToWard && (
          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-emerald-700">
            已回病房
          </span>
        )}
      </div>
    </section>
  );
}
