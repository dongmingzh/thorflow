"use client";

import { Suspense } from "react";

import { MiniShell } from "@/components/patient-mini/mini-shell";
import { MiniNotificationsView } from "@/components/patient-mini/mini-notifications-view";

function NotificationsContent() {
  return (
    <MiniShell>
      <MiniNotificationsView />
    </MiniShell>
  );
}

export default function PatientMiniNotificationsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm">加载中...</div>}>
      <NotificationsContent />
    </Suspense>
  );
}
