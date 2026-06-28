const sdgs = [
  {
    number: 3,
    title: "Good Health and Well-being",
    description: "Faster emergency response and reduced air pollution contribute to healthier urban environments.",
  },
  {
    number: 11,
    title: "Sustainable Cities and Communities",
    description: "Smart traffic management is fundamental to building sustainable, efficient urban infrastructure.",
  },
  {
    number: 16,
    title: "Peace, Justice and Strong Institutions",
    description: "Automated violation detection supports fair enforcement and transparent governance.",
  },
]

export function SDGSection() {
  return (
    <section className="border-t border-border py-20 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-medium uppercase tracking-wider text-accent">
            Sustainability
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Aligned with UN Sustainable Development Goals
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            HELIOS contributes to global sustainability targets through intelligent urban mobility.
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {sdgs.map((sdg) => (
            <div
              key={sdg.number}
              className="rounded-xl border border-border bg-card p-8 transition-all hover:border-accent/30"
            >
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-accent/20 text-accent">
                <span className="text-2xl font-bold">{sdg.number}</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground">SDG {sdg.number}</h3>
              <p className="mt-1 text-lg text-accent">{sdg.title}</p>
              <p className="mt-4 text-muted-foreground">{sdg.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
