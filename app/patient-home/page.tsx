"use client";

import { motion } from "framer-motion";
import {
  CalendarClock,
  ChevronRight,
  Heart,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";

import { usePatientWorkflow } from "@/components/providers/patient-workflow-provider";
import { getCurrentTimelineNode } from "@/lib/workflow";

const DEMO_PATIENT_ID = "PT-1001";

export default function PatientHomePage() {
  const { getPatient, getTimeline } = usePatientWorkflow();
  const patient = getPatient(DEMO_PATIENT_ID) ?? getPatient("PT-1001");

  if (!patient) {
    return (
      <div className="flex min-h-screen items-center justify-center text-muted">
        演示患者未找到
      </div>
    );
  }

  const timeline = getTimeline(patient.id);
  const current = getCurrentTimelineNode(timeline);
  const nextTodo = patient.todos[0];

  return (
    <div className="flex min-h-screen justify-center bg-gradient-to-b from-success-light/40 to-background p-6 md:p-10">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-success-light text-emerald-600">
            <Heart className="h-9 w-9" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            您好，{patient.name}
          </h1>
          <p className="mt-2 text-muted">
            Calm Clinical · 陪伴您完成围术期每一步
          </p>
        </motion.div>

        <motion.div
          whileHover={{ y: -4 }}
          className="mb-5 rounded-3xl border border-border bg-card p-6 shadow-sm"
        >
          <p className="text-xs font-medium uppercase tracking-wide text-emerald-600">
            当前阶段
          </p>
          <h2 className="mt-1 text-xl font-bold text-foreground">
            {current?.title ?? patient.status}
          </h2>
          <div className="mt-5 rounded-2xl bg-slate-50 p-4">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-warning-light text-amber-600">
                <CalendarClock className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium text-foreground">今日待办</p>
                <p className="mt-1 text-sm text-muted">{nextTodo?.title ?? "暂无"}</p>
                {nextTodo?.time && (
                  <p className="text-xs text-primary">{nextTodo.time}</p>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-foreground">预计时间线</h3>
          </div>
          <div className="space-y-4 text-sm">
            <Row label="诊断类型" value={patient.diseaseCategory} />
            <Row label="预计手术" value={patient.surgeryDate ?? "待定"} />
            <Row label="下一节点" value={current?.title ?? "—"} />
          </div>
          <Link
            href={`/patient/${patient.id}`}
            className="mt-6 flex items-center justify-center gap-2 rounded-2xl bg-primary-light py-3 text-sm font-medium text-primary transition hover:bg-primary/20"
          >
            查看完整路径
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-border pb-3 last:border-0">
      <span className="text-muted">{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}
