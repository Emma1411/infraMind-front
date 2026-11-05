export interface Segment {
  text: string;
  placeholder: boolean;
}

// Valeurs à remplacer : VOTRE_IP_SERVEUR, NOM_DU_SERVICE, CHEMIN_VERS_LA_CLE, NUMERO_PROJET, et le PORT d'un Caddyfile
const PLACEHOLDER = /\b(?:VOTRE|NOM|NUMERO|CHEMIN)(?:_[A-Z0-9]+)+\b|(?<=:)PORT\b/g;

/** Découpe une commande pour surligner les valeurs que l'utilisateur doit remplacer par les siennes. */
export function splitPlaceholders(code: string): Segment[] {
  const segments: Segment[] = [];
  let last = 0;
  for (const match of code.matchAll(PLACEHOLDER)) {
    const start = match.index ?? 0;
    if (start > last) segments.push({ text: code.slice(last, start), placeholder: false });
    segments.push({ text: match[0], placeholder: true });
    last = start + match[0].length;
  }
  if (last < code.length) segments.push({ text: code.slice(last), placeholder: false });
  return segments;
}