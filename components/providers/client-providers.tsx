"use client";

import type { ReactNode } from "react";

import { PatientWorkflowProvider } from "./patient-workflow-provider";

export function ClientProviders({ children }: { children: ReactNode }) {
  return <PatientWorkflowProvider>{children}</PatientWorkflowProvider>;
}
