"use client";

import { X } from "lucide-react";
import Image from "next/image";

import { Modal } from "@/components/ui/modal";
import type { ImagingStudy } from "@/lib/mock-data";

interface CTPreviewModalProps {
  open: boolean;
  onClose: () => void;
  study: ImagingStudy | null;
}

export function CTPreviewModal({ open, onClose, study }: CTPreviewModalProps) {
  if (!study) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <div className="overflow-hidden rounded-3xl bg-slate-950 shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <div>
            <p className="text-sm text-slate-400">{study.type}</p>
            <h3 className="text-lg font-semibold text-white">{study.title}</h3>
            <p className="text-xs text-slate-500">{study.date}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-white/10 p-2 text-white transition hover:bg-white/20"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="relative aspect-[16/10] w-full bg-black">
          <Image
            src={study.previewUrl}
            alt={study.title}
            fill
            className="object-contain"
            unoptimized
          />
        </div>
        <div className="border-t border-white/10 px-6 py-3 text-xs text-slate-400">
          ThorFlow Imaging · AI 病灶标注预览（演示数据）
        </div>
      </div>
    </Modal>
  );
}
