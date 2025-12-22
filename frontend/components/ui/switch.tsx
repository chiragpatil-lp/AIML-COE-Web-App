import * as React from "react";

import { cn } from "@/lib/utils";

function Switch({ className, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type="checkbox"
      data-slot="switch"
      className={cn("toggle", "aria-invalid:toggle-error", className)}
      {...props}
    />
  );
}

export { Switch };
