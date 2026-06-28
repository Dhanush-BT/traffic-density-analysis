import Image from "next/image"

const teamMembers = [
  {
    name: "Dhanush B T",
    role: "CEO",
    description: "System architecture and project leadership",
    image: "/images/team/dhanush.jpeg",
  },
  {
    name: "Tejaswini T",
    role: "COO / CTO",
    description: "Operations and technical development",
    image: "/images/team/tejaswini.jpeg",
  },
  {
    name: "Mano V",
    role: "CFO / CMO",
    description: "Finance and marketing strategy",
    image: "/images/team/mano.jpeg",
  },
]

const advisor = {
  name: "Subiksha N",
  role: "Technical Advisor",
  department: "Computer Science and Business Systems",
}

export function TeamSection() {
  return (
    <section id="team" className="border-t border-border bg-secondary/20 py-20 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-medium uppercase tracking-wider text-accent">Team</span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Meet the Team
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            The dedicated team behind HELIOS, building the future of urban traffic management.
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {teamMembers.map((member) => (
            <div
              key={member.name}
              className="rounded-xl border border-border bg-card p-6 text-center transition-all hover:border-accent/30"
            >
              <div className="relative mx-auto mb-4 h-24 w-24 overflow-hidden rounded-full">
                <Image
                  src={member.image ? `${process.env.NEXT_PUBLIC_BASE_PATH || ""}${member.image}` : `${process.env.NEXT_PUBLIC_BASE_PATH || ""}/placeholder.svg`}
                  alt={member.name}
                  fill
                  className="object-cover object-center"
                />
              </div>
              <h3 className="text-xl font-semibold text-foreground">{member.name}</h3>
              <p className="mt-1 text-accent">{member.role}</p>
              <p className="mt-3 text-sm text-muted-foreground">{member.description}</p>
            </div>
          ))}
        </div>

        {/* Technical Advisor */}
        <div className="mt-12 flex flex-col items-center">
          <div className="rounded-xl border border-border bg-card px-8 py-6 text-center">
            <p className="text-sm text-muted-foreground">Technical Advisor</p>
            <h3 className="mt-2 text-xl font-semibold text-foreground">{advisor.name}</h3>
            <p className="mt-1 text-accent">{advisor.role}</p>
            <p className="mt-2 text-sm text-muted-foreground">{advisor.department}</p>
          </div>
        </div>

        {/* Institution */}
        <div className="mt-12 text-center">
          <p className="text-muted-foreground">
            Developed in collaboration with
          </p>
          <p className="mt-2 text-lg font-semibold text-foreground">
            Sri Sairam Engineering College
          </p>
          <p className="mt-1 text-muted-foreground">
            Department of Computer Science and Business Systems
          </p>
        </div>
      </div>
    </section>
  )
}
