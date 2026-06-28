import Image from "next/image"
import { CheckCircle2 } from "lucide-react"

const solutionPoints = [
  "Processes live CCTV and sensor data in real-time",
  "Analyzes traffic density using computer vision",
  "Detects incidents and anomalies automatically",
  "Dynamically controls traffic signals with minimal latency",
  "Prioritizes emergency vehicles through intelligent routing",
  "Scales seamlessly across entire city networks",
]

export function SolutionSection() {
  return (
    <section id="solution" className="border-t border-border py-20 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <span className="text-sm font-medium uppercase tracking-wider text-accent">Our Solution</span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Intelligent Traffic Management at the Edge
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              HELIOS processes live CCTV and sensor data at the edge to analyze traffic density, 
              detect incidents, and dynamically control traffic signals with minimal latency.
            </p>

            <ul className="mt-8 space-y-4">
              {solutionPoints.map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                  <span className="text-muted-foreground">{point}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative">
            <div className="aspect-video overflow-hidden rounded-xl border border-border bg-card">
              <Image
                src="/images/ai-traffic-analysis.jpg"
                alt="AI traffic analysis visualization"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
