import { cn } from "../../lib/utils";

export interface SegmentedControlOption<T extends string> {
  value: T;
  label: string;
}

interface SegmentedControlProps<T extends string> {
  "aria-label": string;
  options: Array<SegmentedControlOption<T>>;
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

export function SegmentedControl<T extends string>({
  "aria-label": ariaLabel,
  options,
  value,
  onChange,
  className,
}: SegmentedControlProps<T>) {
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className={cn("grid w-full rounded-xl bg-[var(--color-thread-off-white)] p-1", className)}
      style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}
    >
      {options.map((option) => {
        const isActive = value === option.value;
        const optionIndex = options.findIndex((item) => item.value === option.value);
        const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
          if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;

          event.preventDefault();

          const nextIndex =
            event.key === "Home"
              ? 0
              : event.key === "End"
                ? options.length - 1
                : event.key === "ArrowRight"
                  ? (optionIndex + 1) % options.length
                  : (optionIndex - 1 + options.length) % options.length;

          onChange(options[nextIndex].value);
        };

        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isActive}
            onClick={() => onChange(option.value)}
            onKeyDown={handleKeyDown}
            className={cn(
              "min-h-8 rounded-lg px-2 text-[0.7rem] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-thread-mid-green)]/25",
              isActive
                ? "bg-white text-[var(--color-thread-heading)] shadow-xs"
                : "text-[var(--color-thread-gray)] hover:text-[var(--color-thread-dark-slate)]"
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
