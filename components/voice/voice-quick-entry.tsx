"use client";

import { motion } from "framer-motion";
import { Mic, Square, Wand2 } from "lucide-react";

import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";

import { VoiceWaveform } from "./voice-waveform";

interface VoiceQuickEntryProps {
  onFillNotes: (text: string) => void;
}

export function VoiceQuickEntry({ onFillNotes }: VoiceQuickEntryProps) {
  const {
    isListening,
    isSupported,
    displayText,
    transcript,
    start,
    stop,
    reset,
  } = useSpeechRecognition();

  const handleFill = () => {
    if (transcript) onFillNotes(transcript);
  };

  return (
    <div className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary-light/60 to-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-foreground">语音快速建档</h3>
          <p className="mt-0.5 text-sm text-muted">
            口述患者信息，实时转写后一键填入备注
          </p>
        </div>
        {isListening && (
          <motion.span
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="rounded-full bg-primary/20 px-3 py-1 text-xs font-medium text-primary"
          >
            正在聆听…
          </motion.span>
        )}
      </div>

      {!isSupported ? (
        <p className="text-sm text-muted">
          当前浏览器不支持 Web Speech API，请使用 Chrome 或 Edge。
        </p>
      ) : (
        <>
          <div className="mb-4 flex items-center gap-3">
            {!isListening ? (
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={start}
                className="inline-flex items-center gap-2 rounded-2xl bg-primary px-5 py-2.5 text-sm font-medium text-white shadow-sm"
              >
                <Mic className="h-4 w-4" />
                开始录音
              </motion.button>
            ) : (
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={stop}
                className="inline-flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-2.5 text-sm font-medium text-rose-600"
              >
                <Square className="h-4 w-4 fill-current" />
                停止
              </motion.button>
            )}
            {transcript && (
              <button
                type="button"
                onClick={reset}
                className="text-sm text-muted hover:text-foreground"
              >
                清空
              </button>
            )}
          </div>

          <div
            className={`min-h-[80px] rounded-2xl border p-4 transition-colors ${
              isListening
                ? "border-primary/30 bg-primary-light/30"
                : "border-border bg-slate-50/80"
            }`}
          >
            {isListening && (
              <div className="mb-3">
                <VoiceWaveform active />
              </div>
            )}
            <p className="text-sm leading-relaxed text-foreground">
              {displayText || (
                <span className="text-muted">
                  例如：「患者右上肺磨玻璃结节，既往高血压，计划胸腔镜肺段切除」
                </span>
              )}
            </p>
          </div>

          {transcript && (
            <motion.button
              type="button"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={handleFill}
              className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-primary-light px-4 py-2.5 text-sm font-medium text-primary transition hover:bg-primary/20"
            >
              <Wand2 className="h-4 w-4" />
              一键填入备注
            </motion.button>
          )}
        </>
      )}
    </div>
  );
}
