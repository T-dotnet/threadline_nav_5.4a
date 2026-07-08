import { motion } from "motion/react";
import { ArrowRight, BookOpen, CalendarClock, ClipboardList, LineChart, ListTodo, Upload, Users } from "lucide-react";
import { Page } from "../types";
import { useCurrentChild } from "../context/ChildContext";
import { useDisplayMode } from "../context/DisplayModeContext";
import { QUESTIONNAIRE_SECTIONS, getCompletedQuestionnaireSections } from "../questionnaire";
import { getJourneyHomeCopy, hasReportContext } from "../lib/journeyCopy";
import { getRotatingCornerClass } from "../lib/cornerStyles";
import { DEFAULT_SESSION_TIME } from "../lib/sessionDefaults";
import {
  getChildSessionStatus,
  getDiagnosticPathwayCardCopy,
  getSessionDate,
  isAssessmentPendingProfile,
  isDiagnosticPathway,
  isIntakeProfile,
  isNewChildOnboardingComplete,
  usesMvpNewChildSetup,
  usesStandaloneQuestionnaire,
} from "../lib/childStatus";
import { PageContainer } from "./ui/PageContainer";
import { PageHeader } from "./ui/PageHeader";
import { FadeInScroll } from "./ui/FadeInScroll";
import { HeroQuoteCard } from "./ui/HeroQuoteCard";
import { HeroActionCard } from "./ui/HeroActionCard";
import { ActionPromptPanel } from "./ui/ActionPromptPanel";
import { Button } from "./ui/Button";
import { SectionLabel } from "./ui/SectionLabel";
import { SectionTitle } from "./ui/SectionTitle";
import { SectionDescription } from "./ui/SectionDescription";
import { TimelineStep } from "./ui/TimelineStep";
import { GuideCard } from "./ui/GuideCard";
import { PageFooterCTA } from "./ui/PageFooterCTA";
import { FirstSessionCard } from "./ui/FirstSessionCard";
import { ActionLink } from "./ui/ActionLink";
import { ValueCard } from "./ui/ValueCard";
import pediatricianQuestionsImg from "../assets/images/optimized/abstract-pediatrician-questions-900.jpg";
import greenPlumBedtimeImg from "../assets/images/optimized/abstract-bedtime-wind-down-900.jpg";
import greenPlumClassroomImg from "../assets/images/optimized/abstract-classroom-support-900.jpg";
import greenPlumBreathingImg from "../assets/images/optimized/abstract-breathing-coregulation-900.jpg";

interface NewChildPreviewPageProps {
  onPageChange: (page: Page) => void;
  onOpenSetup?: (step?: 1 | 2 | 3 | 4 | 5 | "welcome") => void;
  onShowPathway?: (child: any) => void;
}

const previewSections = [
  {
    title: "Understanding",
    description: "A plain-language view of what the questionnaire answers are starting to show.",
    icon: Users,
    questionnaireSection: QUESTIONNAIRE_SECTIONS[0],
    page: "understanding" as Page,
  },
  {
    title: "Priorities",
    description: "A plain-language guide to how Now, Next, and Later will be decided.",
    icon: ListTodo,
    questionnaireSection: QUESTIONNAIRE_SECTIONS[1],
    page: "priorities" as Page,
  },
  {
    title: "Reviews",
    description: "A calmer review space for what you noticed and what to keep watching.",
    icon: LineChart,
    questionnaireSection: QUESTIONNAIRE_SECTIONS[2],
    page: "what-you-noticed" as Page,
  },
  {
    title: "Resources",
    description: "Short, practical preparation tools that match the intake stage without jumping to conclusions.",
    icon: BookOpen,
    questionnaireSection: QUESTIONNAIRE_SECTIONS[3],
    page: "resources" as Page,
  },
];

