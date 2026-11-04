import { ChevronDown, CircleHelp, Info } from "lucide-react";
import { useEffect, useId, useState, type ReactNode } from "react";

export function UnknownNotice() {
  return (
    <p role="status" className="mt-4 flex items-start gap-2 rounded-xl bg-brand-50 px-4 py-3 text-sm text-brand-900">
      <Info className="mt-0.5 size-4 shrink-0 text-brand-600" aria-hidden />
      On utilisera une hypothèse prudente, affichée dans les résultats. Choisis une réponse pour la remplacer.
    </p>
  );
}

export function WhyDisclosure({ text }: { text: string }) {
  return (
    <details className="group mt-3 rounded-xl bg-brand-50">
      <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-2.5 text-sm font-medium text-brand-800 [&::-webkit-details-marker]:hidden">
        <Info className="size-4 text-brand-600" aria-hidden />
        Pourquoi on demande ça ?
        <ChevronDown className="ml-auto size-4 transition group-open:rotate-180" aria-hidden />
      </summary>
      <p className="px-4 pb-3 text-sm text-body">{text}</p>
    </details>
  );
}

interface CardShellProps {
  anchorId?: string;
  tag: string;
  title: string;
  why?: string;
  /** Si fourni, affiche le bouton « Je ne sais pas ». */
  onToggleUnknown?: () => void;
  unknown?: boolean;
  badge?: ReactNode;
  children: ReactNode;
}

export function CardShell({ anchorId, tag, title, why, onToggleUnknown, unknown = false, badge, children }: CardShellProps) {
  const titleId = useId();
  return (
    <section
      id={anchorId}
      aria-labelledby={titleId}
      className="scroll-mt-28 rounded-xl2 border border-line bg-white p-5 shadow-card sm:p-6"
    >
      <div className="flex items-center justify-between gap-3">
        <p className="font-mono text-xs font-semibold tracking-wide text-brand-700">{tag}</p>
        <div className="flex items-center gap-2">
          {badge}
          {onToggleUnknown && (
            <button
              type="button"
              aria-pressed={unknown}
              onClick={onToggleUnknown}
              className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition ${
                unknown ? "bg-brand-600 text-white" : "text-muted hover:bg-brand-50 hover:text-brand-700"
              }`}
            >
              <CircleHelp className="size-3.5" aria-hidden />
              Je ne sais pas
            </button>
          )}
        </div>
      </div>
      <h3 id={titleId} className="mt-3 text-xl font-semibold text-ink">
        {title}
      </h3>
      {why && <WhyDisclosure text={why} />}
      <div className="mt-4">{children}</div>
      {unknown && <UnknownNotice />}
    </section>
  );
}

interface NumberFieldProps {
  value: number | undefined;
  unit: string;
  label: string;
  placeholder?: string;
  onValue: (value: number) => void;
  onClear: () => void;
}

/** Champ numérique qui garde le texte tapé tel quel (« 12. » ne devient pas « 12 » en cours de frappe). */
export function NumberField({ value, unit, label, placeholder, onValue, onClear }: NumberFieldProps) {
  const id = useId();
  const [text, setText] = useState(typeof value === "number" ? String(value) : "");

  useEffect(() => {
    if (typeof value === "number") {
      if (text === "" || Number(text) !== value) setText(String(value));
    } else if (text !== "") {
      setText("");
    }
  }, [value, text]);

  return (
    <div className="flex items-center rounded-xl border border-brand-100 bg-brand-50/60 focus-within:border-brand-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-brand-200">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <input
        id={id}
        type="number"
        inputMode="decimal"
        min={0}
        step="any"
        value={text}
        placeholder={placeholder}
        onChange={(event) => {
          const next = event.target.value;
          setText(next);
          if (next === "" || Number.isNaN(Number(next))) onClear();
          else onValue(Number(next));
        }}
        className="min-w-0 flex-1 bg-transparent px-4 py-3 text-ink outline-none placeholder:text-muted/60"
      />
      <span className="pr-4 text-sm whitespace-nowrap text-muted">{unit}</span>
    </div>
  );
}