import { migratePatient, mockPatients, type Patient } from "./mock-data";

const STORAGE_KEY = "thorflow-patients-v2";
const STORAGE_VERSION = 2;

export interface ThorFlowExport {
  version: number;
  exportedAt: string;
  patients: Patient[];
}

export function loadPatients(): Patient[] | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Patient[];
    if (!Array.isArray(parsed)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function savePatients(patients: Patient[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(patients));
}

export function initializePatients(): Patient[] {
  const stored = loadPatients();
  if (stored && stored.length > 0) {
    return stored.map((p) => migratePatient(p));
  }
  return mockPatients;
}

export function exportPatientsJSON(patients: Patient[]): string {
  const payload: ThorFlowExport = {
    version: STORAGE_VERSION,
    exportedAt: new Date().toISOString(),
    patients,
  };
  return JSON.stringify(payload, null, 2);
}

export function importPatientsJSON(json: string): Patient[] {
  const parsed = JSON.parse(json) as ThorFlowExport | Patient[];

  if (Array.isArray(parsed)) {
    return parsed;
  }

  if (parsed && Array.isArray(parsed.patients)) {
    return parsed.patients;
  }

  throw new Error("无效的导入文件格式");
}

export function downloadJSON(data: string, filename: string): void {
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function generatePatientId(existing: Patient[]): string {
  const nums = existing
    .map((p) => parseInt(p.id.replace("PT-", ""), 10))
    .filter((n) => !Number.isNaN(n));
  const next = nums.length > 0 ? Math.max(...nums) + 1 : 1001;
  return `PT-${next}`;
}
