import { ChevronDown, ListChecks } from "lucide-react";
import { useCallback, useMemo } from "react";
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
  domainProgress,
  draftKey,
  entryAnchors,
  essentialQuestions,
  isAnswered,
  isUnknown,
  twoDigits,
  type DomainProgress,
} from "../utils/questions";
import ActionBar from "../widgets/complete/ActionBar";
import BudgetCard from "../widgets/complete/BudgetCard";
import DomainRail from "../widgets/complete/DomainRail";
import HourlyRateCard from "../widgets/complete/HourlyRateCard";
import ProjectNameCard from "../widgets/complete/ProjectNameCard";
import QuestionCard from "../widgets/complete/QuestionCard";

export default function CompletePage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { baseSpec, spec, secretsMasked, answersStatus, answersError } = useAppSelector((state) => state.project);
  const { items, draft, lastSavedDraft } = useAppSelector((state) => state.questions);
  const evaluation = useAppSelector((state) => state.results.evaluation);

  const essential = useMemo(() => essentialQuestions(items), [items]);
  const details = useMemo(() => detailQuestions(items), [items]);
  const entries = useMemo(() => buildEntries(essential), [essential]);
  const { perEntry, byDomain } = useMemo(() => entryAnchors(entries), [entries]);

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

  const progress = Object.fromEntries(DOMAINS.map((domain) => [domain, domainProgress(domain, items, draft)])) as Record<
    DomainKey,
    DomainProgress
  >;
  const answered = essential.filter((question) => isAnswered(draft, question.path)).length;
  const pending = essential.length - answered;
  const unknownCount = Object.values(draft).filter(isUnknown).length;
  const currency = currentCurrency(spec, draft);

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
              Plus tes précisions sont nettes, plus les coûts seront fiables. Chaque incertitude est comblée par une
              hypothèse prudente, affichée dans les résultats.
            </p>
          </div>
          <div className="flex items-center gap-3 rounded-xl2 bg-brand-50 px-5 py-3">
            <ListChecks className="size-5 text-brand-600" aria-hidden />
            <div>
              <p className="text-xs text-muted">Questions essentielles répondues</p>
              <p className="font-semibold text-brand-800">
                {answered} sur {essential.length}
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
            total={essential.length}
            onJump={jumpTo}
          />

          <div className="space-y-5">
            <ProjectNameCard />

            {entries.length === 0 && (
              <Alert tone="ok" title="Rien d'essentiel à compléter">
                Ton texte contenait toutes les informations essentielles. Tu peux préciser un tarif horaire ci-dessous, ou
                passer directement aux résultats.
              </Alert>
            )}

            {entries.map((entry, index) =>
              entry.kind === "budget" ? (
                <BudgetCard
                  key="budget"
                  tag={twoDigits(index + 1)}
                  anchorId={perEntry[index]}
                  budget={entry.budget}
                  draft={draft}
                  onChange={setValue}
                  onClear={clearValue}
                />
              ) : (
                <QuestionCard
                  key={entry.question.path}
                  question={entry.question}
                  tag={twoDigits(index + 1)}
                  anchorId={perEntry[index]}
                  value={draft[entry.question.path]}
                  currency={currency}
                  onChange={setValue}
                  onClear={clearValue}
                />
              ),
            )}

            <HourlyRateCard draft={draft} currency={currency} onChange={setValue} onClear={clearValue} />

            {details.length > 0 && (
              <details className="group rounded-xl2 border border-line bg-white shadow-card">
                <summary className="flex cursor-pointer list-none items-center gap-3 px-6 py-5 [&::-webkit-details-marker]:hidden">
                  <span className="text-lg font-semibold text-ink">Détails supplémentaires</span>
                  <span className="text-sm text-muted">
                    · {details.length} question{details.length > 1 ? "s" : ""} avancée{details.length > 1 ? "s" : ""}{" "}
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
                      value={draft[question.path]}
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