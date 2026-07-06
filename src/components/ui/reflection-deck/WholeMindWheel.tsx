import { motion } from "motion/react";
import {
  BookOpen,
  Footprints,
  Hand,
  Heart,
  MessageCircle,
  Moon,
  Target,
  User,
  Users,
} from "lucide-react";
import { type DomainKey, type DomainTone } from "../../../lib/reflectionDeck";
import { cn } from "../../../lib/utils";
import { Card, CardContent } from "../Card";

interface DomainDefinition {
  key: DomainKey;
  label: string;
  short: string;
  icon: typeof Target;
  tone: DomainTone;
}

const DOMAIN_DEFINITIONS: DomainDefinition[] = [
  { key: "movement", label: "Movement", short: "Movement", icon: Footprints, tone: "cream" },
  { key: "attention", label: "Attention & Executive Function", short: "Attention", icon: Target, tone: "mint" },
  { key: "learning", label: "Learning & Memory", short: "Learning", icon: BookOpen, tone: "sky" },
  { key: "language", label: "Language & Communication", short: "Language", icon: MessageCircle, tone: "lavender" },
  { key: "social", label: "Social Function", short: "Social", icon: Users, tone: "mint" },
  { key: "emotional", label: "Emotional Function", short: "Emotional", icon: Heart, tone: "mint" },
  { key: "sleep", label: "Sleep", short: "Sleep", icon: Moon, tone: "mint" },
  { key: "sensory", label: "Sensory Function", short: "Sensory", icon: Hand, tone: "peach" },
];

const toneClassMap: Record<DomainTone, string> = {
  mint: "bg-[var(--color-thread-light-green)]/72 border-[var(--color-thread-mid-green)]/12",
  sky: "bg-sky-50 border-sky-200/70",
  lavender: "bg-violet-50 border-violet-200/70",
  peach: "bg-amber-50 border-amber-200/75",
  cream: "bg-stone-50 border-stone-200/75",
};

const toneBadgeMap: Record<DomainTone, string> = {
  mint: "bg-[var(--color-thread-light-green)] border-[var(--color-thread-mid-green)]/25 text-[var(--color-thread-mid-green)]",
  sky: "bg-sky-50 border-sky-200 text-sky-500",
  lavender: "bg-violet-50 border-violet-200 text-violet-500",
  peach: "bg-amber-50 border-amber-200 text-amber-500",
  cream: "bg-stone-50 border-stone-200 text-stone-500",
};

function DomainCard({
  domain,
  active,
  variant,
  index,
}: {
  domain: DomainDefinition;
  active: boolean;
  variant: "intro" | "growth";
  index: number;
}) {
  const Icon = domain.icon;
  const activeClass = variant === "intro" ? "bg-[var(--color-thread-light-green)]/72 border-[var(--color-thread-mid-green)]/15" : toneClassMap[domain.tone];
  const activeBadge = variant === "intro" ? toneBadgeMap.mint : toneBadgeMap[domain.tone];

  return (
    <motion.div
      className={cn(
        "rounded-[20px] border p-4 transition-all duration-300",
        active ? cn(activeClass, "shadow-premium") : "bg-white/80 border-black/5",
      )}
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.28, ease: "easeOut", delay: index * 0.035 }}
    >
      <div
        className={cn(
          "mb-3.5 flex h-9 w-9 items-center justify-center rounded-full border transition-colors",
          active ? activeBadge : "bg-[var(--color-thread-off-white)] border-black/5 text-slate-300",
        )}
      >
        <Icon className="h-[18px] w-[18px]" />
      </div>
      <div className={cn("text-[0.9rem] leading-snug font-medium", active ? "text-[var(--color-thread-heading)]" : "text-slate-400")}>
        {domain.label}
      </div>
    </motion.div>
  );
}

const WHEEL_RADIUS = 37;
const THREAD_INNER = 18;
const THREAD_OUTER = 29;

