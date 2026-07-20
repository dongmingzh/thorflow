"use client";

import { useState } from "react";
import { Dna, Sparkles } from "lucide-react";

import { usePatientWorkflow } from "@/components/providers/patient-workflow-provider";
import type { Patient } from "@/lib/mock-data";
import {
  PATHOLOGY_TYPE_OPTIONS,
  STAGE_OPTIONS,
  type FollowupPlan,
  type PathologyInput,
} from "@/lib/followup-templates";

interface PathologyEntryPanelProps {
  patient: Patient;
  compact?: boolean;
}

export function PathologyEntryPanel({
  patient,
  compact,
}: PathologyEntryPanelProps) {
  const { savePathologyAndFollowup } = usePatientWorkflow();
  const [input, setInput] = useState<PathologyInput>({
    pathologyType: patient.pathology.pathologyType ?? "浸润性腺癌",
    stage: patient.pathology.stage ?? "IA",
    geneTest: patient.pathology.geneTest ?? false,
    chemo: patient.pathology.chemo ?? false,
    targeted: patient.pathology.targeted ?? false,
    immunotherapy: patient.pathology.immunotherapy ?? false,
  });
  const [generatedPlan, setGeneratedPlan] = useState<FollowupPlan | null>(
    patient.followupPlan ?? null
  );

  const handleGenerate = () => {
    const plan = savePathologyAndFollowup(patient.id, input, input);
    if (plan) setGeneratedPlan(plan);
  };

  return (
    <section
      className={`rounded-2xl border border-border bg-card shadow-sm ${compact ? "p-4" : "p-5"}`}
    >
      <div className="flex items-center gap-2">
        <Dna className="h-5 w-5 text-violet-600" />
        <h3 className="font-semibold text-foreground">录入病理结果 · 生成随访计划</h3>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-1 block text-muted">病理类型</span>
          <select
            value={input.pathologyType}
            onChange={(e) =>
              setInput((s) => ({ ...s, pathologyType: e.target.value }))
            }
            className="w-full rounded-xl border border-border px-3 py-2"
          >
            {PATHOLOGY_TYPE_OPTIONS.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          <span className="mb-1 block text-muted">分期</span>
          <select
            value={input.stage}
            onChange={(e) => setInput((s) => ({ ...s, stage: e.target.value }))}
            className="w-full rounded-xl border border-border px-3 py-2"
          >
            {STAGE_OPTIONS.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-4 flex flex-wrap gap-4">
        {(
          [
            ["geneTest", "基因检测"],
            ["chemo", "化疗"],
            ["targeted", "靶向治疗"],
            ["immunotherapy", "免疫治疗"],
          ] as const
        ).map(([key, label]) => (
          <label key={key} className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={input[key]}
              onChange={(e) =>
                setInput((s) => ({ ...s, [key]: e.target.checked }))
              }
              className="rounded border-border"
            />
            {label}
          </label>
        ))}
      </div>

      <button
        type="button"
        onClick={handleGenerate}
        className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-violet-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-violet-700"
      >
        <Sparkles className="h-4 w-4" />
        生成随访计划
      </button>

      {generatedPlan && (
        <div className="mt-4 rounded-2xl bg-violet-50 p-4 text-sm text-violet-900">
          <p className="font-medium">{generatedPlan.templateName}</p>
          <p className="mt-1 text-violet-700">
            下次复查：{generatedPlan.nextVisitDate} · 已推送患者端
          </p>
          <ul className="mt-2 list-inside list-disc text-xs">
            {generatedPlan.items.slice(0, 4).map((i) => (
              <li key={i.id}>{i.title}</li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
