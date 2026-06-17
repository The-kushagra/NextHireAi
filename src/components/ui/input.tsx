import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-11 w-full min-w-0 rounded-lg border border-border bg-card px-4 py-2 text-base text-foreground transition-colors outline-none selection:bg-primary/30 file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground disabled:opacity-50 md:text-sm",
        "focus:border-primary",
        className
      )}
      {...props}
    />
  )
}

export { Input }
