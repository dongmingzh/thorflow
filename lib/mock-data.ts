import type { FollowupPlan } from "./followup-templates";
import type { PatientWorkflowStatus } from "./workflow-engine";

export type TimelineStatus = "completed" | "current" | "pending";

export type WorkflowStage = "Pre-op" | "Surgery" | "Pathology" | "Follow-up";

export type DiseaseCategory =
  | "肺结节"
  | "肺腺癌"
  | "微浸润腺癌"
  | "肺鳞癌"
  | "围术期肺癌";

export type RiskLevel = "Low" | "Medium" | "High";

export interface TimelineNode {
  id: string;
  title: string;
  date?: string;
  status: TimelineStatus;
  description?: string;
}

export interface PatientTodo {
  id: string;
  title: string;
  subtitle: string;
  time?: string;
  priority: "high" | "medium" | "low";
  icon: "activity" | "calendar" | "file" | "image";
}

export interface ImagingStudy {
  id: string;
  type: "CT" | "PET-CT";
  title: string;
  date: string;
  previewUrl: string;
}

export interface PatientAIContent {
  caseSummary: string;
  perioperativeAdvice: string;
  pathologyFocus: string;
  dischargeGuidance: string;
  followupReminder: string;
  riskAlert: string;
}

export interface PatientNotification {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
  category: "surgery" | "exam" | "pathology" | "followup" | "general";
}

export interface PatientWorkflowTask {
  id: string;
  title: string;
  subtitle?: string;
  completed: boolean;
}

export interface SurgeryInfo {
  scheduledDate?: string;
  operatingRoom?: string;
  inOR?: boolean;
  completed?: boolean;
  inICU?: boolean;
  backToWard?: boolean;
}

export interface PathologyInfo {
  pathologyType?: string;
  stage?: string;
  geneTest?: boolean;
  chemo?: boolean;
  targeted?: boolean;
  immunotherapy?: boolean;
  reportedAt?: string;
}

export interface PatientFlags {
  overdue?: boolean;
  readyForSurgeryReview?: boolean;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: "M" | "F";
  diseaseCategory: DiseaseCategory;
  diagnosis: string;
  clinicalStage?: string;
  status: WorkflowStage;
  currentStatus: PatientWorkflowStatus;
  riskLevel: RiskLevel;
  surgeryDate?: string;
  treatmentGroup?: string;
  bed?: string;
  notes?: string;
  medicalHistory?: string;
  preopPlan?: string;
  templateId?: string;
  createdAt?: string;
  phone?: string;
  inpatientNo?: string;
  timeline: TimelineNode[];
  todos: PatientTodo[];
  tasks: PatientWorkflowTask[];
  notifications: PatientNotification[];
  imaging: ImagingStudy[];
  surgery: SurgeryInfo;
  pathology: PathologyInfo;
  followupPlan?: FollowupPlan;
  flags?: PatientFlags;
}

export const STANDARD_TIMELINE_TITLES = [
  "门诊发现",
  "增强CT",
  "PET-CT",
  "肺功能",
  "麻醉评估",
  "MDT",
  "手术",
  "病理",
  "术后方案",
  "随访",
] as const;

const NODE_IDS = [
  "outpatient",
  "ct",
  "pet",
  "pulmonary",
  "anesthesia",
  "mdt",
  "surgery",
  "pathology",
  "postop",
  "followup",
] as const;

function buildTimeline(
  currentNodeId: (typeof NODE_IDS)[number],
  dates: Partial<Record<(typeof NODE_IDS)[number], string>>,
  descriptions: Partial<Record<(typeof NODE_IDS)[number], string>> = {}
): TimelineNode[] {
  const currentIndex = NODE_IDS.indexOf(currentNodeId);

  return NODE_IDS.map((id, index) => {
    let status: TimelineStatus = "pending";
    if (index < currentIndex) status = "completed";
    else if (index === currentIndex) status = "current";

    return {
      id,
      title: STANDARD_TIMELINE_TITLES[index],
      date: dates[id],
      status,
      description: descriptions[id],
    };
  });
}

