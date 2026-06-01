"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Hospital } from "lucide-react";

import { usePatientWorkflow } from "@/components/providers/patient-workflow-provider";
import { useMiniPatient } from "@/components/patient-mini/use-mini-patient";

export function CheckinForm() {
  const { patientId } = useMiniPatient();
  const { pushNotificationFromTemplate, updateCurrentStatus, updatePatient } =
    usePatientWorkflow();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    inpatientNo: "",
    idLast4: "",
    history: "",
    allergy: "无",
    smoking: "否",
    contact: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updatePatient(patientId, {
      name: form.name || "新报道患者",
      phone: form.phone,
      inpatientNo: form.inpatientNo,
      medicalHistory: form.history,
      currentStatus: "checked_in",
    });
    updateCurrentStatus(patientId, "checked_in", "患者扫码完成入院报道");
    pushNotificationFromTemplate(patientId, "checkin_success");
    pushNotificationFromTemplate(patientId, "doctor_received_checkin");
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="px-6 py-12 text-center"
      >
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h2 className="text-xl font-semibold text-slate-800">报道成功</h2>
        <p className="mt-2 text-sm text-slate-600">
          医生端已收到您的报道信息
        </p>
        <p className="mt-4 text-xs text-slate-500">
          请前往「待办」完成术前检查项目
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 px-5 py-6">
      <div className="mb-6 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-600">
          <Hospital className="h-6 w-6" />
        </div>
        <p className="text-xs text-slate-500">复旦大学附属中山医院</p>
        <h2 className="mt-1 text-lg font-semibold text-slate-800">
          胸外科患者报道
        </h2>
      </div>

      {(
        [
          ["name", "姓名", "请输入真实姓名"],
          ["phone", "手机号", "11 位手机号"],
          ["inpatientNo", "住院号", "住院号 / 门诊号"],
          ["idLast4", "身份证后四位", "0000"],
          ["history", "既往病史", "如：高血压、糖尿病"],
          ["allergy", "过敏史", "无 / 青霉素等"],
          ["smoking", "吸烟史", "否 / 已戒 / 是"],
          ["contact", "家属联系方式", "姓名 + 电话"],
        ] as const
      ).map(([key, label, placeholder]) => (
        <label key={key} className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-700">
            {label}
          </span>
          <input
            value={form[key]}
            onChange={(e) =>
              setForm((f) => ({ ...f, [key]: e.target.value }))
            }
            placeholder={placeholder}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
          />
        </label>
      ))}

      <button
        type="submit"
        className="mt-4 w-full rounded-2xl bg-teal-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-teal-600/30 transition hover:bg-teal-700"
      >
        提交报道
      </button>
    </form>
  );
}
