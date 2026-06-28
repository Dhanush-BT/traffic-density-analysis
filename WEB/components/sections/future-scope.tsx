import { BarChart3, Car, Cloud, Network, Brain } from "lucide-react"

const futureFeatures = [
  {
    icon: BarChart3,
    title: "Predictive Analytics",
    description: "ML-based traffic prediction for proactive signal management",
  },
  {
    icon: Network,
    title: "City-wide Deployment",
    description: "Scalable architecture for metropolitan-wide signal coordination",
  },
  {
    icon: Cloud,
    title: "Cloud Dashboard",
    description: "Centralized monitoring and analytics platform for city administrators",
  },
  {
    icon: Car,
    title: "Autonomous Vehicle Integration",
    description: "V2X communication for connected and autonomous vehicles",
  },
  {
    icon: Brain,
    title: "Advanced Behavior Analysis",
    description: "Deep learning for pedestrian and cyclist safety monitoring",
  },
]

export function FutureScopeSection() {
  return (
    <section className="border-t border-border py-20 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-medium uppercase tracking-wider text-accent">Roadmap</span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Future Development
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Our vision for expanding HELIOS into a comprehensive smart city traffic platform.
          </p>
        </div>

        <div className="relative mt-16">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {futureFeatures.map((feature, index) => (
              <div
                key={feature.title}
                className={`group rounded-xl border border-dashed border-border bg-card/50 p-6 transition-all hover:border-accent/30 hover:bg-secondary/20 ${
                  index === futureFeatures.length - 1 ? "sm:col-span-2 lg:col-span-1" : ""
                }`}
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 text-accent transition-colors group-hover:bg-accent/20">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
