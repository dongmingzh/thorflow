export type NotificationCategory =
  | "surgery"
  | "exam"
  | "pathology"
  | "followup"
  | "general";

export interface NotificationTemplate {
  title: string;
  body: string;
  category: NotificationCategory;
}

const TEMPLATES: Record<string, NotificationTemplate> = {
  checkin_success: {
    title: "报道成功",
    body: "您已成功完成胸外科入院报道，医生将尽快审核您的信息。",
    category: "general",
  },
  doctor_received_checkin: {
    title: "医生已收到报道",
    body: "主治医生团队已收到您的报道信息，请留意后续检查安排。",
    category: "general",
  },
  exam_synced: {
    title: "检查已同步",
    body: "您完成的术前检查项目已同步至医生端，请等待医生审核。",
    category: "exam",
  },
  surgery_scheduled: {
    title: "手术已安排",
    body: "您的手术预计安排在 {date}，请按医嘱做好术前准备。",
    category: "surgery",
  },
  entered_or: {
    title: "已进入手术室",
    body: "您已进入手术室，家属请在等候区耐心等待，护士会及时通报进展。",
    category: "surgery",
  },
  surgery_completed_icu: {
    title: "手术已完成",
    body: "手术已完成，您已转入监护室观察，医护团队将密切监测恢复情况。",
    category: "surgery",
  },
  surgery_completed: {
    title: "手术已完成",
    body: "手术已顺利完成，医护团队正在进行术后复苏与病房/监护室交接。",
    category: "surgery",
  },
  transferred_icu: {
    title: "已转入监护室",
    body: "您已转入ICU/监护室观察，医护团队将持续监测生命体征和恢复情况。",
    category: "surgery",
  },
  back_to_ward: {
    title: "已转回病房",
    body: "您已从监护室转回普通病房，请按护士指导进行术后康复活动。",
    category: "surgery",
  },
  pathology_ready: {
    title: "病理结果已回报",
    body: "术后病理结果已由医生团队收到，将为您制定个体化随访与治疗方案。",
    category: "pathology",
  },
  followup_reminder: {
    title: "随访提醒",
    body: "请按随访计划复诊，携带出院小结与近期检查资料。",
    category: "followup",
  },
  followup_plan_ready: {
    title: "随访计划已生成",
    body: "医生已为您制定个体化随访计划，请在「随访」页查看下次复查安排。",
    category: "followup",
  },
  preop_prepare: {
    title: "术前准备提醒",
    body: "请术前 8 小时禁食禁饮，按医嘱停用抗凝药物，携带全部检查资料入院。",
    category: "surgery",
  },
};

export function getNotificationTemplate(key: string): NotificationTemplate {
  return (
    TEMPLATES[key] ?? {
      title: "系统通知",
      body: "您有一条新的医疗流程通知，请查看详情。",
      category: "general",
    }
  );
}

export function formatNotificationBody(
  key: string,
  vars: Record<string, string>
): string {
  let body = getNotificationTemplate(key).body;
  for (const [k, v] of Object.entries(vars)) {
    body = body.replace(`{${k}}`, v);
  }
  return body;
}

export const NOTIFICATION_TEMPLATE_KEYS = Object.keys(TEMPLATES);
