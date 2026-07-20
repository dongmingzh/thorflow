"use client";

import { Bell, CalendarHeart, CheckSquare, Home } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const tabs = [
  { href: "/patient-mini", label: "首页", icon: Home, exact: true },
  { href: "/patient-mini/tasks", label: "待办", icon: CheckSquare },
  { href: "/patient-mini/notifications", label: "通知", icon: Bell },
  { href: "/patient-mini/followup", label: "随访", icon: CalendarHeart },
];

interface MiniTabBarProps {
  patientId?: string;
}

export function MiniTabBar({ patientId }: MiniTabBarProps) {
  const pathname = usePathname();
  const q = patientId ? `?patient=${patientId}` : "";

  return (
    <nav className="sticky bottom-0 z-30 w-full border-t border-slate-100 bg-white/95 px-2 pb-[env(safe-area-inset-bottom)] backdrop-blur-md">
      <div className="flex items-stretch justify-around py-2">
        {tabs.map((tab) => {
          const active = tab.exact
            ? pathname === tab.href
            : pathname.startsWith(tab.href);
          const Icon = tab.icon;
          return (
            <Link
              key={tab.href}
              href={`${tab.href}${q}`}
              className={cn(
                "flex flex-1 flex-col items-center gap-0.5 rounded-2xl py-2 text-[11px] transition",
                active
                  ? "text-teal-600"
                  : "text-slate-400 hover:text-slate-600"
              )}
            >
              <Icon
                className={cn("h-5 w-5", active && "stroke-[2.5px]")}
              />
              <span className={cn("font-medium", active && "font-semibold")}>
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
