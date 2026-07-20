"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, Smartphone } from "lucide-react";

import { MiniTabBar } from "@/components/patient-mini/mini-tab-bar";
import { DEMO_MINI_PATIENT_ID } from "@/lib/mock-data";

interface MiniShellProps {
  children: ReactNode;
  title?: string;
  showBack?: boolean;
  backHref?: string;
  hideTab?: boolean;
  patientId?: string;
}

export function MiniShell({
  children,
  title,
  showBack,
  backHref = "/patient-mini",
  hideTab,
  patientId = DEMO_MINI_PATIENT_ID,
}: MiniShellProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 via-slate-50 to-slate-100 py-6 md:py-10">
      <div className="mx-auto mb-4 flex max-w-[430px] items-center justify-between px-4">
        <Link
          href="/dashboard"
          className="text-xs text-muted transition hover:text-primary"
        >
          ← 返回医生端
        </Link>
        <span className="flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1 text-xs text-muted shadow-sm">
          <Smartphone className="h-3.5 w-3.5" />
          患者小程序模拟 · {patientId}
        </span>
      </div>

      <div className="mx-auto flex w-full max-w-[430px] flex-col overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white shadow-2xl shadow-slate-300/40">
        {(title || showBack) && (
          <header className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
            {showBack && (
              <Link
                href={backHref}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-50 text-slate-600"
              >
                <ArrowLeft className="h-4 w-4" />
              </Link>
            )}
            {title && (
              <h1 className="text-lg font-semibold text-slate-800">{title}</h1>
            )}
          </header>
        )}
        <main className={`min-h-[70vh] ${hideTab ? "pb-6" : ""}`}>
          {children}
        </main>
        {!hideTab && <MiniTabBar patientId={patientId} />}
      </div>
    </div>
  );
}
