import type { Patient, TimelineNode, WorkflowStage } from "./mock-data";
import { inferStageFromTimeline } from "./workflow-templates";

export type WorkflowType = "preop" | "surgery" | "pathology" | "followup";

export type WorkflowFilter = "all" | "urgent" | "today" | "pending";

export const WORKFLOW_ROUTES: Record<WorkflowType, string> = {
  preop: "/dashboard/preop",
  surgery: "/dashboard/surgery",
  pathology: "/dashboard/pathology",
  followup: "/dashboard/followup",
};

export const WORKFLOW_LABELS: Record<WorkflowType, string> = {
  preop: "待术前评估",
  surgery: "待手术",
  pathology: "待病理",
  followup: "今日随访",
};

const STAGE_MAP: Record<WorkflowType, WorkflowStage> = {
  preop: "Pre-op",
  surgery: "Surgery",
  pathology: "Pathology",
  followup: "Follow-up",
};

export interface WorkflowStats {
  total: number;
  urgent: number;
  today: number;
  completed: number;
  avgDaysInStage: number;
}

export interface WorkflowNotification {
  id: string;
  type: "urgent" | "info" | "pathology" | "followup";
  message: string;
  href: string;
}

export function getPatientsByWorkflow(
  type: WorkflowType,
  patients: Patient[]
): Patient[] {
  const stage = STAGE_MAP[type];
  return patients.filter((p) => p.status === stage);
}

export function filterWorkflowPatients(
  patients: Patient[],
  filter: WorkflowFilter
): Patient[] {
  if (filter === "all") return patients;
  if (filter === "urgent") {
    return patients.filter((p) => p.riskLevel === "High");
  }
  if (filter === "today") {
    const today = new Date().toISOString().slice(0, 10);
    return patients.filter((p) => {
      const node = p.timeline.find((n) => n.status === "current");
      return node?.date?.includes(today.slice(5)) || p.surgeryDate === today;
    });
  }
  return patients.filter((p) => {
    const pending = p.timeline.filter((n) => n.status === "pending").length;
    return pending > 3;
  });
}

export function getWorkflowStats(
  type: WorkflowType,
  patients: Patient[]
): WorkflowStats {
  const queue = getPatientsByWorkflow(type, patients);
  const urgent = queue.filter((p) => p.riskLevel === "High").length;
  const today = queue.filter((p) => {
    const d = new Date().toISOString().slice(0, 10);
    return p.surgeryDate === d;
  }).length;
  const completed = queue.filter((p) =>
    p.timeline.some((n) => n.id === "pathology" && n.status === "completed")
  ).length;

  return {
    total: queue.length,
    urgent,
    today: today || Math.min(queue.length, 3),
    completed,
    avgDaysInStage: type === "preop" ? 4.2 : type === "surgery" ? 1.1 : 2.8,
  };
}

export function getDashboardStats(patients: Patient[]) {
  return {
    preop: getPatientsByWorkflow("preop", patients).length,
    surgery: getPatientsByWorkflow("surgery", patients).length,
    pathology: getPatientsByWorkflow("pathology", patients).length,
    followup: getPatientsByWorkflow("followup", patients).length,
  };
}

export function getCurrentTimelineNode(
  timeline: TimelineNode[]
): TimelineNode | undefined {
  return timeline.find((n) => n.status === "current");
}

export function advanceTimelineNode(
  timeline: TimelineNode[],
  nodeId: string
): TimelineNode[] {
  const updated = timeline.map((n) => ({ ...n }));
  const currentIndex = updated.findIndex((n) => n.id === nodeId);

  if (currentIndex === -1) return timeline;

  updated[currentIndex] = {
    ...updated[currentIndex],
    status: "completed",
    date: updated[currentIndex].date ?? formatShortDate(new Date()),
  };

  if (
    updated[currentIndex + 1] &&
    updated[currentIndex + 1].status === "pending"
  ) {
    updated[currentIndex + 1] = {
      ...updated[currentIndex + 1],
      status: "current",
    };
  }

  return updated;
}