const CT_PREVIEW =
  "https://images.unsplash.com/photo-1581595219315-a187dd40c322?q=80&w=1600&auto=format&fit=crop";

/** 患者端小程序 Demo 默认患者 */
export const DEMO_MINI_PATIENT_ID = "PT-1004";

export const DEFAULT_PREOP_TASKS: PatientWorkflowTask[] = [
  { id: "pt-upload", title: "上传术前检查单", completed: false },
  { id: "pt-ct", title: "完成增强CT", completed: false },
  { id: "pt-pft", title: "完成肺功能", completed: false },
  { id: "pt-ecg", title: "完成心电图", completed: false },
  { id: "pt-anes", title: "完成麻醉评估", completed: false },
  { id: "pt-wait", title: "等待医生审核", completed: false },
];

const COMPLETED_PREOP_TASKS: PatientWorkflowTask[] = DEFAULT_PREOP_TASKS.map(
  (t) => ({ ...t, completed: true })
);

function defaultSurgery(scheduledDate?: string): SurgeryInfo {
  return { scheduledDate, inOR: false, completed: false, inICU: false, backToWard: false };
}

function defaultPathology(): PathologyInfo {
  return {};
}

export function createPendingFollowupPlan(): FollowupPlan {
  return {
    templateName: "待病理回报后生成",
    nextVisitDate: "病理回报后确认",
    nextExam: "胸部CT / 肿瘤标志物按分期确认",
    needsChemo: false,
    needsGeneTest: false,
    needsTargeted: false,
    needsImmunotherapy: false,
    doctorNote: "病理类型与分期确认后，AI 将生成个体化随访时间表。",
    items: [
      {
        id: "fu-pending",
        title: "等待医生录入病理并生成随访计划",
        dueDate: "待确认",
        type: "reminder",
      },
    ],
  };
}

function notif(
  id: string,
  title: string,
  body: string,
  category: PatientNotification["category"] = "general"
): PatientNotification {
  return {
    id,
    title,
    body,
    createdAt: new Date().toISOString(),
    read: false,
    category,
  };
}

