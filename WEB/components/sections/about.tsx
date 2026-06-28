import { Brain, Camera, Cpu, Radio } from "lucide-react"

const technologies = [
  {
    icon: Brain,
    title: "Artificial Intelligence",
    description: "Advanced ML models for traffic pattern recognition and prediction",
  },
  {
    icon: Camera,
    title: "Computer Vision",
    description: "Real-time video analysis for vehicle detection and tracking",
  },
  {
    icon: Cpu,
    title: "Edge Computing",
    description: "Low-latency processing at the network edge for instant decisions",
  },
  {
    icon: Radio,
    title: "IoT Integration",
    description: "Seamless connectivity with traffic sensors and signal controllers",
  },
]

export function AboutSection() {
  return (
    <section id="about" className="border-t border-border py-20 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            About HELIOS
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            An AI-powered smart traffic management platform designed to transform urban mobility 
            through intelligent automation and real-time decision making.
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {technologies.map((tech) => (
            <div
              key={tech.title}
              className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-accent/30 hover:bg-secondary/30"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 text-accent transition-colors group-hover:bg-accent/20">
                <tech.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">{tech.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{tech.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