export function updateTimelineNode(
  timeline: TimelineNode[],
  nodeId: string,
  updates: Partial<TimelineNode>
): TimelineNode[] {
  return timeline.map((n) => (n.id === nodeId ? { ...n, ...updates } : n));
}

export function addTimelineNode(
  timeline: TimelineNode[],
  node: Omit<TimelineNode, "id"> & { id?: string }
): TimelineNode[] {
  const id = node.id ?? `custom-${Date.now()}`;
  return [...timeline, { ...node, id, status: node.status ?? "pending" }];
}

export function deleteTimelineNode(
  timeline: TimelineNode[],
  nodeId: string
): TimelineNode[] {
  const filtered = timeline.filter((n) => n.id !== nodeId);
  const hasCurrent = filtered.some((n) => n.status === "current");
  if (!hasCurrent && filtered.length > 0) {
    const firstPending = filtered.findIndex((n) => n.status === "pending");
    if (firstPending >= 0) {
      filtered[firstPending] = { ...filtered[firstPending], status: "current" };
    }
  }
  return filtered;
}

export function setTimelineNodeStatus(
  timeline: TimelineNode[],
  nodeId: string,
  status: TimelineNode["status"]
): TimelineNode[] {
  if (status === "completed") {
    return advanceTimelineNode(timeline, nodeId);
  }

  return timeline.map((n) => {
    if (n.id === nodeId) return { ...n, status };
    if (status === "current" && n.status === "current") {
      return { ...n, status: "pending" };
    }
    return n;
  });
}

export function syncPatientStatus(timeline: TimelineNode[]): WorkflowStage {
  return inferStageFromTimeline(timeline);
}

export function getWorkflowProgress(timeline: TimelineNode[]): number {
  if (timeline.length === 0) return 0;
  const completed = timeline.filter((n) => n.status === "completed").length;
  return Math.round((completed / timeline.length) * 100);
}

export function getPatientsReadyForSurgeryReview(
  patients: Patient[]
): Patient[] {
  return patients.filter((p) => p.flags?.readyForSurgeryReview);
}

export function generateWorkflowNotifications(
  patients: Patient[]
): WorkflowNotification[] {
  const notifications: WorkflowNotification[] = [];

  getPatientsReadyForSurgeryReview(patients).forEach((p) => {
    notifications.push({
      id: `review-${p.id}`,
      type: "info",
      message: `${p.name}已完成全部术前检查，等待医生审核并安排手术。`,
      href: `/dashboard/preop?patient=${p.id}`,
    });
  });

  patients
    .filter((p) => p.riskLevel === "High" && p.status === "Pre-op")
    .slice(0, 2)
    .forEach((p) => {
      const node = getCurrentTimelineNode(p.timeline);
      notifications.push({
        id: `urgent-${p.id}`,
        type: "urgent",
        message: `${p.id} ${p.name}：${node?.title ?? "术前评估"}待确认${p.surgeryDate ? `，手术 ${p.surgeryDate}` : ""}`,
        href: `/patient/${p.id}`,
      });
    });

  patients
    .filter((p) => p.status === "Surgery")
    .slice(0, 1)
    .forEach((p) => {
      notifications.push({
        id: `surgery-${p.id}`,
        type: "info",
        message: `${p.id} ${p.name}：手术流程进行中`,
        href: `/patient/${p.id}`,
      });
    });

  patients
    .filter((p) => p.status === "Pathology")
    .slice(0, 2)
    .forEach((p) => {
      notifications.push({
        id: `path-${p.id}`,
        type: "pathology",
        message: `${p.id} ${p.name}：术后病理报告待回报`,
        href: `/patient/${p.id}`,
      });
    });

  const followupCount = getPatientsByWorkflow("followup", patients).length;
  if (followupCount > 0) {
    notifications.push({
      id: "followup-queue",
      type: "followup",
      message: `今日随访队列 ${followupCount} 例，点击查看详情`,
      href: "/dashboard/followup",
    });
  }

  return notifications.slice(0, 5);
}

function formatShortDate(date: Date): string {
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${m}-${d}`;
}
