import { RotateCcw } from "lucide-react";
import { useEffect, useMemo } from "react";
import { Link, Navigate } from "react-router-dom";
import Alert from "../components/Alert";
import Button from "../components/Button";
import Skeleton from "../components/Skeleton";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { selectArchitecture } from "../slices/resultsSlice";
import { loadGuide } from "../thunks/guideThunks";
import FallbackGuide from "../widgets/deploy/FallbackGuide";
import GuideView from "../widgets/deploy/GuideView";

export default function DeployPage() {
  const dispatch = useAppDispatch();

  const spec = useAppSelector((state) => state.project.spec);
  const { evaluation, selectedArchId } = useAppSelector((state) => state.results);
  const { byArch, status, errors } = useAppSelector((state) => state.guide);

  // On ne déploie pas une architecture éliminée par les contraintes
  const usable = useMemo(
    () => (evaluation?.ranking ?? []).filter((arch) => arch.verdict !== "eliminated"),
    [evaluation],
  );
  const arch = usable.find((candidate) => candidate.id === selectedArchId) ?? usable[0] ?? null;
  const archId = arch?.id ?? null;
  const response = archId ? byArch[archId] : undefined;
  const loadStatus = archId ? (status[archId] ?? "idle") : "idle";

  useEffect(() => {
    if (spec && archId && !response && loadStatus === "idle") void dispatch(loadGuide({ archId, spec }));
  }, [spec, archId, response, loadStatus, dispatch]);

  if (!spec) return null;
  if (!evaluation) return <Navigate to="/resultats" replace />;

  return (
    <div className="mx-auto max-w-[1200px] px-5 pt-8 pb-16">
      {usable.length === 0 || !arch ? (
        <Alert tone="danger" title="Aucune architecture à déployer">
          Toutes les architectures ont été éliminées par tes contraintes.{" "}
          <Link to="/completer" className="font-semibold text-brand-700 underline">
            Modifier mes paramètres
          </Link>
        </Alert>
      ) : (
        <>
          <div className="mb-6 flex flex-wrap items-end gap-4">
            <div>
              <label htmlFor="deploy-arch" className="text-sm font-medium text-ink">
                Guide pour l'architecture
              </label>
              <select
                id="deploy-arch"
                value={arch.id}
                onChange={(event) => dispatch(selectArchitecture(event.target.value))}
                className="mt-1 block min-w-72 rounded-xl border border-brand-100 bg-white px-4 py-2.5 text-sm text-ink focus:border-brand-400 focus:ring-2 focus:ring-brand-200 focus:outline-none"
              >
                {usable.map((candidate) => (
                  <option key={candidate.id} value={candidate.id}>
                    {candidate.label}
                    {candidate.verdict === "recommended" ? " (recommandée)" : ""}
                  </option>
                ))}
              </select>
            </div>
            <Link to="/resultats" className="pb-2.5 text-sm font-medium text-brand-700 underline">
              Revenir aux résultats
            </Link>
          </div>

          {!response && loadStatus === "failed" && (
            <Alert tone="danger" title="Impossible de charger le guide">
              {errors[arch.id] ?? "Une erreur est survenue."}
              <div className="mt-3">
                <Button
                  variant="secondary"
                  iconBefore={<RotateCcw className="size-4" aria-hidden />}
                  onClick={() => void dispatch(loadGuide({ archId: arch.id, spec }))}
                >
                  Réessayer
                </Button>
              </div>
            </Alert>
          )}

          {!response && loadStatus !== "failed" && (
            <div role="status" aria-busy="true">
              <p className="sr-only">Chargement du guide…</p>
              <Skeleton className="h-44 w-full" />
              <Skeleton className="mt-6 h-32 w-full" />
              <Skeleton className="mt-6 h-96 w-full" />
            </div>
          )}

          {response && !response.available && <FallbackGuide fallback={response.fallback} label={arch.label} />}

          {response?.available && response.guide && (
            <GuideView key={arch.id} guide={response.guide} arch={arch} evaluation={evaluation} spec={spec} />
          )}
        </>
      )}
    </div>
  );
}