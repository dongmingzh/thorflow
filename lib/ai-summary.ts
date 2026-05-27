import type { Patient, PatientAIContent } from "./mock-data";
import { getCurrentTimelineNode } from "./workflow";

const AI_CONTENT: Record<string, Partial<PatientAIContent>> = {
  "PT-1001": {
    caseSummary:
      "58 岁男性，右上肺混合磨玻璃结节，影像学倾向 IA 期肺腺癌。已完成增强 CT 与肺功能，当前卡在麻醉评估节点，围术期风险可控。",
    perioperativeAdvice:
      "建议 05-22 行胸腔镜肺段切除；术前 24h 停用抗凝，麻醉科重点评估 FEV1 与屏气试验，MDT 已隐含在流程中可快速补录。",
    pathologyFocus:
      "术后需明确浸润深度、切缘及脉管侵犯；若为微浸润成分为主，可豁免辅助化疗。",
    dischargeGuidance:
      "预计术后 3–4 天出院；出院后 2 周门诊复查胸片，6 周内避免重体力劳动与吸烟环境暴露。",
  },
  "PT-1002": {
    caseSummary:
      "42 岁女性，左下肺腺癌 IA 期，低风险 profile。术前评估已全部完成，当前处于手术执行阶段。",
    perioperativeAdvice:
      "优先单孔 VATS 左下叶切除；术中冰冻建议常规；注意保护下肺静脉分支，预计手术时长 90–120 分钟。",
    pathologyFocus:
      "关注贴壁生长比例与 STAS；若确认为纯贴壁型腺癌，分期可能进一步下调。",
    dischargeGuidance:
      "术后早期下床活动；疼痛管理以多模式镇痛为主；出院后 1 个月复查 CT。",
  },
  "PT-1003": {
    caseSummary:
      "65 岁男性，右上肺鳞癌 IIIA 期，高危。新辅助评估后已手术，当前等待病理与淋巴结分期以决定辅助治疗。",
    perioperativeAdvice:
      "术后需密切监测引流与肺功能；考虑 ICU 过渡观察；营养支持与咳痰训练从术后第 1 天开始。",
    pathologyFocus:
      "淋巴结转移数目决定辅助方案；PD-L1 与驱动基因状态将影响免疫/靶向选择。",
    dischargeGuidance:
      "住院时间可能延长至 7–10 天；出院后 2 周内肿瘤内科 MDT 复诊，制定辅助放化疗计划。",
  },
  "PT-1004": {
    caseSummary:
      "22 岁男性，左下肺混合 GGO，高度怀疑微浸润腺癌（MIA）。年轻、肺功能储备佳，微创适应症明确。",
    perioperativeAdvice:
      "推荐亚肺叶切除（楔形/段切）以最大化保留肺功能；术前无需 PET-CT 可标记为已完成筛查路径。",
    pathologyFocus:
      "冰冻与石蜡需一致判定 MIA；若证实浸润灶 ≤5mm，5 年生存率接近 100%。",
    dischargeGuidance:
      "术后恢复快，预计 2–3 天出院；强调终身随访虽间隔可放宽，但需戒烟与年度低剂量 CT。",
  },
  "PT-1005": {
    caseSummary:
      "71 岁女性，右中叶 IA 期肺腺癌，中等风险。高龄但生活自理，术前谈话与签字为当前节点。",
    perioperativeAdvice:
      "术中注意心律监测；麻醉方案倾向保留自主呼吸或双腔支气管插管；术后谵妄预防纳入路径。",
    pathologyFocus:
      "老年患者病理亚型影响辅助决策；若低分化成分 >20% 需讨论辅助化疗耐受性。",
    dischargeGuidance:
      "建议家属参与出院教育；居家氧疗指征个体化；2 周内心内科协同评估基础病用药。",
  },
  "PT-1006": {
    caseSummary:
      "55 岁男性，右上肺中央型肺癌 IIIA，围术期肺癌管理路径。新辅助与 PET 复评已完成，麻醉/ICU 评估为当前瓶颈。",
    perioperativeAdvice:
      "根治性右肺上叶切除 + 系统性淋巴结清扫；备血 4U；术中支气管镜定位；术后 VTE 预防强化。",
    pathologyFocus:
      "ypTNM 分期决定后续免疫维持；需同步送检驱动基因与 PD-L1。",
    dischargeGuidance:
      "围术期并发症风险高；出院标准需满足引流量、活动耐量与营养指标三重门槛。",
  },
  "PT-1007": {
    caseSummary:
      "48 岁女性，双肺多发 GGO，右肺主病灶 IA 期倾向。MDT 讨论中，需权衡分期手术与主病灶优先策略。",
    perioperativeAdvice:
      "建议先行右侧 VATS；左侧病灶随访或二期处理；术中导航定位推荐。",
    pathologyFocus:
      "多原发 vs 转移鉴别依赖病理分子检测；各灶独立分期记录。",
    dischargeGuidance:
      "一期术后按主病灶方案随访；对侧结节随访间隔 3–6 个月 HRCT。",
  },
  "PT-1008": {
    caseSummary:
      "60 岁男性，左上肺鳞癌 IIB 期，术后第 5 天。病理与基因检测回报中，即将进入辅助治疗决策。",
    perioperativeAdvice:
      "术后胸腔引流管理达标；疼痛控制良好后可开始术前康复训练反向应用于术后恢复。",
    pathologyFocus:
      "鳞癌常规检测 PD-L1；若淋巴结阳性，辅助化疗 ± 放疗指征明确。",
    dischargeGuidance:
      "若辅助方案确定，出院后 3–4 周内启动；伤口护理与呼吸康复操每日 2 次。",
  },
};

