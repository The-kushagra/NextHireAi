import { db } from "@/drizzle/db"
import { JobListingTable } from "@/drizzle/schema"
import { eq } from "drizzle-orm"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  MapPin, 
  Briefcase, 
  DollarSign, 
  Clock,
  Calendar,
  ChevronLeft
} from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { ApplyModal } from "@/components/modals/ApplyModal"

export default async function JobDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const job = await db.query.JobListingTable.findFirst({
    where: eq(JobListingTable.id, id),
    with: {
      organization: true,
    },
  })

  if (!job) {
    notFound()
  }

  return (
    <div className="container mx-auto py-10 max-w-4xl space-y-8 px-4">
      <Button variant="ghost" asChild className="-ml-4 gap-2">
        <Link href="/jobs">
          <ChevronLeft className="size-4" />
          Back to Jobs
        </Link>
      </Button>

      <div className="flex flex-col md:flex-row justify-between items-start gap-6">
        <div className="flex gap-6">
          <div className="size-20 rounded-lg border border-border bg-[#1F2530] flex items-center justify-center overflow-hidden shrink-0">
             {job.organization.imageUrl ? (
                <img src={job.organization.imageUrl} alt={job.organization.name} className="object-cover" />
             ) : (
                <Briefcase className="size-8 text-muted-foreground" />
             )}
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">{job.title}</h1>
            <div className="flex items-center gap-2 group">
              <Link href={`/organizations/${job.organizationId}`} className="text-xl font-medium text-muted-foreground hover:text-primary transition-colors">
                {job.organization.name}
              </Link>
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
                <Badge variant="secondary" className="gap-1">
                  <MapPin className="size-3" /> {job.locationRequirement}
                </Badge>
                <Badge variant="secondary" className="gap-1">
                  <Clock className="size-3" /> {job.type}
                </Badge>
                <Badge variant="outline" className="gap-1 capitalize">
                  {job.experienceLevel}
                </Badge>
            </div>
          </div>
        </div>
        <ApplyModal jobListingId={job.id} jobTitle={job.title} />
      </div>

      <div className="grid gap-8 md:grid-cols-[1fr_300px]">
        <div className="space-y-8">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold border-b pb-2">Description</h2>
            <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap text-slate-200 leading-relaxed font-medium">
              {job.description}
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <div className="rounded-lg border border-border p-6 space-y-6 bg-card">
            <h3 className="font-bold text-white uppercase tracking-widest text-xs opacity-70">Job Overview</h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="size-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <DollarSign className="size-4 text-muted-foreground" />
                </div>
                <div>
                   <p className="text-xs font-black text-slate-500 uppercase tracking-tighter">Salary</p>
                   <p className="text-sm text-white font-bold">
                     {job.wage ? `${job.wage.toLocaleString()} / ${job.wageInterval}` : "Not specified"}
                   </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="size-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <Calendar className="size-4 text-muted-foreground" />
                </div>
                <div>
                   <p className="text-xs font-black text-slate-500 uppercase tracking-tighter">Posted</p>
                   <p className="text-sm text-white font-bold">
                      {job.postedAt ? formatDistanceToNow(new Date(job.postedAt), { addSuffix: true }) : "N/A"}
                   </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="size-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <MapPin className="size-4 text-muted-foreground" />
                </div>
                <div>
                   <p className="text-xs font-black text-slate-500 uppercase tracking-tighter">Location</p>
                   <p className="text-sm text-white font-bold capitalize">{job.locationRequirement}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-border p-6 space-y-4 bg-card">
             <h3 className="font-bold text-white uppercase tracking-widest text-xs opacity-70">About {job.organization.name}</h3>
             <p className="text-sm text-slate-300 leading-relaxed">
                We're a team of innovators building the future of technology. Join us to make a real impact.
              </p>
             <Button variant="outline" className="w-full font-bold" asChild>
                <Link href={`/organizations/${job.organizationId}`}>View Profile</Link>
             </Button>
          </div>
        </aside>
      </div>
    </div>
  )
}
