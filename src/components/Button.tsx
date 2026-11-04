
import { LoaderCircle } from "lucide-react";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  loading?: boolean;
  /** Icône après le texte. */
  icon?: ReactNode;
  /** Icône avant le texte. */
  iconBefore?: ReactNode;
}

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition " +
  "cursor-pointer disabled:cursor-not-allowed disabled:opacity-60";

const VARIANTS: Record<Variant, string> = {
  primary: "bg-brand-800 text-white shadow-sm hover:bg-brand-900",
  secondary: "bg-brand-100 text-brand-800 hover:bg-brand-200",
  ghost: "text-brand-700 hover:bg-brand-50",
};

export default function Button({
  variant = "primary",
  loading = false,
  icon,
  iconBefore,
  children,
  className = "",
  disabled,
  type = "button",
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={`${BASE} ${VARIANTS[variant]} ${className}`}
      {...rest}
    >
      {loading ? (
        <LoaderCircle className="size-4 animate-spin" aria-hidden />
      ) : (
        iconBefore
      )}
      {children}
      {!loading && icon}
    </button>
  );
}
