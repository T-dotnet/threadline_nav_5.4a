import { Info } from "lucide-react";
import { NOT_SURE_PROMPT_TEXT } from "../../lib/questionnaireUi";
import { cn } from "../../lib/utils";
import { Button } from "./Button";

interface QuestionNotSurePromptProps {
  marked: boolean;
  onMark: () => void;
  className?: string;
  buttonClassName?: string;
}

export function QuestionNotSurePrompt({
  marked,
  onMark,
  className,
  buttonClassName,
}: QuestionNotSurePromptProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-stretch gap-3 rounded-none rounded-tr-[20px] bg-[var(--color-thread-off-white)] px-4 py-4 text-base text-[var(--color-thread-dark-slate)] shadow-none sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-4 sm:rounded-tr-[24px] sm:py-3 sm:text-sm",
        className,
      )}
    >
      <div className="flex min-w-0 flex-1 items-start gap-3">
        <Info className="mt-0.5 h-5 w-5 shrink-0 text-slate-700" aria-hidden="true" />
        <p className="leading-6 sm:leading-relaxed">{NOT_SURE_PROMPT_TEXT}</p>
      </div>
      <Button
        type="button"
        variant="secondary"
        onClick={onMark}
        className={cn(
          "min-h-11 w-full justify-center px-4 text-sm font-medium shadow-none sm:min-h-0 sm:w-auto sm:text-xs",
          buttonClassName,
        )}
      >
        {marked ? "Marked not sure" : "Mark as not sure"}
      </Button>
    </div>
  );
}
