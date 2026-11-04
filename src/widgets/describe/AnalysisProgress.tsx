import { LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";

const MESSAGES = [
  "Lecture de ton cahier des charges…",
  "Repérage de ce qui manque…",
  "Préparation des questions…",
];

export default function AnalysisProgress() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => setIndex((current) => Math.min(current + 1, MESSAGES.length - 1)), 3000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div
      role="status"
      aria-live="polite"
      className="mt-4 flex items-center gap-3 rounded-xl bg-brand-50 px-4 py-3 text-sm text-brand-800"
    >
      <LoaderCircle className="size-4 animate-spin" aria-hidden />
      {MESSAGES[index]}
    </div>
  );
}