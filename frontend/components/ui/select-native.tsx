import * as React from "react";

import { cn } from "@/lib/utils";

function Select({ className, ...props }: React.ComponentProps<"select">) {
  return (
    <select
      data-slot="select"
      className={cn(
        "select select-bordered w-full",
        "aria-invalid:select-error",
        className,
      )}
      {...props}
    />
  );
}

export { Select };
