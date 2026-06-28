const steps = [
  {
    step: "01",
    title: "Data Collection",
    description: "CCTV cameras and IoT sensors continuously capture traffic data at intersections.",
  },
  {
    step: "02",
    title: "Edge Processing",
    description: "Video feeds are processed locally at edge devices for real-time analysis.",
  },
  {
    step: "03",
    title: "AI Analysis",
    description: "Computer vision models detect vehicles, measure density, and identify incidents.",
  },
  {
    step: "04",
    title: "Signal Optimization",
    description: "Traffic signals are dynamically adjusted based on current conditions.",
  },
  {
    step: "05",
    title: "Continuous Learning",
    description: "The system learns traffic patterns to predict and prevent congestion.",
  },
]

export function HowItWorksSection() {
  return (
    <section className="border-t border-border bg-secondary/20 py-20 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-medium uppercase tracking-wider text-accent">Process</span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            How HELIOS Works
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            A five-step intelligent process that transforms raw traffic data into optimized signal control.
          </p>
        </div>

        <div className="relative mt-16">
          {/* Connection Line */}
          <div className="absolute top-8 left-0 right-0 hidden h-0.5 bg-border lg:block" />
          
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
            {steps.map((item) => (
              <div key={item.step} className="relative">
                {/* Step Number */}
                <div className="relative z-10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 border-accent bg-background text-accent">
                  <span className="text-xl font-bold">{item.step}</span>
                </div>
                
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
