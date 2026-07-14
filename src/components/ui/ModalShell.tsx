import { type KeyboardEvent, type ReactNode, useEffect, useRef } from "react";
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
  onRequestClose?: () => void;
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
  onRequestClose,
}: ModalShellProps) {
  const finalMaxWidth = maxWidthClassName || (size === "large" ? "thread-modal-panel--large" : "thread-modal-panel--small");
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const previouslyFocused = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const frame = window.requestAnimationFrame(() => {
      const firstFocusable = panelRef.current?.querySelector<HTMLElement>(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      (firstFocusable ?? panelRef.current)?.focus();
    });

    return () => {
      window.cancelAnimationFrame(frame);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus();
    };
  }, [isOpen]);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape" && onRequestClose) {
      event.preventDefault();
      event.stopPropagation();
      onRequestClose();
      return;
    }

    if (event.key !== "Tab" || !panelRef.current) return;

    const focusable = Array.from(panelRef.current.querySelectorAll<HTMLElement>(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ));
    if (focusable.length === 0) {
      event.preventDefault();
      panelRef.current.focus();
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

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
          onKeyDown={handleKeyDown}
        >
          {scrimClassName && (
            <div className={cn("absolute inset-0", scrimClassName)} />
          )}
          <motion.div
            ref={panelRef}
            tabIndex={-1}
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
