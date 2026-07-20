"use client";

import { useSearchParams } from "next/navigation";

import { usePatientWorkflow } from "@/components/providers/patient-workflow-provider";
import { DEFAULT_MINI_PATIENT_ID } from "@/lib/mock-data";

export function useMiniPatient() {
  const params = useSearchParams();
  const patientId = params.get("patient") ?? DEFAULT_MINI_PATIENT_ID;
  const { getPatient } = usePatientWorkflow();
  const patient = getPatient(patientId);
  return { patient, patientId };
}
