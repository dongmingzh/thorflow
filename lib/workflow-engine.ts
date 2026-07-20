import type { Patient, TimelineNode } from "./mock-data";
import { getNotificationTemplate } from "./notification-templates";
import {
  generateFollowupPlanFromPathology,
  type FollowupPlan,
  type PathologyInput,
} from "./followup-templates";

/** 患者精细状态（对接后端 workflow engine 前的本地契约） */
export type PatientWorkflowStatus =
  | "pending_checkin"
  | "checked_in"
  | "history_completed"
  | "orders_uploaded"
  | "exam_in_progress"
  | "exam_completed"
  | "doctor_review"
  | "surgery_scheduled"
  | "preop_preparing"
  | "in_surgery"
  | "surgery_completed"
  | "in_icu"
  | "post_op_recovery"
  | "discharge_ready"
  | "discharged_waiting_pathology"
  | "pathology_reported"
  | "followup_plan_generated"
  | "in_followup"
  | "long_term_management";

export const WORKFLOW_STATUS_LABELS: Record<PatientWorkflowStatus, string> = {
  pending_checkin: "待扫码报道",
  checked_in: "已报道",
  history_completed: "病史已完善",
  orders_uploaded: "检查单已上传",
  exam_in_progress: "术前检查中",
  exam_completed: "检查已完成",
  doctor_review: "待医生审核",
  surgery_scheduled: "已安排手术",
  preop_preparing: "术前准备中",
  in_surgery: "手术进行中",
  surgery_completed: "手术已完成",
  in_icu: "术后监护中",
  post_op_recovery: "术后恢复中",
  discharge_ready: "待出院",
  discharged_waiting_pathology: "待病理回报",
  pathology_reported: "病理已回报",
  followup_plan_generated: "随访计划已生成",
  in_followup: "随访中",
  long_term_management: "长期管理",
};

/** 状态推进顺序（当前产品原型的简化流程） */
const STATUS_FLOW: PatientWorkflowStatus[] = [
  "pending_checkin",
  "checked_in",
  "history_completed",
  "orders_uploaded",
  "exam_in_progress",
  "exam_completed",
  "doctor_review",
  "surgery_scheduled",
  "preop_preparing",
  "in_surgery",
  "surgery_completed",
  "in_icu",
  "post_op_recovery",
  "discharge_ready",
  "discharged_waiting_pathology",
  "pathology_reported",
  "followup_plan_generated",
  "in_followup",
  "long_term_management",
];

export function getNextStatus(
  current: PatientWorkflowStatus
): PatientWorkflowStatus | null {
  const idx = STATUS_FLOW.indexOf(current);
  if (idx < 0 || idx >= STATUS_FLOW.length - 1) return null;
  return STATUS_FLOW[idx + 1];
}

export interface TimelineEventInput {
  patientId: string;
  patientName: string;
  status: PatientWorkflowStatus;
  note?: string;
}

