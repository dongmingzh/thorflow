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
import type {
  Patient,
  PatientNotification,
  PathologyInfo,
  TimelineNode,
} from "@/lib/mock-data";
import { mockPatients } from "@/lib/mock-data";
import type { FollowupPlan, PathologyInput } from "@/lib/followup-templates";
import { formatNotificationBody } from "@/lib/notification-templates";
import {
  generateFollowupPlanFromPathology,
  generatePatientNotification,
  generateTimelineEvent,
  type PatientWorkflowStatus,
} from "@/lib/workflow-engine";
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
  pushNotification: (
    patientId: string,
    notification: Omit<PatientNotification, "id" | "createdAt" | "read"> & {
      id?: string;
    }
  ) => void;
  pushNotificationFromTemplate: (
    patientId: string,
    templateKey: string,
    vars?: Record<string, string>
  ) => void;
  updateCurrentStatus: (
    patientId: string,
    status: PatientWorkflowStatus,
    note?: string
  ) => void;
  scheduleSurgery: (patientId: string, surgeryDate: string) => void;
  markSurgeryMilestone: (
    patientId: string,
    milestone: "in_or" | "completed" | "icu" | "ward"
  ) => void;
  savePathologyAndFollowup: (
    patientId: string,
    pathology: PathologyInfo,
    input: PathologyInput
  ) => FollowupPlan | null;
  updatePatientTasks: (
    patientId: string,
    tasks: Patient["tasks"]
  ) => void;
}

const PatientWorkflowContext = createContext<PatientWorkflowContextValue | null>(
  null
);

export function PatientWorkflowProvider({ children }: { children: ReactNode }) {
  const [patients, setPatients] = useState<Patient[]>(() =>
    initializePatients()
  );
  const hydrated = true;

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
        const rest = { ...updates };
        delete rest.status;
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
        const rest = { ...updates };
        delete rest.status;
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

  const pushNotification = useCallback(
    (
      patientId: string,
      notification: Omit<PatientNotification, "id" | "createdAt" | "read"> & {
        id?: string;
      }
    ) => {
      const item: PatientNotification = {
        id: notification.id ?? `notif-${Date.now()}`,
        createdAt: new Date().toISOString(),
        read: false,
        ...notification,
      };
      setPatients((prev) =>
        prev.map((p) =>
          p.id === patientId
            ? { ...p, notifications: [item, ...p.notifications] }
            : p
        )
      );
    },
    []
  );

  const pushNotificationFromTemplate = useCallback(
    (
      patientId: string,
      templateKey: string,
      vars?: Record<string, string>
    ) => {
      const raw = generatePatientNotification(templateKey);
      pushNotification(patientId, {
        title: raw.title,
        body: vars
          ? formatNotificationBody(templateKey, vars)
          : raw.body,
        category: raw.category,
      });
    },
    [pushNotification]
  );

  const updateCurrentStatus = useCallback(
    (patientId: string, status: PatientWorkflowStatus, note?: string) => {
      setPatients((prev) =>
        prev.map((p) => {
          if (p.id !== patientId) return p;
          const evt = generateTimelineEvent({
            patientId,
            patientName: p.name,
            status,
            note,
          });
          return {
            ...p,
            currentStatus: status,
            timeline: [...p.timeline, evt],
          };
        })
      );
    },
    []
  );

  const scheduleSurgery = useCallback(
    (patientId: string, surgeryDate: string) => {
      setPatients((prev) =>
        prev.map((p) => {
          if (p.id !== patientId) return p;
          const timeline = advanceTimelineNode(p.timeline, "mdt");
          return {
            ...p,
            surgeryDate,
            currentStatus: "surgery_scheduled",
            status: "Surgery",
            timeline,
            surgery: {
              ...p.surgery,
              scheduledDate: surgeryDate,
            },
            flags: { ...p.flags, readyForSurgeryReview: false },
          };
        })
      );
      const formatted = surgeryDate.replace(/(\d{4})-(\d{2})-(\d{2})/, "$2月$3日");
      pushNotificationFromTemplate(patientId, "surgery_scheduled", {
        date: formatted || surgeryDate,
      });
    },
    [pushNotificationFromTemplate]
  );

  const markSurgeryMilestone = useCallback(
    (patientId: string, milestone: "in_or" | "completed" | "icu" | "ward") => {
      const config: Record<
        typeof milestone,
        {
          status: PatientWorkflowStatus;
          template: string;
          surgery: Partial<Patient["surgery"]>;
          workflowStage?: Patient["status"];
        }
      > = {
        in_or: {
          status: "in_surgery",
          template: "entered_or",
          surgery: { inOR: true },
          workflowStage: "Surgery",
        },
        completed: {
          status: "surgery_completed",
          template: "surgery_completed",
          surgery: { inOR: false, completed: true },
          workflowStage: "Surgery",
        },
        icu: {
          status: "in_icu",
          template: "transferred_icu",
          surgery: { inICU: true },
        },
        ward: {
          status: "post_op_recovery",
          template: "back_to_ward",
          surgery: { inICU: false, backToWard: true },
          workflowStage: "Pathology",
        },
      };
      const cfg = config[milestone];
      setPatients((prev) =>
        prev.map((p) => {
          if (p.id !== patientId) return p;
          const evt = generateTimelineEvent({
            patientId,
            patientName: p.name,
            status: cfg.status,
          });
          return {
            ...p,
            currentStatus: cfg.status,
            status: cfg.workflowStage ?? p.status,
            surgery: { ...p.surgery, ...cfg.surgery },
            timeline: [...p.timeline, evt],
          };
        })
      );
      pushNotificationFromTemplate(patientId, cfg.template);
    },
    [pushNotificationFromTemplate]
  );

  const savePathologyAndFollowup = useCallback(
    (patientId: string, pathology: PathologyInfo, input: PathologyInput) => {
      const plan = generateFollowupPlanFromPathology(input);
      setPatients((prev) =>
        prev.map((p) => {
          if (p.id !== patientId) return p;
          const evt = generateTimelineEvent({
            patientId,
            patientName: p.name,
            status: "followup_plan_generated",
            note: `${input.pathologyType} · ${input.stage}`,
          });
          return {
            ...p,
            pathology: { ...pathology, reportedAt: new Date().toISOString().slice(0, 10) },
            followupPlan: plan,
            currentStatus: "followup_plan_generated",
            status: "Follow-up",
            timeline: [...p.timeline, evt],
          };
        })
      );
      pushNotificationFromTemplate(patientId, "followup_plan_ready");
      return plan;
    },
    [pushNotificationFromTemplate]
  );

  const updatePatientTasks = useCallback(
    (patientId: string, tasks: Patient["tasks"]) => {
      updatePatient(patientId, { tasks });
    },
    [updatePatient]
  );

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
      pushNotification,
      pushNotificationFromTemplate,
      updateCurrentStatus,
      scheduleSurgery,
      markSurgeryMilestone,
      savePathologyAndFollowup,
      updatePatientTasks,
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
      pushNotification,
      pushNotificationFromTemplate,
      updateCurrentStatus,
      scheduleSurgery,
      markSurgeryMilestone,
      savePathologyAndFollowup,
      updatePatientTasks,
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
