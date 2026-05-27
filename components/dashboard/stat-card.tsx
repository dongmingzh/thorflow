"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  href: string;
  accent: string;
  iconBg: string;
  delay?: number;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  href,
  accent,
  iconBg,
  delay = 0,
}: StatCardProps) {
  return (
    <Link href={href} className="block">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay }}
        whileHover={{ y: -6, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          "group flex items-center justify-between rounded-3xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-xl",
          accent
        )}
      >
        <div>
          <p className="text-sm font-medium text-muted">{title}</p>
          <p className="mt-1 text-3xl font-semibold text-foreground">{value}</p>
          <p className="mt-2 text-xs text-muted opacity-0 transition group-hover:opacity-100">
            点击进入 workflow →
          </p>
        </div>
        <div
          className={cn(
            "flex h-14 w-14 items-center justify-center rounded-2xl",
            iconBg
          )}
        >
          <Icon className="h-6 w-6" />
        </div>
      </motion.div>
    </Link>
  );
}
