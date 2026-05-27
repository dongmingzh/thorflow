"use client";

import { Modal } from "@/components/ui/modal";
import {
  PatientForm,
  formDataToPatient,
  type PatientFormData,
} from "@/components/patient/patient-form";
import { usePatientWorkflow } from "@/components/providers/patient-workflow-provider";
import { useRouter } from "next/navigation";

interface AddPatientModalProps {
  open: boolean;
  onClose: () => void;
}

export function AddPatientModal({ open, onClose }: AddPatientModalProps) {
  const { addPatient } = usePatientWorkflow();
  const router = useRouter();

  const handleSubmit = (data: PatientFormData) => {
    const patient = addPatient(formDataToPatient(data));
    onClose();
    router.push(`/patient/${patient.id}`);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className="max-h-[90vh] overflow-y-auto rounded-3xl border border-border bg-card p-6 shadow-2xl md:p-8">
        <h2 className="mb-1 text-2xl font-bold text-foreground">新增患者</h2>
        <p className="mb-6 text-sm text-muted">
          选择流程模板，自动生成围术期 Timeline
        </p>
        <PatientForm
          onSubmit={handleSubmit}
          onCancel={onClose}
          submitLabel="创建并进入详情"
        />
      </div>
    </Modal>
  );
}
