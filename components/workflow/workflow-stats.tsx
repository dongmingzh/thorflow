"use client";

import { motion } from "framer-motion";
import { Clock, Flame, ListChecks, Users } from "lucide-react";

import type { WorkflowStats } from "@/lib/workflow";

interface WorkflowStatsProps {
  stats: WorkflowStats;
}

const items = [
  { key: "total", label: "队列总数", icon: Users },
  { key: "urgent", label: "高风险", icon: Flame },
  { key: "today", label: "今日相关", icon: ListChecks },
  { key: "avgDaysInStage", label: "平均停留(天)", icon: Clock },
] as const;

export function WorkflowStatsGrid({ stats }: WorkflowStatsProps) {
  const values: Record<string, number> = {
    total: stats.total,
    urgent: stats.urgent,
    today: stats.today,
    avgDaysInStage: stats.avgDaysInStage,
  };

  return (
    <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
      {items.map((item, i) => {
        const Icon = item.icon;
        const val = values[item.key];
        return (
          <motion.div
            key={item.key}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            whileHover={{ y: -3 }}
            className="rounded-3xl border border-border bg-card p-5 shadow-sm"
          >
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary-light">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <p className="text-2xl font-semibold text-foreground">
              {typeof val === "number" && item.key === "avgDaysInStage"
                ? val.toFixed(1)
                : val}
            </p>
            <p className="mt-1 text-sm text-muted">{item.label}</p>
          </motion.div>
        );
      })}
    </div>
  );
}
