import { Child } from "../types";
import { QUESTIONNAIRE_SECTIONS, isAnswered, normalizeQuestionnaireSectionName } from "../questionnaire";
import { MVP_WORKFLOW_QUESTIONS } from "./familyJourneyQuestionBank";

type ReviewDateFormat = "short" | "long";

interface ChildProfileStatus {
  subheading?: string;
  maintenancePhase?: boolean;
  planNotStarted?: boolean;
  diagnosticPathway?: boolean;
  suppressQuickNote?: boolean;
  sessionPreviewUnavailable?: boolean;
  assessmentCardProfile?: boolean;
  completedAssessmentReport?: boolean;
  pathwayChoiceProfile?: boolean;
  standaloneQuestionnaire?: boolean;
  assessmentProgressProfile?: boolean;
  mvpHidden?: boolean;
  deprecated?: boolean;
  primaryActionLabel?: string;
  reviewDate?: {
    short: string;
    long: string;
  };
}

const CHILD_PROFILE_STATUS: Record<string, ChildProfileStatus> = {
  Maya: {
    subheading: "Navigator Care",
    reviewDate: { short: "12 Sep", long: "12 September" },
    assessmentCardProfile: true,
    mvpHidden: true,
  },
  Liam: {
    subheading: "Navigator Care",
    maintenancePhase: true,
    reviewDate: { short: "12 Dec", long: "12 December" },
    assessmentCardProfile: true,
    mvpHidden: true,
  },
  Leo: {
    subheading: "Diagnostic Assessment",
    diagnosticPathway: true,
    suppressQuickNote: true,
    sessionPreviewUnavailable: true,
    standaloneQuestionnaire: true,
  },
  Isla: {
    subheading: "Diagnostic Assessment",
    diagnosticPathway: true,
    suppressQuickNote: true,
    assessmentCardProfile: true,
    assessmentProgressProfile: true,
  },
  Noah: {
    subheading: "Diagnostic Assessment",
    diagnosticPathway: true,
    planNotStarted: true,
    suppressQuickNote: true,
    sessionPreviewUnavailable: true,
    completedAssessmentReport: true,
    reviewDate: { short: "8 Oct", long: "8 October" },
  },
  Nick: {
    subheading: "Diagnostic Assessment",
    diagnosticPathway: true,
    suppressQuickNote: true,
    deprecated: true,
  },
  Sophia: {
    subheading: "Navigator Care",
    reviewDate: { short: "24 Sep", long: "24 September" },
    assessmentCardProfile: true,
  },
  Tom: {
    subheading: "Intake in progress",
    assessmentCardProfile: true,
    pathwayChoiceProfile: true,
  },
  Ava: {
    subheading: "Assessment pending",
    assessmentCardProfile: true,
    pathwayChoiceProfile: true,
    primaryActionLabel: "Open Insight",
    mvpHidden: true,
  },
  Chloe: {
    subheading: "Assessment pending",
    diagnosticPathway: true,
    assessmentCardProfile: true,
    assessmentProgressProfile: true,
  },
};

const PROFILE_KEY_BY_CHILD_ID: Record<string, string> = {
  "child-maya": "Maya",
  "child-liam": "Liam",
  "child-leo": "Leo",
  "child-isla": "Isla",
  "child-chloe": "Chloe",
  "child-noah": "Noah",
  "child-nick": "Nick",
  "child-sophia": "Sophia",
  "child-tom": "Tom",
  "child-ava": "Ava",
};

export function getChildProfileKey(child: Child) {
  return (child.id && PROFILE_KEY_BY_CHILD_ID[child.id]) || child.name;
}

function getProfileStatus(child: Child): ChildProfileStatus {
  return CHILD_PROFILE_STATUS[getChildProfileKey(child)] || {};
}

export function getChildSessionStatus(child: Child) {
  if (child.intake?.sessionDay && child.intake?.sessionTime) return "booked";
  if (child.intake?.sessionCancelled) return "cancelled";
  return "not-booked";
}

export function isSessionBooked(child: Child) {
  return getChildSessionStatus(child) === "booked";
}

/**
 * Formats the booked session date, e.g. "Thu 26 Jun" (or "Thu 26 June" with
 * month: "long"). Returns undefined when no session is booked, so callers can
 * `?? fallback`. Centralizes the date string that was duplicated across pages.
 */
export function getSessionDate(child: Child, month: "short" | "long" = "short"): string | undefined {
  if (!isSessionBooked(child)) return undefined;
  const day = child.intake?.sessionDay;
  return day ? `Thu ${day} ${month === "long" ? "June" : "Jun"}` : undefined;
}

/**
 * Whether the child is an established profile in the completed-quarter /
 * maintenance phase. Demo-profile decisions stay centralized here so page
 * components do not branch on display names.
 */
export function isMaintenancePhase(child: Child) {
  return getProfileStatus(child).maintenancePhase === true;
}

export function isPlanNotStarted(child: Child) {
  return getProfileStatus(child).planNotStarted === true;
}

export function isDiagnosticPathway(child: Child) {
  return getProfileStatus(child).diagnosticPathway === true;
}

export function isAssessmentPendingProfile(child: Child) {
  return getChildSubheading(child) === "Assessment pending";
}

