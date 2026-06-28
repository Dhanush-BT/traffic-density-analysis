import { 
  Activity, 
  AlertTriangle, 
  Car, 
  Gauge, 
  Scale, 
  Siren, 
  Timer 
} from "lucide-react"

const features = [
  {
    icon: Activity,
    title: "Real-time Density Analysis",
    description: "Continuous monitoring of vehicle count and traffic flow at every intersection",
  },
  {
    icon: Timer,
    title: "Dynamic Signal Optimization",
    description: "Adaptive traffic light timing based on current traffic conditions",
  },
  {
    icon: AlertTriangle,
    title: "Incident Detection",
    description: "Automatic incident detection and alert generation for rapid response",
  },
  {
    icon: Car,
    title: "Violation Detection",
    description: "AI-powered detection of traffic rule violations like signal jumping",
  },
  {
    icon: Siren,
    title: "Emergency Priority",
    description: "Green corridor creation for ambulances and emergency vehicles",
  },
  {
    icon: Gauge,
    title: "Low-latency Processing",
    description: "Edge computing ensures sub-second response times",
  },
  {
    icon: Scale,
    title: "Smart City Scalable",
    description: "Architecture designed to scale across entire metropolitan areas",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="border-t border-border py-20 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-medium uppercase tracking-wider text-accent">Features</span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Comprehensive Traffic Intelligence
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            A complete suite of AI-powered features designed to modernize urban traffic management.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className={`group rounded-xl border border-border bg-card p-6 transition-all hover:border-accent/30 hover:bg-secondary/30 ${
                index === features.length - 1 ? "sm:col-span-2 lg:col-span-1" : ""
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
    </section>
  )
}
