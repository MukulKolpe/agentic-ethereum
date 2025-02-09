// @ts-nocheck comment
import * as React from "react";

import { cn } from "@/utils/utils";

const Grid = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("grid", className)} {...props} />
));
Grid.displayName = "Grid";

export { Grid };
