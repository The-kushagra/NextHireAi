import { db } from "@/drizzle/db"
import { OrganizationTable } from "@/drizzle/schema"
import { eq } from "drizzle-orm"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Building2, Settings, BriefcaseBusiness } from "lucide-react"

export default async function OrganizationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  const organization = await db.query.OrganizationTable.findFirst({
    where: eq(OrganizationTable.id, id),
  })

  if (!organization) {
    notFound()
  }

  return (
    <div className="container mx-auto py-10 space-y-8 px-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="size-20 rounded-lg bg-[#1F2530] flex items-center justify-center text-white overflow-hidden border border-border">
            {organization.imageUrl ? (
              <img src={organization.imageUrl} alt={organization.name} className="object-cover w-full h-full" />
            ) : (
              <Building2 className="size-10 text-muted-foreground" />
            )}
          </div>
          <div className="space-y-1">
            <h1 className="text-4xl font-black text-white tracking-tight">{organization.name}</h1>
            <p className="text-slate-400 font-medium italic">Organization Dashboard</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button asChild variant="outline" className="gap-2 font-bold">
            <Link href={`/organizations/${id}/settings`}>
              <Settings className="size-4 text-muted-foreground" />
              Settings
            </Link>
          </Button>
          <Button asChild className="gap-2 font-black">
            <Link href={`/organizations/${id}/jobs`}>
              <BriefcaseBusiness className="size-4" />
              Manage Jobs
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8 pt-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-400">Company Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="space-y-1">
                <p className="text-xs font-bold text-muted-foreground uppercase">Official Name</p>
                <p className="text-white font-medium">{organization.name}</p>
             </div>
             <div className="space-y-1">
                <p className="text-xs font-bold text-muted-foreground uppercase">Organization ID</p>
                <p className="text-slate-400 font-mono text-xs truncate">{organization.id}</p>
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
