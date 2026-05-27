"use client";

import { useRef } from "react";
import { Download, Upload } from "lucide-react";

import { usePatientWorkflow } from "@/components/providers/patient-workflow-provider";

export function DataActions() {
  const { exportData, importData } = usePatientWorkflow();
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await importData(file);
      e.target.value = "";
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={exportData}
        className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-2 text-xs font-medium text-muted transition hover:border-primary hover:text-primary"
        title="导出 JSON 备份"
      >
        <Download className="h-3.5 w-3.5" />
        导出
      </button>
      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-2 text-xs font-medium text-muted transition hover:border-primary hover:text-primary"
        title="导入 JSON 备份"
      >
        <Upload className="h-3.5 w-3.5" />
        导入
      </button>
      <input
        ref={fileRef}
        type="file"
        accept=".json,application/json"
        className="hidden"
        onChange={handleImport}
      />
    </div>
  );
}
