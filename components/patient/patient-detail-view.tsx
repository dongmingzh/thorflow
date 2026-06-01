"use client";

import { AIAnalysisPanel } from "@/components/patient/ai-analysis-panel";
import { PathologyEntryPanel } from "@/components/patient/pathology-entry-panel";
import { PerioperativeTimeline } from "@/components/patient/perioperative-timeline";
import { PatientSidebar } from "@/components/patient/patient-sidebar";
import { SurgeryActionPanel } from "@/components/patient/surgery-action-panel";
import { TodayTodos } from "@/components/patient/today-todos";
import { WorkflowNotificationBar } from "@/components/dashboard/workflow-notification-bar";
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
      <div className="border-b border-border bg-card px-6 pt-4 md:px-8 [&_.mb-8]:mb-4">
        <WorkflowNotificationBar />
      </div>
      <div className="flex min-h-screen flex-col lg:flex-row">
        <PatientSidebar patient={patient} />
        <main className="flex-1 overflow-y-auto p-6 lg:p-10">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl font-bold text-foreground">
              围术期 Workflow
            </h2>
            <p className="mt-1 text-muted">
              标准十节点路径 · 完成即自动推进 · 支持编辑
            </p>
            <div className="mt-8">
              <PerioperativeTimeline patientId={patientId} />
            </div>
            <SurgeryActionPanel patient={patient} />
            {(patient.status === "Pathology" ||
              patient.currentStatus === "pathology_reported" ||
              patient.currentStatus === "discharged_waiting_pathology") && (
              <PathologyEntryPanel patient={patient} />
            )}
          </div>
        </main>
        <aside className="w-full shrink-0 border-t border-border bg-card p-6 lg:w-[300px] lg:border-l lg:border-t-0 xl:w-[360px]">
          <TodayTodos patient={patient} />
          <div className="mt-8">
            <AIAnalysisPanel content={ai} />
          </div>
        </aside>
      </div>
    </div>
  );
}
