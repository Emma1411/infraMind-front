import { Check, ChevronRight } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { STEPS } from "../data/steps";
import { useStepAccess } from "../hooks/useStepAccess";

function useCurrentIndex(): number {
  const { pathname } = useLocation();
  return Math.max(
    0,
    STEPS.findIndex((step) => step.path === pathname),
  );
}

/** Version large écran : les quatre étapes dans une pastille. */
export default function Stepper() {
  const currentIndex = useCurrentIndex();
  const { canGo } = useStepAccess();

  return (
    <nav aria-label="Étapes du parcours" className="hidden lg:block">
      <ol className="flex items-center gap-1 rounded-full border border-brand-100 bg-brand-50/70 p-1.5">
        {STEPS.map((step, index) => {
          const isCurrent = index === currentIndex;
          const isDone = index < currentIndex;
          const enabled = canGo(step.path);
          const label = (
            <>
              {isDone && <Check className="size-3.5" aria-hidden />}
              {index + 1}. {step.label}
            </>
          );
          const base = "inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm transition";

          let item;
          if (isCurrent) {
            item = (
              <span aria-current="step" className={`${base} bg-white font-semibold text-brand-800 shadow-sm`}>
                {label}
              </span>
            );
          } else if (enabled) {
            item = (
              <Link
                to={step.path}
                className={`${base} ${isDone ? "text-brand-700" : "text-body"} hover:bg-white/70`}
              >
                {label}
              </Link>
            );
          } else {
            item = (
              <span aria-disabled="true" className={`${base} cursor-not-allowed text-muted/70`}>
                {label}
              </span>
            );
          }

          return (
            <li key={step.path} className="flex items-center gap-1">
              {index > 0 && <ChevronRight className="size-3.5 text-brand-300" aria-hidden />}
              {item}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/** Version petit écran : « Étape X sur 4 » avec une barre de progression. */
export function StepperCompact() {
  const currentIndex = useCurrentIndex();

  return (
    <div className="flex items-center justify-between gap-3 lg:hidden">
      <p className="text-sm font-medium text-ink">
        Étape {currentIndex + 1} sur {STEPS.length} ·{" "}
        <span className="text-brand-700">{STEPS[currentIndex].label}</span>
      </p>
      <div className="flex gap-1.5" aria-hidden>
        {STEPS.map((step, index) => (
          <span
            key={step.path}
            className={`h-1.5 w-6 rounded-full ${index <= currentIndex ? "bg-brand-600" : "bg-brand-100"}`}
          />
        ))}
      </div>
    </div>
  );
}