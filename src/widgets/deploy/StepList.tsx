import { Check } from "lucide-react";
import type { GuideStep } from "../../interfaces/guide";

interface StepListProps {
  steps: GuideStep[];
  current: number;
  doneIds: string[];
  onSelect: (index: number) => void;
}

export default function StepList({ steps, current, doneIds, onSelect }: StepListProps) {
  return (
    <nav aria-labelledby="steps-title" className="rounded-xl2 border border-line bg-white p-5 shadow-card">
      <div className="flex items-baseline justify-between">
        <h2 id="steps-title" className="text-xs font-semibold tracking-wide text-muted uppercase">
          Déroulé du déploiement
        </h2>
        <span className="font-mono text-xs font-semibold text-brand-700">{steps.length} étapes</span>
      </div>

      <div className="mt-3 lg:hidden">
        <label htmlFor="step-select" className="sr-only">
          Aller à l'étape
        </label>
        <select
          id="step-select"
          value={current}
          onChange={(event) => onSelect(Number(event.target.value))}
          className="w-full rounded-xl border border-brand-100 bg-white px-4 py-3 text-sm text-ink"
        >
          {steps.map((step, index) => (
            <option key={step.id} value={index}>
              {index + 1}. {step.title}
              {doneIds.includes(step.id) ? " (faite)" : ""}
            </option>
          ))}
        </select>
      </div>

      <ol className="mt-3 hidden space-y-1 lg:block">
        {steps.map((step, index) => {
          const done = doneIds.includes(step.id);
          const active = index === current;
          return (
            <li key={step.id}>
              <button
                type="button"
                aria-current={active ? "step" : undefined}
                onClick={() => onSelect(index)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition ${
                  active ? "bg-brand-100 font-semibold text-brand-900" : "text-body hover:bg-brand-50"
                }`}
              >
                <span
                  aria-hidden
                  className={`flex size-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
                    done
                      ? "bg-brand-600 text-white"
                      : active
                        ? "bg-brand-800 text-white"
                        : "border border-brand-200 text-muted"
                  }`}
                >
                  {done ? <Check className="size-3" /> : index + 1}
                </span>
                <span className="min-w-0 flex-1">
                  {step.title}
                  {step.optional && <span className="ml-1 text-xs font-normal text-muted">(facultative)</span>}
                </span>
                {done && <span className="text-xs text-brand-700">Fait</span>}
              </button>
            </li>
          );
        })}
      </ol>

      <a href="#nettoyage" className="mt-3 block rounded-lg px-3 py-2 text-sm font-medium text-warn transition hover:bg-warn-soft">
        Tout supprimer à la fin
      </a>
    </nav>
  );
}