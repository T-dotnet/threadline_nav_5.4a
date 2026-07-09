import type { ReactNode } from "react";
import { AlertCircle, Check, Clock } from "lucide-react";
import { Card } from "./Card";

interface PreparationChecklistCardProps {
  title: string;
  meta: string;
  metaTag: string;
  description: ReactNode;
  image: string;
  imageAlt: string;
  cornerClass?: string;
  done?: boolean;
  active?: boolean;
  todo?: boolean;
}

export function PreparationChecklistCard({
  title,
  meta,
  metaTag,
  description,
  image,
  imageAlt,
  cornerClass = "rounded-tr-[32px]",
  done = false,
  active = false,
  todo = false,
}: PreparationChecklistCardProps) {
  const statusClass = done
    ? "bg-[var(--color-thread-light-green)] text-[var(--color-thread-mid-green)]"
    : active
    ? "bg-[var(--color-thread-cream)] text-[var(--color-thread-heading)]"
    : "bg-slate-100 text-slate-500";

  return (
    <Card className={`grid grid-cols-[minmax(0,1fr)_220px] rounded-none ${cornerClass} bg-white p-0 max-md:grid-cols-1`}>
      <div className="p-6 sm:p-7">
        <div className="mb-4 flex items-start gap-4">
          <div
            className={[
              "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
              done
                ? "bg-[var(--color-thread-mid-green)] text-white"
                : active
                ? "bg-[var(--color-thread-light-green)] text-[var(--color-thread-mid-green)]"
                : todo
                ? "bg-slate-100 text-slate-400"
                : "bg-slate-100 text-slate-500",
            ].join(" ")}
          >
            {done ? (
              <Check className="h-4 w-4 stroke-[3]" />
            ) : active ? (
              <Clock className="h-4 w-4 stroke-[2]" />
            ) : (
              <AlertCircle className="h-4 w-4 stroke-[2]" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <h3 className="thread-sans-heading font-sans text-[1.06rem] font-medium leading-snug text-slate-950">
                {title}
              </h3>
              <span className={`inline-flex rounded-full px-2.5 py-1 text-[0.6rem] font-medium uppercase tracking-[0.12em] ${statusClass}`}>
                {metaTag}
              </span>
            </div>
            <p className="mt-1 text-[0.78rem] leading-relaxed text-slate-500">
              {meta}
            </p>
          </div>
        </div>

        <div className="pl-0 md:pl-[52px]">
          {description}
        </div>
      </div>

      <div className="relative min-h-[180px] overflow-hidden bg-white max-md:order-first md:h-full">
        <div className="absolute inset-x-0 bottom-0 top-8 overflow-hidden rounded-tl-[28px] bg-slate-100">
          <img
            src={image}
            alt={imageAlt}
            className="h-full w-full object-cover"
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>
    </Card>
  );
}
