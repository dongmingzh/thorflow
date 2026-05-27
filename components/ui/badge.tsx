import { cn } from "@/lib/utils";

const variants = {
  default: "bg-primary-light text-primary",
  success: "bg-success-light text-emerald-700",
  warning: "bg-warning-light text-amber-800",
  danger: "bg-danger-light text-rose-700",
  muted: "bg-slate-100 text-muted",
};

interface BadgeProps {
  children: React.ReactNode;
  variant?: keyof typeof variants;
  className?: string;
}

export function Badge({
  children,
  variant = "default",
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
