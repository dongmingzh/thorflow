"use client";

import { useParams } from "next/navigation";

import { PatientDetailView } from "@/components/patient/patient-detail-view";

export default function PatientPage() {
  const params = useParams();
  const id = params.id as string;
  return <PatientDetailView patientId={id} />;
}