const RISK_LABELS = { Low: "低", Medium: "中", High: "高" } as const;

function generateDynamicAI(patient: Patient): PatientAIContent {
  const current = getCurrentTimelineNode(patient.timeline);
  const stage = patient.clinicalStage ?? "待分期";
  const nodeTitle = current?.title ?? patient.status;

  const riskAlert =
    patient.riskLevel === "High"
      ? `⚠ 高风险患者：${patient.name}（${stage}）需优先处理 ${nodeTitle} 节点，建议今日内完成关键评估。`
      : patient.riskLevel === "Medium"
        ? `中等风险：关注 ${nodeTitle} 进度，确保术前/术后关键检查不遗漏。`
        : `低风险路径：${nodeTitle} 可按标准流程推进，注意常规随访节点。`;

  const followupReminder =
    patient.status === "Follow-up"
      ? `随访提醒：${patient.name} 处于长期随访阶段，建议每 3–6 个月 HRCT，术后 2 年内每 3 个月门诊。`
      : patient.status === "Pathology"
        ? `病理回报后 2 周内安排 MDT，确定辅助治疗方案并预约首次随访。`
        : `预计 ${patient.surgeryDate ?? "手术日"} 后 30 天首次随访，AI 将自动生成复查清单。`;

  return {
    caseSummary: `${patient.age} 岁${patient.gender === "M" ? "男性" : "女性"}，${patient.diagnosis}（${stage}）。当前处于 ${patient.status} 阶段，流程节点：${nodeTitle}。${patient.medicalHistory ? ` 病史：${patient.medicalHistory.slice(0, 60)}…` : ""}`,
    perioperativeAdvice:
      patient.preopPlan ||
      `基于 ${patient.diseaseCategory} 与 ${RISK_LABELS[patient.riskLevel]}风险分层，建议优先完成 ${nodeTitle}。${patient.riskLevel === "High" ? " 高危路径需 ICU/备血/VTE 预防评估。" : " 可按标准微创路径推进。"}`,
    pathologyFocus:
      patient.status === "Pathology" || patient.status === "Follow-up"
        ? `重点追踪淋巴结分期、pTNM、切缘、脉管/LVI、STAS 及 PD-L1/驱动基因；${patient.diseaseCategory.includes("鳞") ? "鳞癌关注 PD-L1 与辅助化疗指征。" : "腺癌关注浸润深度与贴壁比例。"}`
        : `术后需明确病理亚型与分期，为辅助治疗方案提供依据。`,
    dischargeGuidance:
      patient.status === "Follow-up"
        ? `已完成主要治疗，强调呼吸康复、营养支持与戒烟；${patient.age > 65 ? "高龄患者需家属参与出院后管理。" : "年轻患者可适度早期活动。"}`
        : `预计术后 3–7 天出院；出院后 2 周胸片，6 周内避免重体力劳动。`,
    followupReminder,
    riskAlert,
  };
}

export function getPatientAIContent(patient: Patient): PatientAIContent {
  const preset = AI_CONTENT[patient.id];
  const dynamic = generateDynamicAI(patient);

  if (!preset) return dynamic;

  return {
    caseSummary: preset.caseSummary ?? dynamic.caseSummary,
    perioperativeAdvice: preset.perioperativeAdvice ?? dynamic.perioperativeAdvice,
    pathologyFocus: preset.pathologyFocus ?? dynamic.pathologyFocus,
    dischargeGuidance: preset.dischargeGuidance ?? dynamic.dischargeGuidance,
    followupReminder: dynamic.followupReminder,
    riskAlert: dynamic.riskAlert,
  };
}

export function getWorkflowAISummary(
  workflowType: "preop" | "surgery" | "pathology" | "followup",
  count: number
): string {
  const summaries: Record<typeof workflowType, string> = {
    preop: `当前 ${count} 例患者处于术前评估队列。AI 建议优先处理高风险与手术日临近病例；麻醉评估与 MDT 节点是主要瓶颈。`,
    surgery: `今日手术台次 ${count} 例。AI 提示关注 VATS 路径准备、术中冰冻与出血预案；预计平均手术时长 110 分钟。`,
    pathology: `${count} 例待病理回报。AI 将重点标注淋巴结分期、驱动基因与 PD-L1，辅助 MDT 制定辅助方案。`,
    followup: `今日随访 ${count} 例。AI 已按复发风险分层生成问卷与复查提醒，优先随访术后 30 天内患者。`,
  };
  return summaries[workflowType];
}
