import { AppWindow, ArrowLeft, ArrowRight, Server, Terminal, type LucideIcon } from "lucide-react";
import type { RefObject } from "react";
import Badge from "../../components/Badge";
import Button from "../../components/Button";
import type { GuideStep } from "../../interfaces/guide";
import type { OsKey } from "../../utils/os";
import StepBody from "./StepBody";

const WHERE: Record<GuideStep["where"], { label: string; icon: LucideIcon }> = {
  console: { label: "Dans la console du fournisseur", icon: AppWindow },
  local: { label: "Sur ton ordinateur", icon: Terminal },
  server: { label: "Sur le serveur", icon: Server },
};

interface StepCardProps {
  step: GuideStep;
  number: number;
  total: number;
  os: OsKey;
  onOsChange: (os: OsKey) => void;
  done: boolean;
  isFirst: boolean;
  isLast: boolean;
  nextTitle: string | null;
  onPrev: () => void;
  onNext: () => void;
  sectionRef: RefObject<HTMLElement | null>;
}

export default function StepCard({
  step,
  number,
  total,
  os,
  onOsChange,
  done,
  isFirst,
  isLast,
  nextTitle,
  onPrev,
  onNext,
  sectionRef,
}: StepCardProps) {
  const where = WHERE[step.where];
  const Icon = where.icon;

  return (
    <section
      ref={sectionRef}
      tabIndex={-1}
      id="etape-courante"
      aria-labelledby="etape-titre"
      className="scroll-mt-28 rounded-xl2 border border-line bg-white p-5 shadow-card focus:outline-none sm:p-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs font-semibold tracking-wide text-brand-700 uppercase">
          Étape {number} sur {total}
          {step.optional && <span className="ml-2 font-normal text-muted normal-case">· facultative</span>}
        </p>
        <Badge tone="neutral" icon={<Icon className="size-3.5" aria-hidden />}>
          {where.label}
        </Badge>
      </div>

      <div className="mt-3 flex items-start gap-3">
        <span
          aria-hidden
          className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-800 text-sm font-bold text-white"
        >
          {number}
        </span>
        <h2 id="etape-titre" className="text-2xl font-bold text-brand-900">
          {step.title}
        </h2>
      </div>

      <div className="mt-5">
        <StepBody step={step} os={os} onOsChange={onOsChange} />
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5">
        <Button variant="ghost" disabled={isFirst} iconBefore={<ArrowLeft className="size-4" aria-hidden />} onClick={onPrev}>
          Étape précédente
        </Button>
        <Button icon={<ArrowRight className="size-4" aria-hidden />} onClick={onNext}>
          {isLast
            ? done
              ? "Voir le nettoyage"
              : "Valider et voir le nettoyage"
            : done
              ? "Continuer"
              : nextTitle
                ? `Valider et passer à « ${nextTitle} »`
                : "Valider et continuer"}
        </Button>
      </div>
    </section>
  );
}