import { db } from "@/drizzle/db"
import { JobListingApplicationTable, JobListingTable, UserTable } from "@/drizzle/schema"
import { eq, and } from "drizzle-orm"
import { notFound } from "next/navigation"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sparkles, ChevronLeft, FileText, User, CheckCircle2, X } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CandidateSummary } from "@/components/ai/CandidateSummary"
import { UpdateStatusButtons } from "@/components/applications/UpdateStatusButtons"

export default async function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string; jobId: string; applicationId: string }>
}) {
  const { id, jobId, applicationId } = await params

  const application = await db.query.JobListingApplicationTable.findFirst({
    where: and(
        eq(JobListingApplicationTable.id, applicationId),
        eq(JobListingApplicationTable.jobListingId, jobId)
    ),
    with: {
      user: true,
      jobListing: true,
    },
  })

  if (!application) {
    notFound()
  }

  const matchingSkills = application.matchingSkills ? application.matchingSkills.split(",").map(s => s.trim()) : []
  const missingSkills = application.missingSkills ? application.missingSkills.split(",").map(s => s.trim()) : []

  return (
    <div className="container py-10 max-w-5xl space-y-8">
      <Button variant="ghost" asChild className="-ml-4 gap-2">
        <Link href={`/organizations/${id}/jobs/${jobId}/applicants`}>
          <ChevronLeft className="size-4" />
          Back to Applicants
        </Link>
      </Button>

      <div className="flex flex-col md:flex-row justify-between items-start gap-6">
        <div className="flex gap-6">
          <Avatar className="size-20 border shadow-sm">
             <AvatarImage src={application.user.imageUrl || ""} />
             <AvatarFallback><User className="size-10" /></AvatarFallback>
          </Avatar>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">{application.user.name}</h1>
            <p className="text-xl text-muted-foreground">{application.user.email}</p>
            <div className="flex items-center gap-2 pt-2">
               <Badge variant="outline">
                  Application for {application.jobListing.title}
               </Badge>
               <Badge variant="outline" className="capitalize">{application.status}</Badge>
            </div>
          </div>
        </div>
        <UpdateStatusButtons 
          applicationId={application.id} 
          currentStatus={application.status} 
        />
      </div>

      <div className="grid gap-8 md:grid-cols-[1fr_350px]">
        <div className="space-y-8">
          <CandidateSummary 
            resumeText={application.resumeText || ""} 
            jobDescription={application.jobListing.description} 
          />
          
          <section className="space-y-4">
             <div className="flex items-center justify-between border-b pb-2">
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                     <FileText className="size-6 text-muted-foreground" />
                     Resume Content
                  </h2>
             </div>
             <div className="rounded-lg border border-border bg-card p-6 whitespace-pre-wrap font-mono text-sm leading-relaxed text-slate-300">
                {application.resumeText}
             </div>
          </section>
        </div>

        <aside className="space-y-6">
          <div className="rounded-lg border border-border p-6 space-y-6 bg-card relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
               <Sparkles className="size-24 text-muted-foreground rotate-12" />
            </div>
            <div className="relative">
                <h3 className="font-bold text-lg flex items-center gap-2 mb-4">
                    <Sparkles className="size-5 text-muted-foreground" />
                    AI Match Summary
                </h3>
                <div className="flex items-baseline gap-2 mb-4">
                   <span className={`text-5xl font-black ${
                     application.aiScore && Number(application.aiScore) >= 80 ? "text-emerald-400" :
                     application.aiScore && Number(application.aiScore) >= 60 ? "text-amber-400" :
                     "text-muted-foreground"
                   }`}>{application.aiScore}%</span>
                   <span className="text-sm font-medium text-muted-foreground">Match Score</span>
                </div>
                <p className="text-sm leading-relaxed text-slate-400">
                   {application.aiFeedback}
                </p>
            </div>
          </div>

          <div className="space-y-4">
             <h3 className="font-bold px-1">Skill Breakdown</h3>
             <Card>
                <CardHeader className="py-3 px-4">
                   <CardTitle className="text-sm flex items-center gap-2 text-white">
                      <CheckCircle2 className="size-4 text-emerald-400" />
                      Matching Skills
                   </CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4">
                   <div className="flex flex-wrap gap-2">
                      {matchingSkills.map(skill => (
                         <Badge key={skill} variant="match">
                            {skill}
                         </Badge>
                      ))}
                      {matchingSkills.length === 0 && <p className="text-xs text-muted-foreground italic">No matching skills identified.</p>}
                   </div>
                </CardContent>
             </Card>

             <Card>
                <CardHeader className="py-3 px-4">
                   <CardTitle className="text-sm flex items-center gap-2 text-white">
                      <X className="size-4 text-red-400" />
                      Gaps Identified
                   </CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4">
                   <div className="flex flex-wrap gap-2">
                      {missingSkills.map(skill => (
                         <Badge key={skill} variant="destructive">
                            {skill}
                         </Badge>
                      ))}
                      {missingSkills.length === 0 && <p className="text-xs text-muted-foreground italic">No obvious gaps found.</p>}
                   </div>
                </CardContent>
             </Card>
          </div>
        </aside>
      </div>
    </div>
  )
}
