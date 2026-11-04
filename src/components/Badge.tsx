import type { ReactNode } from "react";

type Tone = "info" | "neutral" | "ok" | "warn" | "danger";

const TONES: Record<Tone, string> = {
  info: "bg-brand-50 text-brand-700 ring-brand-200",
  neutral: "bg-white text-body ring-line",
  ok: "bg-ok-soft text-ok ring-ok/25",
  warn: "bg-warn-soft text-warn ring-warn/25",
  danger: "bg-danger-soft text-danger ring-danger/25",
};

interface BadgeProps {
  tone?: Tone;
  icon?: ReactNode;
  className?: string;
  children: ReactNode;
}

export default function Badge({ tone = "info", icon, className = "", children }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset ${TONES[tone]} ${className}`}
    >
      {icon}
      {children}
    </span>
  );
}