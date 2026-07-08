import { motion } from "motion/react";
import { ArrowLeft, Clock } from "lucide-react";
import { cn } from "../../lib/utils";
import { DEFAULT_CLINICIAN_NAME, DEFAULT_CLINICIAN_SHORT_NAME } from "../../lib/clinicalProvider";
import { SESSION_TIMES } from "../../lib/sessionDefaults";
import { Button } from "../ui/Button";
import { Label } from "../ui/Label";
import { useDisplayMode } from "../../context/DisplayModeContext";
import clinicianPhoto from "../../assets/images/optimized/dr-naomi-clark-720.jpg";

const SESSION_DAYS = [
  { dow: "Tue", num: "24", mon: "Jun" },
  { dow: "Wed", num: "25", mon: "Jun" },
  { dow: "Thu", num: "26", mon: "Jun" },
  { dow: "Fri", num: "27", mon: "Jun" },
  { dow: "Mon", num: "30", mon: "Jun" },
];

interface SetupSessionStepProps {
  firstName: string;
  sessionDay: string;
  sessionTime: string;
  isDirectSessionModal: boolean;
  isAppointmentCancelled: boolean;
  isCancelConfirmOpen: boolean;
  isReadyToBook: boolean | null;
  hasCurrentAppointment: boolean;
  currentAppointmentDate: string;
  currentAppointmentTime: string;
  sectionKickerClass: string;
  stepHeadingClass: string;
  stepLeadClass: string;
  onReadyToBookChange: (isReady: boolean) => void;
  onSessionDaySelect: (sessionDay: string) => void;
  onSessionTimeSelect: (sessionTime: string) => void;
  onCancelConfirmOpenChange: (isOpen: boolean) => void;
  onCancelAppointment: () => void;
  onConfirmBooking: () => void;
  onBack: () => void;
}

