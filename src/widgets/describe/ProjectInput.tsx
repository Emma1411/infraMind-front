import { ArrowRight, CircleCheck, CircleHelp, FileText, Lightbulb, Lock, RotateCcw } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Alert from "../../components/Alert";
import Button from "../../components/Button";
import { MAX_INPUT_CHARS } from "../../data/constants";
import { EXAMPLES } from "../../data/examples";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { setRawText } from "../../slices/projectSlice";
import { resetAll } from "../../slices/resetAll";
import { analyzeProject } from "../../thunks/analysisThunks";
import { formatNumber } from "../../utils/format";
import { looksLikeSecret } from "../../utils/secrets";
import AnalysisProgress from "./AnalysisProgress";

const TIPS = [
  "Le type d'application (site, API, application web) et ses technologies.",
  "Le nombre d'utilisateurs, et les moments de forte affluence.",
  "Les données : ce qu'on stocke, en quelle quantité, et si les utilisateurs envoient des fichiers.",
  "Les contraintes : budget, disponibilité attendue, données personnelles ou paiements.",
  "Qui maintiendra l'infrastructure après la livraison.",
  "Il n'est pas grave d'oublier un point : les questions de l'étape suivante combleront les manques.",
];

export default function ProjectInput() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { rawText, status, error, spec } = useAppSelector((state) => state.project);

  const [showTips, setShowTips] = useState(false);
  const pending = useRef<{ abort: () => void } | null>(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const length = rawText.trim().length;
  const empty = length === 0;
  const tooLong = length > MAX_INPUT_CHARS;
  const loading = status === "loading";
  const hasSecret = useMemo(() => looksLikeSecret(rawText), [rawText]);
  const activeExample = EXAMPLES.findIndex((example) => example.text === rawText);

  const loadExample = (index: number) => dispatch(setRawText(EXAMPLES[index].text));

  const analyze = async () => {
    if (empty || tooLong || loading) return;
    const request = dispatch(analyzeProject(rawText));
    pending.current = request;
    const result = await request;
    pending.current = null;
    if (mounted.current && analyzeProject.fulfilled.match(result)) navigate("/completer");
  };

  return (
    <section
      aria-labelledby="input-title"
      className="rounded-xl2 border border-line bg-white p-5 shadow-card sm:p-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="input-title" className="flex items-center gap-2 text-lg font-semibold text-ink">
          <span className="size-2 rounded-full bg-brand-600" aria-hidden />
          Cahier des charges ou descriptif libre
        </h2>
        <div className="flex items-center gap-1 text-sm">
          <Button
            variant="ghost"
            className="px-3 py-1.5 font-medium text-muted cursor-pointer"
            iconBefore={<RotateCcw className="size-4" aria-hidden />}
            disabled={loading || (rawText === "" && spec === null)}
            onClick={() => {
              dispatch(resetAll());
              setShowTips(false);
            }}
          >
            Réinitialiser
          </Button>
          <Button
            variant="ghost"
            className="px-3 py-1.5 font-medium cursor-pointe"
            iconBefore={<CircleHelp className="size-4" aria-hidden />}
            aria-expanded={showTips}
            onClick={() => setShowTips((value) => !value)}
          >
            Qu'est-ce qu'une bonne description ?
          </Button>
        </div>
      </div>

      {showTips && (
        <div className="mt-4 rounded-xl bg-brand-50 p-4 text-sm text-body">
          <p className="flex items-center gap-2 font-semibold text-brand-900">
            <Lightbulb className="size-4 text-brand-600" aria-hidden />
            Ce qui aide le plus l'analyse
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {TIPS.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
        </div>
      )}

      {spec !== null && !loading && (
        <Alert tone="info" className="mt-4">
          Tu as déjà une analyse en cours.{" "}
          <Link to="/completer" className="font-semibold text-brand-700 underline">
            Reprendre à l'étape 2
          </Link>
          . Relancer une analyse efface tes réponses et tes résultats.
        </Alert>
      )}

      <div className="mt-4">
        <label htmlFor="cahier" className="sr-only">
          Cahier des charges ou descriptif libre
        </label>
        <textarea
          id="cahier"
          value={rawText}
          onChange={(event) => dispatch(setRawText(event.target.value))}
          rows={11}
          disabled={loading}
          aria-describedby="cahier-aide"
          placeholder="Ex. : Application web de réservation pour un salon de coiffure. React, FastAPI, PostgreSQL. Environ 200 clients par jour, avec un pic le samedi. Budget d'environ 60 $ par mois…"
          className="w-full  rounded-xl border resize-none border-brand-100 bg-brand-50/60 p-4 text-sm leading-relaxed text-ink placeholder:text-muted/70 focus:border-brand-400 focus:bg-white focus:ring-2 focus:ring-brand-200 focus:outline-none disabled:opacity-70"
        />
        <div
          id="cahier-aide"
          className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-lg bg-brand-50 px-4 py-2.5 text-xs"
        >
          <span className="inline-flex items-center gap-2 text-brand-700">
            {empty ? (
              <>
                <FileText className="size-4" aria-hidden />
                Colle ton texte ou charge un exemple.
              </>
            ) : (
              <>
                <CircleCheck className="size-4" aria-hidden />
                Prêt à être analysé.
              </>
            )}
          </span>
          <span className={`font-mono ${tooLong ? "font-semibold text-danger" : "text-muted"}`}>
            {formatNumber(length)} / {formatNumber(MAX_INPUT_CHARS)} caractères
          </span>
        </div>
      </div>

      {tooLong && (
        <Alert tone="danger" className="mt-3" title="Ton texte est trop long">
          La limite est de {formatNumber(MAX_INPUT_CHARS)} caractères. Garde l'essentiel : type d'application,
          technologies, trafic, données, budget et contraintes.
        </Alert>
      )}

      {hasSecret && (
        <Alert tone="warn" className="mt-3" title="On dirait qu'un secret se cache dans ton texte">
          Certains motifs évidents sont masqués avant l'envoi, mais pas tous. Retire tout mot de passe, clé ou jeton
          avant de lancer l'analyse.
        </Alert>
      )}

      {status === "failed" && error && (
        <Alert tone="danger" className="mt-3" title="L'analyse n'a pas abouti">
          {error}
        </Alert>
      )}

      {loading && <AnalysisProgress />}

      <div className="mt-6">
        <p className="text-xs font-semibold tracking-wide text-muted uppercase">Ou charger un modèle type en 1 clic</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {EXAMPLES.map((example, index) => (
            <button
              key={example.id}
              type="button"
              disabled={loading}
              aria-pressed={activeExample === index}
              onClick={() => loadExample(index)}
              className={`rounded-xl border p-4 cursor-pointer text-left transition disabled:opacity-60 ${
                activeExample === index
                  ? "border-brand-400 bg-brand-50 ring-2 ring-brand-200"
                  : "border-line bg-white hover:border-brand-300 hover:bg-brand-50/50"
              }`}
            >
              <span className="block text-right font-mono text-[11px] text-muted">{example.tag}</span>
              <span className="mt-1 block font-semibold text-ink">{example.title}</span>
              <span className="mt-0.5 block text-xs text-muted">{example.teaser}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-4 border-t border-line pt-5 lg:flex-row lg:items-center lg:justify-between">
        <p className="flex items-start gap-2 text-xs text-muted">
          <Lock className="mt-0.5 size-3.5 shrink-0" aria-hidden />
          Ton texte est envoyé à un service d'IA externe et n'est pas stocké.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="secondary"
            disabled={loading}
            onClick={() => loadExample(activeExample === -1 ? 0 : (activeExample + 1) % EXAMPLES.length)}
          >
            Charger un autre exemple
          </Button>
          {loading && (
            <Button variant="ghost" onClick={() => pending.current?.abort()}>
              Annuler
            </Button>
          )}
          <Button
            loading={loading}
            disabled={empty || tooLong}
            icon={<ArrowRight className="size-4" aria-hidden />}
            onClick={() => void analyze()}
          >
            Analyser mon projet
          </Button>
        </div>
      </div>
    </section>
  );
}