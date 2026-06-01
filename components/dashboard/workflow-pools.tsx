"use client";

import { motion } from "framer-motion";
import { ChevronRight, Layers } from "lucide-react";
import Link from "next/link";

import { PatientCard } from "@/components/dashboard/patient-card";
import { usePatients } from "@/components/providers/patient-workflow-provider";
import type { Patient } from "@/lib/mock-data";
import {
  groupPatientsByPool,
  WORKFLOW_POOL_CONFIG,
  type WorkflowPoolKey,
} from "@/lib/workflow-engine";

export function WorkflowPools() {
  const { patients } = usePatients();
  const pools = groupPatientsByPool(patients);

  const activePools = WORKFLOW_POOL_CONFIG.filter(
    (cfg) => pools[cfg.key].length > 0
  );

  if (activePools.length === 0) return null;

  return (
    <section className="mb-10">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-primary-light p-2.5 text-primary">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              胸外科流程池
            </h2>
            <p className="text-sm text-muted">
              Workflow Engine 驱动的患者状态分组 · 点击卡片进入患者详情
            </p>
          </div>
        </div>
        <Link
          href="/patient-mini"
          className="rounded-2xl border border-primary/30 bg-primary-light px-4 py-2 text-sm font-medium text-primary transition hover:bg-primary/10"
        >
          打开患者小程序模拟端 →
        </Link>
      </div>

      <div className="space-y-8">
        {activePools.map((cfg, poolIndex) => {
          const list = pools[cfg.key];
          return (
            <motion.div
              key={cfg.key}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: poolIndex * 0.04 }}
              className="rounded-3xl border border-border bg-card/60 p-5 shadow-sm"
            >
              <PoolHeader cfg={cfg} count={list.length} />
              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {list.slice(0, 3).map((patient, i) => (
                  <PatientCard key={patient.id} patient={patient} index={i} />
                ))}
              </div>
              {list.length > 3 && (
                <p className="mt-3 text-center text-xs text-muted">
                  另有 {list.length - 3} 例 ·{" "}
                  {cfg.href ? (
                    <Link href={cfg.href} className="text-primary hover:underline">
                      查看完整队列
                    </Link>
                  ) : (
                    "可在对应 workflow 页查看"
                  )}
                </p>
              )}
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

function PoolHeader({
  cfg,
  count,
}: {
  cfg: (typeof WORKFLOW_POOL_CONFIG)[number];
  count: number;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-foreground">{cfg.title}</h3>
          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-muted">
            {count}
          </span>
        </div>
        <p className="mt-1 text-sm text-muted">{cfg.description}</p>
      </div>
      {cfg.href && (
        <Link
          href={cfg.href}
          className="flex shrink-0 items-center gap-1 text-sm text-primary hover:underline"
        >
          进入队列
          <ChevronRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}

export function getPoolPatientCount(
  pools: Record<WorkflowPoolKey, Patient[]>,
  key: WorkflowPoolKey
): number {
  return pools[key]?.length ?? 0;
}
