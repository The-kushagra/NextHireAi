import { db } from "@/drizzle/db"
import { JobListingTable, OrganizationTable } from "@/drizzle/schema"
import { desc, eq } from "drizzle-orm"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  MapPin, 
  Briefcase, 
  DollarSign, 
  Clock 
} from "lucide-react"
import { JobFilters } from "@/components/jobs/JobFilters"
import { and, or, ilike } from "drizzle-orm"

export const dynamic = "force-dynamic"

export default async function PublicJobsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; type?: string; location?: string }>
}) {
  const { search, type, location } = await searchParams

  const whereClause = [eq(JobListingTable.status, "published")]

  if (search) {
    const searchCondition = or(
      ilike(JobListingTable.title, `%${search}%`),
      ilike(OrganizationTable.name, `%${search}%`)
    )
    if (searchCondition) whereClause.push(searchCondition)
  } 

  if (type && type !== "all") {
    whereClause.push(eq(JobListingTable.type, type as any))
  }

  if (location && location !== "all") {
    whereClause.push(eq(JobListingTable.locationRequirement, location as any))
  }

  const jobs = await db
    .select({
      id: JobListingTable.id,
      title: JobListingTable.title,
      type: JobListingTable.type,
      locationRequirement: JobListingTable.locationRequirement,
      wage: JobListingTable.wage,
      wageInterval: JobListingTable.wageInterval,
      organizationName: OrganizationTable.name,
      organizationImageUrl: OrganizationTable.imageUrl,
      postedAt: JobListingTable.postedAt,
    })
    .from(JobListingTable)
    .innerJoin(OrganizationTable, eq(JobListingTable.organizationId, OrganizationTable.id))
    .where(and(...(whereClause.filter(Boolean) as any[])))
    .orderBy(desc(JobListingTable.postedAt))

  return (
    <div className="container mx-auto py-16 space-y-12 px-6">
      <div className="flex flex-col gap-6 text-center max-w-2xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-black tracking-tight text-white leading-tight">
          Discover Your <span className="text-primary">Next</span> Role
        </h1>
        <p className="text-lg md:text-xl text-slate-400 font-medium">
          Browse the most elite AI and technology positions from globally recognized companies.
        </p>
      </div>

      <div className="max-w-4xl mx-auto w-full">
         <JobFilters />
      </div>

      <div className="grid gap-6 max-w-4xl mx-auto w-full">
        {jobs.map((job) => (
          <Link key={job.id} href={`/jobs/${job.id}`} className="group block">
            <div className="relative overflow-hidden rounded-lg border border-border bg-card p-8 transition-colors hover:border-primary">
              <div className="flex flex-col md:flex-row justify-between gap-8 relative z-10">
                <div className="flex gap-6">
                  <div className="size-16 rounded-lg border border-border bg-[#1F2530] flex items-center justify-center overflow-hidden shrink-0">
                    {job.organizationImageUrl ? (
                       <img src={job.organizationImageUrl} alt={job.organizationName} className="object-cover w-full h-full" />
                    ) : (
                       <Briefcase className="size-8 text-slate-600" />
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                       <span className="text-cyan-400 font-black text-xs uppercase tracking-[0.2em]">{job.organizationName}</span>
                    </div>
                    <h3 className="font-black text-2xl text-white group-hover:text-foreground transition-colors">{job.title}</h3>
                    <div className="flex flex-wrap gap-4 text-xs font-bold text-muted-foreground pt-2">
                       <span className="flex items-center gap-2 px-3 py-1.5 rounded bg-[#1F2530] border border-border">
                         <MapPin className="size-3.5 text-muted-foreground" />
                         {job.locationRequirement}
                       </span>
                       <span className="flex items-center gap-2 px-3 py-1.5 rounded bg-[#1F2530] border border-border capitalize">
                         <Clock className="size-3.5 text-muted-foreground" />
                         {job.type}
                       </span>
                       {job.wage && (
                         <span className="flex items-center gap-2 px-3 py-1.5 rounded bg-[#1F2530] border border-border">
                           <DollarSign className="size-3.5 text-muted-foreground" />
                           {job.wage.toLocaleString()} / {job.wageInterval}
                         </span>
                       )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                   <Button variant="outline" className="w-full md:w-auto font-black px-8">
                     View Role
                   </Button>
                </div>
              </div>
            </div>
          </Link>
        ))}

        {jobs.length === 0 && (
          <div className="text-center py-24 border border-dashed border-border rounded-lg bg-card">
             <div className="size-20 rounded-lg bg-[#1F2530] flex items-center justify-center mx-auto mb-6">
                <Briefcase className="size-10 text-muted-foreground" />
             </div>
             <p className="text-muted-foreground font-bold text-xl italic max-w-xs mx-auto">No job opportunities found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
}
