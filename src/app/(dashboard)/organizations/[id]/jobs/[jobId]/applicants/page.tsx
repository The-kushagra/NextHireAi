import { db } from "@/drizzle/db"
import { JobListingTable } from "@/drizzle/schema"
import { eq, and } from "drizzle-orm"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Sparkles } from "lucide-react"
import { RankedApplicants } from "@/components/RankedApplicants"

export default async function JobApplicantsPage({
  params,
}: {
  params: Promise<{ id: string; jobId: string }>
}) {
  const { id, jobId } = await params

  const job = await db.query.JobListingTable.findFirst({
    where: and(eq(JobListingTable.id, jobId), eq(JobListingTable.organizationId, id)),
  })

  if (!job) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight">
            Ranked Applicants
          </h1>
          <Badge
            variant="secondary"
            className="gap-1"
          >
            <Sparkles className="size-3" />
            Powered by AI
          </Badge>
        </div>
        <p className="text-muted-foreground">
          Candidates for <span className="font-medium text-foreground">{job.title}</span> — ranked by AI match score.
        </p>
      </div>

      <RankedApplicants jobId={jobId} />
    </div>
  )
}
