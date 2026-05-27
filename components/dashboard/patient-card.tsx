"use client";

import { motion } from "framer-motion";
import { Calendar, ChevronRight } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { usePatientWorkflow } from "@/components/providers/patient-workflow-provider";
import type { Patient } from "@/lib/mock-data";
import { getWorkflowProgress } from "@/lib/workflow";

interface PatientCardProps {
  patient: Patient;
  index?: number;
}

const statusVariant: Record<
  Patient["status"],
  "default" | "warning" | "danger" | "success"
> = {
  "Pre-op": "default",
  Surgery: "warning",
  Pathology: "danger",
  "Follow-up": "success",
};

export function PatientCard({ patient, index = 0 }: PatientCardProps) {
  const { getTimeline } = usePatientWorkflow();
  const timeline = getTimeline(patient.id);
  const progress = getWorkflowProgress(timeline);

  return (
    <Link href={`/patient/${patient.id}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        whileHover={{ y: -6 }}
        className="group cursor-pointer rounded-3xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-xl"
      >
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              {patient.name}
            </h3>
            <p className="mt-1 text-sm text-muted">
              {patient.age}岁 · {patient.gender === "M" ? "男" : "女"} ·{" "}
              {patient.id}
            </p>
          </div>
          <Badge variant={statusVariant[patient.status]}>
            {patient.status}
          </Badge>
        </div>
        <Badge variant="muted" className="mb-3">
          {patient.diseaseCategory}
        </Badge>
        <p className="mb-4 line-clamp-2 text-sm text-foreground/80">
          {patient.diagnosis}
        </p>
        <div className="mb-4">
          <div className="mb-1 flex justify-between text-xs text-muted">
            <span>围术期进度</span>
            <span>{progress}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full rounded-full bg-primary"
            />
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-border pt-4 text-sm text-muted">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            {patient.surgeryDate ?? "待定"}
          </div>
          <span className="flex items-center gap-1 text-primary opacity-0 transition group-hover:opacity-100">
            查看
            <ChevronRight className="h-4 w-4" />
          </span>
        </div>
      </motion.div>
    </Link>
  );
}