export function generateTimelineEvent(
  input: TimelineEventInput
): TimelineNode {
  const label = WORKFLOW_STATUS_LABELS[input.status];
  const now = new Date();
  const date = `${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  return {
    id: `evt-${input.status}-${Date.now()}`,
    title: label,
    date,
    status: "completed",
    description: input.note ?? `${input.patientName} · ${label}`,
  };
}

export interface PatientNotificationPayload {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
  category: "surgery" | "exam" | "pathology" | "followup" | "general";
}

export function generatePatientNotification(
  templateKey: string,
  overrides?: Partial<PatientNotificationPayload>
): PatientNotificationPayload {
  const tpl = getNotificationTemplate(templateKey);
  return {
    id: `notif-${templateKey}-${Date.now()}`,
    title: tpl.title,
    body: tpl.body,
    createdAt: new Date().toISOString(),
    read: false,
    category: tpl.category,
    ...overrides,
  };
}

export interface PatientTaskItem {
  id: string;
  title: string;
  subtitle?: string;
  completed: boolean;
  syncable?: boolean;
}

export const DEFAULT_RECOGNIZED_ORDER_ITEMS = [
  "增强CT",
  "肺功能",
  "心电图",
  "血常规",
  "凝血功能",
  "肝肾功能",
  "麻醉评估",
];

export function generateTasksFromOrder(
  recognizedItems: string[] = DEFAULT_RECOGNIZED_ORDER_ITEMS
): PatientTaskItem[] {
  return recognizedItems.map((title, i) => ({
    id: `task-order-${i}`,
    title,
    subtitle: "来自检查单 AI 识别",
    completed: false,
    syncable: true,
  }));
}

export { generateFollowupPlanFromPathology };
export type { FollowupPlan, PathologyInput };

/** Dashboard workflow 池定义 */
export type WorkflowPoolKey =
  | "pending_checkin"
  | "exam_in_progress"
  | "exam_completed_review"
  | "awaiting_surgery_schedule"
  | "surgery_today"
  | "post_op_icu"
  | "awaiting_pathology"
  | "discharge_ready"
  | "awaiting_followup_plan"
  | "followup_today"
  | "overdue_abnormal";

export const WORKFLOW_POOL_CONFIG: {
  key: WorkflowPoolKey;
  title: string;
  description: string;
  href?: string;
}[] = [
  {
    key: "pending_checkin",
    title: "待报道患者",
    description: "已预约未到院，等待扫码报道",
  },
  {
    key: "exam_in_progress",
    title: "待完成检查",
    description: "术前检查进行中，关注患者端同步",
    href: "/dashboard/preop",
  },
  {
    key: "exam_completed_review",
    title: "检查已完成待审核",
    description: "患者已完成全部术前检查，等待医生审核",
    href: "/dashboard/preop",
  },
  {
    key: "awaiting_surgery_schedule",
    title: "待安排手术",
    description: "术前评估通过，待排期手术",
    href: "/dashboard/surgery",
  },
  {
    key: "surgery_today",
    title: "今日手术",
    description: "今日计划手术患者",
    href: "/dashboard/surgery",
  },
  {
    key: "post_op_icu",
    title: "术后监护 / ICU",
    description: "术后转入监护室或高危观察",
    href: "/dashboard/surgery",
  },
  {
    key: "awaiting_pathology",
    title: "待病理",
    description: "术后标本病理报告待回报",
    href: "/dashboard/pathology",
  },
  {
    key: "discharge_ready",
    title: "待出院",
    description: "临床路径达标，可办理出院",
  },
  {
    key: "awaiting_followup_plan",
    title: "待制定随访计划",
    description: "病理已出，需生成个体化随访方案",
    href: "/dashboard/pathology",
  },
  {
    key: "followup_today",
    title: "今日随访",
    description: "今日门诊或电话随访",
    href: "/dashboard/followup",
  },
  {
    key: "overdue_abnormal",
    title: "超时 / 异常患者",
    description: "检查超时、节点停滞或高风险未处理",
  },
];

export function getPatientWorkflowPool(patient: Patient): WorkflowPoolKey {
  const s = patient.currentStatus;
  const today = new Date().toISOString().slice(0, 10);

  if (patient.flags?.overdue) return "overdue_abnormal";
  if (s === "pending_checkin") return "pending_checkin";
  if (s === "exam_in_progress" || s === "orders_uploaded" || s === "checked_in")
    return "exam_in_progress";
  if (s === "exam_completed" || s === "doctor_review")
    return "exam_completed_review";
  if (s === "surgery_scheduled" || s === "preop_preparing") {
    if (patient.surgeryDate === today) return "surgery_today";
    return "awaiting_surgery_schedule";
  }
  if (
    (s === "in_surgery" || s === "surgery_completed") &&
    patient.surgeryDate === today
  )
    return "surgery_today";
  if (s === "in_icu" || s === "post_op_recovery") return "post_op_icu";
  if (s === "discharged_waiting_pathology") return "awaiting_pathology";
  if (s === "discharge_ready") return "discharge_ready";
  if (s === "pathology_reported") return "awaiting_followup_plan";
  if (s === "in_followup" || s === "followup_plan_generated") {
    if (patient.followupPlan?.nextVisitDate === today) return "followup_today";
    return "followup_today";
  }
  if (s === "long_term_management") return "followup_today";
  return "exam_in_progress";
}

export function groupPatientsByPool(
  patients: Patient[]
): Record<WorkflowPoolKey, Patient[]> {
  const pools = Object.fromEntries(
    WORKFLOW_POOL_CONFIG.map((p) => [p.key, [] as Patient[]])
  ) as Record<WorkflowPoolKey, Patient[]>;

  for (const patient of patients) {
    const pool = getPatientWorkflowPool(patient);
    pools[pool].push(patient);
  }
  return pools;
}

export function getPatientStageLabelForMini(
  status: PatientWorkflowStatus
): string {
  const map: Partial<Record<PatientWorkflowStatus, string>> = {
    exam_in_progress: "术前检查中",
    exam_completed: "术前检查中",
    doctor_review: "术前检查中",
    surgery_scheduled: "已安排手术",
    preop_preparing: "已安排手术",
    in_surgery: "手术进行中",
    surgery_completed: "手术已完成",
    in_icu: "术后恢复中",
    post_op_recovery: "术后恢复中",
    discharged_waiting_pathology: "待病理",
    pathology_reported: "待病理",
    followup_plan_generated: "随访中",
    in_followup: "随访中",
    long_term_management: "随访中",
  };
  return map[status] ?? WORKFLOW_STATUS_LABELS[status];
}

export function getWorkflowProgressFromStatus(
  status: PatientWorkflowStatus
): number {
  const idx = STATUS_FLOW.indexOf(status);
  if (idx < 0) return 0;
  return Math.round(((idx + 1) / STATUS_FLOW.length) * 100);
}
