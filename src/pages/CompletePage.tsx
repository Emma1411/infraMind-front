import { ChevronDown, ListChecks } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Alert from "../components/Alert";
import { DOMAIN_LIST } from "../data/domains";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { useActiveSection } from "../hooks/useActiveSection";
import type { AnswerValue } from "../interfaces/analysis";
import { DOMAINS, type DomainKey } from "../interfaces/spec";
import { removeAnswer, setAnswer } from "../slices/questionsSlice";
import { saveAnswers } from "../thunks/analysisThunks";
import { runEvaluation } from "../thunks/resultsThunks";
import {
  buildEntries,
  currentCurrency,
  detailQuestions,
  displayValue,
  domainProgress,
  draftKey,
  entryAnchors,
  entryKey,
  entryState,
  essentialQuestions,
  originOf,
  twoDigits,
  type DomainProgress,
} from "../utils/questions";
import ActionBar from "../widgets/complete/ActionBar";
import BudgetCard from "../widgets/complete/BudgetCard";
import DetectedSummary from "../widgets/complete/DetectedSummary";
import DomainRail from "../widgets/complete/DomainRail";
import HourlyRateCard from "../widgets/complete/HourlyRateCard";
import ProjectNameCard from "../widgets/complete/ProjectNameCard";
import QuestionCard from "../widgets/complete/QuestionCard";

type Mode = "all" | "todo";

