"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  downloadJSON,
  exportPatientsJSON,
  generatePatientId,
  importPatientsJSON,
  initializePatients,
  savePatients,
} from "@/lib/local-store";
import type { Patient, TimelineNode } from "@/lib/mock-data";
import { mockPatients } from "@/lib/mock-data";
import {
  addTimelineNode,
  advanceTimelineNode,
  deleteTimelineNode,
  syncPatientStatus,
  updateTimelineNode,
} from "@/lib/workflow";

interface PatientWorkflowContextValue {
  patients: Patient[];
  hydrated: boolean;
  getPatient: (id: string) => Patient | undefined;
  addPatient: (patient: Omit<Patient, "id"> & { id?: string }) => Patient;
  updatePatient: (id: string, updates: Partial<Patient>) => void;
  deletePatient: (id: string) => void;
  getTimeline: (patientId: string) => TimelineNode[];
  advanceNode: (patientId: string, nodeId: string) => void;
  updateNode: (
    patientId: string,
    nodeId: string,
    updates: Partial<TimelineNode>
  ) => void;
  addNode: (
    patientId: string,
    node: Omit<TimelineNode, "id"> & { id?: string }
  ) => void;
  deleteNode: (patientId: string, nodeId: string) => void;
  setTimeline: (patientId: string, timeline: TimelineNode[]) => void;
  resetPatient: (patientId: string) => void;
  exportData: () => void;
  importData: (file: File) => Promise<void>;
  resetAllData: () => void;
}

const PatientWorkflowContext = createContext<PatientWorkflowContextValue | null>(
  null
);

