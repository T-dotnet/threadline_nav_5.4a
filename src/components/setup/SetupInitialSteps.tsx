import { motion } from "motion/react";
import { ArrowRight, Check, User } from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Label } from "../ui/Label";
import { useDisplayMode } from "../../context/DisplayModeContext";

const JOURNEY_STAGE_OPTIONS = [
  {
    value: "Noticing concerns",
    hint: "We will keep the tone exploratory.",
  },
  {
    value: "Waiting for assessment",
    hint: "We will help prepare for assessment.",
  },
  {
    value: "Diagnosed, need next steps",
    hint: "We will focus on support planning.",
  },
];

const RELATIONS = ["Parent", "Guardian", "Carer"];

const NOTICE_OPTIONS = [
  "Attention & focus",
  "Behaviour & emotions",
  "Sleep",
  "Learning",
  "Movement & coordination",
  "Speech & communication",
  "Friendships",
];

interface SetupStepStyleProps {
  sectionKickerClass: string;
  stepHeadingClass: string;
  stepLeadClass: string;
}

interface SetupWelcomeStepProps extends SetupStepStyleProps {
  onCancel: () => void;
  onBegin: () => void;
}

interface SetupJourneyStepProps extends SetupStepStyleProps {
  journeyStage: string;
  questionOptionClass: (selected: boolean) => string;
  onJourneyStageChange: (journeyStage: string) => void;
}

interface SetupChildDetailsStepProps extends SetupStepStyleProps {
  firstName: string;
  yearOfBirth: string;
  relation: string;
  years: string[];
  selectClass: string;
  choiceClass: (selected: boolean) => string;
  onFirstNameChange: (firstName: string) => void;
  onYearOfBirthChange: (yearOfBirth: string) => void;
  onRelationChange: (relation: string) => void;
}

interface SetupNoticesStepProps extends SetupStepStyleProps {
  firstName: string;
  notices: string[];
  choiceClass: (selected: boolean) => string;
  onNoticesChange: (notices: string[]) => void;
}

export function SetupWelcomeStep({
  sectionKickerClass,
  stepHeadingClass,
  stepLeadClass,
  onCancel,
  onBegin,
}: SetupWelcomeStepProps) {
  const { isMvp } = useDisplayMode();

  return (
    <div className="order-1 flex-1 p-8 sm:p-12 md:p-14 flex flex-col justify-between gap-10">
      <div className="space-y-8">
        <div>
          <span className={sectionKickerClass}>{isMvp ? "GP report setup" : "Welcome to Threadline"}</span>
          <h1 className={stepHeadingClass}>
            {isMvp ? "Let's build the context for your GP report." : "Let's set up Threadline for your family."}
          </h1>
          <p className={stepLeadClass}>
            {isMvp
              ? "Three short steps capture where things are now, what feels hardest, and the details a clinician needs before preparing a clear report for GP conversations and referral decisions."
              : "A few short steps to get ready for your first session. It takes about ten minutes, and you can pause and pick up anytime — your progress is saved."}
          </p>
        </div>

        <div className="bg-[var(--color-thread-off-white)]/70 p-5 rounded-tr-[24px] flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-[var(--color-thread-light-green)] flex items-center justify-center flex-shrink-0 text-[var(--color-thread-mid-green)]">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-medium text-[var(--color-thread-heading)] mb-1">
              {isMvp ? "Clinician-reviewed, not automated" : "A clinician leads everything"}
            </h4>
            <p className="text-[0.92rem] text-[var(--color-thread-gray)] leading-relaxed">
              {isMvp
                ? "Threadline organises the background details so the assessment workspace starts in the right place. A registered clinician reviews the information and prepares the report before it is shared."
                : "Your session is led by a registered clinician, and they review every result before you see it. Threadline does the structured work behind the scenes — a person is always accountable for your care."}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
        <Button onClick={onCancel} variant="muted" className="w-full sm:w-auto">
          Cancel
        </Button>
        <Button
          onClick={onBegin}
          variant="forest"
          className="w-full sm:w-auto"
          rightIcon={<ArrowRight className="w-5 h-5" />}
        >
          {isMvp ? "Start GP report setup" : "Begin setup"}
        </Button>
      </div>
    </div>
  );
}

