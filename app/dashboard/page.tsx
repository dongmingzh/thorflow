"use client";

import { useMemo, useState } from "react";
import {
  Activity,
  BarChart3,
  Calendar,
  ClipboardList,
  FileText,
} from "lucide-react";
import Link from "next/link";

import { AddPatientModal } from "@/components/patient/add-patient-modal";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { PatientCard } from "@/components/dashboard/patient-card";
import { WorkflowNotificationBar } from "@/components/dashboard/workflow-notification-bar";
import { usePatients } from "@/components/providers/patient-workflow-provider";
import { getDashboardStats } from "@/lib/workflow";

export default function DashboardPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { patients } = usePatients();

  const stats = useMemo(() => getDashboardStats(patients), [patients]);

  const filteredPatients = useMemo(() => {
    if (!searchQuery.trim()) return patients;
    const q = searchQuery.toLowerCase();
    return patients.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.diagnosis.toLowerCase().includes(q)
    );
  }, [patients, searchQuery]);

  return (
    <div className="min-h-screen bg-background p-6 md:p-8">
      <DashboardHeader
        title="ThorFlow"
        subtitle="AI 胸外科围术期 Workflow · 单医生本地版"
        onAddPatient={() => setShowAddModal(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <WorkflowNotificationBar />
      <DashboardStats
        stats={stats}
        icons={{
          preop: ClipboardList,
          surgery: Activity,
          pathology: FileText,
          followup: Calendar,
        }}
      />
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">
          活跃 Workflow
          {searchQuery && (
            <span className="ml-2 text-sm font-normal text-muted">
              ({filteredPatients.length} 条结果)
            </span>
          )}
        </h2>
        <Link
          href="/dashboard/analytics"
          className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
        >
          <BarChart3 className="h-4 w-4" />
          分析洞察
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filteredPatients.map((patient, i) => (
          <PatientCard key={patient.id} patient={patient} index={i} />
        ))}
      </div>
      <AddPatientModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
      />
    </div>
  );
}
