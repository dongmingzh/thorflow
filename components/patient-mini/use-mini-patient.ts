"use client";

import { useSearchParams } from "next/navigation";

import { usePatientWorkflow } from "@/components/providers/patient-workflow-provider";
import { DEMO_MINI_PATIENT_ID } from "@/lib/mock-data";

export function useMiniPatient() {
  const params = useSearchParams();
  const patientId = params.get("patient") ?? DEMO_MINI_PATIENT_ID;
  const { getPatient } = usePatientWorkflow();
  const patient = getPatient(patientId);
  return { patient, patientId };
}
