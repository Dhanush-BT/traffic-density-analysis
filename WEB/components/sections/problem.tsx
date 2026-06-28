import { AlertTriangle, Clock, Fuel, Leaf, Siren } from "lucide-react"

const problems = [
  {
    icon: Clock,
    title: "Traffic Congestion",
    description: "Fixed-time signals cause unnecessary waiting and gridlock during peak hours",
  },
  {
    icon: Fuel,
    title: "Fuel Wastage",
    description: "Idling vehicles at inefficient signals waste millions of liters of fuel daily",
  },
  {
    icon: Leaf,
    title: "Pollution",
    description: "Stop-and-go traffic patterns contribute significantly to urban air pollution",
  },
  {
    icon: Siren,
    title: "Emergency Delays",
    description: "Lack of priority systems delays ambulances and emergency response vehicles",
  },
  {
    icon: AlertTriangle,
    title: "No Real-time Monitoring",
    description: "Traditional systems cannot detect incidents or adapt to changing conditions",
  },
]

export function ProblemSection() {
  return (
    <section className="border-t border-border bg-secondary/20 py-20 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-medium uppercase tracking-wider text-accent">The Challenge</span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Traditional Traffic Systems Are Failing Our Cities
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Fixed-time traffic signals and lack of real-time monitoring create a cascade of 
            problems that affect millions of commuters every day.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {problems.map((problem, index) => (
            <div
              key={problem.title}
              className={`rounded-xl border border-border bg-card p-6 ${
                index === problems.length - 1 ? "sm:col-span-2 lg:col-span-1" : ""
              }`}
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
                <problem.icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">{problem.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{problem.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
