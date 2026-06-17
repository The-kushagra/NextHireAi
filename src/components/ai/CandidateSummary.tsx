"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, Loader2, FileText } from "lucide-react"
import { useState } from "react"
import { generateCandidateSummaryAction } from "@/server/actions/aiTools"

interface CandidateSummaryProps {
  resumeText: string
  jobDescription: string
}

export function CandidateSummary({ resumeText, jobDescription }: CandidateSummaryProps) {
  const [summary, setSummary] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGenerate = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const result = await generateCandidateSummaryAction(resumeText, jobDescription)
      if ("error" in result && result.error) {
        setError(result.error)
      } else if ("summary" in result && result.summary) {
        setSummary(result.summary)
      }
    } catch (e) {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="overflow-hidden border-border shadow-none">
      <CardHeader className="bg-card border-b border-border pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles className="size-5 text-muted-foreground" />
            AI Candidate Summary
          </CardTitle>
          {!summary && (
            <Button 
              onClick={handleGenerate} 
              disabled={isLoading}
              size="sm"
              className="gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Summarizing...
                </>
              ) : (
                <>
                  <Sparkles className="size-4" />
                  Generate AI Summary
                </>
              )}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        {summary ? (
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <div className="whitespace-pre-wrap text-muted-foreground leading-relaxed">
              {summary}
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-6 text-xs"
              onClick={() => setSummary(null)}
            >
              Regenerate
            </Button>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-destructive text-sm font-medium">{error}</p>
            <Button variant="link" size="sm" onClick={handleGenerate} className="mt-2 font-not-italic">
              Try again
            </Button>
          </div>
        ) : (
          <div className="text-center py-10 space-y-4">
            <div className="bg-muted size-12 rounded-lg flex items-center justify-center mx-auto text-muted-foreground">
              <FileText className="size-6" />
            </div>
            <div className="max-w-[280px] mx-auto">
              <h4 className="text-sm font-semibold mb-1">No Summary Yet</h4>
              <p className="text-xs text-muted-foreground">
                Generate an AI-powered summary to quickly get highlights of this candidate&apos;s fit.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
