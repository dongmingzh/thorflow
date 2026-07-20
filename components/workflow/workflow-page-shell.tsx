"use client";

import { useMemo, useState } from "react";
import {
  Activity,
  BellRing,
  CalendarDays,
  CheckCircle2,
  Clock,
  Inbox,
  Microscope,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";

import { PreopReviewAlert } from "@/components/dashboard/preop-review-alert";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
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
import { WORKFLOW_STATUS_LABELS } from "@/lib/workflow-engine";

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

const PAGE_SUBTITLE: Record<WorkflowType, string> = {
  preop: "术前检查完成度、患者上传检查单、医生审核与手术排期",
  surgery: "今日手术排班、术中状态、ICU/监护室交接",
  pathology: "术后病理录入、分期确认与随访计划生成",
  followup: "今日随访、复查提醒与辅助治疗节点",
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
    <div className="min-h-screen bg-background px-5 py-5 md:px-8 md:py-6">
      <DashboardHeader
        title={WORKFLOW_LABELS[type]}
        subtitle={PAGE_SUBTITLE[type]}
        backHref="/dashboard"
      />
      {type === "preop" && <PreopReviewAlert />}
      <WorkflowCommandStrip type={type} patients={allPatients} />
      <div className="mb-4 rounded-2xl border border-amber-100 bg-amber-50/50 px-4 py-3">
        <p className="text-sm text-amber-900">{BOTTLENECK[type]}</p>
      </div>
      <WorkflowStatsGrid stats={stats} />
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
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

function WorkflowCommandStrip({
  type,
  patients,
}: {
  type: WorkflowType;
  patients: ReturnType<typeof getPatientsByWorkflow>;
}) {
  if (type === "preop") {
    const ready = patients.find((p) => p.flags?.readyForSurgeryReview);
    return (
      <section className="mb-6 grid gap-4 lg:grid-cols-3">
        <SignalCard
          icon={BellRing}
          title="患者上传审核提醒"
          value={ready ? `${ready.name} 6/6` : "暂无待审"}
          description={
            ready
              ? "已完成增强CT、肺功能、心电图、血常规、凝血、肝肾功能与麻醉评估"
              : "患者端完成检查后会进入此队列"
          }
        />
        <SignalCard
          icon={CheckCircle2}
          title="术前检查完成率"
          value={`${Math.round(
            averageCompletion(
              patients.map((p) => p.tasks.filter((t) => t.completed).length),
              patients.map((p) => Math.max(p.tasks.length, 1))
            ) * 100
          )}%`}
          description="患者端上传检查单后自动进入医生审核队列"
        />
        <SignalLink
          href={ready ? `/patient/${ready.id}` : "/patient-mini/tasks"}
          icon={CalendarDays}
          title={ready ? "审核并安排手术" : "打开患者检查上传"}
          description={ready ? "进入医生视角详情页处理患者D" : "先完成患者端检查闭环"}
        />
      </section>
    );
  }

  if (type === "surgery") {
    const rows = patients.slice(0, 4);
    return (
      <section className="mb-6 rounded-2xl border border-border bg-card p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-foreground">今日手术排班</h2>
            <p className="text-sm text-muted">待手术 / 手术中 / 已完成 / ICU 状态同步</p>
          </div>
          <Activity className="h-5 w-5 text-primary" />
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {rows.map((p) => (
            <Link
              key={p.id}
              href={`/patient/${p.id}`}
              className="rounded-2xl border border-border bg-slate-50/70 p-4 transition hover:border-primary/40 hover:bg-primary-light/20"
            >
              <p className="font-semibold text-foreground">{p.name}</p>
              <p className="mt-1 text-xs text-muted">{p.surgery.operatingRoom ?? "OR-3"} · {p.surgeryDate}</p>
              <p className="mt-3 rounded-full bg-white px-3 py-1 text-xs font-medium text-primary">
                {WORKFLOW_STATUS_LABELS[p.currentStatus]}
              </p>
            </Link>
          ))}
        </div>
      </section>
    );
  }

  if (type === "pathology") {
    return (
      <section className="mb-6 grid gap-4 md:grid-cols-3">
        <SignalCard
          icon={Microscope}
          title="待病理录入"
          value={`${patients.filter((p) => p.currentStatus === "discharged_waiting_pathology").length} 例`}
          description="正式报告回报后录入病理类型与分期"
        />
        <SignalCard
          icon={Sparkles}
          title="待生成随访"
          value={`${patients.filter((p) => p.currentStatus === "pathology_reported").length} 例`}
          description="AI 将基于分期、基因检测与辅助治疗生成计划"
        />
        <SignalLink
          href={patients[0] ? `/patient/${patients[0].id}` : "/dashboard"}
          icon={CalendarDays}
          title="录入病理"
          description="选择病理类型、分期、化疗/免疫/靶向策略"
        />
      </section>
    );
  }

  return (
    <section className="mb-6 grid gap-4 md:grid-cols-3">
      <SignalCard
        icon={CalendarDays}
        title="今日随访"
        value={`${patients.length} 例`}
        description="门诊复诊、电话随访与影像复查"
      />
      <SignalCard
        icon={Clock}
        title="下次复查"
        value={patients[0]?.followupPlan?.nextVisitDate ?? "待生成"}
        description={patients[0]?.followupPlan?.nextExam ?? "病理录入后自动生成"}
      />
      <SignalLink
        href="/patient-mini/followup"
        icon={Sparkles}
        title="患者端随访视图"
        description="查看 AI 生成的复查时间表与医生提醒"
      />
    </section>
  );
}

function averageCompletion(done: number[], total: number[]) {
  if (done.length === 0) return 0;
  const sumDone = done.reduce((acc, n) => acc + n, 0);
  const sumTotal = total.reduce((acc, n) => acc + n, 0);
  return sumTotal === 0 ? 0 : sumDone / sumTotal;
}

function SignalCard({
  icon: Icon,
  title,
  value,
  description,
}: {
  icon: LucideIcon;
  title: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <Icon className="h-5 w-5 text-primary" />
        <span className="text-lg font-semibold text-foreground">{value}</span>
      </div>
      <p className="font-semibold text-foreground">{title}</p>
      <p className="mt-1 text-sm leading-relaxed text-muted">{description}</p>
    </div>
  );
}

function SignalLink({
  href,
  icon: Icon,
  title,
  description,
}: {
  href: string;
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-2xl border border-primary/20 bg-primary-light/50 p-5 shadow-sm transition hover:border-primary/50 hover:bg-primary-light"
    >
      <Icon className="mb-3 h-5 w-5 text-primary" />
      <p className="font-semibold text-foreground">{title}</p>
      <p className="mt-1 text-sm leading-relaxed text-muted">{description}</p>
    </Link>
  );
}
