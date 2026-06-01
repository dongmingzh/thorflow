"use client";

import { motion } from "framer-motion";
import { Bell, Calendar, ChevronRight, Sparkles } from "lucide-react";
import Link from "next/link";

import { useMiniPatient } from "@/components/patient-mini/use-mini-patient";
import {
  getPatientStageLabelForMini,
  getWorkflowProgressFromStatus,
} from "@/lib/workflow-engine";
import { cn } from "@/lib/utils";

export function MiniHomeView() {
  const { patient, patientId } = useMiniPatient();

  if (!patient) {
    return (
      <p className="p-8 text-center text-sm text-slate-500">未找到患者信息</p>
    );
  }

  const stageLabel = getPatientStageLabelForMini(patient.currentStatus);
  const progress = getWorkflowProgressFromStatus(patient.currentStatus);
  const nextTask = patient.tasks.find((t) => !t.completed);
  const latestNotif = patient.notifications[0];

  return (
    <div className="px-5 pt-6">
      <div className="mb-6">
        <p className="text-sm text-slate-500">您好，{patient.name}</p>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-800">
          {stageLabel}
        </h2>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-5 rounded-3xl bg-gradient-to-br from-teal-500 to-emerald-600 p-5 text-white shadow-lg shadow-teal-500/25"
      >
        <p className="text-xs font-medium text-teal-50/90">当前流程进度</p>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/25">
          <div
            className="h-full rounded-full bg-white transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-2 text-sm text-teal-50">{progress}% 已完成</p>
      </motion.div>

      {nextTask && (
        <section className="mb-5 rounded-3xl border border-slate-100 bg-slate-50/80 p-4">
          <p className="text-xs font-medium text-slate-500">下一步待办</p>
          <p className="mt-1 font-medium text-slate-800">{nextTask.title}</p>
          <Link
            href={`/patient-mini/tasks?patient=${patientId}`}
            className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-teal-600"
          >
            去完成
            <ChevronRight className="h-4 w-4" />
          </Link>
        </section>
      )}

      {patient.surgeryDate && (
        <section className="mb-5 flex items-center gap-3 rounded-3xl border border-slate-100 bg-white p-4 shadow-sm">
          <div className="rounded-2xl bg-blue-50 p-3 text-blue-600">
            <Calendar className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500">预计手术日期</p>
            <p className="font-semibold text-slate-800">{patient.surgeryDate}</p>
          </div>
        </section>
      )}

      {latestNotif && (
        <section className="mb-5 rounded-3xl border border-amber-100 bg-amber-50/60 p-4">
          <div className="flex items-center gap-2 text-amber-700">
            <Bell className="h-4 w-4" />
            <p className="text-xs font-semibold">医生最新通知</p>
          </div>
          <p className="mt-2 text-sm font-medium text-slate-800">
            {latestNotif.title}
          </p>
          <p className="mt-1 text-sm text-slate-600">{latestNotif.body}</p>
        </section>
      )}

      <section className="rounded-3xl border border-teal-100 bg-teal-50/50 p-4">
        <div className="flex items-center gap-2 text-teal-700">
          <Sparkles className="h-4 w-4" />
          <p className="text-sm font-semibold">今日提醒</p>
        </div>
        <ul className="mt-3 space-y-2 text-sm text-slate-700">
          <li className="flex gap-2">
            <span className="text-teal-500">·</span>
            请保持手机畅通，医护团队会通过小程序推送重要通知
          </li>
          {patient.currentStatus === "surgery_scheduled" && (
            <li className="flex gap-2">
              <span className="text-teal-500">·</span>
              术前 8 小时禁食禁饮，按医嘱停用抗凝药物
            </li>
          )}
        </ul>
      </section>

      <Link
        href={`/patient-mini/checkin?patient=${patientId}`}
        className={cn(
          "mt-6 block rounded-2xl border border-dashed border-slate-200 py-3 text-center text-sm text-slate-500",
          "hover:border-teal-300 hover:text-teal-600"
        )}
      >
        新患者？扫码报道入口
      </Link>
    </div>
  );
}
