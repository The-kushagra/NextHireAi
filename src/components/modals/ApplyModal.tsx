"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { applyToJob } from "@/server/actions/applications"
import { toast } from "sonner"
import { CheckCircle2, Sparkles, Upload, FileText, X } from "lucide-react"

const formSchema = z.object({
  resumeText: z.string().optional(),
})

export function ApplyModal({ jobListingId, jobTitle }: { jobListingId: string, jobTitle: string }) {
  const [open, setOpen] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [file, setFile] = useState<File | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      resumeText: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!file && !values.resumeText) {
      toast.error("Please provide a resume", {
        description: "Upload a PDF or paste your resume text."
      })
      return
    }

    const formData = new FormData()
    formData.append("jobListingId", jobListingId)
    if (file) {
      formData.append("resume", file)
    }
    if (values.resumeText) {
      formData.append("resumeText", values.resumeText)
    }

    console.log("CLIENT: Submitting application", { 
        hasFile: !!file, 
        fileSize: file?.size, 
        hasText: !!values.resumeText 
    })

    const result = await applyToJob(formData)

    if (result.success) {
      setIsSuccess(true)
      toast.success("Application Submitted!", {
        description: "Your AI score is being generated.",
      })
    } else {
      toast.error("Error", {
        description: result.error || "Something went wrong.",
      })
    }
  }

  if (isSuccess) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button size="lg" className="w-full md:w-auto px-10">Apply Now</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md text-center py-10">
          <div className="flex justify-center mb-4">
            <div className="size-16 rounded-lg bg-muted flex items-center justify-center border border-border">
              <CheckCircle2 className="size-10 text-white" />
            </div>
          </div>
          <DialogTitle className="text-2xl mb-2">Application Sent!</DialogTitle>
          <DialogDescription className="text-lg">
            Good luck! We've sent your profile and AI analysis to the recruiter for **{jobTitle}**.
          </DialogDescription>
          <Button className="mt-6" onClick={() => {
              setOpen(false)
              setIsSuccess(false)
              setFile(null)
              form.reset()
          }}>Close</Button>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="w-full md:w-auto px-10">Apply Now</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            Apply for {jobTitle}
            <Badge variant="outline">
              <Sparkles className="size-3 mr-1" />
              AI Powered
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Upload your PDF resume or paste the content below. Our AI will analyze your fit for this role.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
            <div className="space-y-4">
               <div className="flex flex-col gap-2">
                  <FormLabel>Upload PDF Resume</FormLabel>
                  {file ? (
                     <div className="flex items-center justify-between p-3 border rounded-lg bg-card border-border">
                        <div className="flex items-center gap-2">
                           <FileText className="size-5 text-muted-foreground" />
                           <span className="text-sm font-medium truncate max-w-[200px]">{file.name}</span>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => setFile(null)}>
                           <X className="size-4" />
                        </Button>
                     </div>
                  ) : (
                     <div className="relative group">
                        <Input 
                           type="file" 
                           accept=".pdf"
                           className="opacity-0 absolute inset-0 cursor-pointer z-10"
                           onChange={(e) => {
                             const f = e.target.files?.[0]
                             if (f) setFile(f)
                           }}
                        />
                         <div className="border border-dashed rounded-lg p-8 flex flex-col items-center justify-center gap-3 bg-card border-border transition-colors">
                            <Upload className="size-8 text-muted-foreground" />
                            <div className="text-center">
                               <p className="text-sm font-medium">Click to upload or drag and drop</p>
                               <p className="text-xs text-muted-foreground">PDF (MAX. 5MB)</p>
                            </div>
                         </div>
                     </div>
                  )}
               </div>

               <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                     <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                     <span className="bg-background px-2 text-muted-foreground">Or paste text</span>
                  </div>
               </div>

               <FormField
                 control={form.control}
                 name="resumeText"
                 render={({ field }) => (
                   <FormItem>
                     <FormLabel>Resume Text Content</FormLabel>
                     <FormControl>
                       <Textarea 
                         placeholder="Paste your professional experience, skills, and education here..." 
                         className="min-h-[200px] text-sm"
                         {...field} 
                       />
                     </FormControl>
                     <FormMessage />
                   </FormItem>
                 )}
               />
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" type="button" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={form.formState.isSubmitting} className="gap-2">
                {form.formState.isSubmitting ? "Analyzing..." : (
                  <>
                    <Sparkles className="size-4" />
                    Submit Application
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}


