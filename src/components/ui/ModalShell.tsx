import { type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { cn } from "../../lib/utils";

interface ModalShellProps {
  isOpen: boolean;
  titleId: string;
  children: ReactNode;
  className?: string;
  panelClassName?: string;
  maxWidthClassName?: string;
  radiusClassName?: string;
  zIndexClassName?: string;
  scrimClassName?: string;
  isWatercolor?: boolean;
  size?: "small" | "large";
}

interface ModalCloseButtonProps {
  onClick: () => void;
  label: string;
  className?: string;
  iconClassName?: string;
}

export function ModalCloseButton({
  onClick,
  label,
  className,
  iconClassName,
}: ModalCloseButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "thread-modal-close",
        className,
      )}
      aria-label={label}
    >
      <X className={cn("thread-modal-close__icon", iconClassName)} />
    </button>
  );
}

export function ModalShell({
  isOpen,
  titleId,
  children,
  className,
  panelClassName,
  maxWidthClassName,
  radiusClassName = "thread-modal-panel--scalloped",
  zIndexClassName = "thread-z-modal",
  scrimClassName,
  isWatercolor = false,
  size = "large",
}: ModalShellProps) {
  const finalMaxWidth = maxWidthClassName || (size === "large" ? "thread-modal-panel--large" : "thread-modal-panel--small");

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={cn(
            "thread-modal-overlay",
            isWatercolor ? "thread-modal-overlay--watercolor" : "thread-modal-overlay--plain",
            zIndexClassName,
            className,
          )}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
        >
          {scrimClassName && (
            <div className={cn("absolute inset-0", scrimClassName)} />
          )}
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className={cn(
              "thread-modal-panel",
              finalMaxWidth,
              radiusClassName,
              scrimClassName && "z-10",
              panelClassName,
            )}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
