"use client";

import { AIAnalysisPanel } from "@/components/patient/ai-analysis-panel";
import { PathologyEntryPanel } from "@/components/patient/pathology-entry-panel";
import { PerioperativeTimeline } from "@/components/patient/perioperative-timeline";
import { PatientSidebar } from "@/components/patient/patient-sidebar";
import { SurgeryActionPanel } from "@/components/patient/surgery-action-panel";
import { TodayTodos } from "@/components/patient/today-todos";
import { usePatientWorkflow } from "@/components/providers/patient-workflow-provider";
import { getPatientAIContent } from "@/lib/ai-summary";

interface PatientDetailViewProps {
  patientId: string;
}

export function PatientDetailView({ patientId }: PatientDetailViewProps) {
  const { getPatient } = usePatientWorkflow();
  const patient = getPatient(patientId);

  if (!patient) {
    return (
      <div className="flex min-h-screen items-center justify-center text-muted">
        未找到患者
      </div>
    );
  }

  const ai = getPatientAIContent(patient);

  return (
    <div className="min-h-screen bg-background">
      <div className="grid gap-5 p-5 lg:grid-cols-[280px_minmax(0,1fr)_320px] lg:p-6">
        <PatientSidebar patient={patient} />
        <main className="min-w-0">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h2 className="text-2xl font-bold text-foreground">
              医生视角 · 围术期 Workflow
            </h2>
            <p className="mt-1 text-muted">
              患者扫码报道、检查同步、手术/ICU、病理与随访计划的完整闭环
            </p>
            <div className="mt-5">
              <PerioperativeTimeline patientId={patientId} />
            </div>
          </div>
          <div className="mt-5 grid gap-5 xl:grid-cols-2">
            <SurgeryActionPanel patient={patient} />
            <PathologyEntryPanel patient={patient} />
          </div>
        </main>
        <aside className="min-w-0 space-y-5">
          <TodayTodos patient={patient} />
          <AIAnalysisPanel content={ai} />
        </aside>
      </div>
    </div>
  );
}
