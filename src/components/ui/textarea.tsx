import * as React from "react"

import { cn } from "@/lib/utils"

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea"> & { style?: React.CSSProperties }
>(({ className, style, ...props }, ref) => {
  const defaultStyle: React.CSSProperties = {
    backgroundColor: 'rgba(26, 26, 46, 0.8)',
    color: 'white',
    borderColor: 'rgba(99, 102, 241, 0.3)',
    ...style
  };

  return (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-md px-3 py-2 text-base focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      style={defaultStyle}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }
