"use client"

import { useState } from "react"
import { Upload, FileCheck, Loader2, RefreshCw } from "lucide-react"

type ResumeUploadProps = {
  existingResumeDate?: string | null
}

export function ResumeUpload({ existingResumeDate }: ResumeUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleUpload() {
    if (!file) return

    setUploading(true)
    setError(null)
    setSuccess(false)

    try {
      const formData = new FormData()
      formData.append("resume", file)

      const res = await fetch("/api/resume/upload", {
        method: "POST",
        body: formData,
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Upload failed.")
        return
      }

      setSuccess(true)
      setFile(null)

      // Reset the file input
      const input = document.getElementById("resume-file-input") as HTMLInputElement
      if (input) input.value = ""
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setUploading(false)
    }
  }

  const hasExisting = !!existingResumeDate

  return (
    <div className="rounded-lg border border-border bg-card p-6 shadow-sm space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">My Resume</h3>
          <p className="text-sm text-muted-foreground mt-0.5">
            {hasExisting
              ? `Last uploaded on ${existingResumeDate}`
              : "Upload your resume to enable AI-powered job matching."}
          </p>
        </div>
        <div className="size-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
          <FileCheck className="size-5 text-muted-foreground" />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <label
          htmlFor="resume-file-input"
          className="flex-1 w-full cursor-pointer"
        >
          <div className="flex items-center gap-3 rounded-lg border border-dashed px-4 py-3 hover:border-border hover:bg-muted transition-colors">
            <Upload className="size-4 text-muted-foreground shrink-0" />
            <span className="text-sm text-muted-foreground truncate">
              {file ? file.name : "Choose a PDF file..."}
            </span>
          </div>
          <input
            id="resume-file-input"
            type="file"
            accept="application/pdf"
            className="sr-only"
            onChange={(e) => {
              setFile(e.target.files?.[0] ?? null)
              setSuccess(false)
              setError(null)
            }}
          />
        </label>

        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-[#0EA371] disabled:opacity-50 disabled:pointer-events-none shrink-0"
        >
          {uploading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Uploading...
            </>
          ) : hasExisting ? (
            <>
              <RefreshCw className="size-4" />
              Replace Resume
            </>
          ) : (
            <>
              <Upload className="size-4" />
              Upload Resume
            </>
          )}
        </button>
      </div>

      {success && (
        <div className="rounded-lg bg-muted border border-border px-4 py-3">
          <p className="text-sm text-slate-300 font-medium">
            ✓ Resume uploaded successfully — your job matches will update shortly
          </p>
        </div>
      )}

      {error && (
        <div className="rounded-lg bg-destructive/10 border border-destructive/30 px-4 py-3">
          <p className="text-sm text-destructive font-medium">{error}</p>
        </div>
      )}
    </div>
  )
}