export function SetupSessionStep({
  firstName,
  sessionDay,
  sessionTime,
  isDirectSessionModal,
  isAppointmentCancelled,
  isCancelConfirmOpen,
  isReadyToBook,
  hasCurrentAppointment,
  currentAppointmentDate,
  currentAppointmentTime,
  sectionKickerClass,
  stepHeadingClass,
  stepLeadClass,
  onReadyToBookChange,
  onSessionDaySelect,
  onSessionTimeSelect,
  onCancelConfirmOpenChange,
  onCancelAppointment,
  onConfirmBooking,
  onBack,
}: SetupSessionStepProps) {
  const { isMvp } = useDisplayMode();
  const childLabel = firstName || "your child";

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div>
        {!isDirectSessionModal && !isMvp && (
          <span className={sectionKickerClass}>Step 5 of 5 · Your session</span>
        )}
        <h1 className={stepHeadingClass}>{isDirectSessionModal ? "Reschedule your appointment" : "Book your appointment"}</h1>
        <p className={stepLeadClass}>
          {isDirectSessionModal
            ? "Choose a new time for the first clinician appointment. Your intake details stay saved."
            : "A clinician appointment helps us use your information in the right way. Are you ready to choose a time now?"}
        </p>
      </div>

      {isDirectSessionModal && isAppointmentCancelled && (
        <div className="rounded-tr-[24px] bg-[var(--color-thread-light-green)]/60 p-4 text-sm text-[var(--style-light-surface-text)]">
          Appointment cancelled. You can choose a new time below, or close this window.
        </div>
      )}

      {isDirectSessionModal && !isAppointmentCancelled && hasCurrentAppointment && (
        <div className="border-b border-black/10 pb-6">
          <span className="text-[0.66rem] uppercase tracking-[0.14em] text-[var(--color-thread-mid-green)] font-medium">
            Current appointment
          </span>
          <div className="mt-2 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
            <div>
              <div className="font-serif text-[1.6rem] leading-tight tracking-tight text-[var(--color-thread-heading)]">
                {currentAppointmentDate}
              </div>
              <div className="mt-1 text-sm text-slate-500">
                {currentAppointmentTime} · Telehealth with {DEFAULT_CLINICIAN_NAME}
              </div>
            </div>
            <span className="text-[0.78rem] text-slate-400">
              Choose a new slot below to replace this time.
            </span>
          </div>
        </div>
      )}

      {isReadyToBook === null ? (
        <div className="space-y-6 bg-[var(--color-thread-off-white)]/70 p-8 rounded-[24px]">
          <div className="space-y-4">
            <p className="text-[1rem] text-[var(--color-thread-dark-slate)]">If you’d like, we can book your appointment now. Otherwise, we’ll save your progress and send an email reminder so you can book it later.</p>
            <p className="text-sm text-slate-500">You can still finish the setup now and return to booking anytime.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="primary"
              onClick={() => onReadyToBookChange(true)}
              className="px-6 py-3"
            >
              Yes, book now
            </Button>
            <Button
              variant="tertiary"
              onClick={() => onReadyToBookChange(false)}
              className="px-6 py-3"
            >
              Not ready yet
            </Button>
          </div>
        </div>
      ) : isReadyToBook === true ? (
        <>
          {!isDirectSessionModal && (
            <div className="bg-[var(--color-thread-off-white)]/70 p-5 rounded-tr-[24px] shadow-none flex items-start gap-4">
              <img
                src={clinicianPhoto}
                alt={DEFAULT_CLINICIAN_NAME}
                className="w-16 h-16 rounded-full object-cover flex-shrink-0 border border-black/5 shadow-sm"
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
              />
              <div>
                <h4 className="font-medium text-[var(--color-thread-heading)]">{DEFAULT_CLINICIAN_NAME}</h4>
                <p className="text-xs text-slate-400 mb-2">Consultant Child Psychologist · PhD, MAPS</p>
                <p className="text-xs text-slate-500 leading-relaxed max-w-md">{DEFAULT_CLINICIAN_SHORT_NAME} specializes in developmental profiles and child-centered environments. She leads the review of {childLabel}&apos;s profile and works with your family for this appointment.</p>
              </div>
            </div>
          )}

          <div className="space-y-6">
            <div>
              <Label className="mb-3">Choose a day</Label>
              <div className="flex flex-wrap gap-2.5">
                {SESSION_DAYS.map((day) => (
                  <button
                    key={day.num}
                    onClick={() => onSessionDaySelect(day.num)}
                    className={cn(
                      "w-[4.5rem] py-3 rounded-tr-[20px] flex flex-col items-center justify-center border transition-all shadow-none cursor-pointer",
                      sessionDay === day.num
                        ? "bg-[var(--color-thread-light-green)] border-transparent text-[var(--style-light-surface-text)] font-semibold scale-[1.02]"
                        : "bg-white border-black/10 text-slate-600 hover:border-black/20 hover:bg-[var(--color-thread-off-white)]/60",
                    )}
                  >
                    <span className={cn("text-[0.66rem] uppercase tracking-wider mb-1 transition-colors", sessionDay === day.num ? "text-[var(--color-thread-mid-green)] font-semibold" : "text-slate-400")}>{day.dow}</span>
                    <span className={cn("text-xl font-serif transition-colors", sessionDay === day.num ? "text-[var(--color-thread-heading)] font-semibold" : "text-slate-800")}>{day.num}</span>
                    <span className={cn("text-[0.66rem] transition-colors", sessionDay === day.num ? "text-[var(--color-thread-mid-green)] font-semibold" : "text-slate-400")}>{day.mon}</span>
                  </button>
                ))}
              </div>
            </div>

            {sessionDay && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-3">
                <div>
                  <Label className="mb-3">Choose a time</Label>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {SESSION_TIMES.map((time) => (
                    <button
                      key={time}
                      onClick={() => onSessionTimeSelect(time)}
                      className={cn(
                        "px-5 py-2.5 rounded-tr-[20px] text-sm font-medium transition-all border shadow-none cursor-pointer flex flex-col items-center justify-center gap-0.5 min-w-[5.5rem]",
                        sessionTime === time
                          ? "bg-[var(--color-thread-light-green)] border-transparent text-[var(--style-light-surface-text)] font-semibold"
                          : "bg-white border-black/10 text-slate-600 hover:border-black/20 hover:bg-[var(--color-thread-off-white)]/60",
                      )}
                    >
                      <span className="font-semibold text-[0.92rem]">{time}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          <div className="bg-[var(--color-thread-off-white)]/70 p-5 rounded-br-[24px] text-slate-600 text-sm flex gap-3.5">
            <Clock className="w-5 h-5 text-[var(--color-thread-mid-green)] flex-shrink-0 mt-0.5" />
            <div>A <span className="font-semibold">45-minute telehealth appointment</span> — a structured interview, some gentle observation, and a few short tasks for {childLabel}. Join from home.</div>
          </div>

          {isDirectSessionModal && isCancelConfirmOpen && !isAppointmentCancelled && (
            <div className="rounded-tr-[24px] border border-rose-200 bg-rose-50 p-5">
              <h4 className="font-medium text-rose-800">Cancel this appointment?</h4>
              <p className="mt-2 text-sm leading-relaxed text-rose-700/80">
                This will cancel {currentAppointmentDate} at {currentAppointmentTime}. You can book a new time later.
              </p>
              <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
                <Button
                  variant="tertiary"
                  onClick={() => onCancelConfirmOpenChange(false)}
                  className="px-5 py-2.5"
                >
                  Keep appointment
                </Button>
                <Button
                  variant="dangerSolid"
                  onClick={onCancelAppointment}
                >
                  Yes, cancel appointment
                </Button>
              </div>
            </div>
          )}

          <div className="pt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button
              variant="primary"
              onClick={onConfirmBooking}
              className="px-6 py-3"
            >
              {isDirectSessionModal ? "Confirm appointment" : "Continue to confirm"}
            </Button>
            {isDirectSessionModal ? (
              <>
                <Button
                  variant="ghost"
                  onClick={onBack}
                  className="px-6 py-3"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </Button>
                {hasCurrentAppointment && !isAppointmentCancelled && (
                  <Button
                    variant="danger"
                    onClick={() => onCancelConfirmOpenChange(true)}
                    className="sm:ml-auto"
                  >
                    Cancel appointment
                  </Button>
                )}
              </>
            ) : (
              <Button
                variant="tertiary"
                onClick={() => onReadyToBookChange(false)}
                className="px-6 py-3"
              >
                I’ll book later
              </Button>
            )}
          </div>
        </>
      ) : (
        <div className="space-y-6 bg-[var(--color-thread-off-white)]/70 p-8 rounded-[24px]">
          <div className="space-y-4">
            <p className="text-[1rem] text-[var(--color-thread-dark-slate)]">No problem — we’ll save your progress and send an email reminder so you can book the appointment later when it suits you.</p>
            <p className="text-sm text-slate-500">Your intake is saved and your child&apos;s clinician can still review what you have shared.</p>
          </div>
        </div>
      )}
    </motion.div>
  );
}
