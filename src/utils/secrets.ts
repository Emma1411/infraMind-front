const PATTERNS: RegExp[] = [
  /AKIA[0-9A-Z]{16}/,
  /sk-[A-Za-z0-9_-]{20,}/,
  /ghp_[A-Za-z0-9]{30,}/,
  /github_pat_[A-Za-z0-9_]{20,}/,
  /-----BEGIN [A-Z ]*PRIVATE KEY-----/,
  /\b(password|passwd|pwd|secret|token|api[_-]?key)\b\s*[:=]\s*\S+/i,
  /mot de passe\s*[:=]\s*\S+/i,
  /[a-z][a-z0-9+.-]*:\/\/[^\s/@]+:[^\s/@]+@/i,
];

/** Détection prudente côté navigateur, pour prévenir l'utilisateur avant l'envoi. */
export function looksLikeSecret(text: string): boolean {
  return PATTERNS.some((pattern) => pattern.test(text));
}