import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { CalendarClock, ChevronLeft, ChevronRight, ClipboardList, LineChart, Users, ArrowRight } from "lucide-react";
import { cn } from "../lib/utils";
import {
  getAssessmentProgressCardData,
  getChildProfileKey,
  getChildReviewDate,
  getChildSessionStatus,
  getChildSubheading,
  getDiagnosticPathwayCardCopy,
  getNewChildPrimaryActionLabel,
  getSessionDate,
  hasReturnedAssessmentResults,
  isAssessmentPendingProfile,
  isDiagnosticPathway,
  isMaintenancePhase,
  isNewChildOnboardingComplete,
  isPlanNotStarted,
  shouldShowNewChildSetupAction,
  shouldUseFirstSessionCard,
  usesAssessmentProgressCard,
  usesCompletedAssessmentReport,
  usesMvpNewChildSetup,
  usesPathwayChoiceCard,
  usesStandaloneQuestionnaire,
} from "../lib/childStatus";
import { Child, Page } from "../types";
import { DEFAULT_SESSION_TIME } from "../lib/sessionDefaults";
import { ProgressBar } from "./ui/ProgressBar";
import { PageHeader } from "./ui/PageHeader";
import { EvidenceBadge } from "./ui/EvidenceBadge";
import { ActionLink } from "./ui/ActionLink";
import { Button } from "./ui/Button";
import { PlanProgressCard } from "./ui/PlanProgressCard";
import { HeroActionCard } from "./ui/HeroActionCard";
import { HeroQuoteCard } from "./ui/HeroQuoteCard";
import { FirstSessionCard } from "./ui/FirstSessionCard";

import { PageContainer } from "./ui/PageContainer";

import { useCurrentChild } from "../context/ChildContext";
import { useDisplayMode } from "../context/DisplayModeContext";

const OPEN_CLINICAL_MODULES_REQUEST_KEY = "threadline-open-clinical-modules-request";
const OPEN_CLINICIAN_SHARE_REQUEST_KEY = "threadline-open-clinician-share-request";

interface AllChildrenPageProps {
  onPageChange: (page: Page) => void;
  onShowPathway?: (child: Child) => void;
}