export function PatientWorkflowProvider({ children }: { children: ReactNode }) {
  const [patients, setPatients] = useState<Patient[]>(mockPatients);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setPatients(initializePatients());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) savePatients(patients);
  }, [patients, hydrated]);

  const getPatient = useCallback(
    (id: string) => patients.find((p) => p.id === id),
    [patients]
  );

  const updatePatientTimeline = useCallback(
    (patientId: string, timeline: TimelineNode[]) => {
      const status = syncPatientStatus(timeline);
      setPatients((prev) =>
        prev.map((p) =>
          p.id === patientId ? { ...p, timeline, status } : p
        )
      );
    },
    []
  );

  const addPatient = useCallback(
    (data: Omit<Patient, "id"> & { id?: string }) => {
      const id = data.id ?? generatePatientId(patients);
      const patient: Patient = {
        ...data,
        id,
        createdAt: data.createdAt ?? new Date().toISOString(),
      };
      setPatients((prev) => [...prev, patient]);
      return patient;
    },
    [patients]
  );

  const updatePatient = useCallback((id: string, updates: Partial<Patient>) => {
    setPatients((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  }, []);

  const deletePatient = useCallback((id: string) => {
    setPatients((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const getTimeline = useCallback(
    (patientId: string): TimelineNode[] => {
      return getPatient(patientId)?.timeline ?? [];
    },
    [getPatient]
  );

  const advanceNode = useCallback(
    (patientId: string, nodeId: string) => {
      const patient = getPatient(patientId);
      if (!patient) return;
      const timeline = advanceTimelineNode(patient.timeline, nodeId);
      updatePatientTimeline(patientId, timeline);
    },
    [getPatient, updatePatientTimeline]
  );

  const updateNode = useCallback(
    (patientId: string, nodeId: string, updates: Partial<TimelineNode>) => {
      const patient = getPatient(patientId);
      if (!patient) return;

      let timeline = patient.timeline;

      if (updates.status === "completed") {
        timeline = advanceTimelineNode(timeline, nodeId);
        const { status: _, ...rest } = updates;
        if (Object.keys(rest).length > 0) {
          timeline = updateTimelineNode(timeline, nodeId, rest);
        }
      } else if (updates.status === "current") {
        timeline = timeline.map((n) => ({
          ...n,
          status:
            n.id === nodeId
              ? "current"
              : n.status === "current"
                ? "pending"
                : n.status,
        }));
        const { status: _, ...rest } = updates;
        if (Object.keys(rest).length > 0) {
          timeline = updateTimelineNode(timeline, nodeId, rest);
        }
      } else {
        timeline = updateTimelineNode(timeline, nodeId, updates);
      }

      updatePatientTimeline(patientId, timeline);
    },
    [getPatient, updatePatientTimeline]
  );

  const addNode = useCallback(
    (
      patientId: string,
      node: Omit<TimelineNode, "id"> & { id?: string }
    ) => {
      const patient = getPatient(patientId);
      if (!patient) return;
      const timeline = addTimelineNode(patient.timeline, node);
      updatePatientTimeline(patientId, timeline);
    },
    [getPatient, updatePatientTimeline]
  );

  const deleteNode = useCallback(
    (patientId: string, nodeId: string) => {
      const patient = getPatient(patientId);
      if (!patient) return;
      const timeline = deleteTimelineNode(patient.timeline, nodeId);
      updatePatientTimeline(patientId, timeline);
    },
    [getPatient, updatePatientTimeline]
  );

  const setTimeline = useCallback(
    (patientId: string, timeline: TimelineNode[]) => {
      updatePatientTimeline(patientId, timeline);
    },
    [updatePatientTimeline]
  );

  const resetPatient = useCallback((id: string) => {
    const original = mockPatients.find((p) => p.id === id);
    if (!original) return;
    setPatients((prev) =>
      prev.map((p) => (p.id === id ? { ...original } : p))
    );
  }, []);

  const exportData = useCallback(() => {
    const json = exportPatientsJSON(patients);
    const date = new Date().toISOString().slice(0, 10);
    downloadJSON(json, `thorflow-backup-${date}.json`);
  }, [patients]);

  const importData = useCallback(async (file: File) => {
    const text = await file.text();
    const imported = importPatientsJSON(text);
    setPatients(imported);
  }, []);

  const resetAllData = useCallback(() => {
    setPatients(mockPatients);
  }, []);

  const value = useMemo(
    () => ({
      patients,
      hydrated,
      getPatient,
      addPatient,
      updatePatient,
      deletePatient,
      getTimeline,
      advanceNode,
      updateNode,
      addNode,
      deleteNode,
      setTimeline,
      resetPatient,
      exportData,
      importData,
      resetAllData,
    }),
    [
      patients,
      hydrated,
      getPatient,
      addPatient,
      updatePatient,
      deletePatient,
      getTimeline,
      advanceNode,
      updateNode,
      addNode,
      deleteNode,
      setTimeline,
      resetPatient,
      exportData,
      importData,
      resetAllData,
    ]
  );

  return (
    <PatientWorkflowContext.Provider value={value}>
      {children}
    </PatientWorkflowContext.Provider>
  );
}

export function usePatientWorkflow() {
  const ctx = useContext(PatientWorkflowContext);
  if (!ctx) {
    throw new Error(
      "usePatientWorkflow must be used within PatientWorkflowProvider"
    );
  }
  return ctx;
}

export function usePatientTimeline(patientId: string) {
  const { getTimeline, advanceNode, updateNode, addNode, deleteNode } =
    usePatientWorkflow();
  const timeline = getTimeline(patientId);
  return {
    timeline,
    advance: (nodeId: string) => advanceNode(patientId, nodeId),
    updateNode: (nodeId: string, updates: Partial<TimelineNode>) =>
      updateNode(patientId, nodeId, updates),
    addNode: (node: Omit<TimelineNode, "id"> & { id?: string }) =>
      addNode(patientId, node),
    deleteNode: (nodeId: string) => deleteNode(patientId, nodeId),
  };
}

export function usePatients() {
  const { patients, hydrated } = usePatientWorkflow();
  return { patients, hydrated };
}
