"use client"

import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Sparkles, FileText, TrendingUp } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

type Recommendation = {
  id: string
  title: string
  company: string
  location: string
  type: string
  matchScore: number
  reason: string
}

function getScoreClass(score: number) {
  if (score >= 80) return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
  if (score >= 60) return "bg-amber-500/10 text-amber-400 border-amber-500/30";
  return "bg-muted text-muted-foreground border-border";
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="rounded-lg border border-border bg-card p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-3 flex-1">
              <Skeleton className="h-6 w-3/5 bg-slate-700" />
              <Skeleton className="h-4 w-2/5 bg-slate-700" />
              <Skeleton className="h-4 w-4/5 bg-slate-700" />
            </div>
            <Skeleton className="h-10 w-16 rounded-xl bg-slate-700" />
          </div>
        </div>
      ))}
    </div>
  )
}

function NoResumeMessage() {
  return (
    <div className="rounded-lg border border-dashed border-border bg-card p-12 flex flex-col items-center justify-center text-center space-y-6">
      <div className="size-20 rounded-lg bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
        <FileText className="size-10 text-amber-500" />
      </div>
      <div className="max-w-xs">
        <h3 className="text-2xl font-bold text-white leading-tight">Match Your Resume</h3>
        <p className="text-slate-400 font-medium mt-2">
          Upload your resume in your profile to unlock personalized AI-driven job recommendations.
        </p>
      </div>
      <Link href="/user-profile">
        <Button variant="outline" className="h-11 px-8 rounded-xl font-bold">
          Go to Profile
        </Button>
      </Link>
    </div>
  )
}

export function RecommendedJobs() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [loading, setLoading] = useState(true)
  const [noResume, setNoResume] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchRecommendations() {
      try {
        const res = await fetch("/api/jobs/recommended")
        const data = await res.json()

        if (!res.ok) {
          if (data.error === "no_resume") {
            setNoResume(true)
          } else {
            setError(data.message || "Failed to load recommendations.")
          }
          return
        }

        setRecommendations(data.recommendations ?? [])
      } catch {
        setError("Something went wrong. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchRecommendations()
  }, [])

  if (loading) return <LoadingSkeleton />
  if (noResume) return <NoResumeMessage />

  if (error) {
    return (
      <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-8 text-center">
        <p className="text-red-400 font-bold">{error}</p>
      </div>
    )
  }

  if (recommendations.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-12 text-center">
        <p className="text-muted-foreground font-medium font-lg">
          No matches found for your skill set yet. Keep looking!
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-5">
      {recommendations.map((rec, index) => (
        <Link
          key={rec.id}
          href={`/jobs/${rec.id}`}
          className="group block relative rounded-lg border border-border bg-card p-6 transition-colors hover:border-primary overflow-hidden"
        >
          <div className="flex items-start justify-between gap-6">
            <div className="flex-1 min-w-0 space-y-3">
              <div className="flex items-center gap-3">
                {index === 0 && (
                   <Badge variant="match" className="gap-1">
                      <TrendingUp className="size-3" />
                      Top Match
                   </Badge>
                )}
                <span className="text-cyan-400 font-bold text-xs uppercase tracking-widest">{rec.company}</span>
              </div>
              
              <h4 className="font-black text-xl text-white group-hover:text-foreground transition-colors leading-tight">
                {rec.title}
              </h4>
              
              <div className="flex flex-wrap gap-2 items-center text-xs font-semibold text-muted-foreground">
                {rec.location && (
                  <span className="px-2 py-1 rounded-md bg-muted border border-border">{rec.location}</span>
                )}
                {rec.type && (
                  <span className="px-2 py-1 rounded-md bg-muted border border-border capitalize">{rec.type}</span>
                )}
              </div>
              
              <div className="flex items-start gap-2 pt-1">
                <Sparkles className="size-4 shrink-0 text-amber-500 mt-0.5" />
                <p className="text-sm text-slate-400 font-medium leading-relaxed italic">
                  "{rec.reason}"
                </p>
              </div>
            </div>
            
            <div className={cn(
              "shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-black text-sm border transition-colors",
              getScoreClass(rec.matchScore)
            )}>
              <Sparkles className={cn(
                "size-3.5",
                rec.matchScore >= 80 ? "text-emerald-400" : rec.matchScore >= 60 ? "text-amber-400" : "text-muted-foreground"
              )} />
              <span>{rec.matchScore}%</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
