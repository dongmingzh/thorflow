"use client";

import { Suspense } from "react";

import { MiniShell } from "@/components/patient-mini/mini-shell";
import { MiniFollowupView } from "@/components/patient-mini/mini-followup-view";

function FollowupContent() {
  return (
    <MiniShell>
      <MiniFollowupView />
    </MiniShell>
  );
}

export default function PatientMiniFollowupPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm">加载中...</div>}>
      <FollowupContent />
    </Suspense>
  );
}
