import { motion } from "motion/react";
import {
  Clock,
  Calendar,
  ArrowUpRight,
  Minus,
  Plus,
  Check,
} from "lucide-react";
import { PageHeader } from "./ui/PageHeader";
import { PageMetaRow } from "./ui/PageMetaRow";
import { HeroQuoteCard } from "./ui/HeroQuoteCard";
import { SectionTitle } from "./ui/SectionTitle";
import { SectionLabel } from "./ui/SectionLabel";
import { FadeInScroll } from "./ui/FadeInScroll";
import { AreaItem } from "./ui/AreaItem";
import { PageFooterCTA } from "./ui/PageFooterCTA";
import { FirstSessionCard } from "./ui/FirstSessionCard";
import { PlanProgressCard } from "./ui/PlanProgressCard";
import { ReviewRhythmSection } from "./ui/ReviewRhythmSection";

import { PageContainer } from "./ui/PageContainer";

import { Page } from "../types";
import { useCurrentChild } from "../context/ChildContext";
import { useDisplayMode } from "../context/DisplayModeContext";
import { DEFAULT_SESSION_TIME } from "../lib/sessionDefaults";
import {
  getAssessmentProgressCardData,
  getChildReviewDate,
  getDiagnosticPathwayCardCopy,
  isMaintenancePhase,
  isPlanNotStarted,
  isSessionBooked as getIsSessionBooked,
  isSessionPreviewUnavailable,
  shouldUseFirstSessionCard,
  usesAssessmentCard,
  usesAssessmentProgressCard,
  usesPathwayChoiceCard,
  usesStandaloneQuestionnaire,
  getSessionDate,
  getChildSessionStatus,
} from "../lib/childStatus";
import watercolorBgImg from "../assets/images/optimized/watercolor-bg-900.jpg";

