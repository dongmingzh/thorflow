"use client";

import { useMemo, useState } from "react";
import {
  Activity,
  BarChart3,
  Calendar,
  ClipboardList,
  FileText,
  Smartphone,
} from "lucide-react";
import Link from "next/link";

import { AddPatientModal } from "@/components/patient/add-patient-modal";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { WorkflowPools } from "@/components/dashboard/workflow-pools";
import { WorkflowNotificationBar } from "@/components/dashboard/workflow-notification-bar";
import { usePatients } from "@/components/providers/patient-workflow-provider";
import { getDashboardStats } from "@/lib/workflow";

export default function DashboardPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { patients } = usePatients();

  const stats = useMemo(() => getDashboardStats(patients), [patients]);

  return (
    <div className="min-h-screen bg-background p-6 md:p-8">
      <DashboardHeader
        title="ThorFlow"
        subtitle="胸外科围术期医患流程协同平台 · 医生 Workflow OS"
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

      <div className="mb-8 rounded-3xl border border-teal-100 bg-gradient-to-r from-teal-50/80 to-emerald-50/40 p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">
              Demo 闭环演示
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
            打开王宇的患者小程序
          </Link>
        </div>
      </div>

      <WorkflowPools />

      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">全部患者</h2>
        <Link
          href="/dashboard/analytics"
          className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
        >
          <BarChart3 className="h-4 w-4" />
          分析洞察
        </Link>
      </div>
      <AddPatientModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
      />
    </div>
  );
}
