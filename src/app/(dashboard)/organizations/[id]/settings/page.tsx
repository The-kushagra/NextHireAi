import { db } from "@/drizzle/db"
import { OrganizationTable, OrganizationUserSettingsTable } from "@/drizzle/schema"
import { eq, and } from "drizzle-orm"
import { notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DeleteOrganizationButton } from "@/components/organizations/DeleteOrganizationButton"
import { auth } from "@clerk/nextjs/server"

export default async function OrganizationSettingsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  const organization = await db.query.OrganizationTable.findFirst({
    where: eq(OrganizationTable.id, id),
  })

  if (!organization) {
    notFound()
  }

  const { userId } = await auth()
  const userSettings = await db.query.OrganizationUserSettingsTable.findFirst({
    where: and(
      eq(OrganizationUserSettingsTable.organizationId, id),
      eq(OrganizationUserSettingsTable.userId, userId || "")
    )
  })

  const canDelete = userSettings?.role === "admin" || userSettings?.role === "owner"

  return (
    <div className="container mx-auto py-10 space-y-10 px-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-black text-white tracking-tight">Organization Settings</h1>
        <p className="text-muted-foreground font-medium italic">Manage your profile and configuration for {organization.name}</p>
      </div>

      <div className="grid gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-white font-bold">General Information</CardTitle>
            <CardDescription>Basic details about your organization profile.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
             <div className="space-y-1.5">
                <label className="text-xs font-black text-muted-foreground uppercase tracking-widest">Organization Name</label>
                <p className="text-lg text-white font-medium">{organization.name}</p>
             </div>
              <div className="space-y-1.5">
                 <label className="text-xs font-black text-muted-foreground uppercase tracking-widest">Unique Identifier</label>
                 <p className="text-muted-foreground font-mono text-sm">{organization.id}</p>
              </div>
          </CardContent>
        </Card>

        {canDelete && (
          <Card className="border-destructive/20 bg-destructive/5 overflow-hidden">
            <CardHeader className="bg-destructive/10 border-b border-destructive/20">
              <CardTitle className="text-destructive font-black">Danger Zone</CardTitle>
              <CardDescription className="text-destructive/70 font-medium">Irreversible actions for your organization.</CardDescription>
            </CardHeader>
            <CardContent className="py-6">
               <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                   <div className="space-y-1">
                      <p className="text-white font-bold">Delete Organization</p>
                      <p className="text-muted-foreground text-sm">Once deleted, all jobs, applications, and data will be permanently removed.</p>
                   </div>
                  <DeleteOrganizationButton organizationId={id} />
               </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
