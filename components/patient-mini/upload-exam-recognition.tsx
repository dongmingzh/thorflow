"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Check, Loader2, Upload } from "lucide-react";

import { usePatientWorkflow } from "@/components/providers/patient-workflow-provider";
import { useMiniPatient } from "@/components/patient-mini/use-mini-patient";
import {
  DEFAULT_RECOGNIZED_ORDER_ITEMS,
  generateTasksFromOrder,
} from "@/lib/workflow-engine";
import { cn } from "@/lib/utils";

export function UploadExamRecognition() {
  const { patient, patientId } = useMiniPatient();
  const { updatePatientTasks, pushNotificationFromTemplate, updatePatient } =
    usePatientWorkflow();
  const [phase, setPhase] = useState<
    "idle" | "uploaded" | "recognizing" | "recognized" | "synced"
  >("idle");
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  if (!patient) return null;

  const allChecked =
    DEFAULT_RECOGNIZED_ORDER_ITEMS.length > 0 &&
    DEFAULT_RECOGNIZED_ORDER_ITEMS.every((item) => checked[item]);

  const handleUpload = () => {
    setPhase("uploaded");
    setTimeout(() => setPhase("recognizing"), 400);
    setTimeout(() => setPhase("recognized"), 1400);
  };

  const handleSync = () => {
    if (!allChecked) return;
    const tasks = generateTasksFromOrder().map((t) => ({
      id: t.id,
      title: t.title,
      subtitle: t.subtitle,
      completed: true,
    }));
    updatePatientTasks(patientId, tasks);
    updatePatient(patientId, {
      currentStatus: "doctor_review",
      flags: { readyForSurgeryReview: true },
    });
    pushNotificationFromTemplate(patientId, "exam_synced");
    setPhase("synced");
  };

  const toggle = (item: string) => {
    setChecked((c) => ({ ...c, [item]: !c[item] }));
  };

  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm">
      <p className="text-sm font-semibold text-slate-800">上传检查单照片</p>
      <p className="mt-1 text-xs text-slate-500">
        拍照或从相册选择术前检查单，AI 将自动识别检查项目
      </p>

      {phase === "idle" && (
        <button
          type="button"
          onClick={handleUpload}
          className="mt-4 flex w-full flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-teal-200 bg-teal-50/40 py-8 text-teal-700 transition hover:bg-teal-50"
        >
          <Camera className="h-8 w-8" />
          <span className="text-sm font-medium">点击上传检查单</span>
        </button>
      )}

      <AnimatePresence mode="wait">
        {phase === "uploaded" && (
          <motion.p
            key="up"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 flex items-center gap-2 text-sm text-emerald-600"
          >
            <Upload className="h-4 w-4" />
            上传成功
          </motion.p>
        )}
        {phase === "recognizing" && (
          <motion.p
            key="ai"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 flex items-center gap-2 text-sm text-violet-600"
          >
            <Loader2 className="h-4 w-4 animate-spin" />
            AI 识别中...
          </motion.p>
        )}
        {(phase === "recognized" || phase === "synced") && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4"
          >
            <p className="text-xs font-medium text-slate-600">
              已识别到以下检查项目：
            </p>
            <ul className="mt-3 space-y-2">
              {DEFAULT_RECOGNIZED_ORDER_ITEMS.map((item) => (
                <li key={item}>
                  <button
                    type="button"
                    onClick={() => toggle(item)}
                    disabled={phase === "synced"}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left text-sm transition",
                      checked[item]
                        ? "border-teal-200 bg-teal-50 text-teal-800"
                        : "border-slate-100 bg-slate-50 text-slate-700"
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-5 w-5 items-center justify-center rounded-md border",
                        checked[item]
                          ? "border-teal-500 bg-teal-500 text-white"
                          : "border-slate-300"
                      )}
                    >
                      {checked[item] && <Check className="h-3 w-3" />}
                    </span>
                    {item}
                  </button>
                </li>
              ))}
            </ul>
            {phase === "recognized" && (
              <button
                type="button"
                disabled={!allChecked}
                onClick={handleSync}
                className="mt-4 w-full rounded-2xl bg-teal-600 py-3 text-sm font-semibold text-white disabled:opacity-40"
              >
                确认并同步给医生
              </button>
            )}
            {phase === "synced" && (
              <p className="mt-4 text-center text-sm font-medium text-emerald-600">
                已同步给医生端
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
