"use client"

import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Sparkles, UserCheck, User } from "lucide-react"
import { cn } from "@/lib/utils"

type RankedApplicant = {
  id: string
  name: string
  email: string
  imageUrl: string
  status: string
  score: number
  reason: string
  appliedAt: string
}

function getScoreClass(score: number) {
  if (score >= 80) return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
  if (score >= 60) return "bg-amber-500/10 text-amber-400 border-amber-500/30";
  return "bg-muted text-muted-foreground border-border";
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="rounded-lg border border-border bg-card p-6">
          <div className="flex items-center gap-4">
            <Skeleton className="size-10 rounded-full bg-muted" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-1/3 bg-muted" />
              <Skeleton className="h-4 w-1/4 bg-muted" />
            </div>
            <Skeleton className="h-10 w-20 rounded-lg bg-muted" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function RankedApplicants({ jobId }: { jobId: string }) {
  const [applicants, setApplicants] = useState<RankedApplicant[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchRanked() {
      try {
        const res = await fetch(`/api/jobs/${jobId}/applicants/ranked`)
        const data = await res.json()

        if (!res.ok) {
          setError(data.error || "Failed to load applicants.")
          return
        }

        setApplicants(data.applicants ?? [])
      } catch {
        setError("Something went wrong. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchRanked()
  }, [jobId])

  if (loading) return <LoadingSkeleton />

  if (error) {
    return (
      <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-8 text-center text-red-400 font-bold">
        {error}
      </div>
    )
  }

  if (applicants.length === 0) {
    return (
      <div className="py-24 text-center border border-dashed border-border rounded-lg bg-card">
        <div className="size-20 rounded-lg bg-muted flex items-center justify-center mx-auto mb-6">
          <User className="size-10 text-muted-foreground opacity-40" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">No applicants yet</h3>
        <p className="text-muted-foreground font-medium max-w-xs mx-auto">
          Applicants will appear here with AI-generated match scores once they submit their resumes.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {applicants.map((applicant, index) => (
        <div
          key={applicant.id}
          className="group relative rounded-lg border border-border bg-card p-6 transition-colors hover:border-primary"
        >
          <div className="flex items-center gap-6">
            {/* Rank */}
            <div className="flex items-center justify-center size-10 rounded-lg bg-[#1F2530] border border-border text-sm font-black text-muted-foreground transition-colors group-hover:text-white">
              #{index + 1}
            </div>

            {/* Avatar */}
            <div className="size-14 rounded-lg bg-[#1F2530] overflow-hidden shrink-0 border border-border">
              {applicant.imageUrl ? (
                <img
                  src={applicant.imageUrl}
                  alt={applicant.name}
                  className="size-full object-cover"
                />
              ) : (
                <div className="size-full flex items-center justify-center">
                  <User className="size-7 text-slate-400" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1">
                <h4 className="font-black text-lg text-white group-hover:text-foreground transition-colors truncate">
                  {applicant.name}
                </h4>
                <Badge variant="secondary" className="shrink-0">
                  {applicant.status}
                </Badge>
              </div>
              <p className="text-sm font-bold text-cyan-400 uppercase tracking-widest truncate">
                {applicant.email}
              </p>
            </div>

            {/* AI Reason */}
            <div className="hidden md:flex items-center gap-3 max-w-[300px] border-x border-border px-6">
              <Sparkles className="size-5 shrink-0 text-amber-500" />
              <p className="text-sm font-medium text-muted-foreground line-clamp-2 italic leading-snug">
                "{applicant.reason}"
              </p>
            </div>

            {/* Score Badge */}
            <div className={cn(
              "shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-black text-sm border transition-colors",
              getScoreClass(applicant.score)
            )}>
              <Sparkles className={cn(
                "size-3.5",
                applicant.score >= 80 ? "text-emerald-400" : applicant.score >= 60 ? "text-amber-400" : "text-muted-foreground"
              )} />
              <span>{applicant.score}%</span>
            </div>

            {/* Shortlist Button */}
            <Button variant="outline" size="sm" className="hidden lg:flex gap-2 font-black">
              <UserCheck className="size-4" />
              Shortlist
            </Button>
          </div>

          {/* Mobile-only AI reason */}
          <div className="md:hidden mt-6 pt-6 border-t border-border flex items-start gap-3">
             <Sparkles className="size-5 shrink-0 text-amber-500" />
             <p className="text-sm font-medium text-muted-foreground italic leading-relaxed">
               "{applicant.reason}"
             </p>
          </div>
        </div>
      ))}
    </div>
  )
}
