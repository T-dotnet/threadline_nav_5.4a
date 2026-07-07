import * as React from "react"
import { ArrowRight } from "lucide-react"
import { Button } from "./Button"
import { cn } from "../../lib/utils"
import { PageContainer } from "./PageContainer"

interface PageFooterCTAProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  buttonText: string;
  buttonVariant?: React.ComponentProps<typeof Button>["variant"];
  buttonIcon?: React.ReactNode;
  onClick: () => void;
  onBackClick?: () => void;
  backText?: string;
}

export const PageFooterCTA = React.forwardRef<HTMLDivElement, PageFooterCTAProps>(
  ({ className, title, buttonText, buttonVariant = "primary", buttonIcon, onClick, onBackClick, backText, ...props }, ref) => {
    return (
      <PageContainer>
        <div
          ref={ref}
          className={cn(
            "flex items-center justify-between gap-5 border-t border-black/10 pt-7.5 mt-8 flex-wrap",
            className
          )}
          {...props}
        >
          {title ? (
            <div className="font-serif font-normal text-[1.55rem] leading-[1.34] tracking-tight text-[var(--color-thread-heading)] max-w-[24ch]">
              {title}
            </div>
          ) : (
            onBackClick && backText ? (
              <Button
                variant="ghost"
                onClick={onBackClick}
                className="text-[0.92rem] font-medium flex items-center gap-2"
                leftIcon={<ArrowRight className="w-4 h-4 rotate-180" />}
              >
                {backText}
              </Button>
            ) : (
              <div />
            )
          )}

          <Button
            onClick={onClick}
            variant={buttonVariant}
            className="px-5.5 py-3.5 text-[0.92rem] inline-flex items-center gap-2"
          >
            {buttonText} {buttonIcon || <ArrowRight className="w-4 h-4 stroke-[2]" />}
          </Button>
        </div>
      </PageContainer>
    );
  }
);

PageFooterCTA.displayName = "PageFooterCTA";
