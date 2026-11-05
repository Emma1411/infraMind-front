import { Download, FileText, Gauge, ListChecks, Wallet } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Badge from "../../components/Badge";
import Button from "../../components/Button";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import type { ArchitectureResult, EvaluationResult } from "../../interfaces/evaluation";
import type { RenderedGuide } from "../../interfaces/guide";
import type { ProjectSpec } from "../../interfaces/spec";
import { markStepDone, togglePrerequisite } from "../../slices/guideSlice";
import { downloadTextFile } from "../../utils/download";
import { guideToMarkdown } from "../../utils/guideMarkdown";
import { specRows } from "../../utils/guideParams";
import { detectOs, type OsKey } from "../../utils/os";
import { costRange } from "../../utils/results";
import QuoteExport from "../results/QuoteExport";
import CleanupSection from "./CleanupSection";
import Prerequisites from "./Prerequisites";
import StepCard from "./StepCard";
import StepList from "./StepList";
import { safeUrl } from "../../utils/safeUrl";

interface GuideViewProps {
  guide: RenderedGuide;
  arch: ArchitectureResult;
  evaluation: EvaluationResult;
  spec: ProjectSpec;
}

const NO_STEPS: string[] = [];
const NO_INDEXES: number[] = [];

export default function GuideView({ guide, arch, evaluation, spec }: GuideViewProps) {
  const dispatch = useAppDispatch();
  const doneIds = useAppSelector((state) => state.guide.done[arch.id] ?? NO_STEPS);
  const prereqDone = useAppSelector((state) => state.guide.prereqDone[arch.id] ?? NO_INDEXES);

  const [os, setOs] = useState<OsKey>(detectOs);
  const [current, setCurrent] = useState(() => {
    const firstPending = guide.steps.findIndex((step) => !step.optional && !doneIds.includes(step.id));
    return Math.max(0, firstPending);
  });
  const stepRef = useRef<HTMLElement>(null);
  const firstRender = useRef(true);

  // Quand l'étape change, la nouvelle étape reçoit le focus et passe en haut de l'écran
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    stepRef.current?.focus({ preventScroll: true });
    stepRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [current]);

  const steps = guide.steps;
  const step = steps[current];
  const hasDatabase = steps.some((candidate) => candidate.id === "base");
  const rows = specRows(guide.parameters, hasDatabase);
  const required = steps.filter((candidate) => !candidate.optional);
  const doneRequired = required.filter((candidate) => doneIds.includes(candidate.id)).length;
  const percent = required.length === 0 ? 0 : Math.round((doneRequired / required.length) * 100);
  const range = costRange(arch, evaluation);
  const tested = guide.tested_on !== null;

  const next = () => {
    dispatch(markStepDone({ archId: arch.id, stepId: step.id }));
    if (current < steps.length - 1) {
      setCurrent(current + 1);
    } else {
      document.getElementById("nettoyage")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const download = () => {
    downloadTextFile(`guide-deploiement-${arch.id}.md`, guideToMarkdown(guide, arch.label, rows));
  };

  return (
    <>
      <header className="rounded-xl2 border border-line bg-white p-6 shadow-card sm:p-8">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="neutral" icon={<ListChecks className="size-3.5" aria-hidden />}>
            Déploiement pas à pas
          </Badge>
          <Badge tone={tested ? "ok" : "warn"}>{guide.status_label}</Badge>
        </div>
        <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <h1 className="text-3xl leading-tight font-bold text-brand-900 sm:text-4xl">{guide.title}</h1>
            <p className="mt-3 text-body">{guide.intro}</p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            <Button variant="secondary" iconBefore={<Download className="size-4" aria-hidden />} onClick={download}>
              Télécharger .md
            </Button>
            <Button
              iconBefore={<FileText className="size-4" aria-hidden />}
              onClick={() => document.getElementById("export")?.scrollIntoView({ behavior: "smooth", block: "start" })}
            >
              Devis et synthèse
            </Button>
          </div>
        </div>
      </header>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <section aria-labelledby="specs-title" className="rounded-xl2 border border-line bg-white p-5 shadow-card">
          <h2 id="specs-title" className="flex items-center gap-2 text-xs font-semibold tracking-wide text-muted uppercase">
            <Gauge className="size-4 text-brand-600" aria-hidden />
            Valeurs de ton projet
          </h2>
          <dl className="mt-3 space-y-1.5 text-sm">
            {rows.map((row) => (
              <div key={row.label} className="flex flex-wrap justify-between gap-x-3">
                <dt className="text-muted">{row.label}</dt>
                <dd className="font-medium text-ink">{row.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section aria-labelledby="budget-title" className="rounded-xl2 border border-line bg-white p-5 shadow-card">
          <h2 id="budget-title" className="flex items-center gap-2 text-xs font-semibold tracking-wide text-muted uppercase">
            <Wallet className="size-4 text-brand-600" aria-hidden />
            Fourchette budgétaire
          </h2>
          <p className="mt-3 text-2xl font-bold text-brand-900">{range.primary}</p>
          <p className="text-sm text-muted">par mois, hors taxes</p>
          {range.secondary && <p className="mt-1 text-sm font-medium text-brand-700">{range.secondary}</p>}
          <p className="mt-2 text-xs text-muted">Une base de données ou un serveur coûte tant qu'il existe, même sans visiteur.</p>
        </section>

        <section aria-labelledby="progress-title" className="rounded-xl2 border border-line bg-white p-5 shadow-card">
          <h2 id="progress-title" className="flex items-center gap-2 text-xs font-semibold tracking-wide text-muted uppercase">
            <ListChecks className="size-4 text-brand-600" aria-hidden />
            Progression
          </h2>
          <p className="mt-3 text-2xl font-bold text-brand-900">
            {doneRequired} / {required.length}
            <span className="ml-1 text-sm font-normal text-muted">étapes</span>
          </p>
          <div
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={percent}
            aria-label="Progression du déploiement"
            className="mt-2 h-1.5 overflow-hidden rounded-full bg-brand-100"
          >
            <div className="h-full rounded-full bg-brand-600 transition-all" style={{ width: `${percent}%` }} />
          </div>
          <p className="mt-2 text-xs text-muted">Les étapes facultatives ne comptent pas. Ta progression est gardée tant que tu restes sur le site.</p>
        </section>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[19rem_minmax(0,1fr)]">
        <div className="space-y-6 lg:sticky lg:top-28 lg:max-h-[calc(100dvh-8rem)] lg:self-start lg:overflow-y-auto">
          <Prerequisites
            items={guide.prerequisites}
            doneIndexes={prereqDone}
            onToggle={(index) => dispatch(togglePrerequisite({ archId: arch.id, index }))}
          />
          <StepList steps={steps} current={current} doneIds={doneIds} onSelect={setCurrent} />
        </div>

        <div className="min-w-0 space-y-6">
          <StepCard
            key={step.id}
            step={step}
            number={current + 1}
            total={steps.length}
            os={os}
            onOsChange={setOs}
            done={doneIds.includes(step.id)}
            isFirst={current === 0}
            isLast={current === steps.length - 1}
            nextTitle={steps[current + 1]?.title ?? null}
            onPrev={() => setCurrent(Math.max(0, current - 1))}
            onNext={next}
            sectionRef={stepRef}
          />

          {steps.slice(current + 1, current + 3).length > 0 && (
            <ul className="grid gap-4 sm:grid-cols-2" aria-label="Prochaines étapes">
              {steps.slice(current + 1, current + 3).map((upcoming, offset) => (
                <li key={upcoming.id} className="rounded-xl2 border border-line bg-white p-5 shadow-card">
                  <p className="text-xs font-semibold tracking-wide text-muted uppercase">
                    Étape {current + 2 + offset} (suivante)
                  </p>
                  <h3 className="mt-1 font-semibold text-ink">{upcoming.title}</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-body">{upcoming.why}</p>
                  <Button variant="ghost" className="mt-2 px-0" onClick={() => setCurrent(current + 1 + offset)}>
                    Voir cette étape
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <CleanupSection steps={guide.cleanup} os={os} onOsChange={setOs} />

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <section aria-labelledby="limits-title" className="rounded-xl2 border border-line bg-white p-6 shadow-card">
          <h2 id="limits-title" className="text-lg font-semibold text-ink">
            Limites de ce guide
          </h2>
          <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-body">
            {guide.limits.map((limit) => (
              <li key={limit}>{limit}</li>
            ))}
          </ul>
        </section>
        <section aria-labelledby="sources-title" className="rounded-xl2 border border-line bg-white p-6 shadow-card">
          <h2 id="sources-title" className="text-lg font-semibold text-ink">
            Sources
          </h2>
          <p className="mt-1 text-xs text-muted">Pages de documentation sur lesquelles ce guide s'appuie.</p>
          <ul className="mt-3 space-y-1.5 text-sm">
            {guide.sources.map((source) => {
              const url = safeUrl(source.url);
              return (
                <li key={source.url}>
                  {url ? (
                    <a href={url} target="_blank" rel="noopener noreferrer" className="font-medium text-brand-700 underline">
                      {source.label}
                      <span className="sr-only"> (s'ouvre dans un nouvel onglet)</span>
                    </a>
                  ) : (
                    source.label
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      </div>

      <section
        aria-labelledby="archive-title"
        className="mt-10 flex flex-col gap-4 rounded-xl2 bg-brand-50 p-5 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h2 id="archive-title" className="font-semibold text-brand-900">
            Besoin d'archiver ce guide dans ton dépôt Git ?
          </h2>
          <p className="mt-1 text-sm text-body">
            Télécharge un fichier Markdown prêt à ranger dans ton projet (par exemple{" "}
            <code className="rounded bg-white px-1.5 py-0.5 font-mono text-xs">docs/deploy.md</code>), avec tes valeurs
            déjà remplies.
          </p>
        </div>
        <Button iconBefore={<Download className="size-4" aria-hidden />} onClick={download}>
          Télécharger le guide (.md)
        </Button>
      </section>

      <div id="export" className="mt-6 scroll-mt-28">
        <QuoteExport spec={spec} archId={arch.id} archLabel={arch.label} />
      </div>
    </>
  );
}