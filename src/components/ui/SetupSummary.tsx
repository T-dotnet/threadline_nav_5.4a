import React from 'react';
import { Check, ArrowRight, FileText, Calendar, Clock } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useCurrentChild } from '../../context/ChildContext';
import { useDisplayMode } from '../../context/DisplayModeContext';
import { QUESTIONNAIRE_SECTIONS, getCompletedQuestionnaireSections, normalizeQuestionnaireSectionName } from '../../questionnaire';
import { getJourneyReflectionCopy } from '../../lib/journeyCopy';
import { getChildSessionStatus, getSessionDate } from '../../lib/childStatus';
import { DEFAULT_SESSION_TIME } from '../../lib/sessionDefaults';

interface SetupSummaryProps {
  childName: string;
  onContinueQuestionnaire?: () => void;
  onReviewUnderstanding?: () => void;
  className?: string;
}

export function SetupSummary({ childName, onContinueQuestionnaire, onReviewUnderstanding, className }: SetupSummaryProps) {
  const { currentChild } = useCurrentChild();
  const { isMvp } = useDisplayMode();
  const answers = currentChild.intake?.questionnaireAnswers || {};
  const completedSections = Array.from(
    new Set((currentChild.intake?.completedQuestionnaireSections || getCompletedQuestionnaireSections(answers)).map(normalizeQuestionnaireSectionName)),
  );
  const remainingSections = Math.max(0, QUESTIONNAIRE_SECTIONS.length - completedSections.length);
  const isQuestionnaireComplete = remainingSections === 0;
  const journeyCopy = getJourneyReflectionCopy(currentChild.intake?.journeyStage);
  const sessionStatus = getChildSessionStatus(currentChild);
  const isSessionBooked = sessionStatus === 'booked';
  const isSessionCancelled = sessionStatus === 'cancelled';
  const sessionDate = getSessionDate(currentChild, 'long') ?? (isSessionCancelled ? 'Session cancelled' : 'Not booked yet');
  const sessionTime = isSessionBooked ? currentChild.intake?.sessionTime || DEFAULT_SESSION_TIME : isSessionCancelled ? 'Book a new time when ready' : 'Choose a time for the first session';

  return (
    <div className={cn("thread-setup-summary", className)}>
      <div className="thread-setup-summary__inner">
        <div className="thread-setup-summary__layout">
          {/* Left side: Status */}
          <div className="thread-setup-summary__status">
            <div>
              <span className="thread-setup-summary__eyebrow">Setup status</span>
              <h3 className="thread-setup-summary__title">Great progress, {childName}.</h3>
              <p className="thread-setup-summary__description">You've completed most of the setup for {childName}. A few tasks remain before your session.</p>
            </div>

            <div className="thread-setup-summary__steps">
              {/* Step 1: Journey */}
              <div className="thread-setup-summary__step">
                <div className="thread-setup-summary__step-icon thread-setup-summary__step-icon--complete">
                  <Check className="thread-setup-summary__step-check" />
                </div>
                <div>
                  {!isMvp && <div className="thread-setup-summary__step-label">Step 1</div>}
                  <div className="thread-setup-summary__step-title">Journey stage selected</div>
                </div>
              </div>

              {/* Step 2: Your child */}
              <div className="thread-setup-summary__step">
                <div className="thread-setup-summary__step-icon thread-setup-summary__step-icon--complete">
                  <Check className="thread-setup-summary__step-check" />
                </div>
                <div>
                  {!isMvp && <div className="thread-setup-summary__step-label">Step 2</div>}
                  <div className="thread-setup-summary__step-title">{childName}'s profile created</div>
                </div>
              </div>

              {/* Step 3: What feels hardest */}
              <div className="thread-setup-summary__step">
                <div className="thread-setup-summary__step-icon thread-setup-summary__step-icon--complete">
                  <Check className="thread-setup-summary__step-check" />
                </div>
                <div>
                  {!isMvp && <div className="thread-setup-summary__step-label">Step 3</div>}
                  <div className="thread-setup-summary__step-title">Hardest areas recorded</div>
                </div>
              </div>

              {/* Step 4: Questionnaire */}
              <div className={cn(
                "thread-setup-summary__task",
                isQuestionnaireComplete ? "thread-setup-summary__task--complete" : "thread-setup-summary__task--needs-attention"
              )}>
                <div className="thread-setup-summary__task-main">
                  <div className={cn(
                    "thread-setup-summary__step-icon",
                    isQuestionnaireComplete
                      ? "thread-setup-summary__step-icon--complete"
                      : "thread-setup-summary__step-icon--outline-warning"
                  )}>
                    {isQuestionnaireComplete ? <Check className="thread-setup-summary__step-check" /> : <span className="thread-setup-summary__step-alert">!</span>}
                  </div>
                  <div>
                    {!isMvp && <div className="thread-setup-summary__step-label">Step 4</div>}
                    <div className="thread-setup-summary__step-title">
                      {isQuestionnaireComplete
                        ? "Questionnaire complete"
                        : `Questionnaire: ${remainingSections} sections left`}
                    </div>
                  </div>
                </div>
                <button
                  onClick={isQuestionnaireComplete ? onReviewUnderstanding : onContinueQuestionnaire}
                  className={cn(
                    "thread-setup-summary__task-action group",
                    isQuestionnaireComplete ? "thread-setup-summary__task-action--complete" : "thread-setup-summary__task-action--needs-attention"
                  )}
                >
                  {isQuestionnaireComplete ? "Review" : "Complete"} <ArrowRight className="thread-setup-summary__task-arrow" />
                </button>
              </div>

              {/* Step 5: Session */}
              <div className="thread-setup-summary__step">
                <div className={cn(
                  "thread-setup-summary__step-icon",
                  isSessionBooked
                    ? "thread-setup-summary__step-icon--complete"
                    : isSessionCancelled
                    ? "thread-setup-summary__step-icon--cancelled"
                    : "thread-setup-summary__step-icon--warning"
                )}>
                  {isSessionBooked ? <Check className="thread-setup-summary__step-check" /> : <span className="thread-setup-summary__step-alert">!</span>}
                </div>
                <div>
                  {!isMvp && <div className="thread-setup-summary__step-label">Step 5</div>}
                  <div className="thread-setup-summary__step-title">
                    {isSessionBooked ? "Telehealth session booked" : isSessionCancelled ? "Session cancelled" : "Session not booked"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right side: Session Info */}
          <div className="thread-setup-summary__session-column">
            <div className="thread-setup-summary__session-card">
              <div className="thread-setup-summary__session-header">
                <div className="thread-setup-summary__session-icon">
                  <Calendar className="thread-setup-summary__session-icon-svg" />
                </div>
                <div>
                  <div className="thread-setup-summary__step-label">Session</div>
                  <div className="thread-setup-summary__session-date">{sessionDate}</div>
                </div>
              </div>

              <div className="thread-setup-summary__session-details">
                <div className="thread-setup-summary__session-detail">
                  <Clock className="thread-setup-summary__session-detail-icon" />
                  <span>{sessionTime}</span>
                </div>
                <div className="thread-setup-summary__session-detail">
                  <FileText className="thread-setup-summary__session-detail-icon" />
                  <span>{isSessionBooked ? "Telehealth link sent to email" : "No telehealth link active"}</span>
                </div>
              </div>
            </div>

            <div className="thread-setup-summary__note-wrap">
              <p className="thread-setup-summary__note">
                {journeyCopy.nextStep}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
