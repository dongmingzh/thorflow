"use client";

import { Check } from "lucide-react";

import { UploadExamDemo } from "@/components/patient-mini/upload-exam-demo";
import { useMiniPatient } from "@/components/patient-mini/use-mini-patient";
import { cn } from "@/lib/utils";

export function MiniTasksView() {
  const { patient } = useMiniPatient();

  if (!patient) {
    return <p className="p-8 text-center text-sm text-slate-500">未找到患者</p>;
  }

  return (
    <div className="px-5 py-6">
      <h2 className="text-lg font-semibold text-slate-800">我的待办</h2>
      <p className="mt-1 text-sm text-slate-500">
        按医嘱完成检查，完成后将自动通知医生团队
      </p>

      <ul className="mt-5 space-y-2">
        {patient.tasks.map((task) => (
          <li
            key={task.id}
            className={cn(
              "flex items-center gap-3 rounded-2xl border px-4 py-3",
              task.completed
                ? "border-teal-100 bg-teal-50/50"
                : "border-slate-100 bg-white"
            )}
          >
            <span
              className={cn(
                "flex h-6 w-6 shrink-0 items-center justify-center rounded-full",
                task.completed
                  ? "bg-teal-500 text-white"
                  : "border-2 border-slate-200"
              )}
            >
              {task.completed && <Check className="h-3.5 w-3.5" />}
            </span>
            <span
              className={cn(
                "text-sm",
                task.completed ? "text-teal-800" : "text-slate-700"
              )}
            >
              {task.title}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-6">
        <UploadExamDemo />
      </div>
    </div>
  );
}
