// @ts-nocheck comment
import type React from "react";
import { Loader2 } from "lucide-react";

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "default" | "sm" | "lg";
}

export function Spinner({
  size = "default",
  className,
  ...props
}: SpinnerProps) {
  const sizeClasses = {
    default: "w-6 h-6",
    sm: "w-4 h-4",
    lg: "w-8 h-8",
  };

  return (
    <div role="status" {...props}>
      <Loader2 className={`animate-spin ${sizeClasses[size]} ${className}`} />
      <span className="sr-only">Loading...</span>
    </div>
  );
}
