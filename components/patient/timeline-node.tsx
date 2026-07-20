"use client";

import {
  CheckCircle2,
  Circle,
  Pencil,
  Trash2,
} from "lucide-react";
import { useState } from "react";

import type { TimelineNode } from "@/lib/mock-data";

interface TimelineNodeCardProps {
  node: TimelineNode;
  onAdvance: () => void;
  onUpdate: (updates: Partial<TimelineNode>) => void;
  onDelete: () => void;
}

export function TimelineNodeCard({
  node,
  onAdvance,
  onUpdate,
  onDelete,
}: TimelineNodeCardProps) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(node.title);
  const [description, setDescription] = useState(node.description ?? "");

  const saveEdit = () => {
    onUpdate({ title, description });
    setEditing(false);
  };

  return (
    <div className="relative">
      <div
        className={`absolute -left-[49px] flex h-8 w-8 items-center justify-center rounded-full border-2 bg-card ${
          node.status === "completed"
            ? "border-emerald-500 text-emerald-500"
            : node.status === "current"
              ? "border-primary text-primary"
              : "border-slate-300 text-slate-300"
        }`}
      >
        {node.status === "completed" ? (
          <CheckCircle2 className="h-5 w-5" />
        ) : (
          <Circle className="h-3 w-3 fill-current" />
        )}
      </div>

      <div
        className={`rounded-2xl border p-4 transition-all ${
          node.status === "current"
          ? "border-primary/30 bg-primary-light/30 shadow-sm"
          : "border-border bg-card/80"
        }`}
      >
        {editing ? (
          <div className="space-y-3">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-border px-3 py-2 text-sm"
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full rounded-xl border border-border px-3 py-2 text-sm"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={saveEdit}
                className="rounded-xl bg-primary px-3 py-1.5 text-xs font-medium text-white"
              >
                保存
              </button>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="rounded-xl border border-border px-3 py-1.5 text-xs"
              >
                取消
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex justify-between gap-4">
              <div>
                <h3 className="font-semibold text-foreground">{node.title}</h3>
                {node.description && (
                  <p className="mt-1 text-sm text-muted">{node.description}</p>
                )}
              </div>
              <div className="flex shrink-0 items-start gap-2">
                {node.date && (
                  <span className="text-sm text-muted">{node.date}</span>
                )}
                <button
                  type="button"
                  onClick={() => setEditing(true)}
                  className="rounded-lg p-1 text-muted hover:bg-slate-100 hover:text-primary"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={onDelete}
                  className="rounded-lg p-1 text-muted hover:bg-rose-50 hover:text-rose-500"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {node.status === "current" && (
                <button
                  type="button"
                  onClick={onAdvance}
                  className="rounded-xl bg-primary-light px-4 py-2 text-sm font-medium text-primary transition hover:bg-primary/20"
                >
                  标记完成
                </button>
              )}
              {node.status !== "current" && node.status !== "completed" && (
                <button
                  type="button"
                  onClick={() => onUpdate({ status: "current" })}
                  className="rounded-xl border border-border px-3 py-1.5 text-xs text-muted hover:border-primary hover:text-primary"
                >
                  设为当前
                </button>
              )}
              {node.status === "completed" && (
                <button
                  type="button"
                  onClick={() => onUpdate({ status: "pending" })}
                  className="rounded-xl border border-border px-3 py-1.5 text-xs text-muted"
                >
                  重置状态
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
