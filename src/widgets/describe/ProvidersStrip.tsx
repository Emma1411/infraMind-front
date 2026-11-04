const PROVIDERS = ["AWS", "Azure", "Google Cloud", "Hetzner"];

export default function ProvidersStrip() {
  return (
    <section
      aria-labelledby="providers-title"
      className="mt-12 flex flex-col gap-4 rounded-xl2 bg-brand-50 p-5 md:flex-row md:items-center md:justify-between"
    >
      <div>
        <h2 id="providers-title" className="font-semibold text-brand-900">
          Fournisseurs comparés
        </h2>
        <p className="mt-1 max-w-xl text-sm text-body">
          Prix de référence relevés à la main dans les grilles publiques. La date et la région de référence sont
          affichées dans chaque résultat.
        </p>
      </div>
      <ul className="flex flex-wrap gap-2">
        {PROVIDERS.map((provider) => (
          <li key={provider} className="rounded-lg bg-white px-4 py-2 font-mono text-sm text-ink shadow-sm">
            {provider}
          </li>
        ))}
      </ul>
    </section>
  );
}