export default function CompletePage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { baseSpec, secretsMasked, answersStatus, answersError } = useAppSelector((state) => state.project);
  const { items, draft, lastSavedDraft } = useAppSelector((state) => state.questions);
  const evaluation = useAppSelector((state) => state.results.evaluation);

  const [mode, setMode] = useState<Mode>("all");
  // Cartes à compléter au moment où le filtre est activé : une carte remplie ne disparaît pas sous les doigts
  const [snapshot, setSnapshot] = useState<string[]>([]);

  const essential = useMemo(() => essentialQuestions(items), [items]);
  const details = useMemo(() => detailQuestions(items), [items]);
  const allEntries = useMemo(() => buildEntries(essential), [essential]);
  const numbered = useMemo(() => allEntries.map((entry, index) => ({ entry, number: index + 1 })), [allEntries]);
  const visible = useMemo(
    () => (mode === "all" ? numbered : numbered.filter(({ entry }) => snapshot.includes(entryKey(entry)))),
    [mode, numbered, snapshot],
  );
  const { perEntry, byDomain } = useMemo(() => entryAnchors(visible.map(({ entry }) => entry)), [visible]);

  const activeId = useActiveSection(useMemo(() => Object.values(byDomain), [byDomain]));
  const activeDomain = (activeId?.replace("domaine-", "") ?? null) as DomainKey | null;

  const setValue = useCallback(
    (path: string, value: AnswerValue) => {
      dispatch(setAnswer({ path, value }));
    },
    [dispatch],
  );
  const clearValue = useCallback(
    (path: string) => {
      dispatch(removeAnswer(path));
    },
    [dispatch],
  );

  if (!baseSpec) return null;

  const states = allEntries.map((entry) => entryState(entry, draft));
  const answered = states.filter((state) => state !== "pending").length;
  const pending = states.length - answered;
  const unknownCount = states.filter((state) => state === "unknown").length;
  const detectedCount = allEntries.filter((entry) => entryState(entry, {}) === "answered").length;
  const progress = Object.fromEntries(
    DOMAINS.map((domain) => [domain, domainProgress(domain, allEntries, details, draft)]),
  ) as Record<DomainKey, DomainProgress>;
  const currency = currentCurrency(baseSpec, draft);
  const detailDetected = details.filter((question) => originOf(question, {}) === "detected").length;

  const switchMode = (next: Mode) => {
    if (next === "todo") {
      setSnapshot(allEntries.filter((entry) => entryState(entry, draft) === "pending").map(entryKey));
    }
    setMode(next);
  };

  const jumpTo = (domain: DomainKey) => {
    const id = byDomain[domain];
    if (id) document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const submit = async () => {
    const answers = { ...draft };

    // Rien n'a changé depuis le dernier calcul : on réutilise les résultats
    if (evaluation !== null && lastSavedDraft === draftKey(answers)) {
      navigate("/resultats");
      return;
    }

    const saved = await dispatch(saveAnswers({ baseSpec, answers }));
    if (!saveAnswers.fulfilled.match(saved)) return;
    void dispatch(runEvaluation(saved.payload.spec));
    navigate("/resultats");
  };

  const filterButton = (target: Mode, label: string) => (
    <button
      type="button"
      aria-pressed={mode === target}
      onClick={() => switchMode(target)}
      className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
        mode === target ? "bg-white text-brand-800 shadow-sm" : "text-body hover:text-brand-700"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div>
      <div className="mx-auto max-w-[1200px] px-5 pt-8 pb-10">
        <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="flex items-center gap-2 text-xs font-semibold tracking-wide text-brand-700 uppercase">
              <span className="size-1.5 rounded-full bg-brand-600" aria-hidden />
              Étape 2 sur 4 · Calibration technique
            </p>
            <h1 className="mt-2 text-3xl font-bold text-brand-900 sm:text-4xl">Compléter les dimensions architecturales</h1>
            <p className="mt-3 max-w-2xl text-body">
              Vérifie ce que nous avons trouvé dans ton texte et complète le reste. Chaque incertitude est comblée par
              une hypothèse prudente, affichée dans les résultats.
            </p>
          </div>
          <div className="flex items-center gap-3 rounded-xl2 bg-brand-50 px-5 py-3">
            <ListChecks className="size-5 text-brand-600" aria-hidden />
            <div>
              <p className="text-xs text-muted">Questions essentielles renseignées</p>
              <p className="font-semibold text-brand-800">
                {answered} sur {allEntries.length}
                <span className="font-normal text-muted"> · dont {detectedCount} détectées</span>
              </p>
            </div>
          </div>
        </header>

        {secretsMasked && (
          <Alert tone="info" className="mt-6">
            Nous avons masqué des informations qui ressemblaient à des secrets avant l'analyse de ton texte.
          </Alert>
        )}

        <div className="mt-6 lg:hidden">
          <label htmlFor="jump" className="text-sm font-medium text-ink">
            Aller au domaine
          </label>
          <select
            id="jump"
            defaultValue=""
            onChange={(event) => event.target.value && jumpTo(event.target.value as DomainKey)}
            className="mt-1 w-full rounded-xl border border-brand-100 bg-white px-4 py-3 text-sm text-ink"
          >
            <option value="">Choisir…</option>
            {DOMAIN_LIST.filter(({ key }) => byDomain[key]).map(({ key, label }) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[18rem_minmax(0,1fr)]">
          <DomainRail
            progress={progress}
            anchors={byDomain}
            activeDomain={activeDomain}
            answered={answered}
            total={allEntries.length}
            onJump={jumpTo}
          />

          <div className="space-y-5">
            <ProjectNameCard />
            <DetectedSummary spec={baseSpec} detected={detectedCount} total={allEntries.length} />

            <div className="flex flex-wrap items-center justify-between gap-3">
              <div role="group" aria-label="Filtrer les questions" className="inline-flex rounded-xl bg-brand-50 p-1">
                {filterButton("all", "Tout voir")}
                {filterButton("todo", `À compléter (${pending})`)}
              </div>
              <p className="text-sm text-muted">
                {mode === "all"
                  ? "Les valeurs détectées sont modifiables."
                  : "Seules les questions sans réponse au moment du filtre sont affichées."}
              </p>
            </div>

            {mode === "todo" && visible.length === 0 && (
              <Alert tone="ok" title="Tout est renseigné">
                Aucune question n'est restée sans réponse. Passe à « Tout voir » pour relire ce qui a été détecté.
              </Alert>
            )}

            {visible.map(({ entry, number }, index) =>
              entry.kind === "budget" ? (
                <BudgetCard
                  key="budget"
                  tag={twoDigits(number)}
                  anchorId={perEntry[index]}
                  budget={entry.budget}
                  currencyQuestion={entry.currency}
                  draft={draft}
                  onChange={setValue}
                  onClear={clearValue}
                />
              ) : (
                <QuestionCard
                  key={entry.question.path}
                  question={entry.question}
                  tag={twoDigits(number)}
                  anchorId={perEntry[index]}
                  value={displayValue(entry.question, draft)}
                  origin={originOf(entry.question, draft)}
                  currency={currency}
                  onChange={setValue}
                  onClear={clearValue}
                />
              ),
            )}

            <HourlyRateCard draft={draft} currency={currency} onChange={setValue} onClear={clearValue} />

            {details.length > 0 && (
              <details className="group rounded-xl2 border border-line bg-white shadow-card">
                <summary className="flex cursor-pointer list-none flex-wrap items-center gap-x-3 gap-y-1 px-6 py-5 [&::-webkit-details-marker]:hidden">
                  <span className="text-lg font-semibold text-ink">Détails supplémentaires</span>
                  <span className="text-sm text-muted">
                    · {details.length} question{details.length > 1 ? "s" : ""} avancée{details.length > 1 ? "s" : ""}
                    {detailDetected > 0 ? `, dont ${detailDetected} détectée${detailDetected > 1 ? "s" : ""}` : ""}{" "}
                    (facultatif)
                  </span>
                  <ChevronDown className="ml-auto size-5 text-muted transition group-open:rotate-180" aria-hidden />
                </summary>
                <div className="space-y-5 border-t border-line p-5 sm:p-6">
                  {details.map((question) => (
                    <QuestionCard
                      key={question.path}
                      question={question}
                      tag="DÉTAIL"
                      value={displayValue(question, draft)}
                      origin={originOf(question, draft)}
                      currency={currency}
                      onChange={setValue}
                      onClear={clearValue}
                    />
                  ))}
                </div>
              </details>
            )}
          </div>
        </div>
      </div>

      <ActionBar
        pending={pending}
        unknownCount={unknownCount}
        loading={answersStatus === "loading"}
        error={answersStatus === "failed" ? answersError : null}
        onSubmit={() => void submit()}
      />
    </div>
  );
}