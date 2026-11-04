import { CircleAlert, CircleCheck, Info, TriangleAlert, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type Tone = "info" | "ok" | "warn" | "danger";

const CONFIG: Record<Tone, { Icon: LucideIcon; box: string; icon: string; role: "status" | "alert" }> = {
  info: { Icon: Info, box: "bg-brand-50 ring-brand-200", icon: "text-brand-600", role: "status" },
  ok: { Icon: CircleCheck, box: "bg-ok-soft ring-ok/25", icon: "text-ok", role: "status" },
  warn: { Icon: TriangleAlert, box: "bg-warn-soft ring-warn/25", icon: "text-warn", role: "alert" },
  danger: { Icon: CircleAlert, box: "bg-danger-soft ring-danger/25", icon: "text-danger", role: "alert" },
};

interface AlertProps {
  tone?: Tone;
  title?: string;
  className?: string;
  children: ReactNode;
}

export default function Alert({ tone = "info", title, className = "", children }: AlertProps) {
  const { Icon, box, icon, role } = CONFIG[tone];
  return (
    <div role={role} className={`flex gap-3 rounded-xl p-4 text-sm text-ink ring-1 ring-inset ${box} ${className}`}>
      <Icon className={`mt-0.5 size-4 shrink-0 ${icon}`} aria-hidden />
      <div className="min-w-0">
        {title && <p className="font-semibold">{title}</p>}
        <div className={title ? "mt-0.5 text-body" : ""}>{children}</div>
      </div>
    </div>
  );
}