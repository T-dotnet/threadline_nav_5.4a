import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "../../../lib/utils";
import { Button } from "../Button";

interface ReflectionDeckSlideSummary {
  id: string;
}

function SlidePill({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(
        "h-2.5 rounded-full transition-all",
        active ? "w-8 bg-[var(--color-thread-mid-green)]" : "w-2.5 bg-black/15 hover:bg-black/25",
      )}
    />
  );
}

export function SlideFooter({
  slides,
  slideIndex,
  previousLabel,
  nextLabel,
  onPrevious,
  onNext,
  onSelectSlide,
}: {
  slides: ReflectionDeckSlideSummary[];
  slideIndex: number;
  previousLabel: string;
  nextLabel: string;
  onPrevious: () => void;
  onNext: () => void;
  onSelectSlide: (index: number) => void;
}) {
  return (
    <div className="border-t border-black/5 px-8 py-6 sm:px-10">
      <div className="grid gap-3 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
        <Button
          variant="muted"
          className="w-full px-5 shadow-none sm:w-auto lg:justify-self-start"
          leftIcon={<ArrowLeft className="w-4 h-4" />}
          onClick={onPrevious}
        >
          {previousLabel}
        </Button>

        <div className="flex items-center justify-center gap-4 order-first lg:order-none">
          <div className="flex items-center gap-2">
            {slides.map((slide, index) => (
              <SlidePill
                key={slide.id}
                active={index === slideIndex}
                label={`Go to slide ${index + 1}`}
                onClick={() => onSelectSlide(index)}
              />
            ))}
          </div>
          <div className="text-[0.72rem] tracking-[0.1em] uppercase text-slate-400 font-medium">
            {slideIndex + 1} of {slides.length}
          </div>
        </div>

        <div className="flex lg:justify-self-end">
          <Button
            onClick={onNext}
            variant="forest"
            className="w-full px-8 shadow-none sm:w-auto"
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            {nextLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
