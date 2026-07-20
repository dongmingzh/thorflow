"use client";

import { useState } from "react";

import type {
  DiseaseCategory,
  Patient,
  RiskLevel,
  WorkflowStage,
} from "@/lib/mock-data";
import { createPendingFollowupPlan, DEFAULT_PREOP_TASKS } from "@/lib/mock-data";
import {
  createTimelineFromTemplate,
  WORKFLOW_TEMPLATES,
  type WorkflowTemplateId,
} from "@/lib/workflow-templates";
import { VoiceInput } from "@/components/voice/voice-input";
import { VoiceQuickEntry } from "@/components/voice/voice-quick-entry";

export interface PatientFormData {
  name: string;
  age: number;
  gender: "M" | "F";
  diagnosis: string;
  clinicalStage: string;
  status: WorkflowStage;
  riskLevel: RiskLevel;
  surgeryDate: string;
  treatmentGroup: string;
  bed: string;
  notes: string;
  medicalHistory: string;
  preopPlan: string;
  diseaseCategory: DiseaseCategory;
  templateId: WorkflowTemplateId;
}

const defaultForm: PatientFormData = {
  name: "",
  age: 55,
  gender: "M",
  diagnosis: "",
  clinicalStage: "待分期",
  status: "Pre-op",
  riskLevel: "Medium",
  surgeryDate: "",
  treatmentGroup: "胸外科 A 组",
  bed: "",
  notes: "",
  medicalHistory: "",
  preopPlan: "",
  diseaseCategory: "肺结节",
  templateId: "nodule-preop",
};

interface PatientFormProps {
  initial?: Partial<PatientFormData>;
  onSubmit: (data: PatientFormData) => void;
  onCancel: () => void;
  submitLabel?: string;
}

