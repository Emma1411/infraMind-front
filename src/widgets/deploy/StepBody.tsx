import { CircleCheck, Info } from "lucide-react";
import { useState } from "react";
import Alert from "../../components/Alert";
import type { GuideStep } from "../../interfaces/guide";
import { OS_LABEL, type OsKey } from "../../utils/os";
import CommandSnippet from "./CommandSnippet";
import HelpBox from "./HelpBox";

interface StepBodyProps {
  step: GuideStep;
  os: OsKey;
  onOsChange: (os: OsKey) => void;
}

/** Le contenu d'une étape : à quoi ça sert, à faire, commandes, résultat attendu, aide. */
export default function StepBody({ step, os, onOsChange }: StepBodyProps) {
  // Remis à zéro quand l'étape change : le composant est remonté grâce à la clé de l'appelant
  const [checked, setChecked] = useState<number[]>([]);

  const variants = new Set(step.commands.map((block) => block.os).filter((value) => value !== null));
  const showOsTabs = variants.size > 1;
  const blocks = step.commands.filter((block) => block.os === null || block.os === os);

  return (
    <div className="space-y-5">
      <div className="flex gap-3 rounded-xl bg-brand-50 p-4 text-sm text-body">
        <Info className="mt-0.5 size-4 shrink-0 text-brand-600" aria-hidden />
        <div>
          <p className="font-semibold text-ink">À quoi ça sert concrètement ?</p>
          <p className="mt-0.5">{step.why}</p>
        </div>
      </div>

      {step.checklist.length > 0 && (
        <fieldset>
          <legend className="text-xs font-semibold tracking-wide text-muted uppercase">À faire</legend>
          <ul className="mt-2 space-y-2">
            {step.checklist.map((item, index) => (
              <li key={item}>
                <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-line bg-white p-3 text-sm text-body has-[:checked]:border-brand-300 has-[:checked]:bg-brand-50">
                  <input
                    type="checkbox"
                    checked={checked.includes(index)}
                    onChange={() =>
                      setChecked((current) =>
                        current.includes(index) ? current.filter((i) => i !== index) : [...current, index],
                      )
                    }
                    className="mt-0.5 size-4 shrink-0 accent-brand-600"
                  />
                  <span>{item}</span>
                </label>
              </li>
            ))}
          </ul>
        </fieldset>
      )}

      {step.commands.length > 0 && (
        <div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h4 className="text-xs font-semibold tracking-wide text-muted uppercase">Commandes</h4>
            {showOsTabs && (
              <div role="group" aria-label="Système d'exploitation" className="inline-flex rounded-xl bg-brand-50 p-1">
                {(["macos_linux", "windows"] as const).map((key) => (
                  <button
                    key={key}
                    type="button"
                    aria-pressed={os === key}
                    onClick={() => onOsChange(key)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                      os === key ? "bg-white text-brand-800 shadow-sm" : "text-body hover:text-brand-700"
                    }`}
                  >
                    {OS_LABEL[key]}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="mt-3 space-y-3">
            {blocks.map((block) => (
              <CommandSnippet key={`${block.label}-${block.os ?? "all"}`} block={block} />
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-3 rounded-xl bg-ok-soft p-4 text-sm text-ink">
        <CircleCheck className="mt-0.5 size-4 shrink-0 text-ok" aria-hidden />
        <div>
          <p className="font-semibold">Ce que tu dois voir</p>
          <p className="mt-0.5 text-body">{step.expect}</p>
        </div>
      </div>

      {step.warning && (
        <Alert tone="warn" title="Attention">
          {step.warning}
        </Alert>
      )}

      <HelpBox help={step.help} />
    </div>
  );
}