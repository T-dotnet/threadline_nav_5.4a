import React from "react";
import { ArrowRight, Check, Info, LockKeyhole, Tag } from "lucide-react";
import { Button } from "../ui/Button";
import { ClinicalHighlight } from "../ui/ClinicalHighlight";
import { ModalCloseButton, ModalShell } from "../ui/ModalShell";
import { ProcessStepperSidebar } from "../ui/ProcessStepperSidebar";
import {
  DIAGNOSTIC_ASSESSMENT_PRICE,
  DIAGNOSTIC_DISCOUNT_CODE_EXAMPLE,
  DIAGNOSTIC_DISCOUNT_CODES,
  type DiagnosticDiscountCode,
  formatAssessmentPackagePrice,
} from "../../lib/assessmentCheckout";
import { cn } from "../../lib/utils";
import {
  CHECKOUT_ICON_BUTTON_CLASS,
  CHECKOUT_SAVE_CARD_CLASS,
  CHECKOUT_SUMMARY_META_CLASS,
  CHECKOUT_SUMMARY_PANEL_CLASS,
  CHECKOUT_SUMMARY_ROW_CLASS,
  CHECKOUT_TOOLTIP_CLASS,
  CHECKOUT_TOTAL_ROW_CLASS,
  MODAL_ATTACHED_HIGHLIGHT_CLASS,
  MODAL_ATTACHED_HIGHLIGHT_ICON_CLASS,
  MODAL_CHECKBOX_CLASS,
  MODAL_CONFIRM_TITLE_CLASS,
  MODAL_FIELD_LABEL_CLASS,
  MODAL_FINE_PRINT_CLASS,
  MODAL_KICKER_CLASS,
  MODAL_LINK_BUTTON_CLASS,
  MODAL_TITLE_CLASS,
} from "./workflowStyles";

type DiagnosticCheckoutStep = "legal" | "payment" | "complete";
type RequiredThreadConsent = "guardian" | "medical" | "terms";
type OptionalThreadConsent = "improveThreadline" | "improveAssessment";

const DEFAULT_REQUIRED_THREAD_CONSENTS: Record<RequiredThreadConsent, boolean> = {
  guardian: false,
  medical: false,
  terms: false,
};

const DEFAULT_OPTIONAL_THREAD_CONSENTS: Record<OptionalThreadConsent, boolean> = {
  improveThreadline: false,
  improveAssessment: false,
};

const DIAGNOSTIC_PERMISSION_NEXT_STEPS = [
  {
    title: "Uploading documents",
    text: "Confirm you have the right to upload and share documents before they become part of your child's Thread.",
  },
  {
    title: "Teacher invitation",
    text: "Confirm permission to provide teacher contact details before Threadline sends the secure questionnaire link.",
  },
  {
    title: "Share with Your Child's Clinician",
    text: "Confirm authorisation before the Assessment Package is securely shared with your child's clinician, such as your GP, paediatrician or psychiatrist.",
  },
];

const DIAGNOSTIC_CHECKOUT_STEPS = [
  { num: 1, title: "Legal", desc: "Create your Thread" },
  { num: 2, title: "Payment", desc: "Secure checkout" },
  { num: 3, title: "Continue", desc: "Ready for next steps" },
];

interface MvpDiagnosticCheckoutModalProps {
  childName: string;
  isOpen: boolean;
  onClose: () => void;
  onContinue: () => void;
}

