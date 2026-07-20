"use client";

import { Bell, Plus, Search, Smartphone } from "lucide-react";
import Link from "next/link";

import { DataActions } from "@/components/dashboard/data-actions";

interface DashboardHeaderProps {
  title: string;
  subtitle: string;
  backHref?: string;
  onAddPatient?: () => void;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
}

export function DashboardHeader({
  title,
  subtitle,
  backHref,
  onAddPatient,
  searchQuery = "",
  onSearchChange,
}: DashboardHeaderProps) {
  return (
    <header className="mb-5 flex flex-wrap items-center justify-between gap-4">
      <div>
        {backHref && (
          <Link
            href={backHref}
            className="mb-2 inline-block text-sm text-muted hover:text-foreground"
          >
            ← 返回总览
          </Link>
        )}
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          {title}
        </h1>
        <p className="mt-1 text-sm text-muted">{subtitle}</p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        {onSearchChange && (
          <div className="relative hidden sm:block">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="搜索患者、ID、诊断..."
              className="w-64 rounded-full border border-border bg-card py-2 pl-11 pr-4 text-sm outline-none transition focus:ring-4 focus:ring-primary/20"
            />
          </div>
        )}
        <DataActions />
        <Link
          href="/patient-mini"
          className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-4 py-2 text-sm font-medium text-teal-700 transition hover:bg-teal-100"
        >
          <Smartphone className="h-4 w-4" />
          患者小程序
        </Link>
        {onAddPatient && (
          <button
            type="button"
            onClick={onAddPatient}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            新增患者
          </button>
        )}
        <button
          type="button"
          className="rounded-full border border-border bg-card p-2.5 transition hover:bg-primary-light"
        >
          <Bell className="h-5 w-5 text-muted" />
        </button>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-light text-sm font-semibold text-primary">
          MD
        </div>
      </div>
    </header>
  );
}
