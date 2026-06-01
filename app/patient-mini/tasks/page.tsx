"use client";

import { Suspense } from "react";

import { MiniShell } from "@/components/patient-mini/mini-shell";
import { MiniTasksView } from "@/components/patient-mini/mini-tasks-view";

function TasksContent() {
  return (
    <MiniShell>
      <MiniTasksView />
    </MiniShell>
  );
}

export default function PatientMiniTasksPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm">加载中...</div>}>
      <TasksContent />
    </Suspense>
  );
}