export function MvpDiagnosticCheckoutModal({
  childName,
  isOpen,
  onClose,
  onContinue,
}: MvpDiagnosticCheckoutModalProps) {
  const [step, setStep] = React.useState<DiagnosticCheckoutStep>("legal");
  const [requiredConsents, setRequiredConsents] = React.useState(DEFAULT_REQUIRED_THREAD_CONSENTS);
  const [optionalConsents, setOptionalConsents] = React.useState(DEFAULT_OPTIONAL_THREAD_CONSENTS);
  const [discountCode, setDiscountCode] = React.useState("");
  const [appliedDiscountCode, setAppliedDiscountCode] = React.useState<DiagnosticDiscountCode | null>(null);
  const [discountError, setDiscountError] = React.useState("");
  const [saveCardForCheckout, setSaveCardForCheckout] = React.useState(true);

  React.useEffect(() => {
    if (isOpen) return;
    setStep("legal");
    setRequiredConsents(DEFAULT_REQUIRED_THREAD_CONSENTS);
    setOptionalConsents(DEFAULT_OPTIONAL_THREAD_CONSENTS);
    setDiscountCode("");
    setAppliedDiscountCode(null);
    setDiscountError("");
    setSaveCardForCheckout(true);
  }, [isOpen]);

  const canCreateThread = Object.values(requiredConsents).every(Boolean);
  const appliedDiscount = appliedDiscountCode ? DIAGNOSTIC_DISCOUNT_CODES[appliedDiscountCode] : null;
  const discountAmount = appliedDiscount
    ? Math.round(DIAGNOSTIC_ASSESSMENT_PRICE * (appliedDiscount.percentage / 100))
    : 0;
  const total = DIAGNOSTIC_ASSESSMENT_PRICE - discountAmount;
  const formattedTotal = formatAssessmentPackagePrice(total);
  const formattedPaymentTotal = formatAssessmentPackagePrice(total, true);
  const checkoutActiveStep = step === "legal" ? 1 : step === "payment" ? 2 : 3;

  const toggleRequiredConsent = (key: RequiredThreadConsent) => {
    setRequiredConsents((current) => ({
      ...current,
      [key]: !current[key],
    }));
  };

  const toggleOptionalConsent = (key: OptionalThreadConsent) => {
    setOptionalConsents((current) => ({
      ...current,
      [key]: !current[key],
    }));
  };

  const handleApplyDiscount = () => {
    const normalizedCode = discountCode.trim().toUpperCase() as DiagnosticDiscountCode;

    if (!normalizedCode) {
      setDiscountError("Enter a discount code first.");
      setAppliedDiscountCode(null);
      return;
    }

    if (!DIAGNOSTIC_DISCOUNT_CODES[normalizedCode]) {
      setDiscountError(`That code is not active. Try ${DIAGNOSTIC_DISCOUNT_CODE_EXAMPLE}.`);
      setAppliedDiscountCode(null);
      return;
    }

    setDiscountError("");
    setAppliedDiscountCode(normalizedCode);
    setDiscountCode(normalizedCode);
  };

  const handleContinue = () => {
    onClose();
    onContinue();
  };

  const requiredConsentRows: Array<{ id: RequiredThreadConsent; label: React.ReactNode }> = [
    {
      id: "guardian",
      label: "I am the parent or legal guardian of this child, or I have authority to provide this information.",
    },
    {
      id: "medical",
      label: "I understand Threadline helps prepare an Assessment Package and does not diagnose ADHD or provide medical advice.",
    },
    {
      id: "terms",
      label: (
        <>
          I have read and agree to the{" "}
          <button type="button" className="font-medium text-[var(--color-thread-mid-green)] underline decoration-[var(--color-thread-mid-green)]/30 underline-offset-2">
            Terms of Use
          </button>{" "}
          and{" "}
          <button type="button" className="font-medium text-[var(--color-thread-mid-green)] underline decoration-[var(--color-thread-mid-green)]/30 underline-offset-2">
            Privacy Policy
          </button>
          .
        </>
      ),
    },
  ];

  return (
    <ModalShell
      isOpen={isOpen}
      onRequestClose={onClose}
      titleId="diagnostic-checkout-title"
      maxWidthClassName="max-w-5xl"
      radiusClassName="rounded-none rounded-tr-[32px]"
      panelClassName="overflow-hidden"
    >
      <div className="grid min-h-0 grid-cols-[300px_minmax(0,1fr)] bg-white md:min-h-[620px] max-md:grid-cols-1">
        <ProcessStepperSidebar
          activeStep={checkoutActiveStep}
          heading="Diagnostic checkout"
          steps={DIAGNOSTIC_CHECKOUT_STEPS}
          side="left"
        />

        <div className="flex min-h-0 flex-col">
          <div className="flex items-start justify-between gap-4 border-b border-black/5 px-6 py-5 sm:px-8">
            <div>
              <span className={MODAL_KICKER_CLASS}>
                {step === "legal" ? "Create your Thread" : step === "payment" ? "Secure checkout" : "Thread created"}
              </span>
              <h2
                id="diagnostic-checkout-title"
                className={MODAL_TITLE_CLASS}
              >
                {step === "legal"
                  ? "Before you continue, please confirm."
                  : step === "payment"
                  ? "Choose your price and complete payment."
                  : "You are ready to keep going."}
              </h2>
            </div>
            <ModalCloseButton
              onClick={onClose}
              label="Close diagnostic checkout"
              className="cursor-pointer"
            />
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-8">
            {step === "legal" && (
              <div className="space-y-7">
                <ClinicalHighlight
                  className={MODAL_ATTACHED_HIGHLIGHT_CLASS}
                  icon={<LockKeyhole className="h-5 w-5" />}
                  iconClassName={MODAL_ATTACHED_HIGHLIGHT_ICON_CLASS}
                >
                  We ask these first so every Thread begins with permission, clarity, and plain-language expectations.
                </ClinicalHighlight>

                <div className="space-y-3">
                  {requiredConsentRows.map((item) => (
                    <label
                      key={item.id}
                      className="flex cursor-pointer gap-3 rounded-xl bg-slate-50 p-4 text-sm leading-relaxed text-slate-700 transition-colors hover:bg-slate-100"
                    >
                      <input
                        type="checkbox"
                        checked={requiredConsents[item.id]}
                        onChange={() => toggleRequiredConsent(item.id)}
                        className="mt-0.5 h-4 w-4 rounded border-slate-300 accent-[var(--color-thread-mid-green)]"
                      />
                      <span>{item.label}</span>
                    </label>
                  ))}
                </div>

                <div className="border-t border-black/10 py-6 px-0.5">
                  <p className="mb-3 text-sm font-medium leading-relaxed text-slate-700">
                    Help us improve Threadline and future ADHD assessment (optional).
                  </p>
                  <div className="grid gap-3">
                    <label className="flex cursor-pointer gap-3 rounded-xl bg-slate-50 p-4 text-sm leading-relaxed text-slate-700 transition-colors hover:bg-slate-100">
                        <input
                          type="checkbox"
                          checked={optionalConsents.improveThreadline}
                          onChange={() => toggleOptionalConsent("improveThreadline")}
                          className="mt-0.5 h-4 w-4 rounded border-slate-300 accent-[var(--color-thread-mid-green)]"
                        />
                        <span>
                          Use de-identified information to improve Threadline and develop future assessment and care technologies.
                          <span className="mt-1 block text-xs font-medium text-[var(--color-thread-mid-green)]">Learn more: Research &amp; Improvement Policy</span>
                        </span>
                    </label>

                    <label className="flex cursor-pointer gap-3 rounded-xl bg-slate-50 p-4 text-sm leading-relaxed text-slate-700 transition-colors hover:bg-slate-100">
                        <input
                          type="checkbox"
                          checked={optionalConsents.improveAssessment}
                          onChange={() => toggleOptionalConsent("improveAssessment")}
                          className="mt-0.5 h-4 w-4 rounded border-slate-300 accent-[var(--color-thread-mid-green)]"
                        />
                        <span>
                          Use de-identified information to support ethically approved research that helps improve ADHD assessment and care.
                          <span className="mt-1 block text-xs font-medium text-[var(--color-thread-mid-green)]">Learn more: Research &amp; Improvement Policy</span>
                        </span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {step === "payment" && (
              <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_310px]">
                <div className="space-y-5">
                  <div className="grid gap-4">
                    <div>
                      <label className={MODAL_FIELD_LABEL_CLASS} htmlFor="diagnostic-card-name">
                        Name on card
                      </label>
                      <input
                        id="diagnostic-card-name"
                        className="thread-input thread-input--default"
                        placeholder="Taylor Morgan"
                      />
                    </div>
                    <div>
                      <label className={MODAL_FIELD_LABEL_CLASS} htmlFor="diagnostic-card-number">
                        Card number
                      </label>
                      <input
                        id="diagnostic-card-number"
                        className="thread-input thread-input--default"
                        placeholder="4242 4242 4242 4242"
                      />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className={MODAL_FIELD_LABEL_CLASS} htmlFor="diagnostic-card-expiry">
                          Expiry
                        </label>
                        <input
                          id="diagnostic-card-expiry"
                          className="thread-input thread-input--default"
                          placeholder="12 / 30"
                        />
                      </div>
                      <div>
                        <label className={MODAL_FIELD_LABEL_CLASS} htmlFor="diagnostic-card-cvc">
                          CVC
                        </label>
                        <input
                          id="diagnostic-card-cvc"
                          className="thread-input thread-input--default"
                          placeholder="123"
                        />
                      </div>
                    </div>
                    <label className={CHECKOUT_SAVE_CARD_CLASS}>
                      <input
                        type="checkbox"
                        checked={saveCardForCheckout}
                        onChange={() => setSaveCardForCheckout((current) => !current)}
                        className={MODAL_CHECKBOX_CLASS}
                      />
                      <span className="min-w-0">
                        <span className={MODAL_CONFIRM_TITLE_CLASS}>
                          Save my card for faster checkout next time
                        </span>
                        <span className={cn(MODAL_FINE_PRINT_CLASS, "mt-0.5 block")}>
                          Your card details are saved securely with Stripe.
                        </span>
                      </span>
                    </label>
                  </div>
                </div>

                <aside className={CHECKOUT_SUMMARY_PANEL_CLASS}>
                  <div>
                    <h3 className="text-base font-medium text-[var(--color-thread-heading)]">
                      Order summary for {childName}.
                    </h3>
                  </div>

                  <div className="space-y-2 border-y border-black/5 py-4 text-sm">
                    <div className={CHECKOUT_SUMMARY_ROW_CLASS}>
                      <span className="min-w-0">
                        <span className="inline-flex items-center gap-1.5">
                          <span>Assessment Package</span>
                          <span className="group relative inline-flex">
                            <button
                              type="button"
                              aria-label="What is included in the Assessment Package?"
                              className={CHECKOUT_ICON_BUTTON_CLASS}
                            >
                              <Info className="h-3.5 w-3.5" aria-hidden="true" />
                            </button>
                            <span
                              role="tooltip"
                              className={CHECKOUT_TOOLTIP_CLASS}
                            >
                              Includes your completed questionnaires, uploaded documents, and plain-language summary to support conversations with your child&apos;s clinician. It does not diagnose ADHD.
                            </span>
                          </span>
                        </span>
                        <span className={CHECKOUT_SUMMARY_META_CLASS}>One-time payment</span>
                      </span>
                      <span>{formatAssessmentPackagePrice(DIAGNOSTIC_ASSESSMENT_PRICE)}</span>
                    </div>
                    {appliedDiscount && (
                      <div className="flex justify-between gap-4 text-[var(--color-thread-mid-green)]">
                        <span>{appliedDiscount.label}</span>
                        <span>-{formatAssessmentPackagePrice(discountAmount)}</span>
                      </div>
                    )}
                    <div className={CHECKOUT_TOTAL_ROW_CLASS}>
                      <span>Total</span>
                      <span>{formattedTotal}</span>
                    </div>
                    <p className="text-right text-xs text-[var(--color-thread-muted-text)]">Includes GST</p>
                  </div>

                  <div>
                    <label className={MODAL_FIELD_LABEL_CLASS} htmlFor="diagnostic-discount-code">
                      Discount code
                    </label>
                    <div className="flex gap-2">
                      <input
                        id="diagnostic-discount-code"
                        value={discountCode}
                        onChange={(event) => {
                          setDiscountCode(event.target.value);
                          setDiscountError("");
                        }}
                        className="thread-input thread-input--default h-10 text-sm"
                        placeholder={DIAGNOSTIC_DISCOUNT_CODE_EXAMPLE}
                      />
                      <Button
                        type="button"
                        variant="tertiary"
                        onClick={handleApplyDiscount}
                        className="h-10 min-h-10 px-3 text-xs"
                        aria-label="Apply discount code"
                      >
                        <Tag className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                    {discountError && (
                      <p className="mt-2 text-xs font-medium text-red-500">{discountError}</p>
                    )}
                    {appliedDiscount && (
                      <p className="mt-2 text-xs font-medium text-[var(--color-thread-mid-green)]">
                        {appliedDiscount.percentage}% discount applied.
                      </p>
                    )}
                  </div>
                </aside>
              </div>
            )}

            {step === "complete" && (
              <div className="space-y-6">
                <div className="rounded-none rounded-tr-[32px] bg-[var(--color-thread-light-green)] p-6">
                  <div className="flex items-start gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--color-thread-mid-green)] text-white">
                      <Check className="h-5 w-5 stroke-[3]" />
                    </span>
                    <div>
                      <h3 className="text-lg font-medium text-[var(--color-thread-heading)]">
                        {childName}&apos;s Thread is ready.
                      </h3>
                      <p className="mt-1 max-w-[62ch] text-sm leading-relaxed text-slate-700">
                        Payment was completed successfully. The next steps will ask for permission at the exact moment information is uploaded, requested, or shared.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-medium text-[var(--color-thread-heading)]">
                    Permissions you will see later
                  </h3>
                  <div className="mt-4 grid gap-3">
                    {DIAGNOSTIC_PERMISSION_NEXT_STEPS.map((item) => (
                      <div key={item.title} className="rounded-xl bg-slate-50 p-4">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-sm font-medium text-slate-950">{item.title}</h4>
                        </div>
                        <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-black/5 px-6 py-5 sm:px-8">
            {step !== "payment" && (
              <p className="text-xs leading-relaxed text-[var(--color-thread-muted-text)]">
                Your information is only shared with your permission.
              </p>
            )}
            <div
              className={cn(
                "ml-auto flex w-full flex-col gap-3",
                step === "payment" ? "sm:w-full sm:items-stretch" : "sm:w-auto sm:flex-row sm:items-center",
              )}
            >
              {step !== "complete" && step !== "payment" && (
                <Button
                  type="button"
                  variant="tertiary"
                  onClick={onClose}
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>
              )}
              {step === "legal" && (
                <Button
                  type="button"
                  variant="primary"
                  disabled={!canCreateThread}
                  onClick={() => setStep("payment")}
                  className="w-full sm:w-auto"
                  rightIcon={<ArrowRight className="h-5 w-5" />}
                >
                  Create my Thread
                </Button>
              )}
              {step === "payment" && (
                <div className="grid w-full gap-3">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
                    <Button
                      type="button"
                      variant="tertiary"
                      onClick={onClose}
                      className="w-full sm:w-auto"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      variant="primary"
                      onClick={() => setStep("complete")}
                      className="h-11 w-full justify-center px-5 text-sm font-medium sm:w-auto sm:min-w-[260px]"
                      leftIcon={<LockKeyhole className="h-4 w-4" />}
                    >
                      Pay {formattedPaymentTotal}
                    </Button>
                  </div>
                  <p className={cn(MODAL_FINE_PRINT_CLASS, "mt-2 w-full max-w-none text-left")}>
                    By completing your purchase, you agree to our{" "}
                    <button
                      type="button"
                      className={MODAL_LINK_BUTTON_CLASS}
                    >
                      Terms of Use
                    </button>{" "}
                    and{" "}
                    <button
                      type="button"
                      className={MODAL_LINK_BUTTON_CLASS}
                    >
                      Privacy Policy
                    </button>
                    .
                  </p>
                </div>
              )}
              {step === "complete" && (
                <Button
                  type="button"
                  variant="primary"
                  onClick={handleContinue}
                  className="w-full sm:w-auto"
                  rightIcon={<ArrowRight className="h-5 w-5" />}
                >
                  Continue
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </ModalShell>
  );
}
