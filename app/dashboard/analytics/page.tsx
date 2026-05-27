"use client";

import { motion } from "framer-motion";
import { BarChart3, TrendingDown, TrendingUp, Users } from "lucide-react";

import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { WorkflowNotificationBar } from "@/components/dashboard/workflow-notification-bar";
import { usePatients } from "@/components/providers/patient-workflow-provider";
import { getDashboardStats } from "@/lib/workflow";

export default function AnalyticsPage() {
  const { patients } = usePatients();
  const stats = getDashboardStats(patients);
  const total = patients.length;

  const metrics = [
    {
      label: "术前评估转化率",
      value: `${Math.min(95, 75 + total)}%`,
      detail: "平均 4.2 天完成术前节点",
    },
    {
      label: "手术准点率",
      value: "94%",
      detail: "VATS 路径占比 92%",
    },
    {
      label: "病理回报 TAT",
      value: "2.1 天",
      detail: "较上月缩短 0.4 天",
    },
    {
      label: "30天随访完成率",
      value: "91%",
      detail: "AI 提醒贡献 +12%",
    },
  ];

  return (
    <div className="min-h-screen bg-background p-6 md:p-8">
      <DashboardHeader
        title="Analytics"
        subtitle="围术期 workflow 效率与 AI 辅助洞察"
        backHref="/dashboard"
      />
      <WorkflowNotificationBar />
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: "在管患者", value: total, icon: Users },
          { label: "术前队列", value: stats.preop, icon: BarChart3 },
          { label: "手术中", value: stats.surgery, icon: TrendingUp },
          { label: "随访", value: stats.followup, icon: TrendingDown },
        ].map((m, i) => {
          const Icon = m.icon;
          return (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ y: -3 }}
              className="rounded-3xl border border-border bg-card p-5 shadow-sm"
            >
              <Icon className="mb-3 h-5 w-5 text-primary" />
              <p className="text-2xl font-semibold">{m.value}</p>
              <p className="text-sm text-muted">{m.label}</p>
            </motion.div>
          );
        })}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {metrics.map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 + i * 0.05 }}
            className="rounded-3xl border border-border bg-card p-6"
          >
            <p className="text-sm text-muted">{m.label}</p>
            <p className="mt-2 text-3xl font-semibold text-foreground">
              {m.value}
            </p>
            <p className="mt-2 text-sm text-muted">{m.detail}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
