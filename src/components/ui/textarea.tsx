import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex min-h-32 w-full rounded-lg border border-border bg-card px-4 py-3 text-base text-foreground transition-colors outline-none placeholder:text-muted-foreground disabled:opacity-50 md:text-sm",
        "focus:border-primary",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
