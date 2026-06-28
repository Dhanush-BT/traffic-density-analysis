import { ArrowDown, Clock, Fuel, Heart, Leaf, Shield } from "lucide-react"

const benefits = [
  {
    icon: Clock,
    title: "Reduced Congestion",
    description: "Up to 30% reduction in average wait times at traffic signals",
    metric: "30%",
    metricLabel: "Less Wait Time",
  },
  {
    icon: Heart,
    title: "Faster Emergency Response",
    description: "Priority corridors enable ambulances to reach destinations faster",
    metric: "40%",
    metricLabel: "Faster Response",
  },
  {
    icon: Shield,
    title: "Improved Safety",
    description: "Real-time incident detection and violation monitoring",
    metric: "25%",
    metricLabel: "Fewer Incidents",
  },
  {
    icon: Fuel,
    title: "Lower Fuel Consumption",
    description: "Smoother traffic flow reduces idle time and fuel waste",
    metric: "20%",
    metricLabel: "Fuel Savings",
  },
  {
    icon: Leaf,
    title: "Reduced Emissions",
    description: "Less idling and smoother flow means cleaner air",
    metric: "25%",
    metricLabel: "Lower CO2",
  },
]

export function BenefitsSection() {
  return (
    <section className="border-t border-border bg-secondary/20 py-20 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-medium uppercase tracking-wider text-accent">Impact</span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Measurable Benefits for Cities
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            HELIOS delivers tangible improvements across key urban mobility metrics.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit, index) => (
            <div
              key={benefit.title}
              className={`rounded-xl border border-border bg-card p-6 transition-all hover:border-accent/30 ${
                index >= 3 ? "lg:col-span-1" : ""
              } ${index === 4 ? "sm:col-span-2 lg:col-span-1" : ""}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  <benefit.icon className="h-5 w-5" />
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-accent">
                    <ArrowDown className="h-4 w-4" />
                    <span className="text-2xl font-bold">{benefit.metric}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{benefit.metricLabel}</span>
                </div>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-foreground">{benefit.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
