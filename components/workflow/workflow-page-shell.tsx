"use client";

import { useMemo, useState } from "react";
import { Inbox } from "lucide-react";

import { PreopReviewAlert } from "@/components/dashboard/preop-review-alert";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { WorkflowNotificationBar } from "@/components/dashboard/workflow-notification-bar";
import { AISummaryCard } from "@/components/ai/ai-summary-card";
import { PathologyEntryPanel } from "@/components/patient/pathology-entry-panel";
import { EmptyState } from "@/components/ui/empty-state";
import { usePatients } from "@/components/providers/patient-workflow-provider";
import { StatusFilter } from "@/components/workflow/status-filter";
import { WorkflowTable } from "@/components/workflow/workflow-table";
import { WorkflowStatsGrid } from "@/components/workflow/workflow-stats";
import { getWorkflowAISummary } from "@/lib/ai-summary";
import {
  filterWorkflowPatients,
  getPatientsByWorkflow,
  getWorkflowStats,
  WORKFLOW_LABELS,
  type WorkflowFilter,
  type WorkflowType,
} from "@/lib/workflow";

const BOTTLENECK: Record<WorkflowType, string> = {
  preop:
    "当前卡点：术前检查完成度与麻醉/MDT 评估。关注患者小程序同步的检查单与肺功能节点。",
  surgery:
    "当前卡点：今日手术排程与 ICU 备床。术中节点需及时标记以推送患者家属通知。",
  pathology:
    "当前卡点：术后病理回报周期与分期确认。病理录入后需一键生成 IA / IIIA 随访模板。",
  followup:
    "当前卡点：今日门诊随访与复查 CT 预约。关注辅助化疗/免疫治疗节点提醒。",
};

interface WorkflowPageShellProps {
  type: WorkflowType;
}

export function WorkflowPageShell({ type }: WorkflowPageShellProps) {
  const [filter, setFilter] = useState<WorkflowFilter>("all");
  const { patients } = usePatients();

  const allPatients = useMemo(
    () => getPatientsByWorkflow(type, patients),
    [type, patients]
  );
  const stats = useMemo(
    () => getWorkflowStats(type, patients),
    [type, patients]
  );
  const filtered = useMemo(
    () => filterWorkflowPatients(allPatients, filter),
    [allPatients, filter]
  );
  const aiSummary = getWorkflowAISummary(type, allPatients.length);

  return (
    <div className="min-h-screen bg-background p-6 md:p-8">
      <DashboardHeader
        title={WORKFLOW_LABELS[type]}
        subtitle="AI 驱动的胸外科围术期 workflow 调度"
        backHref="/dashboard"
      />
      <WorkflowNotificationBar />
      {type === "preop" && <PreopReviewAlert />}
      <div className="mb-6 rounded-2xl border border-amber-100 bg-amber-50/50 px-5 py-4">
        <p className="text-sm text-amber-900">{BOTTLENECK[type]}</p>
      </div>
      <WorkflowStatsGrid stats={stats} />
      <div className="grid gap-8 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <StatusFilter value={filter} onChange={setFilter} />
          {filtered.length === 0 ? (
            <EmptyState
              icon={Inbox}
              title="暂无匹配患者"
              description="尝试切换筛选条件，或返回总览查看其他 workflow 队列。"
            />
          ) : (
            <WorkflowTable patients={filtered} />
          )}
        </div>
        <div>
          <AISummaryCard
            title="Workflow AI 摘要"
            summary={aiSummary}
            variant="workflow"
          />
          {type === "pathology" && allPatients[0] && (
            <div className="mt-6">
              <PathologyEntryPanel patient={allPatients[0]} compact />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
