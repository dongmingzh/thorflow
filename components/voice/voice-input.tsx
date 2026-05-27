"use client";

import { motion } from "framer-motion";
import { Mic, MicOff } from "lucide-react";

import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { cn } from "@/lib/utils";

import { VoiceWaveform } from "./voice-waveform";

interface VoiceInputProps {
  onTranscript?: (text: string) => void;
  className?: string;
  size?: "sm" | "md";
  placeholder?: string;
}

export function VoiceInput({
  onTranscript,
  className,
  size = "sm",
  placeholder = "点击麦克风开始语音输入",
}: VoiceInputProps) {
  const { isListening, isSupported, displayText, error, toggle } =
    useSpeechRecognition({
      onResult: (text, isFinal) => {
        if (isFinal) onTranscript?.(text);
      },
    });

  if (!isSupported) {
    return (
      <button
        type="button"
        disabled
        title="当前浏览器不支持语音识别"
        className={cn(
          "rounded-xl border border-border bg-slate-50 p-2 text-muted opacity-50",
          size === "sm" ? "p-2" : "p-3",
          className
        )}
      >
        <MicOff className={size === "sm" ? "h-4 w-4" : "h-5 w-5"} />
      </button>
    );
  }

  return (
    <div className={cn("relative", className)}>
      <motion.button
        type="button"
        onClick={toggle}
        whileTap={{ scale: 0.95 }}
        className={cn(
          "relative rounded-xl border transition-all",
          size === "sm" ? "p-2" : "p-3",
          isListening
            ? "border-primary bg-primary-light text-primary shadow-[0_0_0_4px_rgba(125,168,255,0.25)]"
            : "border-border bg-card text-muted hover:border-primary hover:text-primary"
        )}
        title={isListening ? "停止录音" : placeholder}
      >
        {isListening && (
          <motion.span
            className="absolute inset-0 rounded-xl bg-primary/20"
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}
        <Mic className={cn("relative z-10", size === "sm" ? "h-4 w-4" : "h-5 w-5")} />
      </motion.button>
      {isListening && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute right-0 top-full z-20 mt-2 w-48 rounded-2xl border border-primary/20 bg-card p-3 shadow-lg"
        >
          <p className="mb-2 text-xs font-medium text-primary">正在聆听…</p>
          <VoiceWaveform active />
          {displayText && (
            <p className="mt-2 line-clamp-2 text-xs text-muted">{displayText}</p>
          )}
        </motion.div>
      )}
      {error && (
        <p className="absolute right-0 top-full mt-1 text-xs text-rose-500">
          {error}
        </p>
      )}
    </div>
  );
}
