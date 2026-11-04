import { Check, Copy, Download, FileText } from "lucide-react";
import { useId, useState } from "react";
import Alert from "../../components/Alert";
import Button from "../../components/Button";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { useCopyToClipboard } from "../../hooks/useCopyToClipboard";
import type { ProjectSpec } from "../../interfaces/spec";
import { buildQuote } from "../../thunks/resultsThunks";
import { downloadTextFile } from "../../utils/download";

interface QuoteExportProps {
  spec: ProjectSpec;
  archId: string | null;
  archLabel: string | null;
}

const INPUT =
  "mt-1 w-full rounded-xl border border-brand-100 bg-brand-50/60 px-4 py-2.5 text-sm text-ink focus:border-brand-400 focus:bg-white focus:ring-2 focus:ring-brand-200 focus:outline-none";

export default function QuoteExport({ spec, archId, archLabel }: QuoteExportProps) {
  const dispatch = useAppDispatch();
  const { quote, quoteStatus, quoteError } = useAppSelector((state) => state.results);
  const { copied, copy } = useCopyToClipboard();

  const clientId = useId();
  const validityId = useId();
  const marginId = useId();
  const [client, setClient] = useState("");
  const [validity, setValidity] = useState("30");
  const [margin, setMargin] = useState("20");
  const [alternatives, setAlternatives] = useState(true);

  const validityNumber = Number(validity);
  const marginNumber = Number(margin);
  const validityOk = Number.isInteger(validityNumber) && validityNumber >= 1 && validityNumber <= 365;
  const marginOk = margin.trim() !== "" && marginNumber >= 0 && marginNumber <= 100;
  const loading = quoteStatus === "loading";
  const current = quote !== null && quote.arch_id === archId ? quote : null;

  const exportQuote = async () => {
    if (!archId || !validityOk || !marginOk) return;
    const result = await dispatch(
      buildQuote({
        spec,
        arch_id: archId,
        client_name: client.trim() || null,
        validity_days: validityNumber,
        margin_percent: marginNumber,
        include_alternatives: alternatives,
      }),
    );
    if (buildQuote.fulfilled.match(result)) downloadTextFile(result.payload.filename, result.payload.markdown);
  };

  return (
    <section aria-labelledby="export-title" className="rounded-xl2 border border-line bg-white p-6 shadow-card sm:p-8">
      <div className="flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-brand-700">
          <FileText className="size-5" aria-hidden />
        </span>
        <div>
          <h2 id="export-title" className="text-xl font-semibold text-ink">
            Besoin d'un justificatif pour un client ?
          </h2>
          <p className="mt-1 max-w-3xl text-sm text-body">
            Télécharge la section « Infrastructure » de ton devis, au format Markdown : coûts récurrents, maintenance,
            hypothèses, points à confirmer avec le client et façons de facturer.
            {archLabel ? ` Elle porte sur « ${archLabel} ».` : ""} Elle ne chiffre ni tes heures de développement ni la
            mise en place.
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor={clientId} className="text-sm font-medium text-ink">
            Nom du client <span className="font-normal text-muted">(facultatif)</span>
          </label>
          <input id={clientId} type="text" maxLength={120} value={client} onChange={(event) => setClient(event.target.value)} className={INPUT} />
        </div>
        <div>
          <label htmlFor={validityId} className="text-sm font-medium text-ink">
            Validité de l'estimation (jours)
          </label>
          <input
            id={validityId}
            type="number"
            min={1}
            max={365}
            value={validity}
            aria-invalid={!validityOk}
            onChange={(event) => setValidity(event.target.value)}
            className={INPUT}
          />
          {!validityOk && <p className="mt-1 text-xs text-danger">Entre un nombre entier de 1 à 365.</p>}
        </div>
        <div>
          <label htmlFor={marginId} className="text-sm font-medium text-ink">
            Marge du forfait refacturé (%)
          </label>
          <input
            id={marginId}
            type="number"
            min={0}
            max={100}
            value={margin}
            aria-invalid={!marginOk}
            onChange={(event) => setMargin(event.target.value)}
            className={INPUT}
          />
          {!marginOk && <p className="mt-1 text-xs text-danger">Entre un nombre de 0 à 100.</p>}
        </div>
      </div>

      <label className="mt-4 flex items-center gap-2 text-sm text-body">
        <input
          type="checkbox"
          checked={alternatives}
          onChange={(event) => setAlternatives(event.target.checked)}
          className="size-4 accent-brand-600"
        />
        Inclure le tableau des alternatives étudiées
      </label>

      {quoteStatus === "failed" && quoteError && (
        <Alert tone="danger" className="mt-4" title="L'export n'a pas abouti">
          {quoteError}
        </Alert>
      )}

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <Button
          loading={loading}
          disabled={!archId || !validityOk || !marginOk}
          iconBefore={<Download className="size-4" aria-hidden />}
          onClick={() => void exportQuote()}
        >
          Exporter le devis (Markdown)
        </Button>
        {current && (
          <>
            <Button
              variant="secondary"
              iconBefore={copied ? <Check className="size-4" aria-hidden /> : <Copy className="size-4" aria-hidden />}
              onClick={() => void copy(current.markdown)}
            >
              {copied ? "Copié" : "Copier le texte"}
            </Button>
            <Button variant="ghost" onClick={() => downloadTextFile(current.filename, current.markdown)}>
              Télécharger à nouveau
            </Button>
          </>
        )}
      </div>

      {current && (
        <p role="status" className="mt-3 text-sm text-ok">
          Fichier « {current.filename} » généré. Estimation valable jusqu'au {current.valid_until}.
        </p>
      )}
    </section>
  );
}