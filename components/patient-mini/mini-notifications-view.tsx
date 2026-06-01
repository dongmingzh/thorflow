"use client";

import { Bell } from "lucide-react";

import { useMiniPatient } from "@/components/patient-mini/use-mini-patient";
import { cn } from "@/lib/utils";

const DEMO_NOTIFICATIONS = [
  { title: "您的手术已安排", body: "请按医嘱做好术前准备，术前 8 小时禁食禁饮。" },
  { title: "患者已进入手术室", body: "家属请在等候区耐心等待，护士会及时通报进展。" },
  { title: "手术已完成，已转入监护室观察", body: "医护团队将密切监测您的恢复情况。" },
  { title: "已转回病房", body: "请按护士指导进行术后早期活动与呼吸锻炼。" },
  { title: "病理结果已回报", body: "医生将为您制定个体化随访与治疗方案。" },
  { title: "请按随访计划复诊", body: "携带出院小结与近期检查资料按时复诊。" },
];

export function MiniNotificationsView() {
  const { patient } = useMiniPatient();

  const list =
    patient && patient.notifications.length > 0
      ? patient.notifications
      : DEMO_NOTIFICATIONS.map((n, i) => ({
          id: `demo-${i}`,
          title: n.title,
          body: n.body,
          createdAt: new Date().toISOString(),
          read: i > 2,
          category: "general" as const,
        }));

  return (
    <div className="px-5 py-6">
      <h2 className="text-lg font-semibold text-slate-800">消息通知</h2>
      <p className="mt-1 text-sm text-slate-500">来自医护团队的重要提醒</p>

      <ul className="mt-5 space-y-3">
        {list.map((n) => (
          <li
            key={n.id}
            className={cn(
              "rounded-2xl border p-4",
              n.read
                ? "border-slate-100 bg-white"
                : "border-teal-100 bg-teal-50/30"
            )}
          >
            <div className="flex gap-3">
              <div className="rounded-xl bg-teal-100 p-2 text-teal-600">
                <Bell className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">
                  {n.title}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">
                  {n.body}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
