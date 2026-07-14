import React from "react";
import { ArrowRight, Check, LockKeyhole } from "lucide-react";
import { Button } from "../ui/Button";
import { ModalCloseButton, ModalShell } from "../ui/ModalShell";
import { ModalOutcomeScreen } from "../ui/ModalOutcomeScreen";
import { CLINICIAN_SHARE_PLACEHOLDERS } from "../../lib/clinicianSharing";
import {
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

interface MvpClinicianShareModalProps {
  clinicianName: string;
  clinicianPractice: string;
  clinicianEmail: string;
  sharePermission: boolean;
  shareError: string;
  isConfirmingShare: boolean;
  isOpen: boolean;
  onClinicianNameChange: (value: string) => void;
  onClinicianPracticeChange: (value: string) => void;
  onClinicianEmailChange: (value: string) => void;
  onSharePermissionChange: (value: boolean) => void;
  onBackToDetails: () => void;
  onClose: () => void;
  onReviewShare: (event: React.FormEvent) => void;
  onConfirmShare: () => void;
}

export function MvpClinicianShareModal({
  clinicianName,
  clinicianPractice,
  clinicianEmail,
  sharePermission,
  shareError,
  isConfirmingShare,
  isOpen,
  onClinicianNameChange,
  onClinicianPracticeChange,
  onClinicianEmailChange,
  onSharePermissionChange,
  onBackToDetails,
  onClose,
  onReviewShare,
  onConfirmShare,
}: MvpClinicianShareModalProps) {
  return (
    <ModalShell
      isOpen={isOpen}
      onRequestClose={onClose}
      titleId="clinician-share-modal-title"
      size="small"
      radiusClassName="rounded-none rounded-tr-[32px]"
    >
      <form onSubmit={onReviewShare}>
        <div className="flex items-start justify-between gap-4 border-b border-black/5 px-6 py-5 sm:px-8">
          <div>
            <span className={MODAL_KICKER_CLASS}>
              Share with Your Child&apos;s Clinician
            </span>
            <h2
              id="clinician-share-modal-title"
              className={MODAL_TITLE_CLASS}
            >
              Your Assessment Package is ready
            </h2>
          </div>
          <ModalCloseButton
            onClick={onClose}
            label="Close clinician sharing modal"
            className="cursor-pointer"
          />
        </div>

        <div className="space-y-5 px-6 py-6 sm:px-8">
          {isConfirmingShare ? (
            <ModalOutcomeScreen
              kicker="Confirm"
              icon={<LockKeyhole className="h-7 w-7 stroke-[1.8]" />}
              title="Confirm before sharing"
              description="Please check the recipient details below. When you confirm, Threadline will mark this Assessment Package as shared with your child's clinician."
              className="min-h-0"
            >
              <div className={MODAL_CONFIRM_PANEL_CLASS}>
                <span className={MODAL_CONFIRM_TITLE_CLASS}>
                  Share Assessment Package with:
                </span>
                <dl className="grid gap-3 text-sm">
                  <div>
                    <dt className="text-xs font-medium text-[var(--color-thread-muted-text)]">Clinician</dt>
                    <dd className="mt-0.5 text-[var(--color-thread-dark-slate)]">{clinicianName.trim()}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-[var(--color-thread-muted-text)]">Medical centre</dt>
                    <dd className="mt-0.5 text-[var(--color-thread-dark-slate)]">{clinicianPractice.trim()}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-[var(--color-thread-muted-text)]">Email</dt>
                    <dd className="mt-0.5 break-words text-[var(--color-thread-dark-slate)]">{clinicianEmail.trim()}</dd>
                  </div>
                </dl>
              </div>

              <p className={MODAL_FINE_PRINT_CLASS}>
                Your information is only shared with your permission. You can go back to edit these details before confirming.
              </p>
            </ModalOutcomeScreen>
          ) : (
            <>
              <p className={MODAL_BODY_CLASS}>
                Your Assessment Package is complete and ready to share with your child&apos;s clinician, such as your GP, paediatrician or psychiatrist.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={MODAL_FIELD_LABEL_CLASS} htmlFor="clinician-share-name">
                    Clinician name
                  </label>
                  <input
                    id="clinician-share-name"
                    type="text"
                    placeholder={CLINICIAN_SHARE_PLACEHOLDERS.name}
                    value={clinicianName}
                    onChange={(event) => onClinicianNameChange(event.target.value)}
                    className="thread-input thread-input--default text-sm"
                  />
                </div>
                <div>
                  <label className={MODAL_FIELD_LABEL_CLASS} htmlFor="clinician-share-email">
                    Email address
                  </label>
                  <input
                    id="clinician-share-email"
                    type="email"
                    placeholder={CLINICIAN_SHARE_PLACEHOLDERS.email}
                    value={clinicianEmail}
                    onChange={(event) => onClinicianEmailChange(event.target.value)}
                    className="thread-input thread-input--default text-sm"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className={MODAL_FIELD_LABEL_CLASS} htmlFor="clinician-share-practice">
                    Medical centre
                  </label>
                  <input
                    id="clinician-share-practice"
                    type="text"
                    placeholder={CLINICIAN_SHARE_PLACEHOLDERS.practice}
                    value={clinicianPractice}
                    onChange={(event) => onClinicianPracticeChange(event.target.value)}
                    className="thread-input thread-input--default text-sm"
                  />
                </div>
              </div>

              <div className={MODAL_CONFIRM_PANEL_CLASS}>
                <span className={MODAL_CONFIRM_TITLE_CLASS}>
                  Please confirm:
                </span>
                <label className={MODAL_CONFIRM_ROW_CLASS}>
                  <input
                    type="checkbox"
                    checked={sharePermission}
                    onChange={(event) => onSharePermissionChange(event.target.checked)}
                    className={MODAL_CHECKBOX_CLASS}
                  />
                  <span>
                    I authorise Threadline to securely share my child&apos;s Assessment Package and
                    supporting information with my child&apos;s clinician.
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

          {shareError && (
            <p className="text-xs text-red-500 font-medium">{shareError}</p>
          )}

          <div className="flex flex-wrap items-center justify-end gap-3 pt-1">
            <div className="ml-auto flex flex-wrap gap-3">
              <Button
                type="button"
                variant="tertiary"
                onClick={isConfirmingShare ? onBackToDetails : onClose}
                className={MODAL_SECONDARY_BUTTON_CLASS}
              >
                {isConfirmingShare ? "Back" : "Cancel"}
              </Button>
              {isConfirmingShare ? (
                <Button
                  type="button"
                  variant="primary"
                  className={MODAL_PRIMARY_BUTTON_CLASS}
                  rightIcon={<Check className="w-3.5 h-3.5" />}
                  onClick={onConfirmShare}
                >
                  Confirm and share
                </Button>
              ) : (
                <Button
                  type="submit"
                  variant="primary"
                  className={MODAL_PRIMARY_BUTTON_CLASS}
                  rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                >
                  Review before sharing
                </Button>
              )}
            </div>
          </div>
        </div>
      </form>
    </ModalShell>
  );
}

