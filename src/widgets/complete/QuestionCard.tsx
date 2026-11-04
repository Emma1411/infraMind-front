import { Check } from "lucide-react";
import { domainLabel } from "../../data/domains";
import { UNKNOWN_ANSWER, type AnswerValue, type Question } from "../../interfaces/analysis";
import type { Currency } from "../../interfaces/spec";
import { isUnknown } from "../../utils/questions";
import { CardShell, NumberField } from "./QuestionParts";

interface QuestionCardProps {
  question: Question;
  /** « 01 », « 02 »… ou « DÉTAIL ». */
  tag: string;
  anchorId?: string;
  value: AnswerValue | undefined;
  currency: Currency | null;
  onChange: (path: string, value: AnswerValue) => void;
  onClear: (path: string) => void;
}

const CHOICE =
  "relative flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-line bg-white p-4 transition " +
  "hover:border-brand-300 has-[:checked]:border-brand-500 has-[:checked]:bg-brand-50 has-[:focus-visible]:outline-2 " +
  "has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-brand-500";

export default function QuestionCard({ question, tag, anchorId, value, currency, onChange, onClear }: QuestionCardProps) {
  const { path, type, options } = question;
  const unknown = isUnknown(value);

  return (
    <CardShell
      anchorId={anchorId}
      tag={`${tag} / ${domainLabel(question.domain).toUpperCase()}`}
      title={question.text}
      why={question.why}
      unknown={unknown}
      onToggleUnknown={question.allow_unknown ? () => (unknown ? onClear(path) : onChange(path, UNKNOWN_ANSWER)) : undefined}
    >
      <fieldset>
        <legend className="sr-only">{question.text}</legend>

        {type === "single_choice" && (
          <div className="grid gap-3 sm:grid-cols-2">
            {options.map((option) => (
              <label key={option.value} className={CHOICE}>
                <span className="text-sm font-medium text-ink">{option.label}</span>
                <input
                  type="radio"
                  name={path}
                  value={option.value}
                  checked={value === option.value}
                  onChange={() => onChange(path, option.value)}
                  className="size-4 accent-brand-600"
                />
              </label>
            ))}
          </div>
        )}

        {type === "multi_choice" && (
          <div className="flex flex-wrap gap-3">
            {options.map((option) => {
              const selected = Array.isArray(value) ? value : [];
              const checked = selected.includes(option.value);
              return (
                <label
                  key={option.value}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-sm font-medium text-ink transition hover:border-brand-300 has-[:checked]:border-brand-500 has-[:checked]:bg-brand-50 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-brand-500"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => {
                      const next = checked ? selected.filter((item) => item !== option.value) : [...selected, option.value];
                      if (next.length === 0) onClear(path);
                      else onChange(path, next);
                    }}
                    className="sr-only"
                  />
                  <span
                    aria-hidden
                    className={`flex size-4 items-center justify-center rounded border ${
                      checked ? "border-brand-600 bg-brand-600 text-white" : "border-brand-300 bg-white"
                    }`}
                  >
                    {checked && <Check className="size-3" />}
                  </span>
                  {option.label}
                </label>
              );
            })}
          </div>
        )}

        {type === "boolean" && (
          <div className="inline-flex rounded-xl bg-brand-50 p-1">
            {[
              { label: "Oui", flag: true },
              { label: "Non", flag: false },
            ].map(({ label, flag }) => (
              <label
                key={label}
                className="cursor-pointer rounded-lg px-6 py-2 text-sm font-medium text-body transition has-[:checked]:bg-brand-600 has-[:checked]:text-white has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-brand-500"
              >
                <input
                  type="radio"
                  name={path}
                  checked={value === flag}
                  onChange={() => onChange(path, flag)}
                  className="sr-only"
                />
                {label}
              </label>
            ))}
          </div>
        )}

        {type === "number" && (
          <NumberField
            label={question.text}
            value={typeof value === "number" ? value : undefined}
            unit={currency ? `${currency} / mois` : "/ mois"}
            onValue={(next) => onChange(path, next)}
            onClear={() => onClear(path)}
          />
        )}
      </fieldset>
    </CardShell>
  );
}