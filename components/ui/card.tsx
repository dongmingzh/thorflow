"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export function Card({ children, className, hover = false, onClick }: CardProps) {
  const Comp = hover ? motion.div : "div";
  const motionProps = hover
    ? { whileHover: { y: -4, scale: 1.01 }, transition: { duration: 0.2 } }
    : {};

  return (
    <Comp
      {...motionProps}
      onClick={onClick}
      className={cn(
        "rounded-3xl border border-border bg-card p-6 shadow-sm",
        hover && "cursor-pointer transition-shadow hover:shadow-lg",
        className
      )}
    >
      {children}
    </Comp>
  );
}
