"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";

interface DashboardStatsProps {
  stats: {
    preop: number;
    surgery: number;
    pathology: number;
    followup: number;
  };
  icons: {
    preop: LucideIcon;
    surgery: LucideIcon;
    pathology: LucideIcon;
    followup: LucideIcon;
  };
}

const config = [
  { key: "preop" as const, title: "待术前评估", href: "/dashboard/preop", accent: "hover:border-primary/40", iconBg: "bg-primary-light text-primary" },
  { key: "surgery" as const, title: "待手术", href: "/dashboard/surgery", accent: "hover:border-amber-300/60", iconBg: "bg-warning-light text-amber-600" },
  { key: "pathology" as const, title: "待病理", href: "/dashboard/pathology", accent: "hover:border-rose-300/60", iconBg: "bg-danger-light text-rose-600" },
  { key: "followup" as const, title: "今日随访", href: "/dashboard/followup", accent: "hover:border-emerald-300/60", iconBg: "bg-success-light text-emerald-600" },
];

export function DashboardStats({ stats, icons }: DashboardStatsProps) {
  return (
    <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {config.map((item, i) => {
        const Icon = icons[item.key];
        return (
          <Link key={item.key} href={item.href}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -4 }}
              className={`cursor-pointer rounded-3xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-xl ${item.accent}`}
            >
              <div className="mb-4 flex items-center justify-between">
                <div className={`rounded-2xl p-3 ${item.iconBg}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-3xl font-semibold text-foreground">
                  {stats[item.key]}
                </span>
              </div>
              <p className="text-sm font-medium text-muted">{item.title}</p>
            </motion.div>
          </Link>
        );
      })}
    </div>
  );
}