export function isIntakeProfile(child: Child) {
  return getChildSubheading(child) === "Intake in progress";
}

export function shouldSuppressQuickNote(child: Child) {
  if (child.isNew) return true;
  return getProfileStatus(child).suppressQuickNote === true;
}

export function isSessionPreviewUnavailable(child: Child) {
  return getProfileStatus(child).sessionPreviewUnavailable === true;
}

export function usesAssessmentCard(child: Child) {
  return getProfileStatus(child).assessmentCardProfile === true;
}

export function usesPathwayChoiceCard(child: Child) {
  return getProfileStatus(child).pathwayChoiceProfile === true;
}

export function usesMvpNewChildSetup(child: Child) {
  return Boolean(child.isNew) && !usesStandaloneQuestionnaire(child);
}

export function usesCompletedAssessmentReport(child: Child) {
  return getProfileStatus(child).completedAssessmentReport === true;
}

export function usesAssessmentProgressCard(child: Child) {
  return getProfileStatus(child).assessmentProgressProfile === true;
}

export function getAssessmentProgressCardData(child: Child) {
  if (getChildProfileKey(child) === "Chloe") {
    return {
      progress: 100,
      statusText: "submitted — clinical review",
      nextReview: "",
    };
  }

  const mvpQuestions = Object.values(MVP_WORKFLOW_QUESTIONS).flat();
  const answeredCount = mvpQuestions.filter((question) =>
    isAnswered(child.intake?.questionnaireAnswers?.[question.id]),
  ).length;
  const progress = mvpQuestions.length > 0
    ? Math.round((answeredCount / mvpQuestions.length) * 100)
    : 0;

  return {
    progress,
    statusText: progress > 0 ? `questionnaire active — ${answeredCount} of ${mvpQuestions.length} prompts` : "not started — questionnaire pending",
    nextReview: "",
  };
}

export function getChildReviewDate(child: Child, format: ReviewDateFormat = "long") {
  const reviewDate = getProfileStatus(child).reviewDate;
  if (!reviewDate) return format === "long" ? "12 September" : "12 Sep";
  return reviewDate[format];
}

export function getChildSubheadingByName(childName: string) {
  return CHILD_PROFILE_STATUS[childName]?.subheading || "";
}

export function usesStandaloneQuestionnaire(child: Child) {
  return getProfileStatus(child).standaloneQuestionnaire === true;
}

export function shouldHideInMvpMode(child: Child) {
  return getProfileStatus(child).mvpHidden === true;
}

export function isDeprecatedProfile(child: Child) {
  return getProfileStatus(child).deprecated === true;
}

export function getDiagnosticPathwayCardCopy(child: Child) {
  if (!isDiagnosticPathway(child)) return {};
  const isBooked = isSessionBooked(child);
  const isStandaloneQuestionnaire = usesStandaloneQuestionnaire(child);
  const hasCompletedReport = usesCompletedAssessmentReport(child);

  return {
    titleText: "Diagnostic Assessment",
    descriptionText: isBooked ? undefined : (isStandaloneQuestionnaire ? "Complete the questionnaire, invite their teacher, and upload documents to move toward Assessment Ready." : (hasCompletedReport ? `${child.name}'s Assessment Package is ready. Share it with your child's clinician, such as your GP, paediatrician or psychiatrist.` : "The pathway is chosen, but the Diagnostic Assessment hasn't started yet.")),
    buttonText: isBooked ? "Prepare for your session" : (isStandaloneQuestionnaire ? "Start questionnaire" : "Start your journey"),
  };
}

export function getNewChildPrimaryActionLabel(child: Child) {
  if (!child.isNew) return `Open ${child.name}`;
  const profileActionLabel = getProfileStatus(child).primaryActionLabel;
  if (profileActionLabel) return profileActionLabel;
  return isIntakeProfile(child) ? "Start questionnaire" : `Open ${child.name} Insight`;
}

export function shouldShowNewChildSetupAction(child: Child) {
  return Boolean(child.isNew) && !isDiagnosticPathway(child);
}

export function shouldUseFirstSessionCard(child: Child) {
  if (usesAssessmentProgressCard(child)) return false;
  return Boolean(child.isNew) || (isDiagnosticPathway(child) && !isPlanNotStarted(child));
}

export function isNewChildOnboardingComplete(child: Child) {
  if (!child.isNew) return false;

  const completedSections = Array.from(
    new Set((child.intake?.completedQuestionnaireSections || []).map(normalizeQuestionnaireSectionName)),
  );
  const hasCompletedQuestionnaire = completedSections.length >= QUESTIONNAIRE_SECTIONS.length;
  const hasBookedSession = getChildSessionStatus(child) === "booked";

  return hasCompletedQuestionnaire && hasBookedSession;
}

export function getChildSubheading(child: Child) {
  const profileSubheading = getProfileStatus(child).subheading;
  if (profileSubheading) return profileSubheading;

  if (!child.isNew) return "Navigator Care";
  if (getChildSessionStatus(child) === "cancelled") return "Choose your path";
  return isNewChildOnboardingComplete(child) ? "Assessment pending" : "Intake in progress";
}
