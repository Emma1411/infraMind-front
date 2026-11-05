import { ScanSearch } from "lucide-react";
import { Link } from "react-router-dom";
import Alert from "../../components/Alert";
import type { ProjectSpec } from "../../interfaces/spec";

interface DetectedSummaryProps {
  spec: ProjectSpec;
  /** Cartes essentielles dont la réponse a été trouvée dans le texte. */
  detected: number;
  total: number;
}

interface Row {
  label: string;
  value: string;
}

/** Ce que l'IA a repéré et qui n'a pas de question : on le montre pour que l'utilisateur puisse le vérifier. */
function extraRows(spec: ProjectSpec): Row[] {
  const candidates: { label: string; value: string | null }[] = [
    { label: "Technologies", value: spec.application.runtime },
    { label: "Services tiers", value: spec.application.third_party_services.join(", ") },
    { label: "Moments de forte affluence", value: spec.traffic.peak_notes },
    { label: "Réglementations", value: spec.compliance.other_regulations },
    { label: "Stack existante", value: spec.constraints.existing_stack_notes },
    { label: "Migration depuis", value: spec.constraints.migration_from },
  ];
  return candidates.flatMap((row) => (row.value && row.value.trim() ? [{ label: row.label, value: row.value.trim() }] : []));
}

export default function DetectedSummary({ spec, detected, total }: DetectedSummaryProps) {
  const rows = extraRows(spec);
  const provider = spec.constraints.imposed_provider?.trim() || null;

  return (
    <section aria-labelledby="detected-title" className="rounded-xl2 border border-brand-200 bg-brand-50/60 p-5 sm:p-6">
      <div className="flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white text-brand-700 shadow-sm">
          <ScanSearch className="size-5" aria-hidden />
        </span>
        <div className="min-w-0">
          <h2 id="detected-title" className="text-lg font-semibold text-brand-900">
            Ce que nous avons compris de ton texte
          </h2>
          <p className="mt-1 text-sm text-body">
            {detected === 0
              ? "Ton texte ne contenait aucune des informations essentielles : réponds aux questions ci-dessous."
              : `${detected} sur ${total} informations essentielles ont été trouvées dans ton texte. Elles sont déjà remplies ci-dessous, avec la pastille « Détecté dans ton texte » : vérifie-les, et change celles qui sont fausses.`}
          </p>
        </div>
      </div>

      {provider && (
        <Alert tone="warn" className="mt-4" title={`Fournisseur imposé détecté : « ${provider} »`}>
          Les architectures des autres fournisseurs seront éliminées du classement. Si ce n'est pas voulu, retire cette
          contrainte de ton texte à l'étape 1 et relance l'analyse.
        </Alert>
      )}

      {rows.length > 0 && (
        <div className="mt-4">
          <h3 className="text-xs font-semibold tracking-wide text-muted uppercase">Autres éléments repérés dans ton texte</h3>
          <dl className="mt-2 grid gap-x-6 gap-y-2 sm:grid-cols-2">
            {rows.map((row) => (
              <div key={row.label} className="rounded-lg bg-white px-3 py-2 text-sm">
                <dt className="text-xs text-muted">{row.label}</dt>
                <dd className="font-medium text-ink">{row.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      <p className="mt-4 text-sm text-body">
        Une information fausse ou manquante dans ce résumé ?{" "}
        <Link to="/" className="font-semibold text-brand-700 underline">
          Modifie ton texte à l'étape 1
        </Link>{" "}
        et relance l'analyse.
      </p>
    </section>
  );
}