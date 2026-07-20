"use client";

import { useMemo, useState } from "react";
import { BarChart3, Smartphone } from "lucide-react";
import Link from "next/link";

import { AddPatientModal } from "@/components/patient/add-patient-modal";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DoctorCommandCenter } from "@/components/dashboard/doctor-command-center";
import { usePatients } from "@/components/providers/patient-workflow-provider";

export default function DashboardPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { patients } = usePatients();
  const filteredPatients = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return patients;
    return patients.filter((patient) =>
      [patient.name, patient.id, patient.diagnosis, patient.diseaseCategory]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [patients, searchQuery]);

  return (
    <div className="min-h-screen bg-background px-5 py-5 md:px-8 md:py-6">
      <DashboardHeader
        title="ThorFlow"
        subtitle="胸外科围术期医患流程协同平台 · 医生 Workflow OS"
        onAddPatient={() => setShowAddModal(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <DoctorCommandCenter patients={filteredPatients} />

      <div className="mb-6 rounded-2xl border border-teal-100 bg-gradient-to-r from-teal-50/80 to-emerald-50/40 p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">
              产品闭环展示
            </p>
            <h2 className="mt-1 text-lg font-semibold text-foreground">
              医生端 Web + 患者小程序 + Workflow Engine
            </h2>
            <p className="mt-1 max-w-2xl text-sm text-muted">
              在患者端完成检查上传 → 医生端 preop 收到审核提醒 → 安排手术推送通知 →
              手术/ICU 节点同步 → 病理录入生成随访计划
            </p>
          </div>
          <Link
            href="/patient-mini?patient=PT-1004"
            className="inline-flex shrink-0 items-center gap-2 rounded-2xl bg-teal-600 px-5 py-3 text-sm font-medium text-white shadow-lg shadow-teal-600/25 transition hover:bg-teal-700"
          >
            <Smartphone className="h-4 w-4" />
            打开患者D的小程序
          </Link>
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">全部患者</h2>
        <Link
          href="/dashboard/analytics"
          className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
        >
          <BarChart3 className="h-4 w-4" />
          分析洞察
        </Link>
      </div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {filteredPatients.map((patient) => (
          <Link
            key={patient.id}
            href={`/patient/${patient.id}`}
            className="rounded-2xl border border-border bg-card p-4 shadow-sm transition hover:border-primary/40 hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-foreground">{patient.name}</p>
                <p className="text-xs text-muted">
                  {patient.age}岁 · {patient.gender === "M" ? "男" : "女"} · {patient.id}
                </p>
              </div>
              <span className="rounded-full bg-primary-light px-2 py-0.5 text-xs font-medium text-primary">
                {patient.status}
              </span>
            </div>
            <p className="mt-3 line-clamp-2 text-sm text-muted">
              {patient.diagnosis}
            </p>
            <p className="mt-3 text-xs font-medium text-foreground">
              {patient.surgeryDate ?? "手术待定"}
            </p>
          </Link>
        ))}
      </div>
      <AddPatientModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
      />
    </div>
  );
}
