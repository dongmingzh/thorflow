"use client";

import { Suspense } from "react";

import { MiniHomeView } from "@/components/patient-mini/mini-home-view";
import { MiniShell } from "@/components/patient-mini/mini-shell";

function MiniHomePageContent() {
  return (
    <MiniShell>
      <MiniHomeView />
    </MiniShell>
  );
}

export default function PatientMiniHomePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm">加载中...</div>}>
      <MiniHomePageContent />
    </Suspense>
  );
}