export default function AllChildrenPage({
  onPageChange,
  onShowPathway,
}: AllChildrenPageProps) {
  const { childrenList, setChild } = useCurrentChild();
  const { isParentClarity, isMvp, hideRubyHighlightNoah } = useDisplayMode();
  const [isSecondaryLight, setIsSecondaryLight] = useState(true);
  const [activeUpdateIndex, setActiveUpdateIndex] = useState(0);

  useEffect(() => {
    let style = "light";
    try {
      style = localStorage.getItem("thread-secondary-style") || "light";
    } catch (e) {
      console.warn("Storage access is blocked or restricted:", e);
    }
    setIsSecondaryLight(style === "light");
  }, []);

  // Helper to retrieve child-specific premium synthesis quote and progression details
  const getChildSynthesisData = (child: Child) => {
    const sessionStatus = getChildSessionStatus(child);
    const sessionBooked = sessionStatus === "booked";
    const sessionCancelled = sessionStatus === "cancelled";
    const sessionDate = getSessionDate(child);
    const sessionTime = sessionBooked ? child.intake?.sessionTime || DEFAULT_SESSION_TIME : undefined;
    const isDiagnostic = isDiagnosticPathway(child);
    const isMaintenance = isMaintenancePhase(child);
    const isStartingPlan = isPlanNotStarted(child);
    const isAssessmentPending = isAssessmentPendingProfile(child);
    const assessmentProgressCardData = usesAssessmentProgressCard(child)
      ? getAssessmentProgressCardData(child)
      : undefined;

    if (!isMvp && usesPathwayChoiceCard(child)) {
      return {
        quote: `${child.name}'s assessment summary is complete. You can now choose to start your first support plan or continue with clinical monitoring.`,
        evidenceLevel: 3,
        evidenceText: "Synthesis complete",
        progress: 100,
        progressText: "choose your path",
        nextReview: "Choose your path",
        accentColor: "text-amber-600",
        theme: "white",
      };
    }

    if (child.isNew && !isDiagnostic && !isAssessmentPending) {
      return {
        quote: isMvp 
          ? `Ready to prepare ${child.name}'s Assessment Package? The first step is waiting.` 
          : `We're gathering the full picture for ${child.name}. The assessment pages will open after the clinical review.`,
        evidenceLevel: 1,
        evidenceText: getChildSubheading(child),
        progress: 0,
        progressText: sessionBooked
          ? "booked — assessment pending"
          : sessionCancelled
          ? "session cancelled — choose your path"
          : "choose your path",
        nextReview: sessionDate || (sessionCancelled ? "Cancelled" : "Choose your path"),
        sessionDate,
        sessionTime,
        documentStatus: "Initial documents uploaded",
        accentColor: "text-amber-600",
        theme: "white",
      };
    }

    if (isMaintenance) {
      return {
        quote: `${child.name} has achieved all current developmental milestones for this phase; focus now shifts to long-term enrichment and peer-leadership skills.`,
        evidenceLevel: 3,
        evidenceText: "Strong formulation",
        progress: 100,
        progressText: "all goals met — maintenance phase",
        nextReview: getChildReviewDate(child),
        accentColor: "text-[var(--color-thread-mid-green)]",
        theme: "green",
      };
    }

    if (isDiagnostic && isStartingPlan) {
      const hasCompletedReport = isMvp && usesCompletedAssessmentReport(child);
      const hasReturnedResults = hasReturnedAssessmentResults(child);
      const shouldUseGreenSummary = hasReturnedResults || (hideRubyHighlightNoah && getChildProfileKey(child) === "Noah");
      return {
        quote: hasReturnedResults
          ? `${child.name}'s clinician has sent the Assessment Package back. Results are available to review.`
          : hasCompletedReport
          ? `${child.name}'s Assessment Package is ready for review and has been shared with your child's clinician.`
          : `${child.name}'s first quarter plan is ready to begin. Progress is still 0%, so the next update should come from trying the first support routine.`,
        evidenceLevel: 3,
        evidenceText: hasReturnedResults ? "Results available" : hasCompletedReport ? "Report ready" : "Baseline ready",
        progress: hasCompletedReport ? 100 : 0,
        progressText: hasReturnedResults
          ? "returned — Results available"
          : hasCompletedReport
            ? "submitted — Report shared"
            : "not started — first actions ready",
        nextReview: hasCompletedReport ? "" : "Not booked",
        accentColor: hasReturnedResults ? "text-[var(--color-thread-mid-green)]" : "text-amber-600",
        theme: shouldUseGreenSummary ? "green" : "white",
      };
    }

    if (isDiagnostic) {
      const hasStandaloneQuestionnaire = usesStandaloneQuestionnaire(child);
      const profileKey = getChildProfileKey(child);
      const profileQuoteOverrides: Partial<Record<string, string>> = {
        Leo: "Leo is registered for the Diagnostic Assessment. Start your first module",
        Isla: "Isla's Assessment is moving through. Let's keep the momentum",
        Chloe: "Chloe's Assessment is ready to be shared with your child's clinician.",
      };
      return {
        quote: profileQuoteOverrides[profileKey] || (hasStandaloneQuestionnaire
          ? `${child.name} is registered for the Diagnostic Assessment.`
          : assessmentProgressCardData
            ? `${child.name}'s Assessment Ready preparation is moving through the Diagnostic Assessment workflow.`
          : (sessionBooked
            ? "The telehealth assessment session is booked. Completing the preparation details gives your child's clinician rich context."
            : `${child.name} is registered for the Diagnostic Assessment pathway, but the assessment session has not been booked yet.`)),
        evidenceLevel: hasStandaloneQuestionnaire ? 2 : (sessionBooked ? 1 : 2),
        evidenceText: getChildSubheading(child),
        progress: assessmentProgressCardData?.progress ?? 0,
        progressText: profileKey === "Leo"
          ? "Depending"
          : assessmentProgressCardData?.statusText ?? (hasStandaloneQuestionnaire ? "questionnaire pending" : (sessionBooked ? "booked — assessment pending" : "not booked — session pending")),
        nextReview: assessmentProgressCardData?.nextReview ?? (hasStandaloneQuestionnaire ? "Start questionnaire" : (sessionDate || "Choose your path")),
        sessionDate,
        sessionTime,
        accentColor: "text-amber-600",
        theme: "white",
      };
    }

    if (isAssessmentPending) {
      return {
        quote: isMvp 
          ? `Ready to prepare ${child.name}'s Assessment Package? The first step is waiting.` 
          : `We're gathering the full picture for ${child.name}. The assessment pages will open after the clinical review.`,
        evidenceLevel: 2,
        evidenceText: getChildSubheading(child),
        progress: 0,
        progressText: "assessment pending",
        nextReview: "Under review",
        accentColor: "text-amber-600",
        theme: "white",
      };
    }

    switch (getChildProfileKey(child)) {
      case "Sophia":
        return {
          quote: "Sophia exhibits brilliant verbal reasoning and high peer sensitivity, but academic organization challenges necessitate visual scheduling aids.",
          evidenceLevel: 3,
          evidenceText: "Strong formulation",
          progress: 58,
          progressText: "good pacing — steady progress",
          nextReview: getChildReviewDate(child),
          accentColor: "text-[var(--color-thread-mid-green)]",
          theme: "white",
        };
      case "Maya":
      default:
        return {
          quote: isParentClarity ? `${child.name}'s classroom focus is improving. Sleep stays on the watchlist because tired mornings may explain the days where focus still dips.` : `${child.name} is showing marked improvements in auditory processing, though focus remains heavily tethered to circadian stability.`,
          evidenceLevel: 3,
          evidenceText: "Strong formulation",
          progress: 65,
          progressText: "on track — steady progress",
          nextReview: getChildReviewDate(child),
          accentColor: "text-[var(--color-thread-mid-green)]",
          theme: "white",
        };
    }
  };

  const navigate = useNavigate();
  const hasMultipleChildren = childrenList.length > 1;
  const updateSlides = childrenList.map((child) => {
    const childData = getChildSynthesisData(child);
    const sessionStatus = getChildSessionStatus(child);
    const sessionBooked = sessionStatus === "booked";
    const sessionCancelled = sessionStatus === "cancelled";
    const ctaLabel = child.isNew
      ? hasMultipleChildren
        ? getNewChildPrimaryActionLabel(child)
        : `Manage ${child.name}'s Dashboard`
      : `Open ${child.name}`;
    const fallbackIcon = child.isNew
      ? sessionBooked
        ? <CalendarClock className="w-[22px] h-[22px] stroke-[1.7]" />
        : <ClipboardList className="w-[22px] h-[22px] stroke-[1.7]" />
      : <LineChart className="w-[22px] h-[22px] stroke-[1.7]" />;
    const fallbackTitle = child.isNew
      ? sessionBooked
        ? "Session booked"
        : sessionCancelled
        ? "Session cancelled"
        : "Intake live"
      : "Live progress";
    const fallbackSubtitle = child.isNew
      ? sessionBooked
        ? "Awaiting review"
        : sessionCancelled
        ? "Book a new time"
        : "Setup in motion"
      : childData.progressText;

    return {
      child,
      childData,
      kicker: "Updates",
      quote: child.isNew
        ? `${child.name}'s intake is still being built. ${
            sessionBooked
              ? "A first session is booked, so the next milestone is clinical review."
              : sessionCancelled
              ? "The previous session was cancelled, so the next milestone is choosing your path."
              : "The next milestone is finishing intake and choosing your path."
          }`
        : childData.nextReview
        ? `${child.name}'s live update: ${childData.progressText}. Next review is ${childData.nextReview}.`
        : `${child.name}'s live update: ${childData.progressText}.`,
      evidenceText: child.isNew ? getChildSubheading(child) : childData.evidenceText,
      evidenceLevel: child.isNew ? 1 : childData.evidenceLevel,
      ctaLabel,
      fallbackIcon,
      fallbackTitle,
      fallbackSubtitle,
    };
  });
  const activeSlide = updateSlides[activeUpdateIndex];

  const handleFocusChild = useCallback((child: Child) => {
    setChild(child);
    onPageChange(isMvp ? "assessment" : "home");
  }, [setChild, onPageChange, isMvp]);

  const handleAssessmentCardAction = useCallback((child: Child) => {
    setChild(child);
    const profileKey = getChildProfileKey(child);

    if (isMvp && profileKey === "Chloe") {
      try {
        sessionStorage.setItem(
          OPEN_CLINICIAN_SHARE_REQUEST_KEY,
          JSON.stringify({
            childId: child.id,
            childName: child.name,
            createdAt: Date.now(),
          }),
        );
      } catch {
        // Route state below still carries the same one-shot request when storage is unavailable.
      }
      const assessmentSearchParams = new URLSearchParams({
        openClinicianShare: "1",
        childId: child.id,
        childName: child.name,
      });
      navigate(`/assessment?${assessmentSearchParams.toString()}`, {
        state: {
          openClinicianShare: true,
          childId: child.id,
          childName: child.name,
        },
      });
    } else if (isMvp && (usesStandaloneQuestionnaire(child) || profileKey === "Isla")) {
      try {
        sessionStorage.setItem(
          OPEN_CLINICAL_MODULES_REQUEST_KEY,
          JSON.stringify({
            childId: child.id,
            childName: child.name,
            createdAt: Date.now(),
          }),
        );
      } catch {
        // Route state below still carries the same one-shot request when storage is unavailable.
      }
      const assessmentSearchParams = new URLSearchParams({
        openClinicalModules: "1",
        childId: child.id,
        childName: child.name,
      });
      navigate(`/assessment?${assessmentSearchParams.toString()}`, {
        state: {
          openClinicalModules: true,
          childId: child.id,
          childName: child.name,
        },
      });
    } else if (isMvp && usesMvpNewChildSetup(child)) {
      navigate("/assessment");
    } else if (isDiagnosticPathway(child)) {
      navigate("/setup?step=5&directSession=1");
    } else {
      onShowPathway?.(child);
    }
  }, [isMvp, navigate, onPageChange, onShowPathway, setChild]);

  const handlePreviousUpdate = useCallback(() => {
    setActiveUpdateIndex((current) => (current === 0 ? updateSlides.length - 1 : current - 1));
  }, [updateSlides.length]);

  const handleNextUpdate = useCallback(() => {
    setActiveUpdateIndex((current) => (current === updateSlides.length - 1 ? 0 : current + 1));
  }, [updateSlides.length]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="pt-16 pb-16 font-sans"
    >
      <PageContainer>
        <PageHeader
        kicker="Family Overview"
        title="All Children at a glance."
        description="See what needs attention next for each child, from intake to appointments and follow-up."
        titleClassName="md:text-[3.8rem] md:leading-[4.3rem]"
        className="mb-28"
      />

      {activeSlide && !isMvp && (
        <div className="mb-24">
          <motion.div
            key={activeSlide.child.name}
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
          >
            <HeroQuoteCard
              kicker={activeSlide.kicker}
              quote={activeSlide.quote}
              evidenceLevel={isMvp ? undefined : activeSlide.evidenceLevel}
              evidenceText={isMvp ? undefined : activeSlide.evidenceText}
              className="mb-5"
              description={
                <div className="text-[0.96rem] leading-relaxed">
                  Following <strong>{activeSlide.child.name}</strong> and showing the most useful live update before the detailed cards below.
                </div>
              }
              rightNode={
                activeSlide.ctaLabel ? (
                  <HeroActionCard
                    icon={<ArrowRight className="w-[22px] h-[22px] stroke-[1.8]" />}
                    title={activeSlide.ctaLabel}
                    subtitle={(activeSlide.child.isNew && getChildSubheading(activeSlide.child) === "Intake in progress") 
                      ? (isMvp ? "" : "Start questionnaire") 
                      : "Open child view"}
                    className={cn(
                      "bg-[var(--color-thread-light-green)] text-[var(--style-light-surface-text)] w-[190px] rounded-tl-[28px] hover:bg-[var(--color-thread-light-green)]/90",
                      (isMvp && activeSlide.child.isNew && getChildSubheading(activeSlide.child) === "Intake in progress") && "opacity-0 pointer-events-none"
                    )}
                    onClick={() => handleFocusChild(activeSlide.child)}
                  />
                ) : (
                  <HeroActionCard
                    icon={activeSlide.fallbackIcon}
                    title={activeSlide.fallbackTitle}
                    subtitle={activeSlide.fallbackSubtitle}
                    className="bg-[var(--color-thread-light-green)] text-[var(--style-light-surface-text)] w-[190px] rounded-tl-[28px]"
                  />
                )
              }
            />
          </motion.div>

          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="tertiary"
                className="min-h-[36px] px-3 py-2"
                onClick={handlePreviousUpdate}
                aria-label="Previous live update"
              >
                <ChevronLeft className="w-4 h-4 stroke-[2]" />
              </Button>
              <Button
                type="button"
                variant="tertiary"
                className="min-h-[36px] px-3 py-2"
                onClick={handleNextUpdate}
                aria-label="Next live update"
              >
                <ChevronRight className="w-4 h-4 stroke-[2]" />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              {updateSlides.map((slide, index) => (
                <button
                  key={slide.child.name}
                  type="button"
                  onClick={() => setActiveUpdateIndex(index)}
                  aria-label={`Show live update for ${slide.child.name}`}
                  className={cn(
                    "h-2.5 rounded-full transition-all",
                    activeUpdateIndex === index
                      ? "w-8 bg-[var(--color-thread-mid-green)]"
                      : "w-2.5 bg-black/15 hover:bg-black/25"
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-16">
        {childrenList.map((child, index) => {
          const childData = getChildSynthesisData(child);
          const isGreenTheme = childData.theme === "green";
          const sessionStatus = getChildSessionStatus(child);
          const sessionBooked = sessionStatus === "booked";
          const sessionCancelled = sessionStatus === "cancelled";
          const sessionDate = getSessionDate(child);
          const sessionTime = sessionBooked ? child.intake?.sessionTime || DEFAULT_SESSION_TIME : undefined;
          const showPathwayChoiceCard = usesPathwayChoiceCard(child) && !isMvp;
          const showFirstSessionCard = shouldUseFirstSessionCard(child) || showPathwayChoiceCard;
          const diagnosticCardCopy = getDiagnosticPathwayCardCopy(child);
          const profileKey = getChildProfileKey(child);

          const isMvpNewChildOverride = isMvp && usesMvpNewChildSetup(child);
          const isPathwayChoiceOverride = showPathwayChoiceCard;
          const shouldMoveMvpActionToSynthesis = isMvp && (usesStandaloneQuestionnaire(child) || usesMvpNewChildSetup(child));
          const mvpAssessmentActionLabel = profileKey === "Isla"
            ? "Continue modules"
            : profileKey === "Chloe"
              ? "Share package"
              : profileKey === "Noah"
                ? "Open profile"
                : profileKey === "Ruby"
                  ? "View results"
                : "Open Assessment";
          const mvpMovedActionLabel = profileKey === "Leo" ? "Start module" : undefined;

          const titleText = isPathwayChoiceOverride ? "Choose your path" : (isMvpNewChildOverride ? "Get clarity" : (diagnosticCardCopy.titleText || "Diagnostic Assessment"));
          const descriptionText = isPathwayChoiceOverride
            ? "Your assessment is complete. Select Diagnostic Assessment or Navigator Care Program to begin your journey."
            : (isMvpNewChildOverride 
              ? "Prepare the Assessment Package for clinical conversations and referral decisions." 
              : (diagnosticCardCopy.descriptionText || "A clinical session with a specialist to review your child's history and discuss developmental concerns."));
          const buttonText = isPathwayChoiceOverride ? "Choose your path" : (isMvpNewChildOverride ? "Start your journey" : (diagnosticCardCopy.buttonText || "Schedule session"));

          return (
            <motion.section
              key={`${child.name}-${index}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.1 }}
              className="border-b border-black/5 pb-14 last:border-0"
              id={`child-section-${child.name.toLowerCase()}`}
            >
              {/* Child Section Row Header */}
              <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-[44px] h-[44px] rounded-full bg-[var(--color-thread-mid-green)] text-white flex items-center justify-center font-medium text-[1.05rem] font-serif shadow-sm">
                    {child.initial}
                  </div>
                  <div>
                    <h2 className="text-[1.8rem] font-serif font-normal tracking-tight text-[var(--color-thread-heading)] leading-none">
                      {child.name}'s Profile
                    </h2>
                    <span className="text-[0.84rem] text-slate-500 font-medium block mt-1">
                      {isMvp 
                        ? (child.age ? `Age ${child.age}` : "")
                        : (child.isNew 
                            ? `${child.age ? `Age ${child.age} · ` : ""}${getChildSubheading(child)}` 
                            : `Age ${child.age} · Developmental track`)
                      }
                    </span>
                  </div>
                </div>

                {!isMvp && (
                  <ActionLink
                    variant="forest"
                    as="button"
                    onClick={() => handleFocusChild(child)}
                    id={`focus-${child.name.toLowerCase()}`}
                    icon={ArrowRight}
                    className="text-[0.88rem]"
                  >
                    {`Manage ${child.name}'s Dashboard`}
                  </ActionLink>
                )}
              </div>

              {/* Cards Grid: Synthesis (left) and Quarter Plan (right) */}
              <div className="grid grid-cols-[1.5fr_1fr] md:gap-6 max-md:grid-cols-1 max-md:gap-y-8">
                
                {/* Dynamic Synthesis Card */}
                <HeroQuoteCard
                  id={`synthesis-card-${child.name.toLowerCase()}`}
                  variant={isGreenTheme ? "green" : "default"}
                  className="h-auto md:h-[300px] p-8"
                  kicker="Current summary"
                  quote={childData.quote}
                  evidenceLevel={isMvp ? undefined : childData.evidenceLevel}
                  evidenceText={isMvp ? undefined : childData.evidenceText}
                  evidenceVariant={isGreenTheme ? 'green' : 'default'}
                  action={
                    shouldMoveMvpActionToSynthesis ? (
                      <Button
                        onClick={() => handleAssessmentCardAction(child)}
                        variant={isGreenTheme ? "white" : "secondary"}
                        rightIcon={<ChevronRight className="w-3.5 h-3.5 stroke-[2]" />}
                      >
                        {mvpMovedActionLabel || buttonText}
                      </Button>
                    ) : (child.isNew && isMvp) ? null : (
                      child.isNew ? (
                        isNewChildOnboardingComplete(child) ? (
                        <Button
                          onClick={() => handleFocusChild(child)}
                          variant="secondary"
                          rightIcon={<ChevronRight className="w-3.5 h-3.5 stroke-[2]" />}
                        >
                          Open Insight
                        </Button>
                      ) : !shouldShowNewChildSetupAction(child) ? null : (
                        <Button
                          onClick={() => {
                            if (usesPathwayChoiceCard(child)) {
                              handleFocusChild(child);
                            } else {
                              setChild(child);
                              window.location.href = "/setup";
                            }
                          }}
                          variant={isGreenTheme ? "white" : "secondary"}
                          rightIcon={<ChevronRight className="w-3.5 h-3.5 stroke-[2]" />}
                        >
                          {getNewChildPrimaryActionLabel(child)}
                        </Button>
                      )
                    ) : (
                      <Button
                        onClick={() => {
                          if (isMvp && (profileKey === "Isla" || profileKey === "Chloe")) {
                            handleAssessmentCardAction(child);
                            return;
                          }

                          setChild(child);
                          onPageChange(isMvp ? "assessment" : "understanding");
                        }}
                        variant={isGreenTheme ? "white" : "secondary"}
                        rightIcon={<ChevronRight className="w-3.5 h-3.5 stroke-[2]" />}
                      >
                        {isMvp ? mvpAssessmentActionLabel : "Open Insights"}
                      </Button>
                    )
                  )
                }
                />

                {/* Quarter Plan Card */}
                <div
                  className="h-auto md:h-[300px]"
                  id={`plan-card-${child.name.toLowerCase()}`}
                >
                  {showFirstSessionCard ? (
                      <FirstSessionCard
                        date={sessionDate}
                        time={sessionTime}
                        className="h-full"
                        isBooked={showPathwayChoiceCard ? false : sessionBooked}
                        isCancelled={showPathwayChoiceCard ? false : sessionCancelled}
                        titleText={titleText}
                        descriptionText={descriptionText}
                        buttonText={buttonText}
                        onBook={shouldMoveMvpActionToSynthesis ? undefined : () => handleAssessmentCardAction(child)}
                        onReschedule={sessionBooked ? () => {
                          setChild(child);
                          navigate('/setup?step=5&directSession=1');
                        } : undefined}
                      />
                  ) : (
                    <PlanProgressCard
                      title={usesAssessmentProgressCard(child) || isMvp ? "Assessment Progress" : "This Quarter's Plan Progress"}
                      progress={childData.progress}
                      statusText={childData.progressText}
                      nextReview={childData.nextReview}
                      onReschedule={(isMvp && usesCompletedAssessmentReport(child)) ? undefined : () => {
                        setChild(child);
                        navigate('/setup?step=5&directSession=1');
                      }}
                      rescheduleLabel={isPlanNotStarted(child) ? "Book now" : undefined}
                      className="rounded-bl-[32px] h-full"
                    />
                  )}
                </div>

              </div>
            </motion.section>
          );
        })}
      </div>

      {/* Footer support notice */}
      <div className="mt-8 pt-8 border-t border-black/5 flex justify-between items-center flex-wrap gap-4 text-[0.84rem] text-slate-500 text-center md:text-left">
        <span className="flex items-center gap-2">
          <Users className="w-4 h-4 text-[var(--color-thread-mid-green)]" />
          Coordinated clinical care dashboard for families
        </span>
        <ActionLink
          variant="default"
          as="button"
          onClick={() => onPageChange("settings")}
          icon={null}
        >
          Manage account and profiles
        </ActionLink>
      </div>
      </PageContainer>
    </motion.div>
  );
}
