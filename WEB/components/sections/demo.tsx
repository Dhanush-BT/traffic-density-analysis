"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Play, X } from "lucide-react"

export function DemoSection() {
  const [isVideoOpen, setIsVideoOpen] = useState(false)

  return (
    <section id="demo" className="border-t border-border bg-secondary/20 py-20 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-medium uppercase tracking-wider text-accent">Demo</span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            See HELIOS in Action
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Experience the capabilities of our smart traffic intelligence system through a live demonstration.
          </p>
        </div>

        <div className="mt-12">
          <div className="relative mx-auto max-w-4xl overflow-hidden rounded-xl border border-border bg-card">
            <div className="aspect-video relative group cursor-pointer" onClick={() => setIsVideoOpen(true)}>
              {/* Video Thumbnail */}
              <Image
                src={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/images/demo-thumbnail.jpg`}
                alt="HELIOS demo video thumbnail"
                fill
                className="object-contain"
              />
              <div className="absolute inset-0 bg-background/40 transition-all group-hover:bg-background/30" />
              
              {/* Play Button */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-accent text-accent-foreground transition-transform group-hover:scale-110">
                  <Play className="h-8 w-8 ml-1" />
                </div>
                <p className="mt-4 text-lg font-medium text-foreground">
                  Watch Demo Video
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Real-time traffic monitoring and signal optimization
                </p>
              </div>
            </div>
          </div>

          {/* Feature Highlights */}
          <div className="mt-8 grid gap-4 sm:grid-cols-3 max-w-4xl mx-auto">
            <div className="rounded-lg border border-border bg-card p-4 text-center">
              <p className="text-2xl font-bold text-accent">Real-time</p>
              <p className="text-sm text-muted-foreground">Traffic Analysis</p>
            </div>
            <div className="rounded-lg border border-border bg-card p-4 text-center">
              <p className="text-2xl font-bold text-accent">AI-Powered</p>
              <p className="text-sm text-muted-foreground">Vehicle Detection</p>
            </div>
            <div className="rounded-lg border border-border bg-card p-4 text-center">
              <p className="text-2xl font-bold text-accent">Dynamic</p>
              <p className="text-sm text-muted-foreground">Signal Control</p>
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
