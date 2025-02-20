// @ts-nocheck comment
import * as React from "react";

import { cn } from "@/utils/utils";

const Container = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("container mx-auto px-4 max-w-7xl", className)}
    {...props}
  />
));
Container.displayName = "Container";

export { Container };