export function WholeMindWheel({
  childName,
  activeKeys,
  variant,
}: {
  childName: string;
  activeKeys: DomainKey[];
  variant: "intro" | "growth";
}) {
  const centerLabel = `${childName}'s Whole Mind Profile`;
  const activeCount = DOMAIN_DEFINITIONS.filter((domain) => activeKeys.includes(domain.key)).length;
  const focusCaption = variant === "intro" ? "areas in focus" : "areas taking shape";

  const nodes = DOMAIN_DEFINITIONS.map((domain, index) => {
    const angle = ((-90 + index * 45) * Math.PI) / 180;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return {
      domain,
      active: activeKeys.includes(domain.key),
      x: 50 + WHEEL_RADIUS * cos,
      y: 50 + WHEEL_RADIUS * sin,
      x1: 50 + THREAD_INNER * cos,
      y1: 50 + THREAD_INNER * sin,
      x2: 50 + THREAD_OUTER * cos,
      y2: 50 + THREAD_OUTER * sin,
    };
  });

  return (
    <>
      <div className="space-y-4 xl:hidden">
        <Card className="rounded-tr-[28px] border border-black/5 shadow-premium">
          <CardContent className="px-6 py-6 text-center">
            <span className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-thread-light-green)] text-[var(--color-thread-mid-green)]">
              <User className="w-5 h-5" />
            </span>
            <div className="font-serif text-[1.25rem] leading-tight text-[var(--color-thread-heading)]">{centerLabel}</div>
            <div className="mt-2 text-[0.78rem] font-medium tracking-[0.02em] text-[var(--color-thread-mid-green)]">
              {activeCount} of {DOMAIN_DEFINITIONS.length} {focusCaption}
            </div>
          </CardContent>
        </Card>
        <div className="grid grid-cols-2 gap-3">
          {DOMAIN_DEFINITIONS.map((domain, index) => (
            <DomainCard
              key={domain.key}
              domain={domain}
              active={activeKeys.includes(domain.key)}
              variant={variant}
              index={index}
            />
          ))}
        </div>
      </div>

      <div className="hidden xl:block relative mx-auto w-full max-w-[34rem] aspect-square">
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full"
          aria-hidden="true"
        >
          <circle cx="50" cy="50" r={WHEEL_RADIUS} fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="0.25" strokeDasharray="0.7 1.6" />
          <circle cx="50" cy="50" r="23" fill="none" stroke="rgba(0,0,0,0.04)" strokeWidth="0.25" />
          {nodes.map((node) => (
            <line
              key={node.domain.key}
              x1={node.x1}
              y1={node.y1}
              x2={node.x2}
              y2={node.y2}
              stroke={node.active ? "var(--color-thread-mid-green)" : "rgba(0,0,0,0.1)"}
              strokeWidth={node.active ? 0.5 : 0.3}
              strokeLinecap="round"
              strokeDasharray={node.active ? undefined : "0.8 1.2"}
              opacity={node.active ? 0.55 : 1}
            />
          ))}
        </svg>

        <motion.div
          className="absolute left-1/2 top-1/2 z-10 w-[12.5rem] h-[12.5rem] -translate-x-1/2 -translate-y-1/2"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.32, ease: "easeOut" }}
        >
          <Card className="h-full w-full rounded-full border border-black/5 shadow-premium ring-1 ring-[var(--color-thread-mid-green)]/10">
            <CardContent className="h-full flex flex-col items-center justify-center text-center px-8 py-0">
              <span className="mb-2.5 flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-thread-light-green)] text-[var(--color-thread-mid-green)]">
                <User className="w-5 h-5" />
              </span>
              <div className="font-serif text-[1.15rem] leading-[1.12] text-[var(--color-thread-heading)]">{centerLabel}</div>
              <div className="mt-2 text-[0.66rem] font-medium tracking-[0.04em] uppercase text-[var(--color-thread-mid-green)]">
                {activeCount} of {DOMAIN_DEFINITIONS.length} {focusCaption}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {nodes.map((node, index) => {
          const Icon = node.domain.icon;
          const activeBadge = variant === "intro" ? toneBadgeMap.mint : toneBadgeMap[node.domain.tone];
          return (
            <motion.div
              key={node.domain.key}
              className="absolute w-[7.5rem] -translate-x-1/2 -translate-y-1/2 text-center"
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.28, ease: "easeOut", delay: 0.08 + index * 0.035 }}
            >
              <div
                className={cn(
                  "mx-auto mb-2 flex h-[3.25rem] w-[3.25rem] items-center justify-center rounded-full border transition-all duration-300",
                  node.active
                    ? cn(activeBadge, "shadow-premium scale-[1.04]")
                    : "bg-white border-black/5 text-slate-300",
                )}
              >
                <Icon className="h-[1.35rem] w-[1.35rem]" />
              </div>
              <div
                className={cn(
                  "text-[0.82rem] leading-tight font-medium transition-colors",
                  node.active ? "text-[var(--color-thread-heading)]" : "text-slate-400",
                )}
              >
                {node.domain.short}
              </div>
            </motion.div>
          );
        })}
      </div>
    </>
  );
}
