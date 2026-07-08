import { motion } from "motion/react";
import { ArrowRight, Check, ClipboardCheck, User } from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "../ui/Button";
import { ClinicalHighlight } from "../ui/ClinicalHighlight";
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

const MVP_JOURNEY_STAGE_OPTIONS = [
  "We're just starting to wonder whether ADHD might explain what's happening",
  "We've been referred for an ADHD assessment",
  "We're looking for a clinician to assess our child",
  "We already have a clinician for our child's assessment",
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

const MVP_HELP_OPTIONS = [
  "Understanding what information is needed",
  "Making sure nothing important is missed",
  "Collecting teacher questionnaires",
  "Reducing delays before the assessment",
  "I'm not sure yet",
];

const AVAILABLE_INFO_OPTIONS = [
  "Nothing yet",
  "School reports or teacher observations",
  "A referral",
  "Psychology, Speech Pathology or OT report",
  "Previous assessment",
];

const SETUP_HIGHLIGHT_CLASS = "bg-[var(--color-thread-off-white)] shadow-none";
const SETUP_HIGHLIGHT_ICON_CLASS = "bg-white text-[var(--color-thread-mid-green)]";
const SETUP_HIGHLIGHT_TITLE_CLASS = "mb-2 text-[0.92rem] font-semibold text-[var(--color-thread-heading)]";

const AU_STATES_AND_TERRITORIES = [
  "Australian Capital Territory",
  "New South Wales",
  "Northern Territory",
  "Queensland",
  "South Australia",
  "Tasmania",
  "Victoria",
  "Western Australia",
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
  age: string;
  yearOfBirth: string;
  relation: string;
  stateOrTerritory: string;
  years: string[];
  selectClass: string;
  choiceClass: (selected: boolean) => string;
  onFirstNameChange: (firstName: string) => void;
  onAgeChange: (age: string) => void;
  onYearOfBirthChange: (yearOfBirth: string) => void;
  onRelationChange: (relation: string) => void;
  onStateOrTerritoryChange: (stateOrTerritory: string) => void;
}

interface SetupNoticesStepProps extends SetupStepStyleProps {
  firstName: string;
  notices: string[];
  choiceClass: (selected: boolean) => string;
  onNoticesChange: (notices: string[]) => void;
}

interface SetupAvailableInfoStepProps extends SetupStepStyleProps {
  availableInfo: string[];
  questionOptionClass: (selected: boolean) => string;
  onAvailableInfoChange: (availableInfo: string[]) => void;
}

interface SetupReflectionStepProps extends SetupStepStyleProps {
  firstName: string;
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
          <span className={sectionKickerClass}>{isMvp ? "Welcome" : "Welcome to Threadline"}</span>
          <h1 className={stepHeadingClass}>
            {isMvp ? "Let's get your child's assessment started." : "Let's set up Threadline for your family."}
          </h1>
          <p className={stepLeadClass}>
            {isMvp
              ? "A few quick questions, about 2 minutes."
              : "A few short steps to get ready for your first session. It takes about ten minutes, and you can pause and pick up anytime - your progress is saved."}
          </p>
        </div>

        <ClinicalHighlight
          className={SETUP_HIGHLIGHT_CLASS}
        icon={<User className="h-5 w-5" />}
        iconClassName={SETUP_HIGHLIGHT_ICON_CLASS}
        title={isMvp ? "Assessment preparation, made clearer" : "A clinician leads everything"}
        titleClassName={SETUP_HIGHLIGHT_TITLE_CLASS}
      >
          {isMvp
            ? "Threadline helps you gather the right starting information before the assessment, then keeps the next steps organised."
            : "Your session is led by a registered clinician, and they review every result before you see it. Threadline does the structured work behind the scenes - a person is always accountable for your care."}
        </ClinicalHighlight>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
        <Button onClick={onCancel} variant="tertiary" className="w-full sm:w-auto">
          Cancel
        </Button>
        <Button
          onClick={onBegin}
          variant="primary"
          className="w-full sm:w-auto"
          rightIcon={<ArrowRight className="w-5 h-5" />}
        >
          {isMvp ? "Start your journey" : "Begin setup"}
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
  const options = isMvp
    ? MVP_JOURNEY_STAGE_OPTIONS.map((value) => ({ value, hint: "" }))
    : JOURNEY_STAGE_OPTIONS;
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div>
        {!isMvp && <span className={sectionKickerClass}>Step 1 of 5 · Your journey</span>}
        <h1 className={stepHeadingClass}>{isMvp ? "Where are you in the process?" : "Where are you in your journey?"}</h1>
        <p className={stepLeadClass}>
          {isMvp
            ? "Choose the option that fits best right now."
            : "Choose the option that fits best right now. This helps Navigator set the right tone for your family from the start."}
        </p>
      </div>

      <div className="space-y-2.5 max-w-xl">
        {options.map((stage, index) => {
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
                  {stage.hint && (
                    <span className="text-[0.78rem] leading-snug text-[var(--color-thread-gray)]">
                      {stage.hint}
                    </span>
                  )}
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
  age,
  yearOfBirth,
  relation,
  stateOrTerritory,
  years,
  sectionKickerClass,
  stepHeadingClass,
  stepLeadClass,
  selectClass,
  choiceClass,
  onFirstNameChange,
  onAgeChange,
  onYearOfBirthChange,
  onRelationChange,
  onStateOrTerritoryChange,
}: SetupChildDetailsStepProps) {
  const { isMvp } = useDisplayMode();
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div>
        {!isMvp && <span className={sectionKickerClass}>Step 2 of 5 · Your child</span>}
        <h1 className={stepHeadingClass}>{isMvp ? "About your child" : "Add your child"}</h1>
        <p className={stepLeadClass}>
          {isMvp
            ? "Start with the basics so we can set up Your Thread."
            : "Start with the basics - who we're supporting and how you're related to them."}
        </p>
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
        {isMvp ? (
          <>
            <div>
              <Label>Age</Label>
              <Input
                type="number"
                min="0"
                max="17"
                placeholder="e.g. 8"
                value={age}
                onChange={(event) => onAgeChange(event.target.value)}
                className="max-w-md py-3 bg-white"
              />
            </div>
            <div>
              <Label className="mb-2 block">State or Territory</Label>
              <div className="max-w-md">
                <div className="relative">
                  <select
                    value={stateOrTerritory}
                    onChange={(event) => onStateOrTerritoryChange(event.target.value)}
                    className={selectClass}
                  >
                    <option value="">Select</option>
                    {AU_STATES_AND_TERRITORIES.map((state) => (
                      <option key={state} value={state}>
                        {state}
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
          </>
        ) : (
          <>
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
              <Label>I'm the child's...</Label>
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
          </>
        )}
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
  const options = isMvp ? MVP_HELP_OPTIONS : NOTICE_OPTIONS;
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div>
        {!isMvp && <span className={sectionKickerClass}>Step 3 of 5 · Hardest right now</span>}
        <h1 className={stepHeadingClass}>
          {isMvp ? "What would you like help with?" : "Which of these feels hardest right now?"}
        </h1>
        <p className={stepLeadClass}>
          {isMvp
            ? "Pick anything that would make the assessment feel easier to prepare for."
            : `Choose up to three areas. There are no wrong answers - this helps your child's clinician start with what feels most important for ${firstName || "your child"} today.`}
        </p>
      </div>

      <div className="space-y-8">
        <div>
          <Label className="mb-3">
            {isMvp ? "What would you like help with?" : "Which of these feels hardest right now?"}
            {!isMvp && <span className="text-slate-400 font-normal ml-2">select up to three</span>}
          </Label>
          <div className="flex flex-wrap gap-2.5">
            {options.map((option) => {
              const isSelected = notices.includes(option);
              const isAtLimit = !isMvp && notices.length >= 3 && !isSelected;
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

export function SetupAvailableInfoStep({
  availableInfo,
  sectionKickerClass,
  stepHeadingClass,
  stepLeadClass,
  questionOptionClass,
  onAvailableInfoChange,
}: SetupAvailableInfoStepProps) {
  const toggleAvailableInfo = (option: string) => {
    const isSelected = availableInfo.includes(option);
    if (option === "Nothing yet") {
      onAvailableInfoChange(isSelected ? [] : ["Nothing yet"]);
      return;
    }

    const withoutNone = availableInfo.filter((item) => item !== "Nothing yet");
    onAvailableInfoChange(
      isSelected ? withoutNone.filter((item) => item !== option) : [...withoutNone, option],
    );
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div>
        <span className={sectionKickerClass}>Screen 5 of 6</span>
        <h1 className={stepHeadingClass}>What do you already have?</h1>
        <p className={stepLeadClass}>
          Don't worry if you're just getting started. Many families begin with nothing at all.
        </p>
      </div>

      <div className="space-y-2.5 max-w-xl">
        {AVAILABLE_INFO_OPTIONS.map((option, index) => {
          const isSelected = availableInfo.includes(option);
          return (
            <button
              key={option}
              type="button"
              onClick={() => toggleAvailableInfo(option)}
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
                <span className="text-[0.95rem] leading-snug">{option}</span>
              </div>
              {isSelected && <Check className="w-4 h-4 text-[var(--color-thread-mid-green)]" />}
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}

export function SetupReflectionStep({
  firstName,
  sectionKickerClass,
  stepHeadingClass,
  stepLeadClass,
}: SetupReflectionStepProps) {
  const reflectionItems = [
    "Collect the recommended evidence",
    "Complete clinically validated parent and teacher questionnaires",
    "Organise your existing reports",
    "Reach Assessment Ready",
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div>
        <span className={sectionKickerClass}>Reflection</span>
        <h1 className={stepHeadingClass}>Great, we've got enough to get started.</h1>
        <p className={stepLeadClass}>
          We'll help you{firstName ? ` build ${firstName}'s Thread` : " build Your Thread"} and prepare the Assessment Package.
        </p>
      </div>

      <ClinicalHighlight
        className={`${SETUP_HIGHLIGHT_CLASS} max-w-xl p-6 sm:p-8`}
        icon={<ClipboardCheck className="h-5 w-5" />}
        iconClassName={SETUP_HIGHLIGHT_ICON_CLASS}
        title="We'll help you:"
        titleClassName={SETUP_HIGHLIGHT_TITLE_CLASS}
        bodyClassName="space-y-3"
      >
        <div className="space-y-3">
          {reflectionItems.map((item) => (
            <div key={item} className="flex items-start gap-3">
              <Check className="w-5 h-5 text-[var(--color-thread-mid-green)] flex-shrink-0 mt-0.5" />
              <p className="text-[0.96rem] text-[var(--color-thread-dark-slate)] leading-relaxed">{item}</p>
            </div>
          ))}
        </div>
      </ClinicalHighlight>
    </motion.div>
  );
}
