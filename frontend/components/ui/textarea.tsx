import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "textarea textarea-bordered w-full min-h-16",
        "aria-invalid:textarea-error",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
