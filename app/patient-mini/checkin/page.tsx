"use client";

import { Suspense } from "react";

import { CheckinForm } from "@/components/patient-mini/checkin-form";
import { MiniShell } from "@/components/patient-mini/mini-shell";

function CheckinContent() {
  return (
    <MiniShell title="入院报道" showBack hideTab>
      <CheckinForm />
    </MiniShell>
  );
}

export default function PatientMiniCheckinPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm">加载中...</div>}>
      <CheckinContent />
    </Suspense>
  );
}
