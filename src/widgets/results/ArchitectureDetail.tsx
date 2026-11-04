import Alert from "../../components/Alert";
import Badge from "../../components/Badge";
import type { ArchitectureResult, EvaluationResult } from "../../interfaces/evaluation";
import { criterionLabel, formatMoney, formatScore } from "../../utils/results";
import ArchitectureBadges from "./ArchitectureBadges";

interface ArchitectureDetailProps {
  arch: ArchitectureResult;
  evaluation: EvaluationResult;
}

export default function ArchitectureDetail({ arch, evaluation }: ArchitectureDetailProps) {
  const availability = arch.availability;
  const rows: { label: string; score: number | null; why: string | null }[] = [
    { label: "Application", score: availability.application_score, why: availability.application_why },
    { label: "Base de données", score: availability.database_score, why: availability.database_why },
    { label: "Disponibilité globale", score: availability.overall_score, why: availability.overall_why },
  ];

  return (
    <section
      id="detail-architecture"
      aria-labelledby="detail-title"
      className="scroll-mt-28 rounded-xl2 border border-line bg-white p-5 shadow-card sm:p-8"
    >
      <p className="text-xs font-semibold tracking-wide text-brand-700 uppercase">Détail de l'architecture</p>
      <h2 id="detail-title" className="mt-1 text-2xl font-bold text-brand-900">
        {arch.label}
      </h2>
      <p className="mt-2 max-w-3xl text-body">{arch.summary}</p>
      <div className="mt-3">
        <ArchitectureBadges arch={arch} />
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-2">
        <div>
          <h3 className="text-lg font-semibold text-ink">Comment elle est notée</h3>
          <p className="mt-1 text-sm text-muted">
            Huit critères, pondérés selon ton projet. Le poids dit combien chaque critère compte dans la note globale.
          </p>
          <ul className="mt-4 space-y-4">
            {arch.scores.map((score) => {
              const width = Math.max(0, Math.min(100, score.score));
              return (
                <li key={score.criterion}>
                  <div className="flex items-baseline justify-between gap-3 text-sm">
                    <span className="font-medium text-ink">{criterionLabel(score.criterion)}</span>
                    <span className="font-mono text-xs text-muted">
                      poids {formatScore(score.weight)} % · {formatScore(score.score)} / 100
                    </span>
                  </div>
                  <div
                    role="img"
                    aria-label={`${criterionLabel(score.criterion)} : ${formatScore(score.score)} sur 100`}
                    className="mt-1.5 h-2 overflow-hidden rounded-full bg-brand-100"
                  >
                    <div className="h-full rounded-full bg-brand-600" style={{ width: `${width}%` }} />
                  </div>
                  <p className="mt-1 text-xs text-muted">{score.why}</p>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-semibold text-ink">Disponibilité en détail</h3>
            <ul className="mt-3 space-y-3">
              {rows
                .filter((row) => row.score !== null)
                .map((row) => (
                  <li key={row.label} className="rounded-xl bg-brand-50 p-3 text-sm">
                    <p className="flex items-baseline justify-between gap-3">
                      <span className="font-medium text-ink">{row.label}</span>
                      <span className="font-mono text-xs text-brand-800">{row.score} / 5</span>
                    </p>
                    {row.why && <p className="mt-1 text-xs text-body">{row.why}</p>}
                  </li>
                ))}
            </ul>
          </div>

          {arch.requirements_unmet.length > 0 && (
            <Alert tone="warn" title="Exigences non respectées">
              <ul className="list-disc space-y-1 pl-5">
                {arch.requirements_unmet.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Alert>
          )}

          {arch.warnings.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-ink">À savoir</h3>
              <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-body">
                {arch.warnings.map((warning) => (
                  <li key={warning}>{warning}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="mt-10">
        <h3 className="text-lg font-semibold text-ink">Détail des coûts mensuels</h3>
        <p className="mt-1 text-sm text-muted">Au palier de trafic retenu : {evaluation.tier_label}.</p>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[34rem] text-left text-sm">
            <caption className="sr-only">Lignes de coût mensuel de {arch.label}</caption>
            <thead>
              <tr className="border-b border-line text-xs tracking-wide text-muted uppercase">
                <th scope="col" className="py-2 pr-4 font-medium">
                  Service
                </th>
                <th scope="col" className="py-2 pr-4 font-medium">
                  Détail
                </th>
                <th scope="col" className="py-2 text-right font-medium">
                  Coût mensuel
                </th>
              </tr>
            </thead>
            <tbody>
              {arch.lines.map((line) => (
                <tr key={`${line.item_id}-${line.detail}`} className="border-b border-line/60">
                  <td className="py-2.5 pr-4 text-ink">
                    {line.label}
                    {line.to_verify && (
                      <Badge tone="warn" className="ml-2">
                        à vérifier
                      </Badge>
                    )}
                  </td>
                  <td className="py-2.5 pr-4 text-muted">{line.detail}</td>
                  <td className="py-2.5 text-right font-mono">{formatMoney(line.monthly, "USD", 2)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <th scope="row" colSpan={2} className="pt-3 pr-4 text-left font-semibold text-ink">
                  Total au palier retenu
                </th>
                <td className="pt-3 text-right font-mono font-semibold text-ink">{formatMoney(arch.cost_low, "USD", 2)}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {arch.unpriced.length > 0 && (
          <Alert tone="warn" className="mt-4" title="Prix manquants : l'estimation est incomplète">
            <ul className="list-disc space-y-1 pl-5">
              {arch.unpriced.map((line) => (
                <li key={line.item_id}>
                  {line.label} : {line.reason}
                </li>
              ))}
            </ul>
          </Alert>
        )}
      </div>

      <p className="mt-8 border-t border-line pt-4 text-xs text-muted">{arch.price_basis}</p>
    </section>
  );
}