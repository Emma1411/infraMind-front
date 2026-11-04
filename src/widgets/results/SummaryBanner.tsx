import { ChevronDown, Gauge, Globe, Star } from "lucide-react";
import { Link } from "react-router-dom";
import Alert from "../../components/Alert";
import Badge from "../../components/Badge";
import type { ArchitectureResult, EvaluationResult } from "../../interfaces/evaluation";
import { costRange, formatScore, maintenanceRange } from "../../utils/results";
import ArchitectureBadges from "./ArchitectureBadges";

interface SummaryBannerProps {
  evaluation: EvaluationResult;
  recommended: ArchitectureResult | null;
}

const VISIBLE_WARNINGS = 3;

export default function SummaryBanner({ evaluation, recommended }: SummaryBannerProps) {
  const range = recommended ? costRange(recommended, evaluation) : null;
  const withMaintenance = recommended ? maintenanceRange(recommended, evaluation) : null;
  const shown = evaluation.global_warnings.slice(0, VISIBLE_WARNINGS);
  const more = evaluation.global_warnings.slice(VISIBLE_WARNINGS);
  const conversionNote =
    evaluation.display_currency && evaluation.display_currency !== "USD" && evaluation.fx_rate
      ? `Montants convertis en ${evaluation.display_currency}${evaluation.fx_as_of ? ` (taux du ${evaluation.fx_as_of})` : ""}.`
      : null;

  return (
    <section aria-labelledby="summary-title" className="overflow-hidden rounded-xl2 border border-line bg-white shadow-card">
      <div className="grid gap-6 bg-linear-to-br from-brand-50 to-white p-6 sm:p-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
        {recommended && range ? (
          <>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge icon={<Star className="size-3.5" aria-hidden />}>Architecture recommandée</Badge>
                <Badge tone="neutral" icon={<Gauge className="size-3.5" aria-hidden />}>
                  Note : {formatScore(recommended.total_score)} / 100
                </Badge>
                <ArchitectureBadges arch={recommended} showVerdict={false} />
              </div>
              <h1 id="summary-title" className="mt-4 text-3xl leading-tight font-bold text-brand-900 sm:text-4xl">
                {recommended.label}
              </h1>
              <p className="mt-3 max-w-2xl text-body">
                Pour {evaluation.tier_label}. La fourchette haute correspond au palier de trafic supérieur.
              </p>
              <p className="mt-3 flex max-w-2xl gap-2 text-xs text-muted">
                <Globe className="mt-0.5 size-3.5 shrink-0" aria-hidden />
                <span>
                  {recommended.price_basis} {evaluation.pricing_disclaimer}
                </span>
              </p>
            </div>

            <div className="rounded-xl2 border border-brand-100 bg-white/80 px-6 py-5 lg:min-w-72 lg:text-right">
              <p className="text-xs font-semibold tracking-wide text-muted uppercase">Estimation mensuelle</p>
              <p className="mt-2 text-3xl font-bold text-brand-900">{range.primary}</p>
              <p className="text-sm text-muted">par mois, hors taxes</p>
              {range.secondary && <p className="mt-1 text-sm font-medium text-brand-700">{range.secondary}</p>}
              {withMaintenance && (
                <p className="mt-3 border-t border-line pt-3 text-sm text-body">
                  Avec maintenance : <span className="font-semibold text-ink">{withMaintenance.primary}</span>
                </p>
              )}
              {conversionNote && <p className="mt-2 text-xs text-muted">{conversionNote}</p>}
            </div>
          </>
        ) : (
          <div className="lg:col-span-2">
            <h1 id="summary-title" className="text-3xl font-bold text-brand-900 sm:text-4xl">
              Aucune architecture ne respecte tes contraintes
            </h1>
            <Alert tone="danger" className="mt-4" title="Ce qu'il faut faire">
              Chaque architecture a été éliminée par une contrainte (budget, fournisseur imposé). Les raisons sont
              détaillées dans le classement ci-dessous. Modifie ton budget ou tes contraintes, puis recalcule.{" "}
              <Link to="/completer" className="font-semibold text-brand-700 underline">
                Modifier mes paramètres
              </Link>
            </Alert>
          </div>
        )}
      </div>

      <div className="space-y-4 border-t border-line p-6 sm:px-8">
        <details className="group rounded-xl bg-brand-50">
          <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-3 text-sm font-medium text-brand-900 [&::-webkit-details-marker]:hidden">
            Voir les {evaluation.assumptions.length} hypothèses utilisées
            <ChevronDown className="ml-auto size-4 transition group-open:rotate-180" aria-hidden />
          </summary>
          <ul className="list-disc space-y-1.5 px-9 pb-4 text-sm text-body">
            {evaluation.assumptions.map((assumption) => (
              <li key={assumption}>{assumption}</li>
            ))}
          </ul>
        </details>

        {shown.map((warning) => (
          <Alert key={warning} tone="warn">
            {warning}
          </Alert>
        ))}
        {more.length > 0 && (
          <details className="group">
            <summary className="flex cursor-pointer list-none items-center gap-1 text-sm font-medium text-brand-700 [&::-webkit-details-marker]:hidden">
              Voir {more.length} autre{more.length > 1 ? "s" : ""} avertissement{more.length > 1 ? "s" : ""}
              <ChevronDown className="size-4 transition group-open:rotate-180" aria-hidden />
            </summary>
            <div className="mt-3 space-y-3">
              {more.map((warning) => (
                <Alert key={warning} tone="warn">
                  {warning}
                </Alert>
              ))}
            </div>
          </details>
        )}
      </div>
    </section>
  );
}