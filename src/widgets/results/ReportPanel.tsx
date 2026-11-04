import { FileText, RotateCcw, Sparkles } from "lucide-react";
import Alert from "../../components/Alert";
import Badge from "../../components/Badge";
import Button from "../../components/Button";
import Skeleton from "../../components/Skeleton";
import type { LoadStatus } from "../../interfaces/state";
import type { ReportFallbackReason, ReportResponse } from "../../interfaces/report";

const REASONS: Record<ReportFallbackReason, string> = {
  not_configured: "le service d'IA n'est pas configuré",
  service_error: "le service d'IA est indisponible",
  invalid_output: "l'IA n'a pas produit un texte fiable",
  no_recommendation: "aucune architecture n'est recommandée",
};

interface ReportPanelProps {
  report: ReportResponse | null;
  status: LoadStatus;
  error: string | null;
  labels: Record<string, string>;
  onRetry: () => void;
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-body">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export default function ReportPanel({ report, status, error, labels, onRetry }: ReportPanelProps) {
  const heading = (
    <h2 className="text-xl font-semibold text-ink">Explication de l'analyse</h2>
  );

  if (status === "idle" || status === "loading") {
    return (
      <section aria-busy="true" className="rounded-xl2 border border-line bg-white p-6 shadow-card">
        {heading}
        <p role="status" className="mt-2 text-sm text-muted">
          Rédaction de l'explication en cours…
        </p>
        <div className="mt-4 space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-11/12" />
          <Skeleton className="h-4 w-4/5" />
        </div>
      </section>
    );
  }

  if (status === "failed" || !report) {
    return (
      <section className="rounded-xl2 border border-line bg-white p-6 shadow-card">
        {heading}
        <Alert tone="warn" className="mt-3" title="L'explication n'a pas pu être chargée">
          {error ?? "Une erreur est survenue."} Le classement et les coûts ci-dessous restent valables.
        </Alert>
        <Button variant="secondary" className="mt-3" iconBefore={<RotateCcw className="size-4" aria-hidden />} onClick={onRetry}>
          Réessayer
        </Button>
      </section>
    );
  }

  const { report: content, source, fallback_reason: reason } = report;

  return (
    <section aria-labelledby="report-title" className="rounded-xl2 border border-line bg-white p-6 shadow-card sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="report-title" className="text-xl font-semibold text-ink">
          Explication de l'analyse
        </h2>
        {source === "ai" ? (
          <Badge icon={<Sparkles className="size-3.5" aria-hidden />}>Rédigée par l'IA, chiffres vérifiés par le moteur</Badge>
        ) : (
          <Badge tone="neutral" icon={<FileText className="size-3.5" aria-hidden />}>
            Texte généré automatiquement
          </Badge>
        )}
      </div>
      {source === "template" && reason && reason !== "no_recommendation" && (
        <p className="mt-2 text-xs text-muted">
          Version de secours : {REASONS[reason]}. Les chiffres viennent du même calcul.
        </p>
      )}

      <p className="mt-4 max-w-3xl text-base leading-relaxed text-ink">{content.summary}</p>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {content.why_this_one.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold tracking-wide text-brand-700 uppercase">Pourquoi ce choix</h3>
            <BulletList items={content.why_this_one} />
          </div>
        )}
        {content.watch_out.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold tracking-wide text-brand-700 uppercase">Points de vigilance</h3>
            <BulletList items={content.watch_out} />
          </div>
        )}
      </div>

      {content.why_not_others.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-semibold tracking-wide text-brand-700 uppercase">Pourquoi pas les autres</h3>
          <ul className="mt-2 space-y-2 text-sm text-body">
            {content.why_not_others.map((note) => (
              <li key={note.arch_id}>
                <span className="font-semibold text-ink">{labels[note.arch_id] ?? note.arch_id} : </span>
                {note.text}
              </li>
            ))}
          </ul>
        </div>
      )}

      {content.next_steps.length > 0 && (
        <div className="mt-6 rounded-xl bg-brand-50 p-4">
          <h3 className="text-sm font-semibold tracking-wide text-brand-700 uppercase">Prochaines étapes</h3>
          <BulletList items={content.next_steps} />
        </div>
      )}
    </section>
  );
}