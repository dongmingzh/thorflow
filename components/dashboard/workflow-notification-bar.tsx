"use client";

import { motion } from "framer-motion";
import { AlertCircle, Bell, ChevronRight, Dna, Stethoscope } from "lucide-react";
import Link from "next/link";

import { usePatients } from "@/components/providers/patient-workflow-provider";
import { generateWorkflowNotifications } from "@/lib/workflow";
import { cn } from "@/lib/utils";

const iconMap = {
  urgent: AlertCircle,
  info: Stethoscope,
  pathology: Dna,
  followup: Bell,
};

const toneMap = {
  urgent: "text-rose-600 bg-rose-50",
  info: "text-primary bg-primary-light",
  pathology: "text-violet-600 bg-violet-50",
  followup: "text-emerald-600 bg-success-light",
};

export function WorkflowNotificationBar() {
  const { patients } = usePatients();
  const notifications = generateWorkflowNotifications(patients);

  if (notifications.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8 overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
    >
      <div className="flex items-center gap-3 border-b border-border bg-primary-light/40 px-5 py-3">
        <Bell className="h-4 w-4 text-primary" />
        <span className="text-sm font-semibold text-foreground">
          Workflow 通知
        </span>
        <span className="rounded-full bg-primary/20 px-2 py-0.5 text-xs font-medium text-primary">
          {notifications.length} 条活跃
        </span>
      </div>
      <div className="divide-y divide-border">
        {notifications.map((n, i) => {
          const Icon = iconMap[n.type];
          return (
            <Link key={n.id} href={n.href}>
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ backgroundColor: "rgba(234, 241, 255, 0.5)" }}
                className="flex items-center gap-4 px-5 py-3.5 transition-colors"
              >
                <div
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
                    toneMap[n.type]
                  )}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <p className="flex-1 text-sm text-foreground">{n.message}</p>
                <ChevronRight className="h-4 w-4 text-muted" />
              </motion.div>
            </Link>
          );
        })}
      </div>
    </motion.div>
  );
}
