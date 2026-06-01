export interface PathologyInput {
  pathologyType: string;
  stage: string;
  geneTest: boolean;
  chemo: boolean;
  targeted: boolean;
  immunotherapy: boolean;
}

export interface FollowupPlanItem {
  id: string;
  title: string;
  dueDate: string;
  description?: string;
  type: "visit" | "imaging" | "lab" | "treatment" | "reminder";
}

export interface FollowupPlan {
  items: FollowupPlanItem[];
  nextVisitDate: string;
  nextExam?: string;
  needsChemo: boolean;
  needsGeneTest: boolean;
  needsTargeted: boolean;
  needsImmunotherapy: boolean;
  doctorNote: string;
  templateName: string;
}

function addMonths(base: Date, months: number): string {
  const d = new Date(base);
  d.setMonth(d.getMonth() + months);
  return d.toISOString().slice(0, 10);
}

const IA_TEMPLATE: Omit<FollowupPlan, "needsChemo" | "needsGeneTest" | "needsTargeted" | "needsImmunotherapy"> & {
  templateName: string;
} = {
  templateName: "IA期标准随访",
  nextVisitDate: "",
  nextExam: "胸部CT",
  doctorNote:
    "IA期术后以规律影像随访为主，关注第二原发灶与肺功能恢复，暂无需系统性辅助治疗。",
  items: [],
};

function buildIAPlan(baseDate: Date): FollowupPlan {
  return {
    ...IA_TEMPLATE,
    nextVisitDate: addMonths(baseDate, 1),
    needsChemo: false,
    needsGeneTest: false,
    needsTargeted: false,
    needsImmunotherapy: false,
    items: [
      {
        id: "fu-1",
        title: "术后1个月门诊复查",
        dueDate: addMonths(baseDate, 1),
        description: "评估切口愈合、肺功能与活动耐量",
        type: "visit",
      },
      {
        id: "fu-2",
        title: "术后3个月胸部CT",
        dueDate: addMonths(baseDate, 3),
        description: "基线术后复查，对比术前结节变化",
        type: "imaging",
      },
      {
        id: "fu-3",
        title: "术后6个月胸部CT",
        dueDate: addMonths(baseDate, 6),
        type: "imaging",
      },
      {
        id: "fu-4",
        title: "术后1年胸部CT",
        dueDate: addMonths(baseDate, 12),
        type: "imaging",
      },
    ],
  };
}

function buildIIIAPlan(
  baseDate: Date,
  input: PathologyInput
): FollowupPlan {
  return {
    templateName: "IIIA期强化随访",
    nextVisitDate: addMonths(baseDate, 1),
    nextExam: "胸部CT + 肿瘤标志物",
    needsChemo: input.chemo,
    needsGeneTest: input.geneTest,
    needsTargeted: input.targeted,
    needsImmunotherapy: input.immunotherapy,
    doctorNote:
      "IIIA期需密切随访辅助治疗耐受性与复发风险，按时完成基因检测与PD-L1评估。",
    items: [
      {
        id: "fu-1",
        title: "术后1个月评估恢复",
        dueDate: addMonths(baseDate, 1),
        description: "切口、引流、肺功能与营养状态",
        type: "visit",
      },
      {
        id: "fu-2",
        title: "术后辅助治疗提醒",
        dueDate: addMonths(baseDate, 1),
        description: input.chemo
          ? "按计划启动辅助化疗，注意骨髓抑制与肝肾功能"
          : "评估是否需要辅助治疗",
        type: "treatment",
      },
      {
        id: "fu-3",
        title: "基因检测 / PD-L1 提醒",
        dueDate: addMonths(baseDate, 2),
        description: "完善驱动基因与免疫标志物，指导靶向/免疫方案",
        type: "lab",
      },
      {
        id: "fu-4",
        title: "术后3个月胸部CT",
        dueDate: addMonths(baseDate, 3),
        type: "imaging",
      },
      {
        id: "fu-5",
        title: "化疗/免疫治疗节点提醒",
        dueDate: addMonths(baseDate, 4),
        description: "每周期前复查血常规、肝肾功能",
        type: "reminder",
      },
      {
        id: "fu-6",
        title: "术后6个月胸部CT",
        dueDate: addMonths(baseDate, 6),
        type: "imaging",
      },
    ],
  };
}

function buildIBPlan(baseDate: Date, input: PathologyInput): FollowupPlan {
  const plan = buildIAPlan(baseDate);
  plan.templateName = "IB期随访";
  plan.needsChemo = input.chemo;
  plan.doctorNote =
    "IB期根据高危因素评估辅助化疗，影像随访频率同IA期，必要时加做脑MRI。";
  if (input.chemo) {
    plan.items.push({
      id: "fu-chemo",
      title: "辅助化疗周期随访",
      dueDate: addMonths(baseDate, 2),
      type: "treatment",
    });
  }
  return plan;
}

export function generateFollowupPlanFromPathology(
  input: PathologyInput,
  baseDate: Date = new Date()
): FollowupPlan {
  const stage = input.stage.toUpperCase();
  if (stage.includes("IIIA") || stage.includes("IIIB") || stage === "IIIA") {
    return buildIIIAPlan(baseDate, input);
  }
  if (stage === "IB" || stage.includes("IB")) {
    return buildIBPlan(baseDate, input);
  }
  return buildIAPlan(baseDate);
}

export const PATHOLOGY_TYPE_OPTIONS = [
  "原位腺癌",
  "微浸润腺癌",
  "浸润性腺癌",
  "鳞癌",
] as const;

export const STAGE_OPTIONS = [
  "0期",
  "IA",
  "IB",
  "IIA",
  "IIB",
  "IIIA",
] as const;
