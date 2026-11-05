import { BookOpen, ChevronDown, ExternalLink, LifeBuoy, Video } from "lucide-react";
import type { StepHelp } from "../../interfaces/guide";
import { safeUrl } from "../../utils/safeUrl";

const LINK =
  "inline-flex items-center gap-2 rounded-xl bg-brand-100 px-3.5 py-2 text-sm font-semibold text-brand-800 transition hover:bg-brand-200";

export default function HelpBox({ help }: { help: StepHelp }) {
  const doc = safeUrl(help.doc_url);
  const video = safeUrl(help.youtube_url);

  return (
    <details className="group rounded-xl border border-line bg-white">
      <summary className="flex cursor-pointer list-none items-center gap-3 px-4 py-3 [&::-webkit-details-marker]:hidden">
        <LifeBuoy className="size-5 shrink-0 text-brand-600" aria-hidden />
        <span>
          <span className="block text-sm font-semibold text-ink">Ça n'a pas marché ?</span>
          <span className="block text-xs text-muted">Cause fréquente et où chercher</span>
        </span>
        <ChevronDown className="ml-auto size-4 text-muted transition group-open:rotate-180" aria-hidden />
      </summary>
      <div className="border-t border-line px-4 py-4 text-sm">
        <p className="font-medium text-ink">La cause la plus fréquente</p>
        <p className="mt-1 text-body">{help.common_cause}</p>
        <p className="mt-3 text-xs text-muted">
          C'est normal de bloquer. Copie le message d'erreur exact et colle-le dans un moteur de recherche : c'est
          souvent le plus rapide.
        </p>
        <div className="mt-3 flex flex-wrap gap-3">
          {doc && (
            <a href={doc} target="_blank" rel="noopener noreferrer" className={LINK}>
              <BookOpen className="size-4" aria-hidden />
              {help.doc_label ?? "Documentation officielle"}
              <ExternalLink className="size-3.5" aria-hidden />
              <span className="sr-only">(s'ouvre dans un nouvel onglet)</span>
            </a>
          )}
          {video && (
            <a href={video} target="_blank" rel="noopener noreferrer" className={LINK}>
              <Video className="size-4" aria-hidden />
              Chercher une vidéo
              <ExternalLink className="size-3.5" aria-hidden />
              <span className="sr-only">(s'ouvre dans un nouvel onglet)</span>
            </a>
          )}
        </div>
      </div>
    </details>
  );
}