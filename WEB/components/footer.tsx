import Link from "next/link"
import { Cctv } from "lucide-react"

const navLinks = [
  { href: "#about", label: "About" },
  { href: "#solution", label: "Solution" },
  { href: "#features", label: "Features" },
  { href: "#demo", label: "Demo" },
  { href: "#team", label: "Team" },
]

export function Footer() {
  return (
    <footer className="border-t border-border bg-background py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-8 sm:flex-row">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent">
              <Cctv className="h-5 w-5 text-accent-foreground" />
            </div>
            <span className="text-lg font-semibold tracking-tight text-foreground">HELIOS</span>
          </div>

          {/* Navigation */}
          <nav className="flex flex-wrap items-center justify-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-8 border-t border-border pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Smart Traffic Intelligence System
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            Developed in collaboration with Sri Sairam Engineering College
          </p>
        </div>
      </div>
    </footer>
  )
}
