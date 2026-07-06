import { motion } from "motion/react";
import { Heart, Moon, School } from "lucide-react";
import { cn } from "../../../lib/utils";

interface FloatingDiaryEntry {
  tag: string;
  icon: typeof Heart;
  tone: string;
  note: string;
  date: string;
  className: string;
  rotate: number;
  delay: number;
  duration: number;
}

function buildFloatingDiaryEntries(childName: string): FloatingDiaryEntry[] {
  return [
    {
      tag: "Mood",
      icon: Heart,
      tone: "bg-[var(--color-thread-light-green)] text-[var(--color-thread-mid-green)]",
      note: `${childName} stayed calm through homework today — settled quickly and kept going.`,
      date: "Today",
      className: "left-0 top-[2%] z-30",
      rotate: -4,
      delay: 0,
      duration: 5.2,
    },
    {
      tag: "Sleep",
      icon: Moon,
      tone: "bg-sky-50 text-sky-500",
      note: "Asleep by 8:30 with the new wind-down routine. Only woke once overnight.",
      date: "Yesterday",
      className: "right-0 top-[33%] z-20",
      rotate: 3.5,
      delay: 0.5,
      duration: 6,
    },
    {
      tag: "School",
      icon: School,
      tone: "bg-amber-50 text-amber-500",
      note: "Teacher noticed more focus during reading group this morning.",
      date: "Mon",
      className: "left-[6%] top-[64%] z-10",
      rotate: -2,
      delay: 1,
      duration: 5.6,
    },
  ];
}

function FloatingDiaryCard({ entry }: { entry: FloatingDiaryEntry }) {
  const Icon = entry.icon;
  return (
    <motion.div
      className={cn(
        "absolute w-[17.5rem] rounded-[20px] rounded-tr-[26px] bg-white px-5 py-4 shadow-premium",
        entry.className,
      )}
      style={{ rotate: `${entry.rotate}deg` }}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: [0, -7, 0] }}
      transition={{
        opacity: { duration: 0.45, delay: entry.delay },
        y: { duration: entry.duration, repeat: Infinity, ease: "easeInOut", delay: entry.delay },
      }}
    >
      <div className="mb-2.5 flex items-center justify-between gap-3">
        <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.72rem] font-medium", entry.tone)}>
          <Icon className="h-3.5 w-3.5" />
          {entry.tag}
        </span>
        <span className="text-[0.7rem] font-medium text-slate-400">{entry.date}</span>
      </div>
      <p className="text-[0.85rem] leading-relaxed text-[var(--color-thread-gray)]">{entry.note}</p>
    </motion.div>
  );
}

export function FloatingDiaryEntries({ childName }: { childName: string }) {
  const entries = buildFloatingDiaryEntries(childName);

  return (
    <div className="relative mx-auto w-full max-w-[22rem] h-[24rem]">
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        <path
          d="M22 16 C 70 30, 18 54, 74 70"
          fill="none"
          stroke="var(--color-thread-mid-green)"
          strokeOpacity="0.25"
          strokeWidth="0.4"
          strokeLinecap="round"
          strokeDasharray="1 1.6"
        />
      </svg>

      {entries.map((entry) => (
        <FloatingDiaryCard key={entry.tag} entry={entry} />
      ))}
    </div>
  );
}
