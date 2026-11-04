import { ArrowRight, ClipboardCheck } from "lucide-react";
import { Link } from "react-router-dom";
import Alert from "../../components/Alert";
import Button from "../../components/Button";

interface ActionBarProps {
  pending: number;
  unknownCount: number;
  loading: boolean;
  error: string | null;
  onSubmit: () => void;
}

export default function ActionBar({ pending, unknownCount, loading, error, onSubmit }: ActionBarProps) {
  const hypotheses = pending + unknownCount;

  return (
    <div className="sticky bottom-0 z-20 border-t border-line bg-white/90 backdrop-blur">
      <div className="mx-auto max-w-[1200px] px-5 py-4">
        {error && (
          <Alert tone="danger" className="mb-3" title="Impossible de calculer les résultats">
            {error}
          </Alert>
        )}
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <p className="flex items-start gap-2 text-sm text-body" aria-live="polite">
            <ClipboardCheck className="mt-0.5 size-4 shrink-0 text-brand-600" aria-hidden />
            <span>
              <strong className="font-semibold text-ink">Note d'honnêteté : </strong>
              {hypotheses === 0
                ? "toutes les informations essentielles sont renseignées."
                : `${hypotheses} information${hypotheses > 1 ? "s" : ""} ${
                    hypotheses > 1 ? "reposeront" : "reposera"
                  } sur des hypothèses prudentes, affichées clairement dans les résultats.`}
            </span>
          </p>
          <div className="flex items-center gap-3">
            <Link to="/" className="rounded-lg px-3 py-2 text-sm font-medium text-brand-700 transition hover:bg-brand-50">
              Revenir à l'étape 1
            </Link>
            <Button loading={loading} icon={<ArrowRight className="size-4" aria-hidden />} onClick={onSubmit}>
              Voir les résultats d'architecture
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}