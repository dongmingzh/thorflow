"use client";

import { motion } from "framer-motion";
import { AlertTriangle, Bell, Sparkles } from "lucide-react";

import type { PatientAIContent } from "@/lib/mock-data";

interface AIAnalysisPanelProps {
  content: PatientAIContent;
}

export function AIAnalysisPanel({ content }: AIAnalysisPanelProps) {
  const sections = [
    { label: "AI 病例摘要", text: content.caseSummary, icon: Sparkles },
    { label: "AI 围术期建议", text: content.perioperativeAdvice, icon: Sparkles },
    { label: "AI 病理重点", text: content.pathologyFocus, icon: Sparkles },
    { label: "AI 出院指导", text: content.dischargeGuidance, icon: Sparkles },
    { label: "AI 随访提醒", text: content.followupReminder, icon: Bell },
    { label: "AI 风险提示", text: content.riskAlert, icon: AlertTriangle, alert: true },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary-light/80 to-white p-6 shadow-sm"
    >
      <div className="mb-5 flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white">
          <Sparkles className="h-4 w-4" />
        </div>
        <h4 className="font-semibold text-foreground">AI 围术期分析</h4>
      </div>
      <div className="space-y-4">
        {sections.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`rounded-2xl p-4 ${
                s.alert
                  ? "border border-rose-200 bg-rose-50/50"
                  : "bg-white/60"
              }`}
            >
              <div className="mb-1.5 flex items-center gap-2">
                <Icon
                  className={`h-3.5 w-3.5 ${s.alert ? "text-rose-500" : "text-primary"}`}
                />
                <p className="text-xs font-medium uppercase tracking-wide text-muted">
                  {s.label}
                </p>
              </div>
              <p className="text-sm leading-relaxed text-foreground">{s.text}</p>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