export default function ReviewsPage({
  onPageChange,
  onOpenSetup,
  onShowPathway,
}: {
  onPageChange: (page: Page) => void;
  onOpenSetup?: (step?: 1 | 2 | 3 | 4 | 5 | "welcome") => void;
  onShowPathway?: (child: any) => void;
}) {
  const { currentChild } = useCurrentChild();
  const { isParentClarity } = useDisplayMode();
  const isMaintenancePlan = isMaintenancePhase(currentChild);
  const isStartingPlan = isPlanNotStarted(currentChild);
  const showAssessmentCard = usesAssessmentCard(currentChild);
  const showAssessmentProgressCard = usesAssessmentProgressCard(currentChild);
  const assessmentProgressCardData = showAssessmentProgressCard ? getAssessmentProgressCardData(currentChild) : undefined;
  const showPathwayChoiceCard = usesPathwayChoiceCard(currentChild);
  const sessionPreviewUnavailable = isSessionPreviewUnavailable(currentChild);
  const diagnosticCardCopy = getDiagnosticPathwayCardCopy(currentChild);
  const showParentClarity = isParentClarity && !currentChild.isNew && !isMaintenancePlan && !isStartingPlan;
  const reviewDate = getChildReviewDate(currentChild, "short");
  const reviewTime = DEFAULT_SESSION_TIME;
  const isSessionBooked = getIsSessionBooked(currentChild);
  const sessionStatus = getChildSessionStatus(currentChild);
  const isSessionCancelled = sessionPreviewUnavailable ? false : sessionStatus === "cancelled";
  const firstSessionDate = getSessionDate(currentChild, "long") ?? "Choose your path";
  const firstSessionTime = isSessionBooked ? currentChild.intake?.sessionTime || DEFAULT_SESSION_TIME : isSessionCancelled ? "Cancelled" : "Choose your path";
  const showReviewDates = !currentChild.isNew || isSessionBooked;
  const hasStandaloneQuestionnaire = usesStandaloneQuestionnaire(currentChild);
  const showFirstSessionCard = (shouldUseFirstSessionCard(currentChild) || showPathwayChoiceCard) && !showAssessmentProgressCard;
  const reviewRhythmItems = [
    {
      state: "Done",
      title: "Assessment baseline",
      meta: showReviewDates ? "14 June" : "",
      description: "The starting point: what is happening, what matters most, and the first plan.",
      icon: <Check className="w-[19px] h-[19px] stroke-[1.8]" />,
    },
    {
      state: "Next review",
      title: "First full review",
      meta: showReviewDates ? (isStartingPlan ? "8 October" : "12 September") : "After first session",
      description: "Revisit priorities, update the plan, and confirm what has improved and what needs attention next.",
      icon: <Calendar className="w-[19px] h-[19px] stroke-[1.8]" />,
    },
    {
      state: "Happening now",
      title: "Progress tracking",
      meta: "Between reviews",
      description: "We watch what changes week to week and flag patterns, like sleep, before they become urgent.",
      icon: <Clock className="w-[19px] h-[19px] stroke-[1.8]" />,
      active: true,
    },
    {
      state: "Ongoing",
      title: "Keep the picture current",
      meta: `Each term`,
      description: `The picture updates as ${currentChild.name} grows, because needs shift and clarity should not expire.`,
      icon: <ArrowUpRight className="w-[19px] h-[19px] stroke-[1.8]" />,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="pt-16 pb-16"
    >
      <PageContainer>
        <PageHeader
        kicker="Reviews · How we're progressing"
        title={`How ${currentChild.name}'s doing over time.`}
        titleClassName="md:leading-[4.5rem]"
        className={currentChild.isNew ? "mb-12" : "mb-24"}
        description={
          <PageMetaRow
            items={[
              { icon: Clock, children: "Updated 14 June 2026" },
              {
                icon: Calendar,
                children: isMaintenancePlan
                  ? "Maintenance phase active"
                  : isStartingPlan
                  ? `First progress review ${getChildReviewDate(currentChild)}`
                  : `Next full review ${getChildReviewDate(currentChild)}`,
              },
            ]}
          />
        }
      />

      {currentChild.isNew && (
        <div className="w-full h-[200px] rounded-t-[24px] sm:rounded-t-[32px] overflow-hidden relative">
          <img
            src={watercolorBgImg}
            alt="Watercolor Accent"
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
          />
        </div>
      )}

      <div className="grid grid-cols-[2fr_1fr] md:gap-6 max-md:grid-cols-1 max-md:gap-y-6 mb-24">
        <HeroQuoteCard
          kicker="The long view"
          quote={
            isMaintenancePlan ? (
              `${currentChild.name} has achieved all baseline targets. The profile now reflects a state of sustained developmental mastery.`
            ) : isStartingPlan ? (
              `${currentChild.name}'s plan has a clean starting point. The next review will compare the baseline with what happens after the first support routine is actually tried.`
            ) : showParentClarity ? (
              `The main story is simple: ${currentChild.name}'s classroom focus is moving in the right direction. Sleep stays on the watchlist because it may explain the days where focus still dips.`
            ) : (
              `Most assessments are a snapshot. Yours keeps updating — so the picture stays true as ${currentChild.name} grows, not frozen at the day you got the report.`
            )
          }
          className="h-full"
        />

        {showFirstSessionCard ? (
          <FirstSessionCard
            className="h-full"
            isBooked={sessionPreviewUnavailable || showPathwayChoiceCard ? false : isSessionBooked}
            isCancelled={sessionPreviewUnavailable ? false : isSessionCancelled}
            date={firstSessionDate}
            time={firstSessionTime}
            titleText={showAssessmentCard ? diagnosticCardCopy.titleText : undefined}
            descriptionText={showAssessmentCard ? diagnosticCardCopy.descriptionText : undefined}
            buttonText={showAssessmentCard ? diagnosticCardCopy.buttonText : undefined}
            onReschedule={isSessionBooked ? () => onOpenSetup?.(5) : undefined}
            onBook={() => {
              if (showPathwayChoiceCard) {
                onShowPathway?.(currentChild);
              } else if (hasStandaloneQuestionnaire) {
                onPageChange("assessment");
              } else if (showAssessmentCard) {
                onOpenSetup?.(5);
              } else {
                onShowPathway?.(currentChild);
              }
            }}
          />
        ) : (
          <PlanProgressCard
            progress={assessmentProgressCardData?.progress ?? (isMaintenancePlan ? 100 : isStartingPlan ? 0 : 65)}
            statusText={assessmentProgressCardData?.statusText ?? (isMaintenancePlan ? "Plan completed" : isStartingPlan ? "Plan in formulation" : "In progress")}
            nextReview={assessmentProgressCardData?.nextReview ?? (isStartingPlan ? "Not booked" : reviewDate)}
            title={showAssessmentProgressCard ? "Assessment Progress" : "This quarter's plan"}
            className="w-full h-full"
            onReschedule={() => onOpenSetup?.(5)}
            rescheduleLabel={isStartingPlan ? "Book now" : undefined}
          />
        )}
      </div>

      {/* What's Changed Section */}
      <FadeInScroll className="mb-24">
        <div>
          <SectionLabel>
            What's changed
          </SectionLabel>
          <SectionTitle>
            {isMaintenancePlan ? "Current status summaries." : isStartingPlan ? "What we are waiting to learn." : "How the picture has moved."}
          </SectionTitle>
        </div>

        <div className="border-y border-black/10">
          {isMaintenancePlan ? (
            <>
              <AreaItem
                title="Self-Correction"
                description="Fully independent in most social contexts."
                status="Complete"
                icon={<Check className="w-3 h-3 stroke-[2.4]" />}
              />
              <AreaItem
                title="Task Endurance"
                description="Extended engagement is now a stable characteristic."
                status="Complete"
                icon={<Check className="w-3 h-3 stroke-[2.4]" />}
              />
              <AreaItem
                title="Social Connection"
                description="Emerging as a peer leader in school creative projects."
                status="Strength"
                icon={<ArrowUpRight className="w-3 h-3 stroke-[2.4]" />}
              />
            </>
          ) : isStartingPlan ? (
            <>
              <AreaItem
                title="First support routine"
                description="Ready to begin. No progress is recorded yet because the routine has not been used long enough to show movement."
                status="0%"
                icon={<Minus className="w-3 h-3 stroke-[2.4]" />}
              />
              <AreaItem
                title="Baseline"
                description="The starting picture is clear enough to compare against once home and school observations begin."
                status="Set"
                icon={<Check className="w-3 h-3 stroke-[2.4]" />}
              />
              <AreaItem
                title="Early observations"
                description="The next useful update will be whether the first routine feels repeatable in real life."
                status="Waiting"
                icon={<Plus className="w-3 h-3 stroke-[2.4]" />}
              />
            </>
          ) : (
            <>
              <AreaItem
                title="Classroom attention"
                description={showParentClarity ? "Teacher-friendly classroom strategies are starting to show movement. Keep this as the main action area until the September review." : "Focus in class is improving as the strategies take hold."}
                status="Improving"
                icon={<ArrowUpRight className="w-3 h-3 stroke-[2.4]" />}
                sources={showParentClarity ? ["Teacher feedback", "Parent check-in"] : undefined}
              />
              <AreaItem
                title="Emotional regulation at home"
                description={showParentClarity ? "Home frustration is still present, but not escalating. We expect this may ease if classroom focus keeps improving." : "Holding steady — likely to ease further as attention improves."}
                status="Steady"
                icon={<Minus className="w-3 h-3 stroke-[2.4]" />}
                sources={showParentClarity ? ["Parent notes"] : undefined}
              />
              <AreaItem
                title="Sleep"
                description={showParentClarity ? "Not something to act on heavily yet. Keep routines consistent and watch whether tired mornings line up with harder school days." : "A new signal since the assessment — now on the watchlist."}
                status="Emerging"
                icon={<Plus className="w-3 h-3 stroke-[2.4]" />}
                sources={showParentClarity ? ["Parent check-in", "Pattern watch"] : undefined}
              />
              <AreaItem
                title="Friendships & social connection"
                description={showParentClarity ? "Still a strength. This can safely stay off the parent task list unless something changes." : "Still going well — no change needed."}
                status="Strength"
                icon={<Check className="w-3 h-3 stroke-[2.4]" />}
                sources={showParentClarity ? [currentChild.name, "Parent notes"] : undefined}
              />
            </>
          )}
        </div>
      </FadeInScroll>

      {/* Review Rhythm Section */}
      <ReviewRhythmSection items={reviewRhythmItems} />

      </PageContainer>

      {/* Forward Button */}
      <PageFooterCTA
        title="This is the loop that keeps your clarity current."
        buttonText="Back to today's focus"
        buttonIcon={<Check className="w-4 h-4 stroke-[2]" />}
        onClick={() => onPageChange("home")}
      />
    </motion.div>
  );
}
