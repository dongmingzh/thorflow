"use client";

import { motion } from "framer-motion";

interface VoiceWaveformProps {
  active: boolean;
}

export function VoiceWaveform({ active }: VoiceWaveformProps) {
  const bars = [0, 1, 2, 3, 4];

  return (
    <div className="flex h-8 items-end justify-center gap-1">
      {bars.map((i) => (
        <motion.div
          key={i}
          className="w-1 rounded-full bg-primary"
          animate={
            active
              ? {
                  height: [8, 24, 12, 28, 8],
                  opacity: [0.5, 1, 0.7, 1, 0.5],
                }
              : { height: 4, opacity: 0.3 }
          }
          transition={
            active
              ? {
                  duration: 0.8,
                  repeat: Infinity,
                  delay: i * 0.1,
                  ease: "easeInOut",
                }
              : { duration: 0.3 }
          }
        />
      ))}
    </div>
  );
}
