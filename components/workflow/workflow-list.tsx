"use client";

import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { usePatientWorkflow } from "@/components/providers/patient-workflow-provider";
import type { Patient } from "@/lib/mock-data";
import {
  getCurrentTimelineNode,
  getWorkflowProgress,
} from "@/lib/workflow";

interface WorkflowListProps {
  patients: Patient[];
}

export function WorkflowList({ patients }: WorkflowListProps) {
  const { getTimeline, advanceNode } = usePatientWorkflow();

  return (
    <div className="space-y-4">
      {patients.map((patient, i) => {
        const timeline = getTimeline(patient.id);
        const current = getCurrentTimelineNode(timeline);
        const progress = getWorkflowProgress(timeline);

        return (
          <motion.div
            key={patient.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            whileHover={{ y: -2 }}
            className="rounded-3xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    href={`/patient/${patient.id}`}
                    className="text-lg font-semibold text-foreground hover:text-primary"
                  >
                    {patient.name}
                  </Link>
                  <Badge variant="muted">{patient.diseaseCategory}</Badge>
                  {patient.riskLevel === "High" && (
                    <Badge variant="danger">高风险</Badge>
                  )}
                </div>
                <p className="mt-1 text-sm text-muted">{patient.diagnosis}</p>
                <p className="mt-2 text-sm text-foreground">
                  当前节点：
                  <span className="font-medium text-primary">
                    {current?.title ?? "—"}
                  </span>
                </p>
                <div className="mt-3 h-1.5 max-w-xs overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
              <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                {current && (
                  <button
                    type="button"
                    onClick={() => advanceNode(patient.id, current.id)}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary-light px-4 py-2.5 text-sm font-medium text-primary transition hover:bg-primary/20"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    完成当前节点
                  </button>
                )}
                <Link
                  href={`/patient/${patient.id}`}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-border px-4 py-2.5 text-sm text-muted transition hover:border-primary hover:text-primary"
                >
                  详情
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