export const mockPatients: Patient[] = [
  {
    id: "PT-1001",
    name: "患者A",
    age: 58,
    gender: "M",
    diseaseCategory: "肺结节",
    diagnosis: "右上肺混合磨玻璃结节（IA期腺癌倾向）",
    clinicalStage: "cT1aN0M0 · IA1",
    status: "Pre-op",
    currentStatus: "exam_in_progress",
    riskLevel: "Medium",
    surgeryDate: "2026-06-03",
    phone: "138****5621",
    inpatientNo: "20260518001",
    tasks: DEFAULT_PREOP_TASKS.map((t, i) => ({
      ...t,
      completed: i < 2,
    })),
    notifications: [
      notif("n1", "术前检查提醒", "请按医嘱完成增强CT与肺功能检查，完成后在小程序上传检查单。", "exam"),
    ],
    surgery: defaultSurgery("2026-06-03"),
    pathology: defaultPathology(),
    followupPlan: createPendingFollowupPlan(),
    timeline: buildTimeline(
      "anesthesia",
      {
        outpatient: "05-12",
        ct: "05-15",
        pet: "05-16",
        pulmonary: "05-18",
      },
      {
        outpatient: "体检胸部CT发现右上肺磨玻璃结节",
        anesthesia: "等待术前心电图与凝血功能确认",
      }
    ),
    todos: [
      {
        id: "t1",
        title: "完成麻醉术前评估表",
        subtitle: "麻醉科 3 楼，携带近期心电图",
        time: "今日 14:00",
        priority: "high",
        icon: "activity",
      },
      {
        id: "t2",
        title: "签署手术知情同意书",
        subtitle: "胸外科病房护士站",
        time: "今日 16:30",
        priority: "medium",
        icon: "file",
      },
      {
        id: "t3",
        title: "复核增强CT三维重建",
        subtitle: "PACS 已更新 05-15 序列",
        priority: "low",
        icon: "image",
      },
    ],
    imaging: [
      {
        id: "img1",
        type: "CT",
        title: "胸部增强CT · 三维重建",
        date: "2026-05-15",
        previewUrl: CT_PREVIEW,
      },
    ],
  },
  {
    id: "PT-1002",
    name: "患者B",
    age: 42,
    gender: "F",
    diseaseCategory: "肺腺癌",
    diagnosis: "左下肺腺癌（IA期）",
    clinicalStage: "cT1bN0M0 · IA2",
    status: "Surgery",
    currentStatus: "in_surgery",
    riskLevel: "Low",
    surgeryDate: "2026-06-01",
    phone: "139****8820",
    tasks: [],
    notifications: [
      notif("n1", "患者已进入手术室", "您已进入手术室，家属请在等候区耐心等待。", "surgery"),
    ],
    surgery: {
      scheduledDate: "2026-06-01",
      operatingRoom: "OR-3",
      inOR: true,
      completed: false,
      inICU: false,
      backToWard: false,
    },
    pathology: defaultPathology(),
    followupPlan: createPendingFollowupPlan(),
    timeline: buildTimeline(
      "surgery",
      {
        outpatient: "05-10",
        ct: "05-12",
        pet: "05-13",
        pulmonary: "05-14",
        anesthesia: "05-16",
        mdt: "05-17",
        surgery: "06-01",
      },
      { surgery: "胸腔镜左肺下叶切除术进行中" }
    ),
    todos: [
      {
        id: "t1",
        title: "术中冰冻送检",
        subtitle: "病理科已待命，标本预计 11:20 送达",
        time: "进行中",
        priority: "high",
        icon: "activity",
      },
      {
        id: "t2",
        title: "家属手术进展通知",
        subtitle: "预计 12:30 第一台结束",
        priority: "medium",
        icon: "calendar",
      },
    ],
    imaging: [
      {
        id: "img1",
        type: "CT",
        title: "术前定位CT",
        date: "2026-05-12",
        previewUrl: CT_PREVIEW,
      },
      {
        id: "img2",
        type: "PET-CT",
        title: "全身PET-CT",
        date: "2026-05-13",
        previewUrl: CT_PREVIEW,
      },
    ],
  },
  {
    id: "PT-1003",
    name: "患者C",
    age: 65,
    gender: "M",
    diseaseCategory: "肺鳞癌",
    diagnosis: "右上肺鳞癌（IIIA期）",
    clinicalStage: "cT3N2M0 · IIIA",
    status: "Pathology",
    currentStatus: "discharged_waiting_pathology",
    riskLevel: "High",
    surgeryDate: "2026-05-18",
    phone: "136****3309",
    tasks: [],
    notifications: [
      notif("n1", "术后恢复中", "手术已完成，病理报告出具后医生将通知您制定后续方案。", "pathology"),
    ],
    surgery: { scheduledDate: "2026-05-18", inOR: false, completed: true, inICU: false, backToWard: true },
    pathology: { stage: "IIIA", pathologyType: "鳞癌", geneTest: true, chemo: true },
    followupPlan: createPendingFollowupPlan(),
    timeline: buildTimeline(
      "pathology",
      {
        outpatient: "05-08",
        ct: "05-10",
        pet: "05-12",
        pulmonary: "05-13",
        anesthesia: "05-14",
        mdt: "05-15",
        surgery: "05-18",
        pathology: "05-22",
      },
      { pathology: "等待淋巴结分期与PD-L1结果" }
    ),
    todos: [
      {
        id: "t1",
        title: "追踪病理正式报告",
        subtitle: "预计今日 16:00 病理科回报",
        time: "今日 16:00",
        priority: "high",
        icon: "file",
      },
      {
        id: "t2",
        title: "术后第4天胸片",
        subtitle: "评估肺复张与引流情况",
        time: "明日 08:00",
        priority: "medium",
        icon: "image",
      },
      {
        id: "t3",
        title: "肿瘤内科MDT预约",
        subtitle: "辅助治疗方案讨论",
        priority: "high",
        icon: "calendar",
      },
    ],
    imaging: [
      {
        id: "img1",
        type: "PET-CT",
        title: "新辅助后PET-CT复评",
        date: "2026-05-12",
        previewUrl: CT_PREVIEW,
      },
    ],
  },
  {
    id: "PT-1004",
    name: "患者D",
    age: 22,
    gender: "M",
    diseaseCategory: "微浸润腺癌",
    diagnosis: "左下肺混合磨玻璃结节（MIA倾向）",
    clinicalStage: "cT1miN0M0 · IA1",
    status: "Pre-op",
    currentStatus: "doctor_review",
    riskLevel: "Low",
    surgeryDate: "2026-06-04",
    phone: "186****1024",
    inpatientNo: "20260522004",
    flags: { readyForSurgeryReview: true },
    tasks: COMPLETED_PREOP_TASKS,
    notifications: [
      notif("n1", "检查已同步", "您完成的术前检查项目已同步至医生端，请等待医生审核并安排手术。", "exam"),
      notif("n2", "术前准备提醒", "请术前 8 小时禁食禁饮，按医嘱停用抗凝药物。", "surgery"),
    ],
    surgery: defaultSurgery("2026-06-04"),
    pathology: defaultPathology(),
    followupPlan: createPendingFollowupPlan(),
    timeline: buildTimeline(
      "mdt",
      {
        outpatient: "05-10",
        ct: "05-14",
        pulmonary: "05-18",
        anesthesia: "05-20",
        mdt: "05-22",
      },
      { mdt: "讨论亚肺叶切除范围与冰冻策略" }
    ),
    todos: [
      {
        id: "t1",
        title: "参加今日MDT",
        subtitle: "胸外科会议室 B，14:00",
        time: "今日 14:00",
        priority: "high",
        icon: "calendar",
      },
      {
        id: "t2",
        title: "术前肺功能复查",
        subtitle: "年轻患者仍须确认FEV1 > 80%",
        priority: "low",
        icon: "activity",
      },
    ],
    imaging: [
      {
        id: "img1",
        type: "CT",
        title: "高分辨率CT",
        date: "2026-05-14",
        previewUrl: CT_PREVIEW,
      },
    ],
  },
  {
    id: "PT-1005",
    name: "患者E",
    age: 71,
    gender: "F",
    diseaseCategory: "肺腺癌",
    diagnosis: "右中叶肺腺癌（IA期）",
    clinicalStage: "pT1bN0M0 · IA2",
    status: "Follow-up",
    currentStatus: "in_followup",
    riskLevel: "Medium",
    surgeryDate: "2026-05-10",
    phone: "137****6612",
    tasks: [],
    notifications: [
      notif("n1", "请按随访计划复诊", "今日门诊随访，请携带出院小结与用药清单。", "followup"),
    ],
    surgery: { scheduledDate: "2026-05-10", completed: true, backToWard: true },
    pathology: { pathologyType: "浸润性腺癌", stage: "IA", geneTest: false, chemo: false },
    followupPlan: {
      templateName: "IA期标准随访",
      nextVisitDate: "2026-06-01",
      nextExam: "胸部CT",
      needsChemo: false,
      needsGeneTest: false,
      needsTargeted: false,
      needsImmunotherapy: false,
      doctorNote: "IA期术后规律影像随访，关注肺功能与营养状态。",
      items: [
        { id: "fu-1", title: "今日门诊随访", dueDate: "2026-06-01", type: "visit" },
        { id: "fu-2", title: "复查胸部CT", dueDate: "2026-06-01", type: "imaging" },
      ],
    },
    timeline: buildTimeline(
      "followup",
      {
        outpatient: "05-01",
        ct: "05-03",
        pet: "05-05",
        pulmonary: "05-07",
        anesthesia: "05-08",
        mdt: "05-09",
        surgery: "05-10",
        pathology: "05-14",
        postop: "05-18",
        followup: "05-22",
      },
      { followup: "术后30天复查，评估辅助化疗耐受性" }
    ),
    todos: [
      {
        id: "t1",
        title: "今日门诊随访",
        subtitle: "携带出院小结与用药清单",
        time: "今日 09:30",
        priority: "high",
        icon: "calendar",
      },
      {
        id: "t2",
        title: "复查胸部CT",
        subtitle: "门诊放射科，空腹不必",
        time: "今日 10:15",
        priority: "medium",
        icon: "image",
      },
    ],
    imaging: [
      {
        id: "img1",
        type: "CT",
        title: "术后30天复查CT",
        date: "2026-05-22",
        previewUrl: CT_PREVIEW,
      },
    ],
  },
  {
    id: "PT-1006",
    name: "患者F",
    age: 55,
    gender: "M",
    diseaseCategory: "围术期肺癌",
    diagnosis: "右上肺中央型肺癌（IIIA期，围术期管理）",
    clinicalStage: "ycT3N2M0 · IIIA",
    status: "Pre-op",
    currentStatus: "exam_in_progress",
    riskLevel: "High",
    surgeryDate: "2026-06-06",
    flags: { overdue: true },
    phone: "135****7788",
    tasks: DEFAULT_PREOP_TASKS.map((t, i) => ({ ...t, completed: i < 1 })),
    notifications: [
      notif("n1", "检查超时提醒", "肺功能检查已超期 2 天，请尽快完成或联系护士站。", "exam"),
    ],
    surgery: defaultSurgery("2026-06-06"),
    pathology: defaultPathology(),
    followupPlan: createPendingFollowupPlan(),
    timeline: buildTimeline(
      "anesthesia",
      {
        outpatient: "04-28",
        ct: "05-02",
        pet: "05-10",
        pulmonary: "05-15",
        mdt: "05-18",
      },
      {
        anesthesia: "ICU备床评估与VTE风险分层",
      }
    ),
    todos: [
      {
        id: "t1",
        title: "ICU术前评估签字",
        subtitle: "高危路径，需麻醉+ICU双签",
        time: "今日 11:00",
        priority: "high",
        icon: "file",
      },
      {
        id: "t2",
        title: "备血4U完成交叉配血",
        subtitle: "输血科已受理",
        priority: "high",
        icon: "activity",
      },
      {
        id: "t3",
        title: "支气管镜定位",
        subtitle: "中央型病灶，建议术前行",
        time: "05-25",
        priority: "medium",
        icon: "image",
      },
    ],
    imaging: [
      {
        id: "img1",
        type: "CT",
        title: "新辅助后增强CT",
        date: "2026-05-02",
        previewUrl: CT_PREVIEW,
      },
      {
        id: "img2",
        type: "PET-CT",
        title: "疗效评估PET-CT",
        date: "2026-05-10",
        previewUrl: CT_PREVIEW,
      },
    ],
  },
  {
    id: "PT-1007",
    name: "患者G",
    age: 48,
    gender: "F",
    diseaseCategory: "肺结节",
    diagnosis: "双肺多发磨玻璃结节（右肺主病灶）",
    clinicalStage: "cT1aN0M0 · 多原发待评估",
    status: "Pre-op",
    currentStatus: "pending_checkin",
    riskLevel: "High",
    surgeryDate: "2026-06-07",
    phone: "158****4421",
    tasks: DEFAULT_PREOP_TASKS,
    notifications: [],
    surgery: defaultSurgery("2026-06-07"),
    pathology: defaultPathology(),
    followupPlan: createPendingFollowupPlan(),
    timeline: buildTimeline(
      "outpatient",
      {
        outpatient: "05-06",
        ct: "05-12",
        pet: "05-16",
        pulmonary: "05-19",
        mdt: "05-22",
      },
      { mdt: "讨论分期手术与导航定位方案" }
    ),
    todos: [
      {
        id: "t1",
        title: "MDT纪要确认",
        subtitle: "主病灶优先右侧VATS",
        time: "今日 15:00",
        priority: "high",
        icon: "file",
      },
      {
        id: "t2",
        title: "术前导航定位预约",
        subtitle: "介入科 05-27 上午",
        priority: "medium",
        icon: "calendar",
      },
    ],
    imaging: [
      {
        id: "img1",
        type: "CT",
        title: "双肺HRCT",
        date: "2026-05-12",
        previewUrl: CT_PREVIEW,
      },
    ],
  },
  {
    id: "PT-1008",
    name: "患者H",
    age: 60,
    gender: "M",
    diseaseCategory: "肺鳞癌",
    diagnosis: "左上肺鳞癌（IIB期）",
    clinicalStage: "pT2bN1M0 · IIB",
    status: "Pathology",
    currentStatus: "pathology_reported",
    riskLevel: "High",
    surgeryDate: "2026-05-17",
    phone: "133****9901",
    tasks: [],
    notifications: [
      notif("n1", "病理结果已回报", "术后病理结果已由医生团队收到，将为您制定个体化随访方案。", "pathology"),
    ],
    surgery: { scheduledDate: "2026-05-17", completed: true, backToWard: true },
    pathology: {
      pathologyType: "鳞癌",
      stage: "IIB",
      geneTest: true,
      chemo: true,
      immunotherapy: false,
      reportedAt: "2026-05-22",
    },
    followupPlan: createPendingFollowupPlan(),
    timeline: buildTimeline(
      "pathology",
      {
        outpatient: "05-07",
        ct: "05-09",
        pet: "05-11",
        pulmonary: "05-13",
        anesthesia: "05-14",
        mdt: "05-15",
        surgery: "05-17",
        pathology: "05-22",
      },
      { pathology: "鳞癌病理分期与PD-L1检测中" }
    ),
    todos: [
      {
        id: "t1",
        title: "肿瘤内科方案会诊",
        subtitle: "基于病理pT2N1，讨论辅助化疗",
        time: "今日 14:30",
        priority: "high",
        icon: "calendar",
      },
      {
        id: "t2",
        title: "伤口换药",
        subtitle: "胸外科门诊换药室",
        time: "今日 10:00",
        priority: "medium",
        icon: "activity",
      },
    ],
    imaging: [
      {
        id: "img1",
        type: "CT",
        title: "术后第5天胸片/CT",
        date: "2026-05-22",
        previewUrl: CT_PREVIEW,
      },
    ],
  },
];

export function getPatientById(id: string): Patient | undefined {
  return mockPatients.find((p) => p.id === id);
}

/** 将旧版 localStorage 数据补齐为新 schema */
export function migratePatient(patient: Patient): Patient {
  const base = mockPatients.find((p) => p.id === patient.id);
  return {
  ...(base ?? mockPatients[0]),
  ...patient,
  currentStatus:
    patient.currentStatus ?? base?.currentStatus ?? "exam_in_progress",
  tasks: patient.tasks?.length ? patient.tasks : (base?.tasks ?? DEFAULT_PREOP_TASKS),
  notifications: patient.notifications ?? base?.notifications ?? [],
  surgery: { ...(base?.surgery ?? defaultSurgery()), ...patient.surgery },
  pathology: { ...(base?.pathology ?? defaultPathology()), ...patient.pathology },
  followupPlan: patient.followupPlan ?? base?.followupPlan ?? createPendingFollowupPlan(),
  flags: patient.flags ?? base?.flags,
  };
}
