"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight, Play, X } from "lucide-react"

export function HeroSection() {
  const [isVideoOpen, setIsVideoOpen] = useState(false)

  return (
    <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-32">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
      
      {/* Gradient Orb */}
      <div className="absolute top-1/4 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-accent/5 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="text-center lg:text-left">
            {/* Badge */}
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-4 py-1.5">
              <span className="h-2 w-2 rounded-full bg-accent" />
              <span className="text-sm text-muted-foreground">Smart Traffic Intelligence Platform</span>
            </div>

            {/* Headline */}
            <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Intelligent Traffic Control for{" "}
              <span className="text-accent">Modern Cities</span>
            </h1>

            {/* Subtitle */}
            <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground sm:text-xl lg:mx-0">
              Real-time AI-powered traffic optimization using edge computing and computer vision. 
              Reducing congestion, saving lives, and building sustainable cities.
            </p>

            {/* CTAs */}
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start">
              <Button size="lg" className="gap-2" onClick={() => setIsVideoOpen(true)}>
                <Play className="h-4 w-4" />
                Watch Demo
              </Button>
              <Button asChild variant="outline" size="lg" className="gap-2 bg-transparent">
                <Link href="#solution">
                  Learn More
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            {/* Tech Stack */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground lg:justify-start">
              <span>Powered by:</span>
              <div className="flex flex-wrap items-center justify-center gap-3 lg:justify-start">
                {["AI", "Computer Vision", "Edge Computing", "IoT"].map((tech) => (
                  <span key={tech} className="rounded-full border border-border bg-secondary/30 px-3 py-1">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="relative aspect-video overflow-hidden rounded-2xl border border-border bg-card">
              <Image
                src={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/images/hero-smart-city.jpg`}
                alt="Smart city traffic monitoring visualization"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {isVideoOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm">
          <div className="relative w-full max-w-4xl mx-4">
            <button
              onClick={() => setIsVideoOpen(false)}
              className="absolute -top-12 right-0 text-foreground hover:text-accent transition-colors"
              aria-label="Close video"
            >
              <X className="h-8 w-8" />
            </button>
            <div className="aspect-video overflow-hidden rounded-xl border border-border">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/GSDYbqabtWc?autoplay=1"
                title="HELIOS Demo Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
