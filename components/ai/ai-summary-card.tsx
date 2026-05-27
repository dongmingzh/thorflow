"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

import type { PatientAIContent } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

interface AISummaryCardProps {
  title?: string;
  summary?: string;
  content?: PatientAIContent;
  variant?: "workflow" | "patient";
}

export function AISummaryCard({
  title = "AI 分析",
  summary,
  content,
  variant = "patient",
}: AISummaryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "rounded-3xl border border-primary/20 bg-gradient-to-br from-primary-light/80 to-white p-6 shadow-sm",
        variant === "workflow" && "sticky top-8"
      )}
    >
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white">
          <Sparkles className="h-4 w-4" />
        </div>
        <h4 className="font-semibold text-foreground">{title}</h4>
      </div>
      {summary && (
        <p className="text-sm leading-relaxed text-foreground/90">{summary}</p>
      )}
      {content && (
        <div className="space-y-4 text-sm">
          <Section label="病例摘要" text={content.caseSummary} />
          <Section label="围术期建议" text={content.perioperativeAdvice} />
          <Section label="病理重点" text={content.pathologyFocus} />
          <Section label="出院指导" text={content.dischargeGuidance} />
          {content.followupReminder && (
            <Section label="随访提醒" text={content.followupReminder} />
          )}
          {content.riskAlert && (
            <Section label="风险提示" text={content.riskAlert} alert />
          )}
        </div>
      )}
    </motion.div>
  );
}

function Section({
  label,
  text,
  alert,
}: {
  label: string;
  text: string;
  alert?: boolean;
}) {
  return (
    <div className={alert ? "rounded-xl border border-rose-200 bg-rose-50/50 p-3" : ""}>
      <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted">
        {label}
      </p>
      <p className="leading-relaxed text-foreground">{text}</p>
    </div>
  );
}
