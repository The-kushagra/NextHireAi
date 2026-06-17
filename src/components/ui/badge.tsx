import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center justify-center gap-1.5 overflow-hidden rounded-md border px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.1em] whitespace-nowrap transition-all focus-visible:ring-2 focus-visible:ring-primary/50 [&>svg]:size-3",
  {
    variants: {
      variant: {
        default: "bg-muted text-foreground border-border",
        secondary: "bg-muted text-muted-foreground border-border",
        destructive: "bg-red-500/10 text-red-400 border-red-500/20",
        outline: "bg-transparent text-muted-foreground border-border hover:border-primary hover:text-foreground",
        success: "bg-muted text-muted-foreground border-border",
        match: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
        ghost: "border-transparent text-muted-foreground hover:text-foreground",
        link: "text-primary underline-offset-4 hover:underline border-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
