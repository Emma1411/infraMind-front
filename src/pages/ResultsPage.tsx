import { ArrowRight, RotateCcw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Alert from "../components/Alert";
import Button from "../components/Button";
import Skeleton from "../components/Skeleton";
import Tabs, { type TabItem } from "../components/Tabs";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { selectArchitecture } from "../slices/resultsSlice";
import { loadReport, runEvaluation } from "../thunks/resultsThunks";
import CompareTab from "../widgets/results/CompareTab";
import CostsTab from "../widgets/results/CostsTab";
import GraphTab from "../widgets/results/GraphTab";
import QuoteExport from "../widgets/results/QuoteExport";
import RankingTab from "../widgets/results/RankingTab";
import ReportPanel from "../widgets/results/ReportPanel";
import SensitivityTab from "../widgets/results/SensitivityTab";
import SummaryBanner from "../widgets/results/SummaryBanner";

const PREFIX = "results";

export default function ResultsPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const spec = useAppSelector((state) => state.project.spec);
  const { evaluation, evaluationStatus, evaluationError, selectedArchId, report, reportStatus, reportError } =
    useAppSelector((state) => state.results);
  const [tab, setTab] = useState("ranking");

  // Arrivée directe sur l'écran sans calcul : on le lance
  useEffect(() => {
    if (spec && evaluation === null && evaluationStatus === "idle") void dispatch(runEvaluation(spec));
  }, [spec, evaluation, evaluationStatus, dispatch]);

  // Le rapport IA se charge une fois le résultat arrivé
  useEffect(() => {
    if (spec && evaluation && reportStatus === "idle") void dispatch(loadReport(spec));
  }, [spec, evaluation, reportStatus, dispatch]);

  const labels = useMemo(
    () => Object.fromEntries((evaluation?.ranking ?? []).map((arch) => [arch.id, arch.label])),
    [evaluation],
  );

  if (!spec) return null;

  if (!evaluation) {
    return (
      <div className="mx-auto max-w-[1200px] px-5 pt-8 pb-16">
        {evaluationStatus === "failed" ? (
          <Alert tone="danger" title="Impossible de calculer les résultats">
            {evaluationError}
            <div className="mt-3 flex gap-3">
              <Button variant="secondary" iconBefore={<RotateCcw className="size-4" aria-hidden />} onClick={() => void dispatch(runEvaluation(spec))}>
                Réessayer
              </Button>
              <Button variant="ghost" onClick={() => navigate("/completer")}>
                Revenir à l'étape 2
              </Button>
            </div>
          </Alert>
        ) : (
          <div role="status" aria-busy="true">
            <p className="sr-only">Calcul des résultats en cours…</p>
            <Skeleton className="h-56 w-full" />
            <Skeleton className="mt-6 h-12 w-2/3" />
            <Skeleton className="mt-6 h-64 w-full" />
          </div>
        )}
      </div>
    );
  }

  const recommended = evaluation.ranking.find((arch) => arch.id === evaluation.recommended_id) ?? null;
  const selected =
    evaluation.ranking.find((arch) => arch.id === selectedArchId) ?? recommended ?? evaluation.ranking[0];

  const tabs: TabItem[] = [
    { id: "ranking", label: "Classement", badge: evaluation.ranking.length },
    { id: "graph", label: "Schéma" },
    { id: "costs", label: "Répartition des coûts" },
    { id: "sensitivity", label: "Sensibilité du devis" },
    { id: "compare", label: "Comparer" },
  ];

  const select = (id: string) => dispatch(selectArchitecture(id));
  const deploy = (id: string) => {
    select(id);
    navigate("/deployer");
  };

  return (
    <div className="mx-auto max-w-[1200px] px-5 pt-8 pb-16">
      <SummaryBanner evaluation={evaluation} recommended={recommended} />

      <div className="mt-6">
        <ReportPanel
          report={report}
          status={reportStatus}
          error={reportError}
          labels={labels}
          onRetry={() => void dispatch(loadReport(spec))}
        />
      </div>

      <div className="mt-10">
        <Tabs tabs={tabs} active={tab} onChange={setTab} label="Vues des résultats" idPrefix={PREFIX} />
        <div
          role="tabpanel"
          id={`${PREFIX}-panel-${tab}`}
          aria-labelledby={`${PREFIX}-tab-${tab}`}
          tabIndex={0}
          className="mt-6 focus:outline-none"
        >
          {tab === "ranking" && <RankingTab evaluation={evaluation} selected={selected} onSelect={select} onDeploy={deploy} />}
          {tab === "graph" && <GraphTab evaluation={evaluation} selected={selected} onSelect={select} />}
          {tab === "costs" && <CostsTab evaluation={evaluation} />}
          {tab === "sensitivity" && <SensitivityTab evaluation={evaluation} onEdit={() => navigate("/completer")} />}
          {tab === "compare" && <CompareTab evaluation={evaluation} />}
        </div>
      </div>

      <div className="mt-10">
        <QuoteExport spec={spec} archId={selected.id} archLabel={selected.label} />
      </div>

      <div className="mt-8 flex flex-col gap-4 rounded-xl2 bg-brand-50 p-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-body">Un chiffre te semble faux ? Modifie une réponse : tout est recalculé.</p>
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" onClick={() => navigate("/completer")}>
            Modifier mes paramètres
          </Button>
          <Button icon={<ArrowRight className="size-4" aria-hidden />} onClick={() => navigate("/deployer")}>
            Passer à l'étape 4 : Déployer
          </Button>
        </div>
      </div>
    </div>
  );
}