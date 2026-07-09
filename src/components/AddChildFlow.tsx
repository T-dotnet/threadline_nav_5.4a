import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, ChevronRight, FileText, ArrowRight, ArrowLeft, ArrowUp, ArrowDown, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCurrentChild } from '../context/ChildContext';
import { useDisplayMode } from '../context/DisplayModeContext';
import { cn } from '../lib/utils';
import { Button } from './ui/Button';
import { QUESTIONS, QUESTIONNAIRE_SECTIONS, getCompletedQuestionnaireSections } from '../questionnaire';
import { getJourneyReflectionCopy, getJourneySetupCopy } from '../lib/journeyCopy';
import { getAnswerCue, getAnswersAfterOptionSelect, getConversationLead } from '../lib/questionnaireFlow';
import { DEFAULT_SESSION_TIME } from '../lib/sessionDefaults';
import { SetupCompleteStep } from './setup/SetupCompleteStep';
import { SetupStepperSidebar } from './setup/SetupStepper';
import {
  SetupChildDetailsStep,
  SetupAvailableInfoStep,
  SetupJourneyStep,
  SetupNoticesStep,
  SetupReflectionStep,
  SetupWelcomeStep,
} from './setup/SetupInitialSteps';
import { SetupQuestionnaireStep } from './setup/SetupQuestionnaireStep';
import { SetupSessionStep } from './setup/SetupSessionStep';
import { FullScreenSurface } from './ui/FullScreenSurface';
import { ModalShell } from './ui/ModalShell';
import type { ReflectionDeckData } from './ui/ReflectionDeck';
import watercolorBg from '../assets/images/optimized/watercolor-bg-900.jpg';

interface AddChildFlowProps {
  onComplete: () => void;
  onCancel: () => void;
  asModal?: boolean;
  initialStep?: StepType;
  onShowReflection?: (data: ReflectionDeckData) => void;
}

type StepType = 'welcome' | 1 | 2 | 3 | 4 | 5 | 'done';

