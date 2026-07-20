"use client";

import { motion } from "framer-motion";
import { Calendar, User } from "lucide-react";
import Link from "next/link";

import { usePatientWorkflow } from "@/components/providers/patient-workflow-provider";
import { getPatientsReadyForSurgeryReview } from "@/lib/workflow";

interface PreopReviewAlertProps {
  patientId?: string;
}

export function PreopReviewAlert({ patientId }: PreopReviewAlertProps) {
  const { patients, scheduleSurgery } = usePatientWorkflow();
  const ready = getPatientsReadyForSurgeryReview(patients).filter((p) =>
    patientId ? p.id === patientId : true
  );

  if (ready.length === 0) return null;

  return (
    <div className="mb-8 space-y-4">
      {ready.map((p) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-3xl border border-emerald-200/80 bg-gradient-to-r from-emerald-50/90 to-teal-50/50 p-6 shadow-sm"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                患者端已同步 · 待医生操作
              </p>
              <p className="mt-2 text-lg font-semibold text-foreground">
                {p.name}已完成全部术前检查，等待医生审核并安排手术。
              </p>
              <p className="mt-1 text-sm text-muted">
                微浸润腺癌 · 术前检查 6/6 已完成 · 预计手术{" "}
                {p.surgeryDate ?? "待排期"}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href={`/patient/${p.id}`}
                className="inline-flex items-center gap-2 rounded-2xl border border-border bg-card px-5 py-2.5 text-sm font-medium text-foreground transition hover:shadow-md"
              >
                <User className="h-4 w-4" />
                查看患者
              </Link>
              <button
                type="button"
                onClick={() =>
                  scheduleSurgery(p.id, p.surgeryDate ?? "2026-06-04")
                }
                className="inline-flex items-center gap-2 rounded-2xl bg-primary px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-primary/90"
              >
                <Calendar className="h-4 w-4" />
                安排手术
              </button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
