import { ExternalLink, Video } from "lucide-react";
import Alert from "../../components/Alert";
import type { GuideFallback } from "../../interfaces/guide";
import { safeUrl } from "../../utils/safeUrl";

export default function FallbackGuide({ fallback, label }: { fallback: GuideFallback | null; label: string }) {
  const video = safeUrl(fallback?.youtube_url);
  return (
    <Alert tone="info" title="Guide bientôt disponible">
      {fallback?.message ?? `Le guide pas à pas pour « ${label} » n'est pas encore disponible.`}
      {video && (
        <a
          href={video}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-2 rounded-xl bg-brand-100 px-3.5 py-2 text-sm font-semibold text-brand-800 transition hover:bg-brand-200"
        >
          <Video className="size-4" aria-hidden />
          Chercher un tutoriel vidéo
          <ExternalLink className="size-3.5" aria-hidden />
          <span className="sr-only">(s'ouvre dans un nouvel onglet)</span>
        </a>
      )}
    </Alert>
  );
}