export default function AddChildFlow({ onComplete, onCancel, asModal, initialStep, onShowReflection }: AddChildFlowProps) {
  const navigate = useNavigate();
  const { isMvp } = useDisplayMode();
  const isDirectSessionEntry = initialStep === 5 || (() => {
    try {
      const params = new URLSearchParams(window.location.search);
      return params.get('step') === '5' && params.get('directSession') === '1';
    } catch {
      return false;
    }
  })();
  const [step, setStep] = useState<StepType>(() => {
    if (initialStep) return initialStep;
    try {
      const params = new URLSearchParams(window.location.search);
      const stepParam = params.get('step');
      if (stepParam) {
        const num = parseInt(stepParam, 10);
        if (num >= 1 && num <= 5) return num as StepType;
        if (stepParam === 'welcome' || stepParam === 'done') return stepParam as StepType;
      }
      if (params.get('section')) return 4;
    } catch (e) {
      console.error(e);
    }
    return 'welcome';
  });
  const setupProgressClass = (() => {
    if (step === 'welcome') return 'thread-setup-flow-progress--empty';
    if (isMvp) {
      if (step === 1) return 'thread-setup-flow-progress--one-fifth';
      if (step === 2) return 'thread-setup-flow-progress--two-fifths';
      if (step === 3) return 'thread-setup-flow-progress--three-fifths';
      if (step === 4) return 'thread-setup-flow-progress--four-fifths';
      return 'thread-setup-flow-progress--full';
    }
    if (step === 1) return 'thread-setup-flow-progress--quarter';
    if (step === 2) return 'thread-setup-flow-progress--half';
    if (step === 3) return 'thread-setup-flow-progress--three-quarter';
    return 'thread-setup-flow-progress--full';
  })();
  const [qSection, setQSection] = useState<string | null>(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const sectionParam = params.get('section');
      if (sectionParam && QUESTIONNAIRE_SECTIONS.includes(sectionParam)) {
        return sectionParam;
      }
    } catch (e) {
      console.error(e);
    }
    return null;
  });
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState<number>(0);
  const [isReviewing, setIsReviewing] = useState<boolean>(false);

  const { currentChild, addChild, updateChild } = useCurrentChild();
  const [answers, setAnswers] = useState<Record<string, any>>(() => (
    currentChild.isNew ? currentChild.intake?.questionnaireAnswers || {} : {}
  ));

  const currentYear = new Date().getFullYear();
  const yearsArray = Array.from({ length: 18 }, (_, i) => String(currentYear - i));

  const [isAppointmentCancelled, setIsAppointmentCancelled] = useState(
    Boolean(currentChild.intake?.sessionCancelled && !currentChild.intake?.sessionDay && !currentChild.intake?.sessionTime)
  );
  const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState(false);
  const [isReadyToBook, setIsReadyToBook] = useState<boolean | null>(isDirectSessionEntry ? true : null);

  useEffect(() => {
    if (step === 5) {
      setIsReadyToBook(isDirectSessionEntry ? true : null);
    }
  }, [isDirectSessionEntry, step]);

  const handleDobChange = (value: string) => {
    if (value) {
      setFormData({ ...formData, dob: value });
    } else {
      setFormData({ ...formData, dob: '' });
    }
  };

  const currentQuestionRef = useRef<HTMLDivElement | null>(null);
  const prevListRef = useRef<HTMLDivElement | null>(null);

  const [formData, setFormData] = useState(() => ({
    firstName: currentChild.isNew ? currentChild.name : '',
    age: currentChild.isNew && Number.isFinite(currentChild.age) ? String(currentChild.age) : '',
    dob: '',
    relation: currentChild.isNew ? currentChild.intake?.relation || 'Parent' : 'Parent',
    journeyStage: currentChild.isNew ? currentChild.intake?.journeyStage || '' : '',
    stateOrTerritory: currentChild.isNew ? currentChild.intake?.stateOrTerritory || '' : '',
    availableInfo: currentChild.isNew ? currentChild.intake?.availableInfo || [] as string[] : [] as string[],
    notices: currentChild.isNew ? currentChild.intake?.notices || [] as string[] : [] as string[],
    notes: currentChild.isNew ? currentChild.intake?.notes || '' : '',
    sessionDay: currentChild.isNew ? currentChild.intake?.sessionDay || '' : '',
    sessionTime: currentChild.isNew ? currentChild.intake?.sessionTime || '' : '',
  }));

  const buildIntake = useCallback((nextAnswers = answers) => {
    const questionnaireAvailableInfo = Array.isArray(nextAnswers.dev_available_information)
      ? nextAnswers.dev_available_information
      : formData.availableInfo;

    return {
      relation: formData.relation,
      journeyStage: formData.journeyStage,
      stateOrTerritory: formData.stateOrTerritory,
      availableInfo: questionnaireAvailableInfo,
      notices: formData.notices,
      notes: formData.notes,
      sessionDay: formData.sessionDay,
      sessionTime: formData.sessionTime,
      sessionCancelled: formData.sessionDay && formData.sessionTime ? false : Boolean(currentChild.intake?.sessionCancelled),
      questionnaireAnswers: nextAnswers,
      completedQuestionnaireSections: getCompletedQuestionnaireSections(nextAnswers),
    };
  }, [formData, answers, currentChild.intake?.sessionCancelled]);

  const saveCurrentChildIntake = useCallback((nextAnswers = answers) => {
    if (!currentChild.isNew) return;
    const name = formData.firstName.trim() || currentChild.name || 'New child';
    updateChild({
      ...currentChild,
      name,
      initial: name.charAt(0).toUpperCase(),
      intake: buildIntake(nextAnswers),
    });
  }, [currentChild, formData.firstName, updateChild, buildIntake]);

  const handleTextChange = useCallback((qId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [qId]: value }));
  }, []);

  useEffect(() => {
    if (!qSection || isReviewing) return;
    currentQuestionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    if (prevListRef.current) {
      prevListRef.current.scrollTo({ top: prevListRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [activeQuestionIndex, qSection, isReviewing]);

  const handlePrevQuestion = useCallback(() => {
    if (isReviewing) {
      setIsReviewing(false);
      const currentQuestions = QUESTIONS[qSection || ''] || [];
      setActiveQuestionIndex(currentQuestions.length - 1);
    } else if (activeQuestionIndex > 0) {
      setActiveQuestionIndex(prev => prev - 1);
    }
  }, [isReviewing, activeQuestionIndex, qSection]);

  const handleNextQuestion = useCallback(() => {
    const currentQuestions = QUESTIONS[qSection || ''] || [];
    if (activeQuestionIndex < currentQuestions.length - 1) {
      setActiveQuestionIndex(prev => prev + 1);
    } else {
      // Automatically move to the next section
      saveCurrentChildIntake();
      const completed = getCompletedQuestionnaireSections(answers);
      const next = QUESTIONNAIRE_SECTIONS.find((s) => !completed.includes(s)) || null;
      if (next) {
        setQSection(next);
        setActiveQuestionIndex(0);
        setIsReviewing(false);
      } else {
        setQSection(null);
        setIsReviewing(false);
        setIsModalOpen(false);
      }
    }
  }, [activeQuestionIndex, qSection, answers, saveCurrentChildIntake]);

  const handleSelectOption = useCallback((qId: string, option: string, type: 'choice' | 'multiple-choice' | 'text') => {
    if (type === 'choice') {
      setAnswers(prev => getAnswersAfterOptionSelect(prev, qId, option, type));
      // Auto-advance with a slight delay for pleasant visual feedback
      setTimeout(() => {
        handleNextQuestion();
      }, 350);
    } else if (type === 'multiple-choice') {
      setAnswers(prev => getAnswersAfterOptionSelect(prev, qId, option, type));
    }
  }, [handleNextQuestion]);

  const getSectionStatus = useCallback((secName: string) => {
    const qs = QUESTIONS[secName] || [];
    if (qs.length === 0) return 'Not started';
    
    const answeredCount = qs.filter(q => {
      const ans = answers[q.id];
      if (ans === undefined || ans === null) return false;
      if (Array.isArray(ans)) return ans.length > 0;
      if (typeof ans === 'string') return ans.trim() !== '';
      return true;
    }).length;

    if (answeredCount === 0) return 'Not started';
    if (answeredCount === qs.length) return 'Completed';
    return `${answeredCount} of ${qs.length} answered`;
  }, [answers]);

  // Handle Typeform keyboard shortcuts
  useEffect(() => {
    if (!qSection) return;
    
    const currentQuestions = QUESTIONS[qSection] || [];
    const handleKeyDown = (e: KeyboardEvent) => {
      // If user is typing in a textarea or input, do not capture single keys like A/B/C
      const isTyping = document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA';
      
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        handlePrevQuestion();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        handleNextQuestion();
      } else if (e.key === 'Enter') {
        if (isTyping && document.activeElement instanceof HTMLTextAreaElement) {
          // Allow multiline textareas, unless Cmd/Ctrl+Enter is pressed
          if (!e.metaKey && !e.ctrlKey) return;
        }
        e.preventDefault();
        handleNextQuestion();
      } else if (!isTyping) {
        const key = e.key.toLowerCase();
        const code = key.charCodeAt(0) - 97; // 'a' code is 97
        const activeQ = currentQuestions[activeQuestionIndex];
        if (activeQ && activeQ.options && code >= 0 && code < activeQ.options.length) {
          e.preventDefault();
          handleSelectOption(activeQ.id, activeQ.options[code], activeQ.type);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [qSection, activeQuestionIndex, handlePrevQuestion, handleNextQuestion, handleSelectOption]);

  const handleDirectSessionConfirm = () => {
    setIsCancelConfirmOpen(false);
    saveCurrentChildIntake();
    onComplete();
  };

  const resolveChildAge = () => {
    const parsedAge = Number.parseInt(formData.age, 10);
    if (Number.isFinite(parsedAge)) return parsedAge;
    if (currentChild.isNew && Number.isFinite(currentChild.age)) return currentChild.age;
    return 9;
  };

  const completeSetup = () => {
    saveCurrentChildIntake();
    const name = formData.firstName.trim() || (currentChild.isNew ? currentChild.name : 'New child');
    const child = {
      ...(currentChild.isNew ? currentChild : {}),
      id: currentChild.isNew ? currentChild.id : undefined,
      name,
      age: resolveChildAge(),
      initial: name.charAt(0).toUpperCase(),
      isNew: true,
      intake: buildIntake(),
    };
    if (currentChild.isNew) {
      updateChild(child);
    } else {
      addChild(child);
    }
    setStep('done');
  };

  const finishMvpSetup = () => {
    saveCurrentChildIntake();
    const name = formData.firstName.trim() || (currentChild.isNew ? currentChild.name : 'New child');
    const child = {
      ...(currentChild.isNew ? currentChild : {}),
      id: currentChild.isNew ? currentChild.id : undefined,
      name,
      age: resolveChildAge(),
      initial: name.charAt(0).toUpperCase(),
      isNew: true,
      intake: buildIntake(),
    };
    if (currentChild.isNew) {
      updateChild(child);
    } else {
      addChild(child);
    }
    onComplete();
  };

  const handleCancelAppointment = () => {
    setIsCancelConfirmOpen(false);
    if (!currentChild.isNew) {
      setFormData((prev) => ({ ...prev, sessionDay: '', sessionTime: '' }));
      setIsAppointmentCancelled(true);
      return;
    }
    const clearedIntake = {
      ...buildIntake(),
      sessionDay: '',
      sessionTime: '',
      sessionCancelled: true,
    };
    const name = formData.firstName.trim() || currentChild.name || 'New child';
    updateChild({
      ...currentChild,
      name,
      initial: name.charAt(0).toUpperCase(),
      intake: clearedIntake,
    });
    setFormData((prev) => ({ ...prev, sessionDay: '', sessionTime: '' }));
    setIsAppointmentCancelled(true);
  };

  const handleNext = () => {
    if (step === 'welcome') setStep(1);
    else if (step === 1) setStep(2);
    else if (step === 2) setStep(3);
    else if (step === 3) {
      if (isMvp) {
        setStep(4);
      } else {
        setStep(4);
      }
    }
    else if (step === 4) {
      if (isMvp) {
        setStep(5);
      } else {
        completeSetup();
      }
    }
    else if (step === 5) {
      if (isMvp) {
        finishMvpSetup();
      } else {
        completeSetup();
      }
    }
    else if (step === 'done') {
      onComplete();
    }
  };

  const handleBack = () => {
    if (hideStepperForDirectModalStep) {
      onCancel();
      return;
    }
    if (step === 'done') setStep(isMvp ? 5 : 4);
    else if (step === 1) setStep('welcome');
    else if (step === 2) setStep(1);
    else if (step === 3) setStep(2);
    else if (step === 4) setStep(3);
    else if (step === 5) setStep(4);
  };

  const handleGoToProfile = () => {
    navigate(isMvp ? '/assessment' : '/understanding');
    if (asModal) {
      onComplete();
    }
  };

  const completedQuestionnaireSections = getCompletedQuestionnaireSections(answers);
  const remainingQuestionnaireSections = Math.max(0, Object.keys(QUESTIONS).length - completedQuestionnaireSections.length);
  const isDirectObservationModal = asModal && initialStep === 3;
  const isDirectSessionModal = step === 5 && isDirectSessionEntry;
  const hideStepperForDirectModalStep = isDirectObservationModal || isDirectSessionModal;
  const hasCurrentAppointment = Boolean(currentChild.intake?.sessionDay && currentChild.intake?.sessionTime);
  const currentAppointmentDay = currentChild.intake?.sessionDay || '26';
  const currentAppointmentTime = currentChild.intake?.sessionTime || DEFAULT_SESSION_TIME;
  const currentAppointmentDate = `Thu ${currentAppointmentDay} Jun`;
  const handleDirectObservationConfirm = () => {
    saveCurrentChildIntake();
    onCancel();
  };
  const questionnaireAvailableInfo = Array.isArray(answers.dev_available_information) ? answers.dev_available_information : [];
  const reflectedAvailableInfo = questionnaireAvailableInfo.length > 0 ? questionnaireAvailableInfo : formData.availableInfo;
  const journeyReflectionCopy = getJourneyReflectionCopy(formData.journeyStage);
  const journeySetupCopy = getJourneySetupCopy(formData.journeyStage);
  const formatMirrorList = (items: string[]) => {
    if (items.length === 0) return 'not sure yet';
    const normalized = items.map((item) => item.toLowerCase());
    if (normalized.length === 1) return normalized[0];
    if (normalized.length === 2) return `${normalized[0]} and ${normalized[1]}`;
    return `${normalized.slice(0, -1).join(', ')}, and ${normalized[normalized.length - 1]}`;
  };
  const mirroredJourneyStage = "You're noticing a few concerns and looking for a clearer next step.";
  const mirroredHardestAreasSentence = "What you'd most like help with can become clearer as we go.";
  const mirroredAvailableInfoSentence = "You do not need reports or documents to begin.";
  const reflectedChildName = formData.firstName.trim() || currentChild.name || 'New child';
  const sectionKickerClass = "text-[0.75rem] tracking-[0.1em] uppercase text-[var(--color-thread-mid-green)] font-medium mb-3 block";
  const stepHeadingClass = "font-serif font-normal text-[2rem] sm:text-[2.35rem] leading-[1.12] tracking-tight text-[var(--color-thread-heading)] mb-3";
  const stepLeadClass = "text-[0.98rem] text-[var(--color-thread-gray)] leading-relaxed max-w-[55ch]";
  const selectClass = "w-full py-3 px-4 pr-9 bg-[var(--color-thread-off-white)]/50 border border-black/10 rounded-xl text-[0.95rem] font-medium text-[var(--color-thread-dark-slate)] focus:outline-none focus:ring-2 focus:ring-[var(--color-thread-mid-green)]/20 focus:border-[var(--color-thread-mid-green)]/30 transition-all appearance-none cursor-pointer";
  const smallFieldLabelClass = "text-[0.66rem] tracking-[0.12em] uppercase text-[var(--color-thread-gray)] font-medium mb-1.5 block";
  const choiceClass = (selected: boolean) => cn(
    "px-5 py-2.5 rounded-full text-[0.84rem] font-medium transition-all border shadow-none cursor-pointer inline-flex items-center gap-2 min-h-[40px]",
    selected
      ? "bg-[var(--color-thread-light-green)] border-transparent text-[var(--style-light-surface-text)]"
      : "bg-white border-black/10 text-[var(--color-thread-gray)] hover:border-black/20 hover:text-[var(--color-thread-heading)]"
  );
  const questionOptionClass = (selected: boolean) => cn(
    "w-full p-4 rounded-tr-[20px] border text-left flex items-center justify-between group transition-all duration-200 cursor-pointer shadow-none",
    selected
      ? "bg-[var(--color-thread-light-green)] border-[var(--color-thread-mid-green)]/30 text-[var(--style-light-surface-text)] font-medium"
      : "bg-white border-black/10 text-[var(--color-thread-dark-slate)] hover:border-black/20 hover:bg-[var(--color-thread-off-white)]/60"
  );
  const flowPanel = (
    <>
      {/* Main Container */}
      <div className={cn(
        "flex-1 w-full bg-transparent flex items-start justify-center",
        asModal ? "p-0" : "px-4 py-8 sm:px-6 sm:py-12 md:px-8 md:py-16"
      )}>
        <div className={cn(
          "w-full overflow-hidden relative",
          step === 'done'
            ? "max-w-4xl bg-transparent shadow-none flex flex-col md:flex-row"
            : cn(
                "bg-white flex flex-col md:flex-row min-h-[640px]",
                asModal ? "max-w-none rounded-none shadow-none" : "max-w-4xl rounded-tr-[36px] shadow-premium"
              )
        )}>
          {step !== 'done' && !isDirectSessionModal && (
            <div
              className={cn("thread-setup-flow-progress", setupProgressClass)}
            />
          )}
          
          {isDirectSessionModal && (
            <button
              type="button"
              onClick={onCancel}
              className="absolute right-6 top-6 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-thread-off-white)] text-slate-500 transition-colors hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-[var(--color-thread-mid-green)]/30 cursor-pointer"
              aria-label="Close"
            >
              <X className="h-5 w-5 stroke-[2]" />
            </button>
          )}
          
          {/* WELCOME STATE */}
          {step === 'welcome' && (
            <>
              <SetupStepperSidebar
                activeStep={1}
                heading="What we'll do together"
                side="left"
                mobileBorder="bottom"
                className="order-1"
              />

              <SetupWelcomeStep
                sectionKickerClass={sectionKickerClass}
                stepHeadingClass={stepHeadingClass}
                stepLeadClass={stepLeadClass}
                onCancel={onCancel}
                onBegin={handleNext}
              />
            </>
          )}

          {/* ACTIVE STEPS 1-5 */}
          {typeof step === 'number' && (
            <>
              {/* Right Column: Interactive Sidebar Progress */}
              {!hideStepperForDirectModalStep && (
                <SetupStepperSidebar
                  activeStep={step}
                  heading={`${formData.firstName || 'Your child'}'s setup`}
                  side="left"
                  mobileBorder="bottom"
                  className="order-1"
                />
              )}

              {/* Step content & in-card action buttons */}
              <main className={cn(
                "order-2 flex-1 p-8 sm:p-12 md:p-14 flex flex-col justify-between min-h-[500px]",
                asModal && "max-h-[calc(100vh-3rem)] overflow-y-auto",
              )}>
                <div className="w-full">
                  
                  {/* Step 1 */}
                  {step === 1 && (
                    isMvp ? (
                      <SetupChildDetailsStep
                        firstName={formData.firstName}
                        age={formData.age}
                        yearOfBirth={formData.dob || ''}
                        relation={formData.relation}
                        stateOrTerritory={formData.stateOrTerritory}
                        years={yearsArray}
                        sectionKickerClass={sectionKickerClass}
                        stepHeadingClass={stepHeadingClass}
                        stepLeadClass={stepLeadClass}
                        selectClass={selectClass}
                        choiceClass={choiceClass}
                        onFirstNameChange={(firstName) => setFormData({ ...formData, firstName })}
                        onAgeChange={(age) => setFormData({ ...formData, age })}
                        onYearOfBirthChange={handleDobChange}
                        onRelationChange={(relation) => setFormData({ ...formData, relation })}
                        onStateOrTerritoryChange={(stateOrTerritory) => setFormData({ ...formData, stateOrTerritory })}
                      />
                    ) : (
                      <SetupJourneyStep
                        journeyStage={formData.journeyStage}
                        sectionKickerClass={sectionKickerClass}
                        stepHeadingClass={stepHeadingClass}
                        stepLeadClass={stepLeadClass}
                        questionOptionClass={questionOptionClass}
                        onJourneyStageChange={(journeyStage) => setFormData({ ...formData, journeyStage })}
                      />
                    )
                  )}

                  {/* Step 2 */}
                  {step === 2 && (
                    isMvp ? (
                      <SetupJourneyStep
                        journeyStage={formData.journeyStage}
                        sectionKickerClass={sectionKickerClass}
                        stepHeadingClass={stepHeadingClass}
                        stepLeadClass={stepLeadClass}
                        questionOptionClass={questionOptionClass}
                        onJourneyStageChange={(journeyStage) => setFormData({ ...formData, journeyStage })}
                      />
                    ) : (
                      <SetupChildDetailsStep
                        firstName={formData.firstName}
                        age={formData.age}
                        yearOfBirth={formData.dob || ''}
                        relation={formData.relation}
                        stateOrTerritory={formData.stateOrTerritory}
                        years={yearsArray}
                        sectionKickerClass={sectionKickerClass}
                        stepHeadingClass={stepHeadingClass}
                        stepLeadClass={stepLeadClass}
                        selectClass={selectClass}
                        choiceClass={choiceClass}
                        onFirstNameChange={(firstName) => setFormData({ ...formData, firstName })}
                        onAgeChange={(age) => setFormData({ ...formData, age })}
                        onYearOfBirthChange={handleDobChange}
                        onRelationChange={(relation) => setFormData({ ...formData, relation })}
                        onStateOrTerritoryChange={(stateOrTerritory) => setFormData({ ...formData, stateOrTerritory })}
                      />
                    )
                  )}

                  {/* Step 3 */}
                  {step === 3 && (
                    <SetupNoticesStep
                      firstName={formData.firstName}
                      notices={formData.notices}
                      sectionKickerClass={sectionKickerClass}
                      stepHeadingClass={stepHeadingClass}
                      stepLeadClass={stepLeadClass}
                      choiceClass={choiceClass}
                      onNoticesChange={(notices) => setFormData({ ...formData, notices })}
                    />
                  )}

                  {/* Step 5 */}
                  {step === 5 && (
                    isMvp ? (
                      <SetupReflectionStep
                        firstName={formData.firstName}
                        sectionKickerClass={sectionKickerClass}
                        stepHeadingClass={stepHeadingClass}
                        stepLeadClass={stepLeadClass}
                      />
                    ) : (
                      <SetupSessionStep
                        firstName={formData.firstName}
                        sessionDay={formData.sessionDay}
                        sessionTime={formData.sessionTime}
                        isDirectSessionModal={isDirectSessionModal}
                        isAppointmentCancelled={isAppointmentCancelled}
                        isCancelConfirmOpen={isCancelConfirmOpen}
                        isReadyToBook={isReadyToBook}
                        hasCurrentAppointment={hasCurrentAppointment}
                        currentAppointmentDate={currentAppointmentDate}
                        currentAppointmentTime={currentAppointmentTime}
                        sectionKickerClass={sectionKickerClass}
                        stepHeadingClass={stepHeadingClass}
                        stepLeadClass={stepLeadClass}
                        onReadyToBookChange={setIsReadyToBook}
                        onSessionDaySelect={(sessionDay) => {
                          setIsAppointmentCancelled(false);
                          setIsCancelConfirmOpen(false);
                          setFormData((prev) => ({ ...prev, sessionDay, sessionTime: '' }));
                        }}
                        onSessionTimeSelect={(sessionTime) => {
                          setFormData((prev) => ({ ...prev, sessionTime }));
                        }}
                        onCancelConfirmOpenChange={setIsCancelConfirmOpen}
                        onCancelAppointment={handleCancelAppointment}
                        onConfirmBooking={() => {
                          saveCurrentChildIntake();
                          if (isDirectSessionModal) {
                            handleDirectSessionConfirm();
                            return;
                          }
                          handleNext();
                        }}
                        onBack={handleBack}
                      />
                    )
                  )}

                  {/* Step 4 */}
                  {step === 4 && (
                    isMvp ? (
                      <SetupAvailableInfoStep
                        availableInfo={formData.availableInfo}
                        sectionKickerClass={sectionKickerClass}
                        stepHeadingClass={stepHeadingClass}
                        stepLeadClass={stepLeadClass}
                        questionOptionClass={questionOptionClass}
                        onAvailableInfoChange={(availableInfo) => setFormData({ ...formData, availableInfo })}
                      />
                    ) : (
                      <SetupQuestionnaireStep
                        title={journeySetupCopy.title}
                        description={journeySetupCopy.description}
                        answers={answers}
                        sectionKickerClass={sectionKickerClass}
                        stepHeadingClass={stepHeadingClass}
                        stepLeadClass={stepLeadClass}
                        getSectionStatus={getSectionStatus}
                        onOpenSection={(sectionName) => {
                          setQSection(sectionName);
                          setActiveQuestionIndex(0);
                          setIsReviewing(false);
                          setIsModalOpen(true);
                        }}
                      />
                    )
                  )}

                  <ModalShell
                    isOpen={Boolean(isModalOpen && qSection)}
                    titleId="setup-questionnaire-modal-title"
                    size="small"
                    isWatercolor
                    zIndexClassName="thread-z-modal-high"
                    scrimClassName="bg-white/40 backdrop-blur-[2px]"
                    radiusClassName="rounded-tr-[36px]"
                    panelClassName="flex flex-col max-h-[90vh]"
                  >
                        <div className="flex flex-col h-full justify-between min-h-[480px]">
                          {/* Header / Nav-back */}
                          <div className="flex items-center justify-between p-6 pb-5 border-b border-black/5">
                            {!isReviewing ? (
                              <button
                                onClick={() => {
                                  saveCurrentChildIntake();
                                  setQSection(null);
                                  setIsModalOpen(false);
                                }}
                                className="text-[0.84rem] text-[var(--color-thread-dark-slate)] font-medium border-b border-[var(--color-thread-dark-slate)] pb-0.5 hover:opacity-70 transition-all min-h-[32px] inline-flex items-center cursor-pointer"
                              >
                                Save & exit section
                              </button>
                            ) : (
                              <div className="min-h-[32px] w-[140px]" />
                            )}
                            {/* Hidden One question at a time label */}
                            <div className="w-16" />
                          </div>

                          {/* Main Body */}
                          <div className="flex-1 py-8 px-6 sm:px-10 flex flex-col justify-start overflow-y-auto space-y-10">
                            <AnimatePresence mode="wait">
                              <motion.div
                                key={`question-${activeQuestionIndex}`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-10"
                              >
                                {(() => {
                                  const currentQuestions = QUESTIONS[qSection || ''] || [];
                                  const q = currentQuestions[activeQuestionIndex];
                                  if (!q) return null;
                                  
                                  const qText = q.text.replace(/\$\{childName\}/g, formData.firstName || 'your child');
                                  const qSub = q.subtext?.replace(/\$\{childName\}/g, formData.firstName || 'your child');
                                  const isSelected = (opt: string) => {
                                    const ans = answers[q.id];
                                    if (q.type === 'multiple-choice') {
                                      return (ans as string[] || []).includes(opt);
                                    }
                                    return ans === opt;
                                  };

                                  return (
                                    <div key={q.id} className="space-y-8">
                                      <div className="space-y-4">
                                        <div className="inline-flex rounded-tr-[18px] rounded-bl-[18px] bg-[var(--color-thread-light-green)]/70 px-4 py-2 text-[0.86rem] font-medium text-[var(--style-light-surface-text)] mb-2">
                                          {getConversationLead(qSection || '', activeQuestionIndex)}
                                        </div>
                                        <div className="flex items-start gap-3">
                                          <span className="mt-2 h-7 min-w-7 rounded-full bg-[var(--color-thread-off-white)] text-[0.72rem] font-semibold tracking-[0.08em] text-[var(--color-thread-mid-green)] flex items-center justify-center">
                                            {activeQuestionIndex + 1}
                                          </span>
                                          <div>
                                            <h2 className="font-serif font-normal text-2xl md:text-3xl text-[var(--color-thread-heading)] leading-snug">
                                              {qText}
                                            </h2>
                                            {qSub && (
                                              <p className="text-[var(--color-thread-gray)] text-[0.92rem] leading-relaxed mt-2 max-w-xl">
                                                {qSub}
                                              </p>
                                            )}
                                            <p className="text-[0.7rem] uppercase tracking-wider text-slate-400 font-medium mt-4">
                                              {getAnswerCue(q.type)}
                                            </p>
                                          </div>
                                        </div>
                                      </div>

                                      <div className="ml-0 sm:ml-10">
                                        {(q.type === 'choice' || q.type === 'multiple-choice') && q.options && (
                                          <div className="space-y-2.5 max-w-lg">
                                            {q.options.map((opt, oIdx) => {
                                              const selected = isSelected(opt);
                                              const letter = String.fromCharCode(65 + oIdx);
                                              return (
                                                <button
                                                  key={opt}
                                                  onClick={() => handleSelectOption(q.id, opt, q.type as 'choice' | 'multiple-choice')}
                                                  className={cn(
                                                    questionOptionClass(selected)
                                                  )}
                                                >
                                                  <div className="flex items-center gap-3">
                                                    <span className={cn(
                                                      "w-6 h-6 rounded-full border text-[0.66rem] font-medium flex items-center justify-center transition-colors",
                                                      selected
                                                        ? "bg-[var(--color-thread-mid-green)] border-[var(--color-thread-mid-green)] text-white"
                                                        : "bg-white border-black/10 text-slate-400 group-hover:border-black/20 group-hover:text-slate-600"
                                                    )}>
                                                      {letter}
                                                    </span>
                                                    <span className="text-[0.95rem]">{opt}</span>
                                                  </div>
                                                  {selected && <Check className="w-4 h-4 text-[var(--color-thread-mid-green)]" />}
                                                </button>
                                              );
                                            })}

                                            {q.type === 'multiple-choice' && (
                                              <div className="pt-4 flex items-center gap-3">
                                                <Button
                                                  onClick={handleNextQuestion}
                                                  variant="primary"
                                                  className="px-5 py-2.5 min-h-[40px] shadow-none"
                                                  rightIcon={<Check className="w-4 h-4" />}
                                                >
                                                  That feels right
                                                </Button>
                                                <span className="text-[0.74rem] text-slate-400">then we’ll move on</span>
                                              </div>
                                            )}
                                          </div>
                                        )}

                                        {q.type === 'text' && (
                                          <div className="max-w-xl space-y-4">
                                            <textarea
                                              value={answers[q.id] || ''}
                                              onChange={(e) => handleTextChange(q.id, e.target.value)}
                                              placeholder={q.placeholder || "Type your answer here..."}
                                              rows={3}
                                              className="thread-textarea thread-textarea--soft thread-textarea--compact"
                                            />
                                            <div className="flex items-center gap-3">
                                              <Button
                                                onClick={handleNextQuestion}
                                                variant="primary"
                                                className="px-5 py-2.5 min-h-[40px] shadow-none"
                                                rightIcon={<Check className="w-4 h-4" />}
                                              >
                                                That feels right
                                              </Button>
                                              <span className="text-[0.74rem] text-slate-400">press Enter or Ctrl+Enter</span>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })()}
                              </motion.div>
                            </AnimatePresence>
                          </div>

                          {/* Footer Progress */}
                          <div className="pt-5 pb-6 px-6 sm:px-10 border-t border-black/5 flex items-center justify-end bg-slate-50/50">
                            <div className="flex items-center gap-2">
                              <span className="text-[0.74rem] text-slate-400 hidden sm:inline-block font-medium">Move back or forward</span>
                              <div className="flex border border-black/10 rounded-full overflow-hidden bg-white">
                                <button
                                  onClick={handlePrevQuestion}
                                  disabled={activeQuestionIndex === 0}
                                  className={cn(
                                    "p-2.5 hover:bg-[var(--color-thread-off-white)] transition-all border-r border-black/10 cursor-pointer text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed"
                                  )}
                                  title="Previous (Arrow Up)"
                                >
                                  <ArrowUp className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={handleNextQuestion}
                                  className={cn(
                                    "p-2.5 hover:bg-[var(--color-thread-off-white)] transition-all cursor-pointer text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed"
                                  )}
                                  title="Next (Arrow Down)"
                                >
                                  <ArrowDown className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                  </ModalShell>

                </div>

                {/* Unified In-Card navigation footer inside the card container */}
                {!isDirectSessionModal && (
                  <div className="flex items-center justify-between pt-8 border-t border-black/5 mt-12 w-full">
                    {isDirectObservationModal && step === 3 ? (
                      <>
                        <Button onClick={onCancel} variant="tertiary" className="px-6 shadow-none">
                          Cancel
                        </Button>
                        <div className="flex items-center gap-5">
                          <Button onClick={handleDirectObservationConfirm} variant="primary" className="px-6 shadow-none">
                            Confirm <Check className="w-4 h-4 ml-2" />
                          </Button>
                        </div>
                      </>
                    ) : (
                      <>
                        <Button
                          type="button"
                          onClick={handleBack}
                          variant="ghost"
                          className="text-sm font-medium"
                          leftIcon={<ArrowLeft className="w-4 h-4" />}
                        >
                          Back
                        </Button>
                        <div className="flex items-center gap-5">
                          <Button onClick={handleNext} variant="primary" className="px-6 shadow-none">
                            {step === 5 && !isMvp ? 'Finish setup' : 'Continue'} <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </main>
            </>
          )}

          {/* SETUP COMPLETE DONE SCREEN */}
          {step === 'done' && (
            <SetupCompleteStep
              reflectedChildName={reflectedChildName}
              mirroredJourneyStage={mirroredJourneyStage}
              mirroredHardestAreasSentence={mirroredHardestAreasSentence}
              mirroredAvailableInfoSentence={mirroredAvailableInfoSentence}
              stepHeadingClass={stepHeadingClass}
              stepLeadClass={stepLeadClass}
              onBack={handleBack}
              onViewProfile={() => {
                handleGoToProfile();
              }}
            />
          )}

        </div>
      </div>
    </>
  );

  if (asModal) {
    return (
      <ModalShell
        isOpen
        titleId="add-child-setup-modal-title"
        maxWidthClassName="max-w-5xl"
        radiusClassName="rounded-none rounded-tr-[40px]"
        panelClassName="max-h-[calc(100vh-3rem)] overflow-hidden"
      >
        <span id="add-child-setup-modal-title" className="sr-only">
          Add child profile setup
        </span>
        {flowPanel}
      </ModalShell>
    );
  }

  return (
    <FullScreenSurface>
      {flowPanel}
    </FullScreenSurface>
  );
}
