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

interface WorkflowTableProps {
  patients: Patient[];
}

export function WorkflowTable({ patients }: WorkflowTableProps) {
  const { getTimeline, advanceNode } = usePatientWorkflow();

  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-slate-50/80 text-left text-xs font-medium uppercase tracking-wide text-muted">
            <th className="px-5 py-3">患者</th>
            <th className="hidden px-5 py-3 md:table-cell">诊断</th>
            <th className="px-5 py-3">当前节点</th>
            <th className="hidden px-5 py-3 sm:table-cell">进度</th>
            <th className="px-5 py-3 text-right">操作</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {patients.map((patient, i) => {
            const timeline = getTimeline(patient.id);
            const current = getCurrentTimelineNode(timeline);
            const progress = getWorkflowProgress(timeline);

            return (
              <motion.tr
                key={patient.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                className="transition-colors hover:bg-primary-light/20"
              >
                <td className="px-5 py-4">
                  <Link
                    href={`/patient/${patient.id}`}
                    className="font-medium text-foreground hover:text-primary"
                  >
                    {patient.name}
                  </Link>
                  <div className="mt-1 flex gap-1">
                    <Badge variant="muted" className="text-[10px]">
                      {patient.id}
                    </Badge>
                    {patient.riskLevel === "High" && (
                      <Badge variant="danger" className="text-[10px]">
                        高风险
                      </Badge>
                    )}
                  </div>
                </td>
                <td className="hidden max-w-[200px] truncate px-5 py-4 text-muted md:table-cell">
                  {patient.diagnosis}
                </td>
                <td className="px-5 py-4 font-medium text-primary">
                  {current?.title ?? "—"}
                </td>
                <td className="hidden px-5 py-4 sm:table-cell">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-20 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted">{progress}%</span>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <div className="flex justify-end gap-2">
                    {current && (
                      <button
                        type="button"
                        onClick={() => advanceNode(patient.id, current.id)}
                        className="inline-flex items-center gap-1 rounded-xl bg-primary-light px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/20"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        完成
                      </button>
                    )}
                    <Link
                      href={`/patient/${patient.id}`}
                      className="inline-flex items-center gap-1 rounded-xl border border-border px-3 py-1.5 text-xs text-muted hover:border-primary hover:text-primary"
                    >
                      详情
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </td>
              </motion.tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