export function SetupJourneyStep({
  journeyStage,
  sectionKickerClass,
  stepHeadingClass,
  stepLeadClass,
  questionOptionClass,
  onJourneyStageChange,
}: SetupJourneyStepProps) {
  const { isMvp } = useDisplayMode();
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div>
        {!isMvp && <span className={sectionKickerClass}>Step 1 of 5 · Your journey</span>}
        <h1 className={stepHeadingClass}>Where are you in your journey?</h1>
        <p className={stepLeadClass}>
          Choose the option that fits best right now. This helps Navigator set the right tone for your family from the start.
        </p>
      </div>

      <div className="space-y-2.5 max-w-xl">
        {JOURNEY_STAGE_OPTIONS.map((stage, index) => {
          const isSelected = journeyStage === stage.value;
          return (
            <button
              key={stage.value}
              type="button"
              onClick={() => onJourneyStageChange(stage.value)}
              className={questionOptionClass(isSelected)}
            >
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "w-6 h-6 rounded-full border text-[0.66rem] font-medium flex items-center justify-center transition-colors",
                    isSelected
                      ? "bg-[var(--color-thread-mid-green)] border-[var(--color-thread-mid-green)] text-white"
                      : "bg-white border-black/10 text-slate-400 group-hover:border-black/20 group-hover:text-slate-600",
                  )}
                >
                  {index + 1}
                </span>
                <span className="flex flex-col gap-0.5">
                  <span className="text-[0.95rem] leading-snug">{stage.value}</span>
                  <span className="text-[0.78rem] leading-snug text-[var(--color-thread-gray)]">
                    {stage.hint}
                  </span>
                </span>
              </div>
              {isSelected && <Check className="w-4 h-4 text-[var(--color-thread-mid-green)]" />}
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}

export function SetupChildDetailsStep({
  firstName,
  yearOfBirth,
  relation,
  years,
  sectionKickerClass,
  stepHeadingClass,
  stepLeadClass,
  selectClass,
  choiceClass,
  onFirstNameChange,
  onYearOfBirthChange,
  onRelationChange,
}: SetupChildDetailsStepProps) {
  const { isMvp } = useDisplayMode();
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div>
        {!isMvp && <span className={sectionKickerClass}>Step 2 of 5 · Your child</span>}
        <h1 className={stepHeadingClass}>Add your child</h1>
        <p className={stepLeadClass}>Start with the basics — who we&apos;re supporting and how you&apos;re related to them.</p>
      </div>

      <div className="space-y-6">
        <div>
          <Label>Child&apos;s first name</Label>
          <Input
            placeholder="e.g. Alex"
            value={firstName}
            onChange={(event) => onFirstNameChange(event.target.value)}
            className="max-w-md py-3 bg-white"
          />
        </div>
        <div>
          <Label className="mb-2 block">Year of birth</Label>
          <div className="max-w-md">
            <div className="relative">
              <select
                value={yearOfBirth}
                onChange={(event) => onYearOfBirthChange(event.target.value)}
                className={selectClass}
              >
                <option value="">YYYY</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div>
          <Label>I&apos;m the child&apos;s…</Label>
          <div className="flex flex-wrap gap-2">
            {RELATIONS.map((relationOption) => (
              <Button
                key={relationOption}
                type="button"
                onClick={() => onRelationChange(relationOption)}
                variant={relation === relationOption ? "mint" : "muted"}
                className={choiceClass(relation === relationOption)}
              >
                {relationOption}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function SetupNoticesStep({
  firstName,
  notices,
  sectionKickerClass,
  stepHeadingClass,
  stepLeadClass,
  choiceClass,
  onNoticesChange,
}: SetupNoticesStepProps) {
  const { isMvp } = useDisplayMode();
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div>
        {!isMvp && <span className={sectionKickerClass}>Step 3 of 5 · Hardest right now</span>}
        <h1 className={stepHeadingClass}>Which of these feels hardest right now?</h1>
        <p className={stepLeadClass}>
          Choose up to three areas. There are no wrong answers — this helps your clinician start with what feels most important for {firstName || "your child"} today.
        </p>
      </div>

      <div className="space-y-8">
        <div>
          <Label className="mb-3">
            Which of these feels hardest right now? <span className="text-slate-400 font-normal ml-2">select up to three</span>
          </Label>
          <div className="flex flex-wrap gap-2.5">
            {NOTICE_OPTIONS.map((option) => {
              const isSelected = notices.includes(option);
              const isAtLimit = notices.length >= 3 && !isSelected;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    if (isAtLimit) return;
                    onNoticesChange(
                      isSelected ? notices.filter((notice) => notice !== option) : [...notices, option],
                    );
                  }}
                  className={cn(
                    choiceClass(isSelected),
                    isAtLimit && "opacity-45 cursor-not-allowed hover:border-black/10 hover:text-[var(--color-thread-gray)]",
                  )}
                >
                  {option}
                  {isSelected && <Check className="w-3.5 h-3.5 text-[var(--color-thread-mid-green)]" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
