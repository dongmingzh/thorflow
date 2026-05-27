"use client";

import { motion } from "framer-motion";

import type { WorkflowFilter } from "@/lib/workflow";
import { cn } from "@/lib/utils";

const FILTERS: { id: WorkflowFilter; label: string }[] = [
  { id: "all", label: "全部" },
  { id: "urgent", label: "高风险" },
  { id: "today", label: "今日" },
  { id: "pending", label: "待推进" },
];

interface StatusFilterProps {
  value: WorkflowFilter;
  onChange: (v: WorkflowFilter) => void;
}

export function StatusFilter({ value, onChange }: StatusFilterProps) {
  return (
    <div className="mb-6 flex flex-wrap gap-2">
      {FILTERS.map((f) => (
        <button
          key={f.id}
          type="button"
          onClick={() => onChange(f.id)}
          className={cn(
            "relative rounded-full px-4 py-2 text-sm font-medium transition",
            value === f.id
              ? "text-primary"
              : "text-muted hover:text-foreground"
          )}
        >
          {value === f.id && (
            <motion.span
              layoutId="workflow-filter"
              className="absolute inset-0 rounded-full bg-primary-light"
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}
          <span className="relative z-10">{f.label}</span>
        </button>
      ))}
    </div>
  );
}
