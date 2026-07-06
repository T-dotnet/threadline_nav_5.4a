import * as React from "react";
import { cn } from "../../lib/utils";

interface PageContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function PageContainer({ children, className, ...props }: PageContainerProps) {
  return (
    <div 
      className={cn("thread-page-container", className)}
      {...props}
    >
      {children}
    </div>
  );
}
