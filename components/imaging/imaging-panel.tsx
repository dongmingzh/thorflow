"use client";

import { useState } from "react";
import { ImageIcon } from "lucide-react";

import { CTPreviewModal } from "@/components/imaging/ct-preview-modal";
import type { ImagingStudy } from "@/lib/mock-data";

interface ImagingPanelProps {
  imaging: ImagingStudy[];
}

export function ImagingPanel({ imaging }: ImagingPanelProps) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<ImagingStudy | null>(null);

  const openStudy = (study: ImagingStudy) => {
    setActive(study);
    setOpen(true);
  };

  return (
    <>
      <div className="rounded-2xl border border-border bg-slate-50/80 p-5">
        <p className="mb-3 text-sm text-muted">影像资料</p>
        <div className="space-y-2">
          {imaging.map((study) => (
            <button
              key={study.id}
              type="button"
              onClick={() => openStudy(study)}
              className="flex w-full items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 text-left transition hover:border-primary hover:bg-primary-light/30"
            >
              <ImageIcon className="h-4 w-4 shrink-0 text-primary" />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">
                  {study.title}
                </p>
                <p className="text-xs text-muted">{study.date}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
      <CTPreviewModal
        open={open}
        onClose={() => setOpen(false)}
        study={active}
      />
    </>
  );
}
