"use client";

import { useMemo, useState } from "react";
import { Inbox } from "lucide-react";

import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { WorkflowNotificationBar } from "@/components/dashboard/workflow-notification-bar";
import { AISummaryCard } from "@/components/ai/ai-summary-card";
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
        </div>
      </div>
    </div>
  );
}
