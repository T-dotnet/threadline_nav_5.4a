import * as React from "react"
import { cn } from "../../lib/utils"

export interface AvatarProps extends React.ComponentPropsWithoutRef<"div"> {
  fallback?: React.ReactNode;
  src?: string;
  alt?: string;
  size?: "sm" | "md" | "lg";
}

export function Avatar({ className, fallback, src, alt, size = "md", ...props }: AvatarProps) {
  return (
    <div
      className={cn(
        "thread-avatar",
        size === "sm" && "thread-avatar--sm",
        size === "md" && "thread-avatar--md",
        size === "lg" && "thread-avatar--lg",
        className
      )}
      {...props}
    >
      {src ? (
        <img src={src} alt={alt || "Avatar"} className="thread-avatar__image" referrerPolicy="no-referrer" />
      ) : (
        fallback
      )}
    </div>
  )
}
