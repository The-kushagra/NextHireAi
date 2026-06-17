import { db } from "@/drizzle/db"
import { JobListingTable, OrganizationTable } from "@/drizzle/schema"
import { eq, desc } from "drizzle-orm"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus, Clock, MapPin, BriefcaseBusiness } from "lucide-react"

export default async function OrganizationJobsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  const organization = await db.query.OrganizationTable.findFirst({
    where: eq(OrganizationTable.id, id),
  })

  if (!organization) {
    notFound()
  }

  const jobs = await db.query.JobListingTable.findMany({
    where: eq(JobListingTable.organizationId, id),
    orderBy: desc(JobListingTable.postedAt),
  })

  return (
    <div className="container mx-auto py-10 space-y-10 px-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-white tracking-tight">Active Jobs</h1>
          <p className="text-muted-foreground font-medium italic">Manage and track your open positions at {organization.name}</p>
        </div>
        <Button asChild className="gap-2 font-black">
          <Link href={`/organizations/${id}/jobs/new`}>
            <Plus className="size-4" />
            New Position
          </Link>
        </Button>
      </div>

      <div className="grid gap-6">
        {jobs.map((job) => (
          <div key={job.id} className="group relative overflow-hidden rounded-lg border border-border bg-card p-6 transition-colors hover:border-primary">
            <div className="flex flex-col md:flex-row justify-between gap-6">
              <div className="space-y-3">
                 <div className="flex items-center gap-2">
                    <div className="size-2 rounded-full bg-slate-500" />
                    <span className="text-xs font-black text-muted-foreground uppercase tracking-widest">{job.status}</span>
                 </div>
                 <h3 className="text-xl font-black text-white group-hover:text-foreground transition-colors">{job.title}</h3>
                 <div className="flex flex-wrap gap-4 text-xs font-bold text-muted-foreground">
                   <span className="flex items-center gap-1.5">
                     <MapPin className="size-3.5 text-muted-foreground" />
                     {job.locationRequirement}
                   </span>
                   <span className="flex items-center gap-1.5">
                     <Clock className="size-3.5 text-muted-foreground" />
                     {job.type}
                   </span>
                 </div>
              </div>
              <div className="flex items-center gap-3">
                <Button asChild variant="outline" className="font-bold">
                  <Link href={`/jobs/${job.id}`}>View Public</Link>
                </Button>
                <Button asChild variant="outline" className="font-bold">
                   <Link href={`/organizations/${id}/jobs/${job.id}/applicants`}>Applicants</Link>
                </Button>
              </div>
            </div>
          </div>
        ))}

        {jobs.length === 0 && (
          <div className="text-center py-20 border border-dashed border-border rounded-lg bg-card">
            <BriefcaseBusiness className="size-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground font-bold text-lg">No job listings yet.</p>
            <p className="text-muted-foreground/80 text-sm mt-1">Create your first position to start receiving applications.</p>
          </div>
        )}
      </div>
    </div>
  )
}
