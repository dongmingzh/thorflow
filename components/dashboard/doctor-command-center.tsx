"use client";

import {
  AlertTriangle,
  CalendarDays,
  ClipboardCheck,
  ClipboardList,
  HeartPulse,
  Hospital,
  Inbox,
  Microscope,
  ScanLine,
  Stethoscope,
  Users,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";

import type { Patient } from "@/lib/mock-data";
import {
  groupPatientsByPool,
  WORKFLOW_POOL_CONFIG,
  type WorkflowPoolKey,
} from "@/lib/workflow-engine";

const poolIcons: Record<WorkflowPoolKey, LucideIcon> = {
  pending_checkin: Inbox,
  exam_in_progress: ScanLine,
  exam_completed_review: ClipboardCheck,
  awaiting_surgery_schedule: CalendarDays,
  surgery_today: Hospital,
  post_op_icu: HeartPulse,
  awaiting_pathology: Microscope,
  discharge_ready: ClipboardList,
  awaiting_followup_plan: Stethoscope,
  followup_today: Users,
  overdue_abnormal: AlertTriangle,
};

const poolTone: Record<WorkflowPoolKey, string> = {
  pending_checkin: "text-slate-700 bg-slate-50",
  exam_in_progress: "text-blue-700 bg-blue-50",
  exam_completed_review: "text-emerald-700 bg-emerald-50",
  awaiting_surgery_schedule: "text-cyan-700 bg-cyan-50",
  surgery_today: "text-amber-700 bg-amber-50",
  post_op_icu: "text-rose-700 bg-rose-50",
  awaiting_pathology: "text-violet-700 bg-violet-50",
  discharge_ready: "text-teal-700 bg-teal-50",
  awaiting_followup_plan: "text-indigo-700 bg-indigo-50",
  followup_today: "text-green-700 bg-green-50",
  overdue_abnormal: "text-red-700 bg-red-50",
};

interface DoctorCommandCenterProps {
  patients: Patient[];
}

export function DoctorCommandCenter({ patients }: DoctorCommandCenterProps) {
  const pools = groupPatientsByPool(patients);
  const activePools = WORKFLOW_POOL_CONFIG.filter(
    (cfg) => pools[cfg.key].length > 0
  );

  return (
    <section className="mb-6 rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">
            Workflow OS
          </p>
          <h2 className="text-xl font-semibold text-foreground">
            胸外科流程控制台
          </h2>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center text-xs sm:flex sm:text-left">
          <Metric label="全部患者" value={patients.length} />
          <Metric
            label="今日手术"
            value={pools.surgery_today.length}
            href="/dashboard/surgery"
          />
          <Metric
            label="待审核"
            value={pools.exam_completed_review.length}
            href="/dashboard/preop"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 md:grid-cols-4 xl:grid-cols-6">
        {WORKFLOW_POOL_CONFIG.map((cfg) => {
          const Icon = poolIcons[cfg.key];
          const count = pools[cfg.key].length;
          return (
            <Link
              key={cfg.key}
              href={cfg.href ?? "/dashboard"}
              className="rounded-xl border border-border bg-white px-3 py-3 transition hover:border-primary/40 hover:bg-primary-light/30"
            >
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className={`rounded-lg p-1.5 ${poolTone[cfg.key]}`}>
                  <Icon className="h-4 w-4" />
                </span>
                <span className="text-xl font-semibold text-foreground">
                  {count}
                </span>
              </div>
              <p className="truncate text-sm font-medium text-foreground">
                {cfg.title}
              </p>
            </Link>
          );
        })}
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-3">
        {activePools.slice(0, 6).map((cfg) => (
          <div
            key={cfg.key}
            className="rounded-xl border border-border bg-slate-50/70 p-3"
          >
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-semibold text-foreground">
                {cfg.title}
              </p>
              {cfg.href && (
                <Link href={cfg.href} className="text-xs text-primary">
                  队列
                </Link>
              )}
            </div>
            <div className="space-y-2">
              {pools[cfg.key].slice(0, 2).map((patient) => (
                <Link
                  key={patient.id}
                  href={`/patient/${patient.id}`}
                  className="flex items-center justify-between rounded-lg bg-white px-3 py-2 text-sm transition hover:text-primary"
                >
                  <span className="font-medium text-foreground">
                    {patient.name}
                  </span>
                  <span className="max-w-[12rem] truncate text-xs text-muted">
                    {patient.diagnosis}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Metric({
  label,
  value,
  href,
}: {
  label: string;
  value: number;
  href?: string;
}) {
  const content = (
    <div className="rounded-xl bg-slate-50 px-3 py-2">
      <p className="text-lg font-semibold text-foreground">{value}</p>
      <p className="text-xs text-muted">{label}</p>
    </div>
  );

  return href ? <Link href={href}>{content}</Link> : content;
}