export default function NewChildPreviewPage({ onPageChange, onOpenSetup, onShowPathway }: NewChildPreviewPageProps) {
  const { currentChild } = useCurrentChild();
  const { isMvp } = useDisplayMode();
  const answers = currentChild.intake?.questionnaireAnswers || {};
  const completedSections = getCompletedQuestionnaireSections(answers);
  const isQuestionnaireComplete = completedSections.length === QUESTIONNAIRE_SECTIONS.length;
  const sessionStatus = getChildSessionStatus(currentChild);
  const isSessionBooked = sessionStatus === "booked";
  const isSessionCancelled = sessionStatus === "cancelled";
  const isAssessmentPending = isNewChildOnboardingComplete(currentChild);
  const firstSessionDate = getSessionDate(currentChild);
  const firstSessionTime = isSessionBooked ? currentChild.intake?.sessionTime || DEFAULT_SESSION_TIME : undefined;
  const reportContext = hasReportContext(currentChild.intake?.availableInfo);
  const homeCopy = getJourneyHomeCopy(currentChild.name, currentChild.intake?.journeyStage, reportContext);
  const isDiagnostic = isDiagnosticPathway(currentChild);
  const isProfileAssessmentPending = isAssessmentPendingProfile(currentChild);
  const isProfileIntakeOnly = isIntakeProfile(currentChild);
  const shouldShowPreparationGuides = !isProfileIntakeOnly && !isProfileAssessmentPending && !(isDiagnostic && !isSessionBooked);
  const diagnosticCardCopy = getDiagnosticPathwayCardCopy(currentChild);
  const useMvpSetup = isMvp && usesMvpNewChildSetup(currentChild);
  const hasStandaloneQuestionnaire = usesStandaloneQuestionnaire(currentChild);
  const diagnosticDescription = diagnosticCardCopy.descriptionText || "Your assessment session is booked. Complete the preparation details so your child's clinician, such as your GP, paediatrician or psychiatrist, has the right context.";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="pt-16 pb-16"
    >
      <PageContainer>
        <PageHeader
          kicker={homeCopy.kicker}
          title={homeCopy.title}
          titleClassName="md:leading-[4.5rem]"
          className="mb-12"
          description={
            <SectionDescription>
              {isDiagnostic ? diagnosticDescription : homeCopy.description}
            </SectionDescription>
          }
        />

        {!isAssessmentPending && !isDiagnostic && (
          <div className="mb-8 rounded-tr-[24px] bg-white p-4 shadow-sm md:hidden">
            <div className="text-[0.68rem] font-medium uppercase tracking-[0.14em] text-[var(--color-thread-mid-green)]">
              Next step
            </div>
            <div className="mt-2 flex items-center justify-between gap-4">
              <p className="text-[0.92rem] leading-snug text-[var(--color-thread-dark-slate)]">
                Begin with the questionnaire, then choose the right pathway.
              </p>
              <Button
                variant="primary"
                className="min-h-[40px] shrink-0 px-4 text-[0.78rem]"
                onClick={() => onOpenSetup?.()}
                rightIcon={<ArrowRight className="h-3.5 w-3.5 stroke-[2]" />}
              >
                Start your journey
              </Button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-[2fr_1fr] md:gap-6 max-md:grid-cols-1 max-md:gap-y-6 mb-24">
          <HeroQuoteCard
            kicker="Assessment Ready"
            quote={homeCopy.quote}
            evidenceLevel={isAssessmentPending ? 3 : undefined}
            evidenceText={isAssessmentPending ? "Setup completed" : undefined}
            className="h-full"
            action={
              (isAssessmentPending || isDiagnostic) ? undefined : (
                <Button
                  variant="primary"
                  onClick={() => onOpenSetup?.()}
                  rightIcon={<ArrowRight className="w-3.5 h-3.5 stroke-[2]" />}
                >
                  Start your journey
                </Button>
              )
            }
          />

          <FirstSessionCard
            date={firstSessionDate}
            time={firstSessionTime}
            isBooked={isSessionBooked}
            isCancelled={isSessionCancelled}
            titleText={useMvpSetup ? "Get clarity" : diagnosticCardCopy.titleText}
            descriptionText={useMvpSetup ? "Prepare the Assessment Package for clinical conversations and referral decisions." : diagnosticCardCopy.descriptionText}
            buttonText={useMvpSetup ? "Start your journey" : diagnosticCardCopy.buttonText}
            onBook={useMvpSetup ? () => onPageChange("assessment") : hasStandaloneQuestionnaire ? () => onPageChange("questionnaire") : (isDiagnostic ? () => onOpenSetup?.(5) : (onShowPathway ? () => onShowPathway(currentChild) : () => onOpenSetup?.(5)))}
            onReschedule={isSessionBooked ? () => onOpenSetup?.(5) : undefined}
          />
        </div>

        <FadeInScroll className="mb-24">
          <div>
            <SectionLabel>Workspace preview</SectionLabel>
            <SectionTitle>Understanding, priorities, reviews, and resources.</SectionTitle>
          </div>

          <div className="grid grid-cols-2 gap-6 max-md:grid-cols-1 mt-8">
            {previewSections.map((section, index) => {
              const Icon = section.icon;
              return (
                <div
                  key={section.title}
                  className={`overflow-hidden bg-white ${getRotatingCornerClass(index)} transition-all duration-300 flex flex-col`}
                >
                  <div className="p-8 flex flex-col h-full">
                    <div className="w-10 h-10 rounded-full bg-[var(--color-thread-light-green)] text-[var(--color-thread-mid-green)] flex items-center justify-center mb-6">
                      <Icon className="w-5 h-5 stroke-[1.8] text-[var(--color-thread-mid-green)]" />
                    </div>
                    <h3 className="font-serif text-[1.55rem] text-[var(--color-thread-heading)] mb-3 leading-snug">
                      {section.title}
                    </h3>
                    <p className="text-[0.95rem] leading-relaxed text-slate-600 flex-1">
                      {section.description}
                    </p>
                    <div className="pt-4 mt-6">
                      <ActionLink
                        variant="slate"
                        as="button"
                        onClick={() => onPageChange(section.page)}
                        className="text-[0.84rem]"
                      >
                        Learn more
                      </ActionLink>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </FadeInScroll>

        {!isDiagnostic && (
          <FadeInScroll className="mb-24">
            <div>
              <SectionTitle>{homeCopy.timelineTitle}</SectionTitle>
            </div>
            <div className="relative mt-1">
              <div className="absolute left-[11px] top-3.5 bottom-5 w-[2px] bg-black/10" />
              <TimelineStep
                done={isQuestionnaireComplete}
                active={!isQuestionnaireComplete}
                title="Finish the questionnaire"
                meta="Intake"
                metaTag={isQuestionnaireComplete ? "Completed" : "Now"}
                description={
                  <div className="space-y-3">
                    <p className="text-[0.92rem] text-[var(--color-thread-gray)] leading-relaxed">
                      {homeCopy.questionnaireDescription}
                    </p>
                    <Button
                      type="button"
                      variant={isQuestionnaireComplete ? "tertiary" : "secondary"}
                      className="min-h-[38px] px-4 py-2 text-[0.78rem]"
                      onClick={() => onOpenSetup?.(4)}
                      rightIcon={isQuestionnaireComplete ? <ArrowRight className="w-3.5 h-3.5 stroke-[2]" /> : <ClipboardList className="w-3.5 h-3.5 stroke-[2]" />}
                    >
                    {isQuestionnaireComplete ? "Review module" : "Continue module"}
                    </Button>
                  </div>
                }
              />
              <TimelineStep
                active={!isSessionBooked && isQuestionnaireComplete}
                todo={!isSessionBooked && !isQuestionnaireComplete}
                done={isSessionBooked}
                title={isSessionBooked ? "Attend the first session" : "Choose your path"}
                meta="Pathway"
                metaTag={isSessionBooked ? "Booked" : isSessionCancelled ? "Cancelled" : isQuestionnaireComplete ? "Next" : "To choose"}
                description={
                  <div className="space-y-3">
                    <p className="text-[0.92rem] text-[var(--color-thread-gray)] leading-relaxed">
                      {isSessionBooked
                        ? homeCopy.sessionDescription
                        : "Select Diagnostic Assessment or Navigator Care Program to begin your journey."}
                    </p>
                    <Button
                      type="button"
                      variant={isSessionBooked ? "tertiary" : "primary"}
                      className="min-h-[38px] px-4 py-2 text-[0.78rem]"
                      onClick={isSessionBooked ? () => onOpenSetup?.(5) : (onShowPathway ? () => onShowPathway(currentChild) : () => onOpenSetup?.(5))}
                      rightIcon={<CalendarClock className="w-3.5 h-3.5 stroke-[2]" />}
                    >
                      {isSessionBooked ? "Reschedule or cancel" : "Choose your path"}
                    </Button>
                  </div>
                }
              />
            </div>
          </FadeInScroll>
        )}

        {!isMvp && (
          <FadeInScroll className="mb-24">
            <ActionPromptPanel
              label="Reports or information ready"
              title="Upload what you have. We'll help explain it."
              description={`If you already have reports, school notes, or other useful information for ${currentChild.name}, add them here now. Once they are uploaded, Threadline can help you understand the document more clearly before the first session.`}
              action={
                <HeroActionCard
                  icon={<Upload className="w-[22px] h-[22px] stroke-[1.7]" />}
                  title="Upload documents"
                  subtitle="Add reports or notes"
                  onClick={() => onPageChange("documents")}
                />
              }
            />
          </FadeInScroll>
        )}

        {shouldShowPreparationGuides && (
          <FadeInScroll className="mb-16">
            <div>
              <SectionLabel>Helpful preparation</SectionLabel>
              <SectionTitle>{homeCopy.prepTitle}</SectionTitle>
              {homeCopy.prepDescription && (
                <SectionDescription>{homeCopy.prepDescription}</SectionDescription>
              )}
            </div>
            <div className="grid grid-cols-3 gap-6 max-md:grid-cols-1 mt-8">
              {homeCopy.prepCards === 'gentle' && (
                <>
                  <GuideCard
                    category="Session prep"
                    title="Questions to bring to the call"
                    description="Keep a short list of what you want your child's clinician to understand first."
                    readTime="5 min"
                    image={greenPlumBreathingImg}
                    cornerClass="rounded-tr-[32px]"
                  />
                  <GuideCard
                    category="Gentle next step"
                    title="Two things to notice"
                    description="What feels hardest right now, and when does the day feel easiest?"
                    readTime="3 min"
                    image={greenPlumBedtimeImg}
                    cornerClass="rounded-tl-[32px]"
                  />
                  <GuideCard
                    category="Observation"
                    title="What to notice this week"
                    description="Look for patterns around routines, transitions, sleep, school, and friendships."
                    readTime="6 min"
                    image={greenPlumClassroomImg}
                    cornerClass="rounded-bl-[32px]"
                  />
                </>
              )}
              {homeCopy.prepCards === 'support' && (
                <>
                  <GuideCard
                    category="Session prep"
                    title="Questions to bring to the call"
                    description="Keep a short list of what support would help most after diagnosis."
                    readTime="5 min"
                    image={greenPlumBreathingImg}
                    cornerClass="rounded-tr-[32px]"
                  />
                  <GuideCard
                    category="Support context"
                    title="What support already exists"
                    description="Plans, reports, school adjustments, and strategies already tried can help shape next steps."
                    readTime="4 min"
                    image={pediatricianQuestionsImg}
                    cornerClass="rounded-tl-[32px]"
                  />
                  <GuideCard
                    category="Observation"
                    title="What to notice this week"
                    description="Look for patterns around routines, transitions, sleep, school, and friendships."
                    readTime="6 min"
                    image={greenPlumClassroomImg}
                    cornerClass="rounded-bl-[32px]"
                  />
                </>
              )}
              {homeCopy.prepCards === 'documents' && (
                <>
                  <GuideCard
                    category="Session prep"
                    title="Questions to bring to the call"
                    description="Keep a list of existing reports and observations that can make the assessment more useful."
                    readTime="5 min"
                    image={pediatricianQuestionsImg}
                    cornerClass="rounded-tr-[32px]"
                  />
                  <GuideCard
                    category="Assessment prep"
                    title="What to gather before assessment"
                    description="Collect reports, teacher notes, and recent observations so the session starts with the right context."
                    readTime="4 min"
                    image={greenPlumBedtimeImg}
                    cornerClass="rounded-tl-[32px]"
                  />
                  <GuideCard
                    category="Observation"
                    title="What to notice this week"
                    description="Look for patterns around routines, transitions, sleep, school, and friendships."
                    readTime="6 min"
                    image={greenPlumClassroomImg}
                    cornerClass="rounded-bl-[32px]"
                  />
                </>
              )}
            </div>
          </FadeInScroll>
        )}
      </PageContainer>

      {!isProfileAssessmentPending && (
        <PageFooterCTA
          title={isDiagnostic ? "Ready to explore the assessment pathway?" : homeCopy.footerTitle}
          buttonText={isDiagnostic ? "Explore Assessment preview" : homeCopy.footerButton}
          buttonIcon={<ArrowRight className="w-4 h-4 stroke-[2]" />}
          onClick={isDiagnostic ? () => onPageChange("assessment") : () => onOpenSetup?.()}
        />
      )}
    </motion.div>
  );
}
