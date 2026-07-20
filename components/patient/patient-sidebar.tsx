"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

import { ImagingPanel } from "@/components/imaging/imaging-panel";
import { Badge } from "@/components/ui/badge";
import type { Patient } from "@/lib/mock-data";

interface PatientSidebarProps {
  patient: Patient;
}

const RISK_LABELS = { Low: "低", Medium: "中", High: "高" } as const;

export function PatientSidebar({ patient }: PatientSidebarProps) {
  const router = useRouter();

  return (
    <aside className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <button
        type="button"
        onClick={() => router.push("/dashboard")}
        className="mb-6 flex items-center gap-2 text-sm text-muted transition hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        返回工作台
      </button>
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-light text-2xl font-bold text-primary">
        {patient.name[0]}
      </div>
      <h1 className="text-2xl font-bold text-foreground">{patient.name}</h1>
      <p className="mt-1 text-muted">
        {patient.age} 岁 · {patient.gender === "M" ? "男" : "女"} · {patient.id}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Badge>{patient.diseaseCategory}</Badge>
        <Badge variant="muted">{patient.status}</Badge>
        <Badge variant={patient.riskLevel === "High" ? "danger" : "default"}>
          {RISK_LABELS[patient.riskLevel]}风险
        </Badge>
      </div>
      <div className="mt-5 space-y-2">
        <InfoBlock label="主要诊断" value={patient.diagnosis} />
        {patient.clinicalStage && (
          <InfoBlock label="临床分期" value={patient.clinicalStage} />
        )}
        <InfoBlock
          label="预计手术"
          value={patient.surgeryDate ?? "待确认"}
        />
        {patient.treatmentGroup && (
          <InfoBlock label="治疗组" value={patient.treatmentGroup} />
        )}
        {patient.bed && <InfoBlock label="床位" value={patient.bed} />}
        {patient.medicalHistory && (
          <InfoBlock label="病史" value={patient.medicalHistory} />
        )}
        {patient.preopPlan && (
          <InfoBlock label="术前计划" value={patient.preopPlan} />
        )}
        {patient.notes && <InfoBlock label="备注" value={patient.notes} />}
        <ImagingPanel imaging={patient.imaging} />
      </div>
    </aside>
  );
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-slate-50/80 p-3">
      <p className="mb-1 text-xs text-muted">{label}</p>
      <p className="text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}
