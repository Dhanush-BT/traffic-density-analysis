"use client"

import { useState, useRef, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Camera, Upload, Play, Pause, RefreshCw, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export default function AnalysisPage() {
  const [setupStep, setSetupStep] = useState<"junction" | "sources" | "ready">("junction")
  const [laneCount, setLaneCount] = useState<number>(4)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [inferenceMode, setInferenceMode] = useState<"local" | "serverless">("serverless")
  const [hfToken, setHfToken] = useState<string>("")

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedToken = localStorage.getItem("hf_inference_token")
      if (savedToken) setHfToken(savedToken)
      
      const savedMode = localStorage.getItem("hf_inference_mode") as "local" | "serverless" | null
      if (savedMode) setInferenceMode(savedMode)
    }
  }, [])

  const saveToken = (token: string) => {
    setHfToken(token)
    if (typeof window !== "undefined") {
      localStorage.setItem("hf_inference_token", token)
    }
  }

  const saveMode = (mode: "local" | "serverless") => {
    setInferenceMode(mode)
    if (typeof window !== "undefined") {
      localStorage.setItem("hf_inference_mode", mode)
    }
  }

  
  interface LaneState {
    id: string
    name: string
    density: number
    prevDensity: number | null
    sourceType: "webcam" | "video" | null
    videoUrl: string | null
    waitTime: number
    signal: "RED" | "YELLOW" | "GREEN"
    ps: number
    timer: number
    prediction: {
      label: string
      confidence: number
      probabilities: Record<string, number>
    } | null
    isDummy?: boolean
  }

  const [lanes, setLanes] = useState<LaneState[]>([
    { id: "A", name: "Main St (North)", density: 0, prevDensity: null, sourceType: null, videoUrl: null, waitTime: 0, signal: "RED", ps: 0, timer: 0, prediction: null },
    { id: "B", name: "Side St (East)", density: 0, prevDensity: null, sourceType: null, videoUrl: null, waitTime: 0, signal: "RED", ps: 0, timer: 0, prediction: null },
    { id: "C", name: "Main St (South)", density: 0, prevDensity: null, sourceType: null, videoUrl: null, waitTime: 0, signal: "RED", ps: 0, timer: 0, prediction: null },
    { id: "D", name: "Side St (West)", density: 0, prevDensity: null, sourceType: null, videoUrl: null, waitTime: 0, signal: "RED", ps: 0, timer: 0, prediction: null },
  ])

  const [activeLaneId, setActiveLaneId] = useState<string | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [history, setHistory] = useState<string[]>([])

  // Multi-Ref management
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({})
  const previewVideoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({})
  const activeStreams = useRef<{ [key: string]: MediaStream | null }>({})
  const canvasRefs = useRef<{ [key: string]: HTMLCanvasElement | null }>({})
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({})
  
  const processingRef = useRef(false)
  const currentLanesRef = useRef(lanes)

  useEffect(() => {
    currentLanesRef.current = lanes
  }, [lanes])

  // Constants
  const KD = 10.0
  const KW = 1.0
  const YELLOW_DURATION = 3 // Standard yellow duration for simulation

  // Helper: Density to Numeric
  const labelToDensity = (label: string) => {
    if (label.includes("high")) return 10
    if (label.includes("medium")) return 4
    if (label.includes("low")) return 1
    return 0
  }

  // Effect: Global Controller (1s Heartbeat)
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isProcessing && setupStep === "ready") {
      interval = setInterval(() => {
        setLanes((currentLanes) => {
          const activeLanes = currentLanes.slice(0, laneCount)
          const inactiveLanes = currentLanes.slice(laneCount)
          const nextActiveLanes = [...activeLanes]
          
          let currentGreen = nextActiveLanes.find(l => l.signal === "GREEN")
          let currentYellow = nextActiveLanes.find(l => l.signal === "YELLOW")

          // 1. Update Wait Times and PS Scores
          nextActiveLanes.forEach(lane => {
            if (lane.signal === "RED") {
              lane.waitTime += 1
            }
            lane.ps = Number(((lane.density * KD) + (lane.waitTime * KW)).toFixed(1))
          })

          // 2. Handle Yellow Transition
          if (currentYellow) {
            if (currentYellow.timer > 0) {
              currentYellow.timer -= 1
              return [...nextActiveLanes, ...inactiveLanes]
            } else {
              currentYellow.signal = "RED"
              currentYellow.waitTime = 0
              currentYellow = undefined
              setIsTransitioning(false)
            }
          }

          // 3. Handle Green Cycle
          if (currentGreen) {
            if (currentGreen.timer > 0) {
              const isGapOut = currentGreen.density === 0
              if (isGapOut && currentGreen.timer > 5) {
                currentGreen.timer = 0
              } else {
                currentGreen.timer -= 1
                return [...nextActiveLanes, ...inactiveLanes]
              }
            }
            currentGreen.signal = "YELLOW"
            currentGreen.timer = YELLOW_DURATION
            setIsTransitioning(true)
            return [...nextActiveLanes, ...inactiveLanes]
          }

          // 4. Deciding the Winner
          const candidates = nextActiveLanes.filter(l => l.density > 0)
          if (candidates.length > 0) {
            // Tie-breaker: If PS is equal, prefer higher density
            const winner = candidates.reduce((prev, curr) => {
              if (curr.ps > prev.ps) return curr
              if (curr.ps === prev.ps && curr.density > prev.density) return curr
              return prev
            })
            winner.signal = "GREEN"
            winner.timer = winner.density >= 10 ? 60 : winner.density >= 4 ? 30 : 15
            setActiveLaneId(winner.id)
            setHistory(prev => [new Date().toLocaleTimeString() + ": Lane " + winner.id + " Green", ...prev.slice(0, 4)])
          } else {
            setActiveLaneId(null)
          }

          return [...nextActiveLanes, ...inactiveLanes]
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isProcessing, laneCount, setupStep])


  // Multi-Lane Management Helpers
  const setupJunction = (count: number) => {
    setLaneCount(count)
    setSetupStep("sources")
  }

  const configureLaneSource = async (laneId: string, type: "webcam" | "video") => {
    if (type === "webcam") {
      // Check if webcam is already in use
      const otherWebcamLane = lanes.find(l => l.sourceType === "webcam" && !l.isDummy && l.id !== laneId)
      
      const setSourceOnPreview = (stream: MediaStream | null) => {
        const preview = previewVideoRefs.current[laneId]
        if (preview) {
          preview.srcObject = stream
          if (stream) preview.play().catch(e => console.log("Preview play failed", e))
        }
      }

      if (otherWebcamLane) {
        // Dummy Mode
        setLanes(prev => prev.map(l => l.id === laneId ? { ...l, sourceType: "webcam", isDummy: true, videoUrl: null } : l))
        // For dummy, we can't show a real stream, maybe just a placeholder or the same stream
        return
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true })
        activeStreams.current[laneId] = stream
        setSourceOnPreview(stream)
        setLanes(prev => prev.map(l => l.id === laneId ? { ...l, sourceType: "webcam", isDummy: false, videoUrl: null } : l))
      } catch (err) {
        setError(`Webcam access denied. Defaulting Lane ${laneId} to Dummy Mode.`)
        setLanes(prev => prev.map(l => l.id === laneId ? { ...l, sourceType: "webcam", isDummy: true, videoUrl: null } : l))
      }
    } else {
      fileInputRefs.current[laneId]?.click()
    }
  }

  const handleLaneVideoUpload = (laneId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      const preview = previewVideoRefs.current[laneId]
      if (preview) {
        preview.srcObject = null
        preview.src = url
        preview.play().catch(e => console.log("Video preview play failed", e))
      }
      setLanes(prev => prev.map(l => l.id === laneId ? { ...l, sourceType: "video", videoUrl: url, isDummy: false } : l))
    }
  }

  const base64ToBlob = (base64Data: string, contentType = "image/jpeg") => {
    try {
      const parts = base64Data.split(",");
      const dataStr = parts[1] || parts[0];
      const byteCharacters = atob(dataStr);
      const byteArrays = [];
      for (let offset = 0; offset < byteCharacters.length; offset += 512) {
        const slice = byteCharacters.slice(offset, offset + 512);
        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }
      return new Blob(byteArrays, { type: contentType });
    } catch (e) {
      console.error("Failed to convert base64 to blob", e);
      return null;
    }
  };

  // Multi-Lane Processing Loop
  const processAllLanes = async () => {
    if (!processingRef.current) return

    const activeLanes = currentLanesRef.current.slice(0, laneCount)
    
    for (const lane of activeLanes) {
      if (!processingRef.current) break
      
      const vRef = videoRefs.current[lane.id]
      const cRef = canvasRefs.current[lane.id]
      
      if (vRef && cRef && vRef.readyState === vRef.HAVE_ENOUGH_DATA) {
        const context = cRef.getContext("2d")
        if (context) {
          cRef.width = vRef.videoWidth
          cRef.height = vRef.videoHeight
          context.drawImage(vRef, 0, 0, cRef.width, cRef.height)
          
          const base64Image = cRef.toDataURL("image/jpeg", 0.7)
          
          try {
            let data: any = null;
            
            if (inferenceMode === "serverless") {
              const imageBlob = base64ToBlob(base64Image);
              if (!imageBlob) throw new Error("Base64 conversion failed");

              const headers: Record<string, string> = {};
              if (hfToken) {
                headers["Authorization"] = `Bearer ${hfToken}`;
              }

              const hfResponse = await fetch(
                "https://router.huggingface.co/hf-inference/models/prithivMLmods/Traffic-Density-Classification",
                {
                  method: "POST",
                  headers: headers,
                  body: imageBlob,
                }
              );

              if (!hfResponse.ok) {
                const errText = await hfResponse.text();
                throw new Error(`HF API error: ${hfResponse.status} ${errText}`);
              }

              const hfData = await hfResponse.json();
              if (Array.isArray(hfData) && hfData.length > 0) {
                const topResult = hfData[0];
                const probabilities: Record<string, number> = {};
                hfData.forEach((item: any) => {
                  probabilities[item.label] = item.score;
                });

                let signal = "GREEN";
                if (topResult.label.includes("high-traffic")) {
                  signal = "RED";
                } else if (topResult.label.includes("medium-traffic")) {
                  signal = "YELLOW";
                }

                data = {
                  label: topResult.label,
                  confidence: topResult.score,
                  signal: signal,
                  probabilities: probabilities
                };
              } else {
                throw new Error("Invalid response format from Hugging Face");
              }
            } else {
              // Local mode
              const response = await fetch("http://localhost:8000/analyze-frame", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ image: base64Image }),
              })
              
              if (response.ok) {
                data = await response.json()
              } else {
                throw new Error(`Local API error: ${response.status}`);
              }
            }
            
            if (data) {
              setError(null);
              const newDensity = labelToDensity(data.label)
              
              setLanes(prev => prev.map(l => {
                if (l.id === lane.id) {
                  return { 
                    ...l, 
                    prevDensity: l.density,
                    density: newDensity,
                    prediction: data
                  }
                }
                return l
              }))
            }
          } catch (err: any) {
            console.error(`Inference error for Lane ${lane.id}:`, err)
            setError(`Inference failed on Lane ${lane.id}: ${err.message || err}`)
          }
        }
      } else if (lane.isDummy) {
        // Simulate minor variation for dummy
        const newDensity = Math.random() > 0.8 ? [0, 2, 5][Math.floor(Math.random() * 3)] : lane.density
        setLanes(prev => prev.map(l => l.id === lane.id ? { ...l, density: newDensity } : l))
      }
      // Small pause between lanes to avoid overwhelming the server
      await new Promise(r => setTimeout(r, 100))
    }

    if (processingRef.current) {
      setTimeout(processAllLanes, 500)
    }
  }

  // Effect: Sync Streams to Dashboard when it mounts
  useEffect(() => {
    if (setupStep === "ready") {
      lanes.slice(0, laneCount).forEach(lane => {
        const main = videoRefs.current[lane.id]
        if (main) {
          if (lane.sourceType === "webcam" && !lane.isDummy) {
            const persistentStream = activeStreams.current[lane.id]
            if (persistentStream && main.srcObject !== persistentStream) {
              main.srcObject = persistentStream
              main.play().catch(e => console.log("Main video play failed", e))
            }
          } else if (lane.sourceType === "video" && lane.videoUrl) {
            if (main.src !== lane.videoUrl) {
              main.src = lane.videoUrl
              main.play().catch(e => console.log("Main video play failed", e))
            }
          }
        }
      })
    }
  }, [setupStep, laneCount])

  const toggleProcessing = () => {
    const isNowProcessing = !isProcessing
    processingRef.current = isNowProcessing
    setIsProcessing(isNowProcessing)
    
    if (isNowProcessing) {
      processAllLanes()
    } else {
      setLanes(prev => prev.map(l => ({ ...l, signal: "RED", waitTime: 0, timer: 0 })))
      setActiveLaneId(null)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 pt-32 pb-20">
        <div className="flex flex-col gap-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Multi-Lane <span className="text-accent">Intelligent Controller</span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Configure independent traffic feeds for your junction and visualize real-time priority arbitration.
            </p>
          </div>

          {/* SETUP FLOW */}
          {setupStep === "junction" && (
            <Card className="max-w-2xl mx-auto border-accent/20 bg-accent/5 backdrop-blur-md">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Step 1: Choose Junction Complexity</CardTitle>
                <CardDescription>Select the number of lanes for this signal junction</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-8">
                {[1, 2, 3, 4].map(num => (
                  <Button 
                    key={num} 
                    variant="outline" 
                    className="h-24 text-2xl font-bold hover:border-accent hover:text-accent transition-all"
                    onClick={() => setupJunction(num)}
                  >
                    {num} Lane{num > 1 ? "s" : ""}
                  </Button>
                ))}
              </CardContent>
            </Card>
          )}

          {setupStep === "sources" && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Step 2: Initialize Lane Feeds</h2>
                <Badge variant="outline">{laneCount} Lanes Active</Badge>
              </div>

              {/* Inference Engine Settings */}
              <Card className="border-accent/15 bg-accent/5 backdrop-blur-md p-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold tracking-wide uppercase text-accent">Inference Engine</h3>
                    <p className="text-xs text-muted-foreground">Select where the AI model executes. The Hugging Face API is completely free and requires no credits.</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      size="sm"
                      variant={inferenceMode === "serverless" ? "default" : "outline"} 
                      onClick={() => saveMode("serverless")}
                    >
                      Serverless (Hugging Face API)
                    </Button>
                    <Button 
                      size="sm"
                      variant={inferenceMode === "local" ? "default" : "outline"} 
                      onClick={() => saveMode("local")}
                    >
                      Local Server (localhost:8000)
                    </Button>
                  </div>
                </div>
                {inferenceMode === "serverless" && (
                  <div className="mt-4 space-y-2 border-t border-border/50 pt-4">
                    <label className="text-xs font-semibold text-muted-foreground block">
                      Hugging Face User Access Token (Optional)
                    </label>
                    <input 
                      type="password"
                      placeholder="hf_..."
                      value={hfToken}
                      onChange={(e) => saveToken(e.target.value)}
                      className="w-full max-w-md px-3 py-1.5 text-sm bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
                    />
                    <p className="text-[10px] text-muted-foreground">
                      No costs or credits required. If you encounter rate limits, you can paste a free read token from your <a href="https://huggingface.co/settings/tokens" target="_blank" rel="noopener noreferrer" className="underline text-accent">Hugging Face Settings</a>.
                    </p>
                  </div>
                )}
              </Card>

              <div className="grid gap-4 md:grid-cols-2">
                {lanes.slice(0, laneCount).map(lane => (
                  <Card key={lane.id} className="border-border">
                    <CardHeader className="py-4">
                      <CardTitle className="text-sm">Configure Lane {lane.id}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Source Preview */}
                      <div className="aspect-video bg-black rounded-lg overflow-hidden border border-border/50 relative">
                        {lane.sourceType ? (
                          <video 
                            ref={el => { previewVideoRefs.current[lane.id] = el }}
                            autoPlay 
                            muted 
                            playsInline 
                            loop
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground/50">
                            <Play className="h-8 w-8 mb-2 opacity-20" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">No Source Selected</span>
                          </div>
                        )}
                        {lane.isDummy && (
                          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center text-center p-4">
                            <p className="text-[10px] font-bold text-yellow-500 uppercase">Single Webcam Detected<br/>Simulating Lane {lane.id} Activity</p>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Button 
                          variant={lane.sourceType === "webcam" ? "default" : "outline"} 
                          className="flex-1 gap-2"
                          onClick={() => configureLaneSource(lane.id, "webcam")}
                        >
                          <Camera className="h-4 w-4" /> Webcam
                        </Button>
                        <Button 
                          variant={lane.sourceType === "video" ? "default" : "outline"} 
                          className="flex-1 gap-2"
                          onClick={() => configureLaneSource(lane.id, "video")}
                        >
                          <Upload className="h-4 w-4" /> Video File
                        </Button>
                      </div>
                      <input 
                        type="file" 
                        ref={el => { fileInputRefs.current[lane.id] = el }}
                        className="hidden" 
                        accept="video/*" 
                        onChange={(e) => handleLaneVideoUpload(lane.id, e)} 
                      />
                      {lane.sourceType && (
                        <div className={`text-[10px] ${lane.isDummy ? "text-yellow-500" : "text-green-500"} font-bold flex items-center gap-1`}>
                          <RefreshCw className="h-3 w-3" /> 
                          {lane.isDummy ? "Source Active (Dummy Mode)" : "Source Linked Successfully"}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="flex justify-center pt-4">
                <Button 
                  size="lg" 
                  disabled={lanes.slice(0, laneCount).some(l => !l.sourceType)}
                  onClick={() => {
                    // Pre-sync if possible, though the useEffect will handle the main handoff
                    setSetupStep("ready")
                  }}
                  className="px-12 bg-accent hover:bg-accent/90"
                >
                  Confirm Configuration & Launch
                </Button>
              </div>
            </div>
          )}

          {/* MAIN DASHBOARD */}
          {setupStep === "ready" && (
            <div className="grid gap-8 lg:grid-cols-3">
              {/* Video Feeds Column */}
              <div className="lg:col-span-2 space-y-6">
                <div className={`grid gap-4 ${laneCount === 1 ? "grid-cols-1" : "grid-cols-2"}`}>
                  {lanes.slice(0, laneCount).map(lane => (
                    <Card key={lane.id} className="border-border bg-card overflow-hidden">
                      <CardHeader className="flex flex-row items-center justify-between py-3 bg-secondary/20">
                        <div className="flex items-center gap-2">
                          <div className={`h-2 w-2 rounded-full ${lane.signal === "GREEN" ? "bg-green-500" : lane.signal === "YELLOW" ? "bg-yellow-500" : "bg-red-500"}`} />
                          <span className="text-xs font-bold uppercase tracking-wider">Lane {lane.id}</span>
                        </div>
                        {isProcessing && lane.prediction && (
                          <Badge variant="outline" className={`text-[10px] h-5 uppercase tracking-tighter border-2 ${
                            lane.prediction.label.includes("high") ? "border-red-500/50 text-red-500" :
                            lane.prediction.label.includes("medium") ? "border-yellow-500/50 text-yellow-500" :
                            "border-green-500/50 text-green-500"
                          }`}>
                            {lane.prediction.label.replace("-", " ")}
                          </Badge>
                        )}
                      </CardHeader>
                      <CardContent className="p-0 relative aspect-video bg-black">
                        <video 
                          ref={el => { videoRefs.current[lane.id] = el }} 
                          autoPlay 
                          muted 
                          playsInline 
                          loop
                          className="w-full h-full object-cover"
                        />
                        <canvas ref={el => { canvasRefs.current[lane.id] = el }} className="hidden" />
                        
                        {/* Dummy Overlay in Dashboard */}
                        {lane.isDummy && (
                           <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm flex flex-col items-center justify-center border-t border-yellow-500/20">
                              <Play className="h-6 w-6 text-yellow-500/50 mb-1" />
                              <span className="text-[8px] font-bold text-yellow-500/80 uppercase tracking-tighter">Simulated Feed {lane.id}</span>
                           </div>
                        )}

                        {/* Overlay: Intensity HUD */}
                        <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/80 to-transparent flex items-end justify-between">
                           <div className="space-y-1">
                              <p className="text-[10px] text-white/50 font-bold uppercase">Priority Score</p>
                              <p className="text-lg font-black text-white">{lane.ps}</p>
                           </div>
                           <div className="text-right">
                              <p className="text-[10px] text-white/50 font-bold uppercase">Wait Time</p>
                              <p className="text-xs font-mono text-white">{lane.waitTime}s</p>
                           </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="flex flex-col items-center gap-2">
                  <div className="flex justify-center gap-4">
                    <Button 
                      onClick={toggleProcessing} 
                      variant={isProcessing ? "destructive" : "default"}
                      className="gap-2 px-8"
                    >
                      {isProcessing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      {isProcessing ? "Freeze Analysis" : "Initialize Matrix"}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                          processingRef.current = false
                          setIsProcessing(false)
                          setSetupStep("junction")
                      }}
                    >
                      Reconfigure Junction
                    </Button>
                  </div>
                  <div className="text-[10px] text-muted-foreground flex items-center gap-2 mt-1">
                    <span>Inference Engine:</span>
                    <span className="font-bold text-accent uppercase">{inferenceMode}</span>
                    {inferenceMode === "serverless" && !hfToken && <span className="text-yellow-500/80">(Free Public Pool)</span>}
                    {inferenceMode === "serverless" && hfToken && <span className="text-green-500/80">(Personal HF Access Token)</span>}
                  </div>
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 p-3 rounded-lg border border-destructive/20">
                    <AlertCircle className="h-4 w-4" />
                    {error}
                  </div>
                )}
              </div>

              {/* Analysis Results Column */}
              <div className="space-y-8">
                {/* Intelligent Junction Controller View */}
                <Card className="border-border bg-card overflow-hidden sticky top-32">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-bold uppercase tracking-widest text-accent">Active Controller</CardTitle>
                      <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20">{laneCount}-Lane Logic</Badge>
                    </div>
                    <CardDescription>Density & Wait Time Arbitration</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    {/* The Dynamic Junction Grid */}
                    <div className="relative aspect-square w-full max-w-[280px] mx-auto bg-slate-900/50 rounded-full border-4 border-slate-800/50 flex items-center justify-center p-4">
                      {lanes.slice(0, laneCount).map((lane, idx) => {
                        const positions = [
                          "top-0 left-1/2 -translate-x-1/2", // North
                          "right-0 top-1/2 -translate-y-1/2", // East
                          "bottom-0 left-1/2 -translate-x-1/2", // South
                          "left-0 top-1/2 -translate-y-1/2", // West
                        ]
                        return (
                          <div key={lane.id} className={`absolute ${positions[idx]} flex flex-col items-center gap-1`}>
                            <span className="text-[10px] font-bold text-muted-foreground">{lane.id}</span>
                            <div className={`w-8 h-12 bg-slate-900 rounded-lg border-2 border-slate-700 p-1 flex flex-col justify-between shadow-lg`}>
                              <div className={`w-full h-2.5 rounded-full ${lane.signal === "RED" ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" : "bg-red-950"}`} />
                              <div className={`w-full h-2.5 rounded-full ${lane.signal === "YELLOW" ? "bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.5)]" : "bg-yellow-950"}`} />
                              <div className={`w-full h-2.5 rounded-full ${lane.signal === "GREEN" ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" : "bg-green-950"}`} />
                            </div>
                            {lane.signal === "GREEN" && (
                              <span className="text-[10px] font-mono font-bold text-green-500">{lane.timer}s</span>
                            )}
                          </div>
                        )
                      })}

                      {/* Central Controller UI */}
                      <div className="w-24 h-24 rounded-full bg-slate-900 border-2 border-slate-700 flex flex-col items-center justify-center text-center p-2 z-20 shadow-2xl">
                        <span className="text-[8px] uppercase tracking-tighter text-muted-foreground font-bold">Winner</span>
                        <span className="text-2xl font-black text-foreground">{activeLaneId || "--"}</span>
                        <div className="h-1 w-8 bg-accent rounded-full mt-1 animate-pulse" />
                      </div>
                    </div>

                    {/* Priority Scores List */}
                    <div className="mt-8 space-y-3">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest border-b border-border pb-1">Arbitration Matrix & Trends</p>
                      {lanes.slice(0, laneCount).map(lane => (
                        <div key={lane.id} className={`flex items-center justify-between p-2 rounded-lg border transition-colors ${lane.signal === "GREEN" ? "bg-green-500/5 border-green-500/20" : "bg-secondary/20 border-transparent"}`}>
                          <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${lane.signal === "GREEN" ? "bg-green-500" : lane.signal === "YELLOW" ? "bg-yellow-500" : "bg-red-500"}`} />
                            <div className="flex flex-col">
                                <span className="text-xs font-bold text-foreground">Lane {lane.id}</span>
                                <div className="flex items-center gap-1">
                                    <Badge variant="outline" className="text-[8px] px-1 py-0 h-3 uppercase leading-none">{lane.density === 10 ? "High" : lane.density === 5 ? "Med" : lane.density === 2 ? "Low" : "No"}</Badge>
                                    {lane.prevDensity !== null && lane.density !== lane.prevDensity && (
                                        <span className={`text-[8px] font-bold ${lane.density > lane.prevDensity ? "text-red-500" : "text-green-500"}`}>
                                            {lane.density > lane.prevDensity ? "↑" : "↓"}
                                        </span>
                                    )}
                                </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="text-[8px] uppercase text-muted-foreground font-bold">PS</p>
                              <p className={`text-xs font-black ${lane.signal === "GREEN" ? "text-green-500" : "text-foreground"}`}>{lane.ps}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Decision Logs */}
                    <div className="mt-6 pt-6 border-t border-border">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2 px-1">Recent Arbitration Events</p>
                        <div className="space-y-1.5">
                            {history.length > 0 ? (
                                history.map((log, i) => (
                                    <div key={i} className="flex items-center gap-3 text-[10px] font-mono text-muted-foreground border-l border-border pl-2">
                                        <span className="text-accent/40">{log.split(": ")[0]}</span>
                                        <span className="text-foreground/80">{log.split(": ")[1]}</span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-[10px] text-muted-foreground italic px-1">Listening for controller decisions...</p>
                            )}
                        </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
