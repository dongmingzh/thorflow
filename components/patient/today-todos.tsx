"use client";

import {
  Activity,
  Calendar,
  FileText,
  ImageIcon,
  type LucideIcon,
} from "lucide-react";
import { motion } from "framer-motion";

import type { Patient, PatientTodo } from "@/lib/mock-data";
import { getCurrentTimelineNode } from "@/lib/workflow";
import { usePatientTimeline } from "@/components/providers/patient-workflow-provider";

const iconMap: Record<PatientTodo["icon"], LucideIcon> = {
  activity: Activity,
  calendar: Calendar,
  file: FileText,
  image: ImageIcon,
};

const priorityBorder: Record<PatientTodo["priority"], string> = {
  high: "border-rose-200 bg-rose-50/50",
  medium: "border-amber-200 bg-amber-50/40",
  low: "border-border bg-slate-50/80",
};

interface TodayTodosProps {
  patient: Patient;
}

export function TodayTodos({ patient }: TodayTodosProps) {
  const { timeline } = usePatientTimeline(patient.id);
  const current = getCurrentTimelineNode(timeline);

  return (
    <div className="space-y-3 rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="rounded-2xl border border-primary/20 bg-primary-light/50 p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-primary">
          当前流程节点
        </p>
        <p className="mt-1 font-semibold text-foreground">
          {current?.title ?? "—"}
        </p>
        {current?.description && (
          <p className="mt-1 text-sm text-muted">{current.description}</p>
        )}
      </div>
      <h3 className="text-base font-semibold text-foreground">今日待办</h3>
      {patient.todos.map((todo, i) => {
        const Icon = iconMap[todo.icon];
        return (
          <motion.div
            key={todo.id}
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06 }}
            whileHover={{ x: -2 }}
            className={`rounded-2xl border p-4 ${priorityBorder[todo.priority]}`}
          >
            <div className="flex gap-3">
              <Icon className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <div>
                <p className="font-medium text-foreground">{todo.title}</p>
                <p className="mt-1 text-sm text-muted">{todo.subtitle}</p>
                {todo.time && (
                  <p className="mt-2 text-xs font-medium text-primary">
                    {todo.time}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
