import { Check, Copy } from "lucide-react";
import { useCopyToClipboard } from "../../hooks/useCopyToClipboard";
import type { CommandBlock } from "../../interfaces/guide";
import { splitPlaceholders } from "../../utils/placeholders";

const LANGUAGE_LABEL = { bash: "bash", powershell: "PowerShell", yaml: "YAML", text: "texte" } as const;

export default function CommandSnippet({ block }: { block: CommandBlock }) {
  const { copied, copy } = useCopyToClipboard();
  const segments = splitPlaceholders(block.code);
  const hasPlaceholder = segments.some((segment) => segment.placeholder);

  return (
    <figure className="overflow-hidden rounded-xl bg-brand-950">
      <figcaption className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-2.5">
        <span className="min-w-0 text-xs text-brand-200">{block.label}</span>
        <span className="flex shrink-0 items-center gap-2">
          <span className="font-mono text-[11px] text-brand-300">{LANGUAGE_LABEL[block.language]}</span>
          <button
            type="button"
            onClick={() => void copy(block.code)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-2.5 py-1.5 text-xs font-medium text-white transition hover:bg-white/20"
          >
            {copied ? <Check className="size-3.5" aria-hidden /> : <Copy className="size-3.5" aria-hidden />}
            {copied ? "Copié" : "Copier la commande"}
          </button>
        </span>
      </figcaption>
      <pre tabIndex={0} className="overflow-x-auto p-4 font-mono text-[13px] leading-relaxed text-brand-50">
        <code>
          {segments.map((segment, index) =>
            segment.placeholder ? (
              <mark key={index} className="rounded bg-brand-500/30 px-1 text-brand-100 ring-1 ring-brand-300/50">
                {segment.text}
              </mark>
            ) : (
              <span key={index}>{segment.text}</span>
            ),
          )}
        </code>
      </pre>
      {hasPlaceholder && (
        <p className="border-t border-white/10 px-4 py-2 text-[11px] text-brand-200">
          Les valeurs surlignées sont à remplacer par les tiennes.
        </p>
      )}
      <span role="status" className="sr-only">
        {copied ? "Commande copiée" : ""}
      </span>
    </figure>
  );
}