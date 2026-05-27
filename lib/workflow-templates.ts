import type { TimelineNode, WorkflowStage } from "./mock-data";

export type WorkflowTemplateId =
  | "nodule-preop"
  | "early-lung-cancer"
  | "neoadjuvant-surgery"
  | "postop-pathology"
  | "long-followup";

export interface WorkflowTemplate {
  id: WorkflowTemplateId;
  name: string;
  description: string;
  defaultStage: WorkflowStage;
  /** 初始 current 节点在 STANDARD_NODES 中的索引 */
  startIndex: number;
}

export const STANDARD_NODES = [
  { id: "outpatient", title: "门诊发现" },
  { id: "ct", title: "增强CT" },
  { id: "pet", title: "PET-CT" },
  { id: "pulmonary", title: "肺功能" },
  { id: "anesthesia", title: "麻醉评估" },
  { id: "mdt", title: "MDT" },
  { id: "surgery", title: "手术" },
  { id: "pathology", title: "病理" },
  { id: "postop", title: "术后方案" },
  { id: "followup", title: "随访" },
] as const;

export const WORKFLOW_TEMPLATES: WorkflowTemplate[] = [
  {
    id: "nodule-preop",
    name: "肺结节术前流程",
    description: "体检/门诊发现结节 → 影像评估 → 微创术前准备",
    defaultStage: "Pre-op",
    startIndex: 1,
  },
  {
    id: "early-lung-cancer",
    name: "早期肺癌围术期流程",
    description: "IA–IB 期标准围术期十节点路径",
    defaultStage: "Pre-op",
    startIndex: 4,
  },
  {
    id: "neoadjuvant-surgery",
    name: "新辅助后手术流程",
    description: "新辅助评估完成，进入 MDT 与手术决策",
    defaultStage: "Pre-op",
    startIndex: 5,
  },
  {
    id: "postop-pathology",
    name: "术后待病理流程",
    description: "手术已完成，等待病理与辅助方案",
    defaultStage: "Pathology",
    startIndex: 7,
  },
  {
    id: "long-followup",
    name: "长期随访流程",
    description: "术后进入长期复查与复发监测",
    defaultStage: "Follow-up",
    startIndex: 9,
  },
];

export function getTemplateById(
  id: WorkflowTemplateId
): WorkflowTemplate | undefined {
  return WORKFLOW_TEMPLATES.find((t) => t.id === id);
}

export function buildTimeline(
  currentIndex: number,
  descriptions: Partial<Record<string, string>> = {}
): TimelineNode[] {
  return STANDARD_NODES.map((node, index) => {
    let status: TimelineNode["status"] = "pending";
    if (index < currentIndex) status = "completed";
    else if (index === currentIndex) status = "current";

    return {
      id: node.id,
      title: node.title,
      status,
      description: descriptions[node.id],
    };
  });
}

export function createTimelineFromTemplate(
  templateId: WorkflowTemplateId
): TimelineNode[] {
  const template = getTemplateById(templateId);
  if (!template) return buildTimeline(0);
  return buildTimeline(template.startIndex);
}

export function inferStageFromTimeline(timeline: TimelineNode[]): WorkflowStage {
  const current = timeline.find((n) => n.status === "current");
  if (!current) {
    const allDone = timeline.every((n) => n.status === "completed");
    return allDone ? "Follow-up" : "Pre-op";
  }

  const preopIds = new Set([
    "outpatient",
    "ct",
    "pet",
    "pulmonary",
    "anesthesia",
    "mdt",
  ]);
  if (preopIds.has(current.id)) return "Pre-op";
  if (current.id === "surgery") return "Surgery";
  if (current.id === "pathology") return "Pathology";
  return "Follow-up";
}
