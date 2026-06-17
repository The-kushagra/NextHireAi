import { db } from "@/drizzle/db"
import { 
  JobListingTable, 
  JobListingApplicationTable, 
  UserResumeTable, 
  OrganizationUserSettingsTable,
  OrganizationTable,
  UserTable
} from "@/drizzle/schema"
import { auth, currentUser } from "@clerk/nextjs/server"
import { eq, count, desc, avg, inArray, sql } from "drizzle-orm"
import { 
  BriefcaseBusiness, 
  FileText, 
  Users, 
  Sparkles,
  ArrowRight,
  TrendingUp,
  Building2,
  Clock
} from "lucide-react"
import { RecommendedJobs } from "@/components/RecommendedJobs"
import { cn } from "@/lib/utils"
import { getUserRole } from "@/lib/getUserRole"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default async function DashboardPage() {
  const { userId } = await auth()
  const user = await currentUser()
  if (!userId) return null

  const role = await getUserRole(userId)

  if (role === 'candidate') {
    const resume = await db.query.UserResumeTable.findFirst({
      where: eq(UserResumeTable.userId, userId)
    })

    const [appCount] = await db.select({ count: count() })
      .from(JobListingApplicationTable)
      .where(eq(JobListingApplicationTable.userId, userId))

    const latestApp = await db.query.JobListingApplicationTable.findFirst({
      where: eq(JobListingApplicationTable.userId, userId),
      orderBy: desc(JobListingApplicationTable.createdAt)
    })

    return (
      <div className="space-y-12">
        <div className="flex flex-col gap-2">
          <h1 className="text-5xl font-black tracking-tight text-white">
            Welcome back, <span className="text-white">{user?.firstName || 'there'}</span>
          </h1>
          <p className="text-muted-foreground text-lg font-medium">Your AI-powered job search hub</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Resume Card */}
          <div className="group relative rounded-lg border border-border bg-card p-8 hover:border-primary transition-colors">
             <div className="size-14 rounded-lg bg-muted flex items-center justify-center border border-border mb-6 transition-colors">
                <FileText className="size-7 text-muted-foreground" />
             </div>
             <h3 className="text-xl font-bold text-white mb-2">Resume Status</h3>
             {resume ? (
               <div className="space-y-4">
                 <p className="text-sm text-muted-foreground">Successfully processed via AI</p>
                 <Badge variant="success">
                    Updated {new Date(resume.updatedAt).toLocaleDateString()}
                 </Badge>
               </div>
             ) : (
               <div className="space-y-4">
                 <p className="text-sm text-muted-foreground">Unlock AI matching by uploading your resume</p>
                 <Button asChild size="sm" className="w-full">
                   <Link href="/user-profile">Upload Resume</Link>
                 </Button>
               </div>
             )}
          </div>

          {/* AI Success Card */}
          <div className="group relative rounded-lg border border-border bg-card p-8 hover:border-primary transition-colors">
             <div className="size-14 rounded-lg bg-muted flex items-center justify-center border border-border mb-6 transition-colors">
                <TrendingUp className="size-7 text-muted-foreground" />
             </div>
             <h3 className="text-xl font-bold text-white mb-2">Market Analysis</h3>
             <div className="space-y-2">
                 <div className="text-3xl font-black text-white">92%</div>
                 <p className="text-sm text-muted-foreground">Match accuracy for your profile</p>
             </div>
          </div>

          {/* Applications Card */}
          <div className="group relative rounded-lg border border-border bg-card p-8 hover:border-primary transition-colors">
             <div className="size-14 rounded-lg bg-amber-500/10 flex items-center justify-center border border-amber-500/20 mb-6 transition-colors">
                <BriefcaseBusiness className="size-7 text-amber-500" />
             </div>
             <h3 className="text-xl font-bold text-white mb-2">Active Track</h3>
             <div className="space-y-2">
                 <div className="text-3xl font-black text-white">{appCount.count}</div>
                 <p className="text-sm text-muted-foreground">Applications currently in review</p>
             </div>
          </div>
        </div>

        <div className="space-y-8">
           <div className="flex items-center justify-between">
               <div className="flex items-center gap-3">
                  <Sparkles className="size-6 text-muted-foreground" />
                  <h2 className="text-3xl font-black text-white">Jobs Matched For You</h2>
               </div>
               <Link href="/jobs" className="text-sm font-bold text-muted-foreground hover:text-white flex items-center gap-2 transition-colors">
                  View Marketplace <ArrowRight className="size-4" />
               </Link>
           </div>
           <RecommendedJobs />
        </div>
      </div>
    )
  }

  // Recruiter Dashboard
  const myOrgs = await db.select({
    id: OrganizationTable.id,
    name: OrganizationTable.name,
    imageUrl: OrganizationTable.imageUrl
  })
    .from(OrganizationTable)
    .innerJoin(OrganizationUserSettingsTable, eq(OrganizationUserSettingsTable.organizationId, OrganizationTable.id))
    .where(eq(OrganizationUserSettingsTable.userId, userId))

  const orgIds = myOrgs.map(o => o.id)

  const [totalPosts] = orgIds.length > 0 
    ? await db.select({ count: count() })
        .from(JobListingTable)
        .where(inArray(JobListingTable.organizationId, orgIds))
    : [{ count: 0 }]

  const [totalApplicants] = orgIds.length > 0
    ? await db.select({ count: count() })
        .from(JobListingApplicationTable)
        .innerJoin(JobListingTable, eq(JobListingApplicationTable.jobListingId, JobListingTable.id))
        .where(inArray(JobListingTable.organizationId, orgIds))
    : [{ count: 0 }]

  const [avgScoreResult] = orgIds.length > 0
    ? await db.select({ 
        avg: avg(sql<number>`CAST(${JobListingApplicationTable.aiScore} AS NUMERIC)`) 
      })
      .from(JobListingApplicationTable)
      .innerJoin(JobListingTable, eq(JobListingApplicationTable.jobListingId, JobListingTable.id))
      .where(inArray(JobListingTable.organizationId, orgIds))
    : [{ avg: "0" }]

  const avgScore = Math.round(Number(avgScoreResult?.avg || 0))

  const recentApplicants = orgIds.length > 0
    ? await db.select({
        id: JobListingApplicationTable.id,
        candidateName: UserTable.name,
        jobTitle: JobListingTable.title,
        aiScore: JobListingApplicationTable.aiScore,
        createdAt: JobListingApplicationTable.createdAt
      })
      .from(JobListingApplicationTable)
      .innerJoin(JobListingTable, eq(JobListingApplicationTable.jobListingId, JobListingTable.id))
      .innerJoin(UserTable, eq(JobListingApplicationTable.userId, UserTable.id))
      .where(inArray(JobListingTable.organizationId, orgIds))
      .orderBy(desc(JobListingApplicationTable.createdAt))
      .limit(5)
    : []

  return (
    <div className="space-y-12">
      <div className="flex flex-col gap-2">
        <h1 className="text-5xl font-black tracking-tight text-white">
           Recruiter <span className="text-white">Dashboard</span>
        </h1>
        <p className="text-muted-foreground text-lg font-medium">Manage your hiring pipeline</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="group rounded-lg border border-border bg-card p-8">
           <h3 className="text-muted-foreground font-bold uppercase tracking-widest text-xs mb-4">Total Listings</h3>
           <div className="flex items-end gap-3">
              <div className="text-5xl font-black text-white leading-none">{totalPosts.count}</div>
              <Badge className="mb-1">Active</Badge>
           </div>
        </div>
        <div className="group rounded-lg border border-border bg-card p-8">
           <h3 className="text-muted-foreground font-bold uppercase tracking-widest text-xs mb-4">Total Apps</h3>
           <div className="flex items-end gap-3">
              <div className="text-5xl font-black text-white leading-none">{totalApplicants.count}</div>
              <Badge className="mb-1" variant="success">Review</Badge>
           </div>
        </div>
        <div className="group rounded-lg border border-border bg-card p-8">
           <h3 className="text-muted-foreground font-bold uppercase tracking-widest text-xs mb-4">AI Efficiency</h3>
           <div className="flex items-end gap-3">
              <div className="text-5xl font-black text-white leading-none">{avgScore}%</div>
              <Badge className="mb-1" variant="default">Avg Match</Badge>
           </div>
        </div>
      </div>

      <div className="grid gap-12 lg:grid-cols-2">
         {/* My Organizations */}
         <div className="space-y-6">
            <h2 className="text-2xl font-black text-white flex items-center gap-3">
               <Building2 className="size-6 text-muted-foreground" />
               Your Organizations
            </h2>
             <div className="grid gap-4">
                {myOrgs.map(org => (
                  <Link key={org.id} href={`/organizations/${org.id}/jobs`} className="group flex items-center justify-between p-5 rounded-lg border border-border bg-card hover:border-primary transition-colors">
                     <div className="flex items-center gap-4">
                        <div className="size-12 rounded-lg bg-[#1F2530] flex items-center justify-center border border-border overflow-hidden">
                           {org.imageUrl ? <img src={org.imageUrl} className="size-full object-cover" /> : <Building2 className="size-6 text-muted-foreground" />}
                        </div>
                        <span className="font-bold text-lg text-white group-hover:text-foreground transition-colors">{org.name}</span>
                     </div>
                     <ArrowRight className="size-5 text-muted-foreground group-hover:text-white transition-colors" />
                  </Link>
                ))}
             </div>
         </div>

         {/* Recent Applicants */}
         <div className="space-y-6">
            <h2 className="text-2xl font-black text-white flex items-center gap-3">
               <Users className="size-6 text-muted-foreground" />
               Recent Applicants
            </h2>
            <div className="grid gap-4">
                {recentApplicants.map(app => {
                  const score = Number(app.aiScore || 0)
                  return (
                    <div key={app.id} className="group flex items-center justify-between p-5 rounded-lg border border-border bg-card hover:border-primary transition-colors">
                       <div className="flex flex-col gap-1">
                          <span className="font-black text-white">{app.candidateName}</span>
                          <span className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-2">
                             <BriefcaseBusiness className="size-3" />
                             {app.jobTitle}
                          </span>
                       </div>
                       <div className="flex items-center gap-4">
                          <div className="text-right hidden sm:block">
                             <p className="text-[10px] font-black text-muted-foreground uppercase tracking-tighter">AI Match</p>
                             <p className="text-lg font-black text-white leading-none">{score}%</p>
                          </div>
                          <Badge variant={ score >= 80 ? "match" : "secondary" } className="h-8">View</Badge>
                       </div>
                    </div>
                  )
                })}
                {recentApplicants.length === 0 && (
                  <div className="p-8 rounded-lg border border-dashed border-border text-center text-muted-foreground font-medium italic">
                     No recent applicants to track.
                  </div>
                )}
             </div>
         </div>
      </div>
    </div>
  )
}
