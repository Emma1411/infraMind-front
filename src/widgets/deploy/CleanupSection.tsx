import { Trash2 } from "lucide-react";
import Badge from "../../components/Badge";
import type { GuideStep } from "../../interfaces/guide";
import type { OsKey } from "../../utils/os";
import StepBody from "./StepBody";

interface CleanupSectionProps {
  steps: GuideStep[];
  os: OsKey;
  onOsChange: (os: OsKey) => void;
}

export default function CleanupSection({ steps, os, onOsChange }: CleanupSectionProps) {
  if (steps.length === 0) return null;

  return (
    <section
      id="nettoyage"
      aria-labelledby="cleanup-title"
      className="mt-10 scroll-mt-28 rounded-xl2 border border-warn/30 bg-warn-soft/50 p-5 sm:p-8"
    >
      <div className="flex flex-wrap items-center gap-3">
        <span className="flex size-11 items-center justify-center rounded-xl bg-warn-soft text-warn ring-1 ring-warn/25">
          <Trash2 className="size-5" aria-hidden />
        </span>
        <div>
          <p className="text-xs font-semibold tracking-wide text-warn uppercase">Sécurité de facturation et anti-oubli</p>
          <h2 id="cleanup-title" className="text-2xl font-bold text-brand-900">
            Nettoyage complet : tout supprimer après tes tests
          </h2>
        </div>
        <Badge tone="warn" className="ml-auto">
          Aucune ressource oubliée
        </Badge>
      </div>
      <p className="mt-3 max-w-3xl text-sm text-body">
        Un serveur ou une base qui tourne à vide continue de coûter. Suis ces étapes quand tu as fini tes tests, pour ne
        rien laisser de facturé. Certaines actions sont définitives : lis les avertissements.
      </p>

      <ol className="mt-6 space-y-6">
        {steps.map((step, index) => (
          <li key={step.id} className="rounded-xl2 border border-line bg-white p-5 shadow-card">
            <h3 className="text-lg font-semibold text-ink">
              <span className="mr-2 font-mono text-sm text-warn">S{index + 1}</span>
              {step.title}
              {step.optional && <span className="ml-2 text-sm font-normal text-muted">(facultative)</span>}
            </h3>
            <div className="mt-4">
              <StepBody step={step} os={os} onOsChange={onOsChange} />
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}