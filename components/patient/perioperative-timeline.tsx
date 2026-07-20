"use client";

import { Plus } from "lucide-react";
import { useState } from "react";

import { TimelineNodeCard } from "@/components/patient/timeline-node";
import { usePatientTimeline } from "@/components/providers/patient-workflow-provider";

interface PerioperativeTimelineProps {
  patientId: string;
}

export function PerioperativeTimeline({ patientId }: PerioperativeTimelineProps) {
  const { timeline, advance, updateNode, addNode, deleteNode } =
    usePatientTimeline(patientId);
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState("");

  const handleAdd = () => {
    if (!newTitle.trim()) return;
    addNode({ title: newTitle.trim(), status: "pending" });
    setNewTitle("");
    setShowAdd(false);
  };

  return (
    <div>
      <div className="relative ml-4 space-y-3 border-l-2 border-border pl-9">
        {timeline.map((node) => (
          <TimelineNodeCard
            key={node.id}
            node={node}
            onAdvance={() => advance(node.id)}
            onUpdate={(updates) => updateNode(node.id, updates)}
            onDelete={() => deleteNode(node.id)}
          />
        ))}
      </div>

      <div className="ml-14 mt-6">
        {showAdd ? (
          <div className="flex gap-2">
            <input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="新节点名称"
              className="flex-1 rounded-xl border border-border px-3 py-2 text-sm"
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            />
            <button
              type="button"
              onClick={handleAdd}
              className="rounded-xl bg-primary px-4 py-2 text-sm text-white"
            >
              添加
            </button>
            <button
              type="button"
              onClick={() => setShowAdd(false)}
              className="rounded-xl border border-border px-3 py-2 text-sm"
            >
              取消
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowAdd(true)}
            className="inline-flex items-center gap-2 rounded-2xl border border-dashed border-border px-4 py-2.5 text-sm text-muted transition hover:border-primary hover:text-primary"
          >
            <Plus className="h-4 w-4" />
            新增节点
          </button>
        )}
      </div>
    </div>
  );
}
