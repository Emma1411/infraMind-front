import type { CommandBlock, GuideStep, RenderedGuide } from "../interfaces/guide";
import type { SpecRow } from "./guideParams";
import { safeUrl } from "./safeUrl";

const WHERE: Record<GuideStep["where"], string> = {
  console: "Dans la console du fournisseur",
  local: "Sur ton ordinateur",
  server: "Sur le serveur",
};

const OS_LABEL = { windows: "Windows", macos_linux: "macOS / Linux" } as const;

function fence(block: CommandBlock): string {
  const language = block.language === "text" ? "" : block.language;
  const os = block.os ? ` (${OS_LABEL[block.os]})` : "";
  return [`**${block.label}${os}**`, "", "```" + language, block.code, "```", ""].join("\n");
}

function stepMarkdown(step: GuideStep, number: string): string {
  const out: string[] = [
    `### ${number}. ${step.title}${step.optional ? " (facultatif)" : ""}`,
    "",
    `*${WHERE[step.where]}*`,
    "",
    `**À quoi ça sert :** ${step.why}`,
    "",
  ];
  if (step.checklist.length > 0) {
    step.checklist.forEach((item) => out.push(`- [ ] ${item}`));
    out.push("");
  }
  step.commands.forEach((block) => out.push(fence(block)));
  out.push(`**Ce que tu dois voir :** ${step.expect}`, "");
  if (step.warning) out.push(`> **Attention :** ${step.warning}`, "");

  out.push(`**Si ça n'a pas marché :** ${step.help.common_cause}`);
  const doc = safeUrl(step.help.doc_url);
  if (doc) out.push(`- Documentation : [${step.help.doc_label ?? doc}](${doc})`);
  const video = safeUrl(step.help.youtube_url);
  if (video) out.push(`- Recherche de vidéos : ${video}`);
  out.push("");
  return out.join("\n");
}

/** Le guide complet en Markdown, prêt à être rangé dans un dépôt Git (par exemple docs/deploy.md). */
export function guideToMarkdown(guide: RenderedGuide, archLabel: string, rows: SpecRow[]): string {
  const out: string[] = [
    `# ${guide.title}`,
    "",
    `> ${guide.status_label}`,
    `> Architecture : ${archLabel}`,
    "",
    guide.intro,
    "",
  ];

  if (rows.length > 0) {
    out.push("## Valeurs de ton projet", "");
    rows.forEach((row) => out.push(`- **${row.label}** : ${row.value}`));
    out.push("");
  }

  out.push("## Avant de commencer", "");
  guide.prerequisites.forEach((item) => out.push(`- [ ] ${item}`));
  out.push("", "## Étapes", "");
  guide.steps.forEach((step, index) => out.push(stepMarkdown(step, String(index + 1))));

  out.push("## Tout supprimer à la fin", "");
  guide.cleanup.forEach((step, index) => out.push(stepMarkdown(step, `S${index + 1}`)));

  out.push("## Limites de ce guide", "");
  guide.limits.forEach((limit) => out.push(`- ${limit}`));
  out.push("", "## Sources", "");
  guide.sources.forEach((source) => {
    const url = safeUrl(source.url);
    out.push(url ? `- [${source.label}](${url})` : `- ${source.label}`);
  });
  out.push("", "---", "Estimations basées sur des prix publics, à revérifier avant signature.", "");
  return out.join("\n");
}