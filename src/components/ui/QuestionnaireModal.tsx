import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, ChevronRight, ArrowLeft, ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '../../lib/utils';
import { QUESTIONS } from '../../questionnaire';
import { getAnswerCue, getAnswersAfterOptionSelect, getConversationLead } from '../../lib/questionnaireFlow';
import { ProgressBar } from './ProgressBar';
import { Button } from './Button';

interface QuestionnaireModalProps {
  isOpen: boolean;
  section: string | null;
  answers: Record<string, any>;
  childName: string;
  onClose: () => void;
  onSave: (updatedAnswers: Record<string, any>) => void;
}

export function QuestionnaireModal({ isOpen, section, answers: initialAnswers, childName, onClose, onSave }: QuestionnaireModalProps) {
  const [answers, setAnswers] = useState<Record<string, any>>(initialAnswers);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [isReviewing, setIsReviewing] = useState(false);

  useEffect(() => {
    setAnswers(initialAnswers);
  }, [initialAnswers, section]);

  useEffect(() => {
    if (isOpen) {
      setActiveQuestionIndex(0);
      setIsReviewing(false);
    }
  }, [isOpen, section]);

  const currentQuestions = QUESTIONS[section || ''] || [];

  const handleSelectOption = useCallback((qId: string, option: string, type: 'choice' | 'multiple-choice' | 'text') => {
    if (type === 'choice') {
      setAnswers(prev => getAnswersAfterOptionSelect(prev, qId, option, type));
      setTimeout(() => {
        setActiveQuestionIndex(prev => {
          if (prev < currentQuestions.length - 1) return prev + 1;
          setIsReviewing(true);
          return prev;
        });
      }, 350);
    } else if (type === 'multiple-choice') {
      setAnswers(prev => getAnswersAfterOptionSelect(prev, qId, option, type));
    }
  }, [currentQuestions.length]);

  const handleTextChange = useCallback((qId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [qId]: value }));
  }, []);

  const handlePrevQuestion = useCallback(() => {
    if (isReviewing) {
      setIsReviewing(false);
      setActiveQuestionIndex(currentQuestions.length - 1);
    } else if (activeQuestionIndex > 0) {
      setActiveQuestionIndex(prev => prev - 1);
    }
  }, [isReviewing, activeQuestionIndex, currentQuestions.length]);

  const handleNextQuestion = useCallback(() => {
    if (activeQuestionIndex < currentQuestions.length - 1) {
      setActiveQuestionIndex(prev => prev + 1);
    } else {
      setIsReviewing(true);
    }
  }, [activeQuestionIndex, currentQuestions.length]);

  const currentQuestionRef = useRef<HTMLDivElement | null>(null);
  const prevListRef = useRef<HTMLDivElement | null>(null);
  const bodyScrollRef = useRef<HTMLDivElement | null>(null);

  const handleSaveAndExit = useCallback(() => {
    onSave(answers);
    onClose();
  }, [answers, onSave, onClose]);

  const handleSaveAndAdvance = useCallback(() => {
    onSave(answers);
  }, [answers, onSave]);

  useEffect(() => {
    if (!isOpen || isReviewing) return;
    requestAnimationFrame(() => {
      currentQuestionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
      if (bodyScrollRef.current) {
        bodyScrollRef.current.scrollTop = bodyScrollRef.current.scrollHeight;
      }
      if (prevListRef.current) {
        prevListRef.current.scrollTop = prevListRef.current.scrollHeight;
      }
    });
  }, [activeQuestionIndex, isOpen, isReviewing]);

  useEffect(() => {
    if (!isOpen || !section) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      const isTyping = document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA';
      if (e.key === 'Escape') { handleSaveAndExit(); return; }
      if (e.key === 'ArrowUp') { e.preventDefault(); handlePrevQuestion(); }
      else if (e.key === 'ArrowDown') { e.preventDefault(); handleNextQuestion(); }
      else if (e.key === 'Enter') {
        if (isTyping && document.activeElement instanceof HTMLTextAreaElement) {
          if (!e.metaKey && !e.ctrlKey) return;
        }
        e.preventDefault();
        handleNextQuestion();
      } else if (!isTyping) {
        const key = e.key.toLowerCase();
        const code = key.charCodeAt(0) - 97;
        const activeQ = currentQuestions[activeQuestionIndex];
        if (activeQ && activeQ.options && code >= 0 && code < activeQ.options.length) {
          e.preventDefault();
          handleSelectOption(activeQ.id, activeQ.options[code], activeQ.type);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
}, [isOpen, section, activeQuestionIndex, handlePrevQuestion, handleNextQuestion, handleSelectOption, handleSaveAndExit, currentQuestions]);

  if (!isOpen || !section) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="thread-questionnaire-modal"
      >
        <div className="thread-questionnaire-modal__scrim" />
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.97 }}
          transition={{ duration: 0.3 }}
          className="thread-questionnaire-modal__panel"
        >
          <div className="flex flex-col h-full justify-between min-h-[480px]">
            {/* Header */}
            <div className="flex items-center justify-between p-6 pb-5 border-b border-black/5">
              <Button
                type="button"
                variant="link"
                onClick={handleSaveAndExit}
                className="border-[var(--color-thread-mid-green)]/30 text-xs font-medium uppercase tracking-wider text-[var(--color-thread-mid-green)] hover:text-[var(--color-thread-heading)]"
                leftIcon={<ArrowLeft className="w-4 h-4" />}
              >
                Save & Exit Section
              </Button>
              <span className="text-xs font-medium text-slate-400 uppercase tracking-tight">
                One question at a time
              </span>
            </div>

            {/* Body */}
            <div ref={bodyScrollRef} className="flex-1 py-8 px-6 sm:px-10 flex flex-col justify-start overflow-y-auto space-y-6">
              <div ref={prevListRef} className="space-y-4 overflow-y-auto max-h-[220px]">
                {currentQuestions.slice(0, activeQuestionIndex).map((q, idx) => {
                  const answer = answers[q.id];
                  const displayAnswer = Array.isArray(answer)
                    ? answer.join(', ')
                    : answer || <span className="text-rose-500 italic font-normal">Not answered</span>;
                  return (
                    <div key={q.id} className="rounded-[28px] bg-slate-50 p-5">
                      <div className="text-[0.72rem] uppercase tracking-[0.18em] text-slate-400 mb-2">Question {idx + 1}</div>
                      <div className="font-medium text-[1rem] text-[var(--color-thread-heading)] leading-snug mb-3">
                        {q.text.replace(/\$\{childName\}/g, childName || 'your child')}
                      </div>
                      <div className="rounded-3xl bg-white border border-black/10 p-4 text-[0.95rem] text-slate-700">
                        {displayAnswer}
                      </div>
                    </div>
                  );
                })}
              </div>
              <AnimatePresence mode="wait">
                {!isReviewing ? (
                  <motion.div
                    ref={currentQuestionRef}
                    key={`question-${activeQuestionIndex}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-8"
                  >
                    {(() => {
                      const q = currentQuestions[activeQuestionIndex];
                      if (!q) return null;
                      const qText = q.text.replace(/\$\{childName\}/g, childName || 'your child');
                      const qSub = q.subtext?.replace(/\$\{childName\}/g, childName || 'your child');

                      return (
                        <div className="space-y-6">
                          <div className="space-y-3">
                            <div className="inline-flex rounded-tr-[18px] rounded-bl-[18px] bg-[var(--color-thread-light-green)]/70 px-4 py-2 text-[0.86rem] font-medium text-[var(--style-light-surface-text)]">
                              {getConversationLead(section || '', activeQuestionIndex)}
                            </div>
                            <div className="flex items-start gap-3">
                              <span className="mt-2 h-7 min-w-7 rounded-full bg-[var(--color-thread-off-white)] text-[0.72rem] font-medium tracking-[0.08em] text-[var(--color-thread-mid-green)] flex items-center justify-center">{activeQuestionIndex + 1}</span>
                              <div>
 <h2 className="font-serif text-2xl md:text-3xl text-[var(--color-thread-heading)] leading-snug">{qText}</h2>
                                <p className="text-[0.84rem] text-slate-500 leading-relaxed mt-2">
                                  {getAnswerCue(q.type)}
                                </p>
                              </div>
                            </div>
                            {qSub && <p className="text-slate-400 text-[0.92rem] ml-10">{qSub}</p>}
                          </div>

                          <div className="ml-0 sm:ml-10">
                            {q.type === 'choice' && q.options && (
                              <div className="space-y-2.5 max-w-lg">
                                {q.options.map((opt, oIdx) => {
                                  const isSelected = answers[q.id] === opt;
                                  const letter = String.fromCharCode(65 + oIdx);
                                  return (
                                    <button
                                      key={opt}
                                      onClick={() => handleSelectOption(q.id, opt, 'choice')}
                                      className={cn(
                                        "w-full p-4 rounded-xl border text-left flex items-center justify-between group transition-all duration-200 cursor-pointer shadow-none",
                                        isSelected
                                          ? "bg-[var(--color-thread-light-green)] border-[var(--color-thread-mid-green)] text-[var(--style-light-surface-text)] font-medium"
                                          : "bg-white border-black/10 text-slate-700 hover:border-black/20 hover:bg-slate-50/50"
                                      )}
                                    >
                                      <div className="flex items-center gap-3">
                                        <span className={cn(
                                          "w-6 h-6 rounded-md border text-[10px] font-mono font-medium flex items-center justify-center transition-colors",
                                          isSelected
                                            ? "bg-[var(--color-thread-mid-green)] border-[var(--color-thread-mid-green)] text-white"
                                            : "bg-white border-black/10 text-slate-400 group-hover:border-black/20 group-hover:text-slate-600"
                                        )}>{letter}</span>
                                        <span className="text-[0.95rem]">{opt}</span>
                                      </div>
                                      {isSelected && <Check className="w-4 h-4 text-[var(--color-thread-mid-green)]" />}
                                    </button>
                                  );
                                })}
                              </div>
                            )}

                            {q.type === 'multiple-choice' && q.options && (
                              <div className="space-y-2.5 max-w-lg">
                                {q.options.map((opt, oIdx) => {
                                  const selectedList = answers[q.id] || [];
                                  const isSelected = selectedList.includes(opt);
                                  const letter = String.fromCharCode(65 + oIdx);
                                  return (
                                    <button
                                      key={opt}
                                      onClick={() => handleSelectOption(q.id, opt, 'multiple-choice')}
                                      className={cn(
                                        "w-full p-4 rounded-xl border text-left flex items-center justify-between group transition-all duration-200 cursor-pointer shadow-none",
                                        isSelected
                                          ? "bg-[var(--color-thread-light-green)] border-[var(--color-thread-mid-green)] text-[var(--style-light-surface-text)] font-medium"
                                          : "bg-white border-black/10 text-slate-700 hover:border-black/20 hover:bg-slate-50/50"
                                      )}
                                    >
                                      <div className="flex items-center gap-3">
                                        <span className={cn(
                                          "w-6 h-6 rounded-md border text-[10px] font-mono font-medium flex items-center justify-center transition-colors",
                                          isSelected
                                            ? "bg-[var(--color-thread-mid-green)] border-[var(--color-thread-mid-green)] text-white"
                                            : "bg-white border-black/10 text-slate-400 group-hover:border-black/20 group-hover:text-slate-600"
                                        )}>{letter}</span>
                                        <span className="text-[0.95rem]">{opt}</span>
                                      </div>
                                      <div className={cn(
                                        "w-5 h-5 rounded-md border flex items-center justify-center transition-all",
                                        isSelected
                                          ? "bg-[var(--color-thread-mid-green)] border-[var(--color-thread-mid-green)] text-white"
                                          : "border-black/10 group-hover:border-black/20 bg-white"
                                      )}>
                                        {isSelected && <Check className="w-3.5 h-3.5" />}
                                      </div>
                                    </button>
                                  );
                                })}
                                <div className="pt-4 flex items-center gap-3">
                                  <Button
                                    type="button"
                                    variant="forest"
                                    onClick={handleNextQuestion}
                                    className="px-6 text-sm font-medium"
                                    rightIcon={<Check className="w-4 h-4" />}
                                  >
                                    That feels right
                                  </Button>
                                  <span className="text-[0.74rem] text-slate-400">then we’ll move on</span>
                                </div>
                              </div>
                            )}

                            {q.type === 'text' && (
                              <div className="max-w-xl space-y-4">
                                <textarea
                                  value={answers[q.id] || ''}
                                  onChange={(e) => handleTextChange(q.id, e.target.value)}
                                  placeholder={q.placeholder || "Type your answer here..."}
                                  rows={3}
                                  className="thread-textarea thread-textarea--white thread-textarea--compact rounded-2xl"
                                />
                                <div className="flex items-center gap-3">
                                  <Button
                                    type="button"
                                    variant="forest"
                                    onClick={handleNextQuestion}
                                    className="px-6 text-sm font-medium"
                                    rightIcon={<Check className="w-4 h-4" />}
                                  >
                                    That feels right
                                  </Button>
                                  <span className="text-[0.74rem] text-slate-400">then we’ll move on</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })()}
                  </motion.div>
                ) : (
                  <motion.div
                    key="review"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div>
 <h3 className="font-serif text-2xl text-[var(--color-thread-heading)] mb-1.5">Quick check before we save this part</h3>
                      <p className="text-slate-500 text-sm">If something does not feel quite right, tap it and choose again.</p>
                    </div>

                    <div className="space-y-3 max-w-xl border-t border-b border-black/5 py-4 my-2 max-h-[300px] overflow-y-auto pr-1">
                      {currentQuestions.map((q, idx) => {
                        const ansVal = answers[q.id];
                        const displayAns = Array.isArray(ansVal)
                          ? ansVal.join(', ')
                          : ansVal || <span className="text-rose-500 italic font-normal">Not answered</span>;
                        return (
                          <button
                            key={q.id}
                            onClick={() => { setActiveQuestionIndex(idx); setIsReviewing(false); }}
                            className="w-full text-left p-3.5 rounded-xl border-0 hover:bg-slate-50/50 transition-all flex justify-between items-start gap-4 cursor-pointer group"
                          >
                            <div className="space-y-1.5">
                              <div className="text-[10px] font-medium text-slate-400 uppercase tracking-wider group-hover:text-[var(--color-thread-mid-green)] transition-colors">Question {idx + 1}</div>
                              <div className="text-[0.95rem] font-medium text-slate-800 leading-snug">{q.text.replace(/\$\{childName\}/g, childName || 'your child')}</div>
                              <div className="text-sm text-[var(--color-thread-mid-green)] font-medium bg-[var(--color-thread-light-green)] inline-block px-3 py-1 rounded-lg mt-2">{displayAns}</div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors mt-1" />
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex gap-3">
                      <Button
                        type="button"
                        variant="forest"
                        onClick={handleSaveAndAdvance}
                        className="px-6 text-sm font-medium"
                      >
                        Save this part
                      </Button>
                      <Button
                        type="button"
                        variant="tertiary"
                        onClick={() => { setIsReviewing(false); setActiveQuestionIndex(0); }}
                        className="px-5 text-sm font-medium"
                      >
                        Look again
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="pt-5 pb-6 px-6 sm:px-10 border-t border-black/5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-xs font-mono font-medium text-slate-400">
                  {!isReviewing ? `${activeQuestionIndex + 1} of ${currentQuestions.length}` : 'Review screen'}
                </span>
                {!isReviewing && (
                  <ProgressBar
                    className="thread-questionnaire-modal__progress"
                    value={activeQuestionIndex + 1}
                    max={currentQuestions.length}
                  />
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[0.74rem] text-slate-400 hidden sm:inline-block font-medium">Move back or forward</span>
                <div className="flex border border-black/10 rounded-xl overflow-hidden bg-white">
                  <button
                    onClick={handlePrevQuestion}
                    disabled={activeQuestionIndex === 0 && !isReviewing}
                    className="p-2.5 hover:bg-slate-50 transition-all border-r border-black/10 cursor-pointer text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed"
                    title="Previous (Arrow Up)"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleNextQuestion}
                    disabled={isReviewing}
                    className="p-2.5 hover:bg-slate-50 transition-all cursor-pointer text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed"
                    title="Next (Arrow Down)"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
