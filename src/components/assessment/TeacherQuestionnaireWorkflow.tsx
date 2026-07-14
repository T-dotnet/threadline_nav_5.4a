import React from "react";
import { ArrowRight, Check, FileText, LockKeyhole } from "lucide-react";
import { Button } from "../ui/Button";
import { ModalCloseButton, ModalShell } from "../ui/ModalShell";
import { ModalOutcomeScreen } from "../ui/ModalOutcomeScreen";
import {
  CHECKLIST_DETAIL_WIDTH_CLASS,
  MODAL_BODY_CLASS,
  MODAL_CHECKBOX_CLASS,
  MODAL_CONFIRM_PANEL_CLASS,
  MODAL_CONFIRM_ROW_CLASS,
  MODAL_CONFIRM_TITLE_CLASS,
  MODAL_FIELD_LABEL_CLASS,
  MODAL_FINE_PRINT_CLASS,
  MODAL_KICKER_CLASS,
  MODAL_LINK_BUTTON_CLASS,
  MODAL_PRIMARY_BUTTON_CLASS,
  MODAL_SECONDARY_BUTTON_CLASS,
  MODAL_TITLE_CLASS,
} from "./workflowStyles";

export type TeacherChecklistStatus = "todo" | "sent" | "completed";

interface TeacherContact {
  name: string;
  email: string;
}

interface TeacherChecklistState {
  done: boolean;
  active: boolean;
  todo: boolean;
  meta: string;
  metaTag: string;
}

export function getTeacherChecklistState({
  teacherStatus,
  teacherName,
  teacherEmail,
  isSeededComplete,
}: {
  teacherStatus: TeacherChecklistStatus;
  teacherName: string;
  teacherEmail: string;
  isSeededComplete: boolean;
}): TeacherChecklistState {
  const isComplete = isSeededComplete || teacherStatus === "completed";
  const resolvedTeacherName = teacherName || "Ms. Carter";
  const resolvedTeacherEmail = teacherEmail || "carter@oakwood.edu";

  if (isComplete) {
    return {
      done: true,
      active: false,
      todo: false,
      meta: `Completed by ${resolvedTeacherName} (${resolvedTeacherEmail})`,
      metaTag: "Completed",
    };
  }

  if (teacherStatus === "sent") {
    return {
      done: false,
      active: true,
      todo: false,
      meta: `Invitation sent to ${resolvedTeacherName} (${resolvedTeacherEmail})`,
      metaTag: "Pending Response",
    };
  }

  return {
    done: false,
    active: false,
    todo: true,
    meta: "Share link to the modules with homeroom teacher",
    metaTag: "To do",
  };
}

interface TeacherQuestionnaireChecklistContentProps {
  childName: string;
  teacherStatus: TeacherChecklistStatus;
  teacherName: string;
  teacherEmail: string;
  teacherMessage: string;
  teacherInviteError: string;
  teacherContactPermission: boolean;
  teacherAssessmentPermission: boolean;
  primaryTeacher?: TeacherContact;
  isSeededComplete: boolean;
  isInviteModalOpen: boolean;
  isConfirmingInvite: boolean;
  onTeacherNameChange: (value: string) => void;
  onTeacherEmailChange: (value: string) => void;
  onTeacherMessageChange: (value: string) => void;
  onTeacherContactPermissionChange: (value: boolean) => void;
  onTeacherAssessmentPermissionChange: (value: boolean) => void;
  onOpenTeacherInvite: () => void;
  onCloseTeacherInvite: () => void;
  onReviewTeacherInvite: (event: React.FormEvent) => void;
  onBackToTeacherInviteDetails: () => void;
  onConfirmTeacherInvite: () => void;
  onSimulateTeacherResponse: () => void;
  onResetTeacherStatus: () => void;
  layout?: "default" | "unboxed";
}

