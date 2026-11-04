import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { setProjectName } from "../../slices/projectSlice";

export default function ProjectNameCard() {
  const dispatch = useAppDispatch();
  const initial = useAppSelector((state) => state.project.baseSpec?.name ?? "");
  const [text, setText] = useState(initial);

  return (
    <section className="rounded-xl2 border border-line bg-white p-5 shadow-card sm:p-6">
      <label htmlFor="project-name" className="text-sm font-semibold text-ink">
        Nom du projet <span className="font-normal text-muted">(facultatif)</span>
      </label>
      <p className="mt-1 text-sm text-muted">Il sert à nommer le fichier du devis et les ressources dans les guides.</p>
      <input
        id="project-name"
        type="text"
        maxLength={80}
        value={text}
        placeholder="Ex. : Salon Élégance"
        onChange={(event) => {
          setText(event.target.value);
          dispatch(setProjectName(event.target.value));
        }}
        className="mt-3 w-full rounded-xl border border-brand-100 bg-brand-50/60 px-4 py-3 text-ink focus:border-brand-400 focus:bg-white focus:ring-2 focus:ring-brand-200 focus:outline-none"
      />
    </section>
  );
}