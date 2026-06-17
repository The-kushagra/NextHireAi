"use client"

import { CreateOrganization } from "@clerk/nextjs"

export default function NewOrganizationPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] py-12 px-4">
      <div className="mb-8 text-center space-y-2">
        <h1 className="text-3xl font-black text-white tracking-tight">Create Your Organization</h1>
        <p className="text-muted-foreground font-medium italic">Start hiring top talent with AI-powered ranking.</p>
      </div>
      
      <div className="w-full flex justify-center">
        <CreateOrganization 
          routing="hash"
          afterCreateOrganizationUrl="/dashboard"
          appearance={{
            elements: {
              rootBox: "mx-auto rounded-lg overflow-hidden border border-border bg-card",
              card: "bg-card border-none shadow-none",
              headerTitle: "text-white",
              headerSubtitle: "text-muted-foreground",
              formButtonPrimary: "bg-primary hover:bg-[#0EA371] text-white font-bold",
              organizationSwitcherTrigger: "text-white",
              organizationPreviewTextContainer: "text-white",
              organizationPreviewSecondaryText: "text-muted-foreground",
              formLabel: "text-slate-300 font-bold",
              formInput: "bg-[#1F2530] border-border text-white focus:border-primary",
            }
          }}
        />
      </div>
    </div>
  )
}
