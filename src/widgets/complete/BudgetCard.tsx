import { CURRENCY_OPTIONS } from "../../data/currencies";
import { UNKNOWN_ANSWER, type AnswerValue, type Answers, type QuestionState } from "../../interfaces/analysis";
import { BUDGET_PATH, CURRENCY_PATH, displayValue, isUnknown, originOf } from "../../utils/questions";
import { CardShell, NumberField, OriginBadge, OriginNote } from "./QuestionParts";

interface BudgetCardProps {
  tag: string;
  anchorId?: string;
  budget: QuestionState;
  currencyQuestion: QuestionState;
  draft: Answers;
  onChange: (path: string, value: AnswerValue) => void;
  onClear: (path: string) => void;
}

/** Une seule carte pour le montant du budget et sa devise, comme dans le design. */
export default function BudgetCard({ tag, anchorId, budget, currencyQuestion, draft, onChange, onClear }: BudgetCardProps) {
  const amount = displayValue(budget, draft);
  const currency = displayValue(currencyQuestion, draft);
  const amountOrigin = originOf(budget, draft);
  const currencyOrigin = originOf(currencyQuestion, draft);
  const unknown = isUnknown(amount);
  const currencyValue = typeof currency === "string" && currency !== UNKNOWN_ANSWER ? currency : "";

  const toggleUnknown = () => {
    if (unknown) {
      onClear(BUDGET_PATH);
      onClear(CURRENCY_PATH);
    } else {
      onChange(BUDGET_PATH, UNKNOWN_ANSWER);
      onChange(CURRENCY_PATH, UNKNOWN_ANSWER);
    }
  };

  return (
    <CardShell
      anchorId={anchorId}
      tag={`${tag} / BUDGET INFRASTRUCTURE`}
      title={budget.text}
      why={budget.why}
      unknown={unknown}
      accent={amountOrigin === "detected" || amountOrigin === "edited"}
      badge={<OriginBadge origin={amountOrigin} />}
      onToggleUnknown={toggleUnknown}
    >
      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_16rem]">
        <NumberField
          label="Budget mensuel maximal"
          value={typeof amount === "number" ? amount : undefined}
          unit="/ mois"
          placeholder="Ex. : 150"
          onValue={(next) => {
            onChange(BUDGET_PATH, next);
            if (isUnknown(currency)) onClear(CURRENCY_PATH);
          }}
          onClear={() => onClear(BUDGET_PATH)}
        />
        <div>
          <label htmlFor="budget-currency" className="sr-only">
            Devise du budget
          </label>
          <select
            id="budget-currency"
            value={currencyValue}
            onChange={(event) => (event.target.value ? onChange(CURRENCY_PATH, event.target.value) : onClear(CURRENCY_PATH))}
            className="w-full rounded-xl border border-brand-100 bg-brand-50/60 px-4 py-3 text-sm text-ink focus:border-brand-400 focus:bg-white focus:ring-2 focus:ring-brand-200 focus:outline-none"
          >
            <option value="">Choisir la devise</option>
            {CURRENCY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {currencyOrigin === "detected" && currencyValue !== "" && (
        <p className="mt-2 text-xs text-muted">Devise trouvée dans ton texte. Change-la si besoin.</p>
      )}
      {typeof amount === "number" && currencyValue === "" && (
        <p className="mt-2 text-sm text-warn">Choisis aussi la devise : sans elle, le budget ne peut pas être comparé.</p>
      )}

      <OriginNote origin={amountOrigin} onRestore={() => onClear(BUDGET_PATH)} />
    </CardShell>
  );
}