export function PatientForm({
  initial,
  onSubmit,
  onCancel,
  submitLabel = "创建患者",
}: PatientFormProps) {
  const [form, setForm] = useState<PatientFormData>({
    ...defaultForm,
    ...initial,
  });

  const update = <K extends keyof PatientFormData>(
    key: K,
    value: PatientFormData[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const appendVoice = (key: keyof PatientFormData, text: string) => {
    setForm((prev) => ({
      ...prev,
      [key]: prev[key] ? `${String(prev[key])} ${text}` : text,
    }));
  };

  const handleTemplateChange = (templateId: WorkflowTemplateId) => {
    const template = WORKFLOW_TEMPLATES.find((t) => t.id === templateId);
    update("templateId", templateId);
    if (template) update("status", template.defaultStage);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.diagnosis.trim()) return;
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <VoiceQuickEntry onFillNotes={(text) => update("notes", text)} />

      <div>
        <label className="mb-2 block text-sm font-medium text-foreground">
          流程模板
        </label>
        <div className="grid gap-2 sm:grid-cols-2">
          {WORKFLOW_TEMPLATES.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => handleTemplateChange(t.id)}
              className={`rounded-2xl border p-3 text-left transition ${
                form.templateId === t.id
                  ? "border-primary bg-primary-light"
                  : "border-border bg-card hover:border-primary/40"
              }`}
            >
              <p className="text-sm font-medium text-foreground">{t.name}</p>
              <p className="mt-0.5 text-xs text-muted">{t.description}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="姓名" required>
          <input
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            className={inputClass}
            placeholder="患者姓名"
            required
          />
        </Field>
        <Field label="年龄">
          <input
            type="number"
            value={form.age}
            onChange={(e) => update("age", parseInt(e.target.value, 10) || 0)}
            className={inputClass}
            min={1}
            max={120}
          />
        </Field>
        <Field label="性别">
          <select
            value={form.gender}
            onChange={(e) => update("gender", e.target.value as "M" | "F")}
            className={inputClass}
          >
            <option value="M">男</option>
            <option value="F">女</option>
          </select>
        </Field>
        <Field label="病种">
          <select
            value={form.diseaseCategory}
            onChange={(e) =>
              update("diseaseCategory", e.target.value as DiseaseCategory)
            }
            className={inputClass}
          >
            {(
              ["肺结节", "肺腺癌", "微浸润腺癌", "肺鳞癌", "围术期肺癌"] as const
            ).map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <VoiceField
        label="主要诊断"
        required
        value={form.diagnosis}
        onChange={(v) => update("diagnosis", v)}
        onVoice={(t) => appendVoice("diagnosis", t)}
      />

      <VoiceField
        label="临床分期"
        value={form.clinicalStage}
        onChange={(v) => update("clinicalStage", v)}
        onVoice={(t) => appendVoice("clinicalStage", t)}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="当前阶段">
          <select
            value={form.status}
            onChange={(e) => update("status", e.target.value as WorkflowStage)}
            className={inputClass}
          >
            {(["Pre-op", "Surgery", "Pathology", "Follow-up"] as const).map(
              (s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              )
            )}
          </select>
        </Field>
        <Field label="风险等级">
          <select
            value={form.riskLevel}
            onChange={(e) => update("riskLevel", e.target.value as RiskLevel)}
            className={inputClass}
          >
            <option value="Low">低</option>
            <option value="Medium">中</option>
            <option value="High">高</option>
          </select>
        </Field>
        <Field label="预计手术日期">
          <input
            type="date"
            value={form.surgeryDate}
            onChange={(e) => update("surgeryDate", e.target.value)}
            className={inputClass}
          />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="治疗组">
          <input
            value={form.treatmentGroup}
            onChange={(e) => update("treatmentGroup", e.target.value)}
            className={inputClass}
            placeholder="胸外科 A 组"
          />
        </Field>
        <Field label="床位">
          <input
            value={form.bed}
            onChange={(e) => update("bed", e.target.value)}
            className={inputClass}
            placeholder="12A-03"
          />
        </Field>
      </div>

      <VoiceField
        label="病史描述"
        value={form.medicalHistory}
        onChange={(v) => update("medicalHistory", v)}
        onVoice={(t) => appendVoice("medicalHistory", t)}
        multiline
      />

      <VoiceField
        label="术前计划"
        value={form.preopPlan}
        onChange={(v) => update("preopPlan", v)}
        onVoice={(t) => appendVoice("preopPlan", t)}
        multiline
      />

      <VoiceField
        label="备注"
        value={form.notes}
        onChange={(v) => update("notes", v)}
        onVoice={(t) => appendVoice("notes", t)}
        multiline
      />

      <div className="flex justify-end gap-3 border-t border-border pt-6">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-2xl border border-border px-5 py-2.5 text-sm text-muted transition hover:bg-slate-50"
        >
          取消
        </button>
        <button
          type="submit"
          className="rounded-2xl bg-primary px-6 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-primary/90"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}

export function formDataToPatient(data: PatientFormData): Omit<Patient, "id"> {
  const timeline = createTimelineFromTemplate(data.templateId);
  const template = WORKFLOW_TEMPLATES.find((t) => t.id === data.templateId);

  return {
    name: data.name,
    age: data.age,
    gender: data.gender,
    diseaseCategory: data.diseaseCategory,
    diagnosis: data.diagnosis,
    clinicalStage: data.clinicalStage,
    status: template?.defaultStage ?? data.status,
    riskLevel: data.riskLevel,
    surgeryDate: data.surgeryDate || undefined,
    treatmentGroup: data.treatmentGroup,
    bed: data.bed,
    notes: data.notes,
    medicalHistory: data.medicalHistory,
    preopPlan: data.preopPlan,
    templateId: data.templateId,
    timeline,
    todos: [
      {
        id: `todo-${Date.now()}`,
        title: `完成${timeline.find((n) => n.status === "current")?.title ?? "当前节点"}`,
        subtitle: "新建患者默认待办",
        priority: data.riskLevel === "High" ? "high" : "medium",
        icon: "activity",
      },
    ],
    imaging: [],
    currentStatus: "pending_checkin",
    tasks: DEFAULT_PREOP_TASKS,
    notifications: [],
    surgery: { scheduledDate: data.surgeryDate || undefined },
    pathology: {},
    followupPlan: createPendingFollowupPlan(),
  };
}

const inputClass =
  "w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm outline-none transition focus:ring-4 focus:ring-primary/20";

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-rose-500"> *</span>}
      </label>
      {children}
    </div>
  );
}

function VoiceField({
  label,
  value,
  onChange,
  onVoice,
  multiline,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  onVoice: (text: string) => void;
  multiline?: boolean;
  required?: boolean;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <label className="text-sm font-medium text-foreground">
          {label}
          {required && <span className="text-rose-500"> *</span>}
        </label>
        <VoiceInput onTranscript={onVoice} />
      </div>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className={inputClass}
          required={required}
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={inputClass}
          required={required}
        />
      )}
    </div>
  );
}