export function TeacherQuestionnaireChecklistContent({
  childName,
  teacherStatus,
  teacherName,
  teacherEmail,
  teacherMessage,
  teacherInviteError,
  teacherContactPermission,
  teacherAssessmentPermission,
  primaryTeacher,
  isSeededComplete,
  isInviteModalOpen,
  isConfirmingInvite,
  onTeacherNameChange,
  onTeacherEmailChange,
  onTeacherMessageChange,
  onTeacherContactPermissionChange,
  onTeacherAssessmentPermissionChange,
  onOpenTeacherInvite,
  onCloseTeacherInvite,
  onReviewTeacherInvite,
  onBackToTeacherInviteDetails,
  onConfirmTeacherInvite,
  onSimulateTeacherResponse,
  onResetTeacherStatus,
  layout = "default",
}: TeacherQuestionnaireChecklistContentProps) {
  const isComplete = isSeededComplete || teacherStatus === "completed";
  const resolvedTeacherName = teacherName || "Ms. Carter";
  const resolvedTeacherEmail = teacherEmail || "carter@oakwood.edu";
  const isUnboxedLayout = layout === "unboxed";
  const statePanelClassName = [
    "w-full space-y-4 font-sans mt-2",
    isUnboxedLayout
      ? "max-w-xl"
      : "bg-[var(--color-thread-off-white)] p-5 rounded-none rounded-tr-[32px]",
  ].filter(Boolean).join(" ");
  const completedPanelClassName = [
    `${CHECKLIST_DETAIL_WIDTH_CLASS} space-y-2 mt-4`,
  ].join(" ");

  return (
    <div className={isUnboxedLayout ? "max-w-[62ch] space-y-4 pt-1" : "space-y-4 pt-1"}>
      <p className="text-sm text-slate-600 leading-relaxed font-sans">
        To understand how {childName} performs in structured school environments, we require observations from their classroom teacher. Send a secure, direct link to the educational checklist when you are ready.
      </p>

      {isComplete && (
        <div className={completedPanelClassName}>
          <span className="text-[var(--color-thread-muted-text)] block uppercase font-medium tracking-wider text-xs mb-2 font-sans">shared with teacher</span>
          <div className="flex items-center gap-2.5 text-xs text-slate-700 bg-slate-50 px-3 py-2.5 rounded-xl font-sans">
            <FileText className="w-4 h-4 text-[var(--color-thread-mid-green)] shrink-0" />
            <span className="font-medium truncate">Classroom focus &amp; attention questionnaire</span>
            <span className="text-[var(--color-thread-muted-text)] text-xs ml-auto shrink-0">Shared</span>
          </div>
          {!isSeededComplete && (
            <button
              onClick={onResetTeacherStatus}
              className="text-xs text-[var(--color-thread-muted-text)] font-medium hover:text-slate-800 underline transition-colors"
            >
              Reset / Invite Another Teacher
            </button>
          )}
        </div>
      )}

      {teacherStatus === "todo" && !isSeededComplete && (
        <div className={statePanelClassName}>
          <div>
            <span className="text-[var(--color-thread-muted-text)] block uppercase font-medium tracking-wider text-xs mb-2">
              Teacher questionnaire
            </span>
            <p className="text-xs text-slate-600 leading-relaxed">
              Add the teacher&apos;s contact details and an optional note before the invitation is sent.
            </p>
          </div>
          <Button
            type="button"
            variant="secondary"
            onClick={onOpenTeacherInvite}
            className="text-xs h-9 px-4 font-medium rounded-full cursor-pointer inline-flex items-center gap-1.5"
          >
            <span>Send Questionnaire Invitation</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      )}

      {teacherStatus === "sent" && !isSeededComplete && (
        <div className={statePanelClassName}>
          <div className="flex items-center justify-between gap-3">
            <span className="text-[var(--color-thread-muted-text)] block uppercase font-medium tracking-wider text-xs">
              Invitation Active
            </span>
            <span className="text-xs text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full font-medium border border-amber-100">
              Awaiting teacher response
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            An invitation with a unique questionnaire token was emailed to <strong className="text-slate-800">{resolvedTeacherName}</strong> (<span className="text-[var(--color-thread-muted-text)]">{resolvedTeacherEmail}</span>). Once submitted, their classroom observations will automatically merge here.
          </p>
          {teacherMessage.trim() && (
            <p className="text-xs text-slate-600 leading-relaxed border-l-2 border-[var(--color-thread-mid-green)]/30 pl-3">
              Your message: &ldquo;{teacherMessage.trim()}&rdquo;
            </p>
          )}

          <div className="pt-2 flex flex-wrap gap-3">
            <Button
              variant="primary"
              onClick={onSimulateTeacherResponse}
              className="text-xs h-9 px-4 font-medium rounded-full cursor-pointer"
            >
              Simulate Teacher Response (Mark Done)
            </Button>
            <Button
              variant="tertiary"
              onClick={onResetTeacherStatus}
              className="text-xs h-9 px-4 font-medium rounded-full cursor-pointer"
            >
              Cancel / Reset
            </Button>
          </div>
        </div>
      )}

      <ModalShell
        isOpen={isInviteModalOpen}
        onRequestClose={onCloseTeacherInvite}
        titleId="teacher-invite-modal-title"
        size="small"
        radiusClassName="rounded-none rounded-tr-[32px]"
      >
        <form onSubmit={onReviewTeacherInvite}>
          <div className="flex items-start justify-between gap-4 border-b border-black/5 px-6 py-5 sm:px-8">
            <div>
              <span className={MODAL_KICKER_CLASS}>
                Teacher questionnaire
              </span>
              <h2
                id="teacher-invite-modal-title"
                className={MODAL_TITLE_CLASS}
              >
                Invite your child&apos;s teacher
              </h2>
            </div>
            <ModalCloseButton
              onClick={onCloseTeacherInvite}
              label="Close teacher invitation modal"
              className="cursor-pointer"
            />
          </div>

          <div className="space-y-5 px-6 py-6 sm:px-8">
            {isConfirmingInvite ? (
              <ModalOutcomeScreen
                kicker="Confirm"
                icon={<LockKeyhole className="h-7 w-7 stroke-[1.8]" />}
                title="Confirm teacher invitation"
                description="Please check the recipient details below. When you confirm, Threadline will send the secure teacher questionnaire invitation."
                className="min-h-0"
              >
                <div className={MODAL_CONFIRM_PANEL_CLASS}>
                  <span className={MODAL_CONFIRM_TITLE_CLASS}>
                    Send teacher questionnaire to:
                  </span>
                  <dl className="grid gap-3 text-sm">
                    <div>
                      <dt className="text-xs font-medium text-[var(--color-thread-muted-text)]">Teacher</dt>
                      <dd className="mt-0.5 text-[var(--color-thread-dark-slate)]">{teacherName.trim()}</dd>
                    </div>
                    <div>
                      <dt className="text-xs font-medium text-[var(--color-thread-muted-text)]">Email</dt>
                      <dd className="mt-0.5 break-words text-[var(--color-thread-dark-slate)]">{teacherEmail.trim()}</dd>
                    </div>
                    {teacherMessage.trim() && (
                      <div>
                        <dt className="text-xs font-medium text-[var(--color-thread-muted-text)]">Message</dt>
                        <dd className="mt-0.5 text-[var(--color-thread-dark-slate)]">&ldquo;{teacherMessage.trim()}&rdquo;</dd>
                      </div>
                    )}
                  </dl>
                </div>
                <p className={MODAL_FINE_PRINT_CLASS}>
                  Your information is only shared with your permission. You can go back to edit these details before confirming.
                </p>
              </ModalOutcomeScreen>
            ) : (
              <>
                <p className={MODAL_BODY_CLASS}>
                  We&apos;ll send your child&apos;s teacher a secure link to complete a questionnaire.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={MODAL_FIELD_LABEL_CLASS} htmlFor="teacher-invite-name">
                      Teacher name
                    </label>
                    <input
                      id="teacher-invite-name"
                      type="text"
                      placeholder="e.g. Ms. Carter"
                      value={teacherName}
                      onChange={(event) => onTeacherNameChange(event.target.value)}
                      className="thread-input thread-input--default text-sm"
                    />
                  </div>
                  <div>
                    <label className={MODAL_FIELD_LABEL_CLASS} htmlFor="teacher-invite-email">
                      Teacher email
                    </label>
                    <input
                      id="teacher-invite-email"
                      type="email"
                      placeholder="e.g. carter@oakwood.edu"
                      value={teacherEmail}
                      onChange={(event) => onTeacherEmailChange(event.target.value)}
                      className="thread-input thread-input--default text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className={MODAL_FIELD_LABEL_CLASS} htmlFor="teacher-invite-message">
                    Short message <span className="font-normal text-[var(--color-thread-muted-text)]">(optional)</span>
                  </label>
                  <textarea
                    id="teacher-invite-message"
                    rows={4}
                    maxLength={280}
                    placeholder="Add a short note for the teacher."
                    value={teacherMessage}
                    onChange={(event) => onTeacherMessageChange(event.target.value)}
                    className="thread-textarea thread-textarea--soft thread-textarea--compact"
                  />
                  <p className="mt-1.5 text-xs text-[var(--color-thread-muted-text)]">{teacherMessage.length}/280</p>
                </div>

                <div className={MODAL_CONFIRM_PANEL_CLASS}>
                  <span className={MODAL_CONFIRM_TITLE_CLASS}>
                    Please confirm:
                  </span>
                  <label className={MODAL_CONFIRM_ROW_CLASS}>
                    <input
                      type="checkbox"
                      checked={teacherContactPermission}
                      onChange={(event) => onTeacherContactPermissionChange(event.target.checked)}
                      className={MODAL_CHECKBOX_CLASS}
                    />
                    <span>
                      I have permission to provide my child&apos;s teacher&apos;s contact details.
                    </span>
                  </label>
                  <label className={MODAL_CONFIRM_ROW_CLASS}>
                    <input
                      type="checkbox"
                      checked={teacherAssessmentPermission}
                      onChange={(event) => onTeacherAssessmentPermissionChange(event.target.checked)}
                      className={MODAL_CHECKBOX_CLASS}
                    />
                    <span>
                      I authorise Threadline to contact my child&apos;s teacher to collect assessment information.
                    </span>
                  </label>
                  <p className={MODAL_FINE_PRINT_CLASS}>
                    Learn more:{" "}
                    <button
                      type="button"
                      className={MODAL_LINK_BUTTON_CLASS}
                    >
                      Privacy Policy
                    </button>
                  </p>
                  <p className={MODAL_FINE_PRINT_CLASS}>
                    Your information is only shared with your permission.
                  </p>
                </div>
              </>
            )}

            {teacherInviteError && (
              <p className="text-xs text-red-500 font-medium">{teacherInviteError}</p>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              {primaryTeacher && teacherName !== primaryTeacher.name && (
                <button
                  type="button"
                  onClick={() => {
                    onTeacherNameChange(primaryTeacher.name);
                    onTeacherEmailChange(primaryTeacher.email);
                  }}
                  className="text-xs text-[var(--color-thread-mid-green)] font-medium hover:underline"
                >
                  Quick select {primaryTeacher.name} (Teacher)
                </button>
              )}
              <div className="ml-auto flex flex-wrap gap-3">
                <Button
                  type="button"
                  variant="tertiary"
                  onClick={isConfirmingInvite ? onBackToTeacherInviteDetails : onCloseTeacherInvite}
                  className={MODAL_SECONDARY_BUTTON_CLASS}
                >
                  {isConfirmingInvite ? "Back" : "Cancel"}
                </Button>
                {isConfirmingInvite ? (
                  <Button
                    type="button"
                    variant="primary"
                    className={MODAL_PRIMARY_BUTTON_CLASS}
                    rightIcon={<Check className="w-3.5 h-3.5" />}
                    onClick={onConfirmTeacherInvite}
                  >
                    Confirm and send
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    variant="primary"
                    className={MODAL_PRIMARY_BUTTON_CLASS}
                    rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                  >
                    Review before sending
                  </Button>
                )}
              </div>
            </div>
          </div>
        </form>
      </ModalShell>
    </div>
  );
}

