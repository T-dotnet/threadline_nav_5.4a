import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowRight,
  Camera,
  Check,
  FileText,
  Folder,
  Home,
  PenLine,
  School,
  Stethoscope,
} from 'lucide-react';
import {
  getGrowthDomains,
  getQuestionnaireDomainSignals,
} from '../../lib/reflectionDeck';
import { cn } from '../../lib/utils';
import { Button } from './Button';
import { Card, CardContent } from './Card';
import { FloatingDiaryEntries } from './reflection-deck/FloatingDiaryEntries';
import { SectionLabel } from './SectionLabel';
import { SectionTitle } from './SectionTitle';
import { SlideFooter } from './reflection-deck/SlideFooter';
import { WholeMindWheel } from './reflection-deck/WholeMindWheel';
import { useCurrentChild } from '../../context/ChildContext';
import { getChildSubheading, getChildSubheadingByName } from '../../lib/childStatus';

export interface ReflectionDeckData {
  childName: string;
  navigatorHelp: string;
  nextStep: string;
  selectedNotices: string[];
  availableInfo: string[];
  questionnaireAnswers?: Record<string, unknown>;
  initialSlideIndex?: number;
  isPathwayOnly?: boolean;
}

interface ReflectionDeckProps extends ReflectionDeckData {
  onBackToSetup: () => void;
  onGoToProfile: () => void;
  onSetUpAnotherChild: () => void;
  initialSlideIndex?: number;
  isPathwayOnly?: boolean;
}

// Shared heading style for completion slides — matches the onboarding flow's
// serif step headings (see AddChildFlow stepHeadingClass) so the whole /setup
// flow reads as one consistent experience.
const SLIDE_HEADING_CLASS =
  'font-serif font-normal text-[2rem] sm:text-[2.35rem] leading-[1.12] tracking-tight text-[var(--color-thread-heading)]';

export function ReflectionDeck({
  childName,
  navigatorHelp,
  nextStep,
  selectedNotices,
  availableInfo,
  questionnaireAnswers,
  onBackToSetup,
  onGoToProfile,
  onSetUpAnotherChild,
  initialSlideIndex,
  isPathwayOnly,
}: ReflectionDeckProps) {
  const [slideIndex, setSlideIndex] = useState(isPathwayOnly ? 3 : (initialSlideIndex ?? 0));
  const { currentChild } = useCurrentChild();
  const activeStatus = (currentChild && currentChild.name === childName)
    ? getChildSubheading(currentChild)
    : getChildSubheadingByName(childName);

  const isDiagnosticActive = activeStatus === 'Diagnostic Assessment';
  const isNavigatorActive = activeStatus === 'Navigator Care';
  const questionnaireSignals = useMemo(
    () => getQuestionnaireDomainSignals(selectedNotices, questionnaireAnswers),
    [questionnaireAnswers, selectedNotices],
  );
  const selectedDomains = useMemo(() => questionnaireSignals.map((signal) => signal.key), [questionnaireSignals]);
  const growthDomains = useMemo(() => getGrowthDomains(selectedDomains, availableInfo), [availableInfo, selectedDomains]);
  const cleanedInfo = useMemo(() => availableInfo.filter((item) => item !== 'Nothing yet'), [availableInfo]);
  const hasSchoolContext = cleanedInfo.some((item) => item === 'School reports' || item === 'Teacher observations');
  const hasClinicianContext = cleanedInfo.some(
    (item) =>
      item === 'GP or paediatrician reports' ||
      item === 'Psychology reports' ||
      item === 'Speech reports' ||
      item === 'OT reports' ||
      item === 'Previous assessments',
  );

  const slides = [
    {
      id: 'whole-mind-profile',
      content: (
        <div className="grid xl:grid-cols-[0.82fr_1.18fr] gap-8 items-stretch">
          <div className="space-y-6">
            <div className="space-y-6">
              <div>
                <SectionLabel>Your Whole Mind Profile</SectionLabel>
                <SectionTitle className={cn(SLIDE_HEADING_CLASS, 'mb-0')}>
                  Meet {childName}&apos;s Whole Mind Profile
                </SectionTitle>
              </div>

              <div className="space-y-2">
                <p className="text-[0.98rem] leading-relaxed text-[var(--color-thread-gray)]">
                  You&apos;ve helped us begin building {childName}&apos;s Whole Mind Profile.
                </p>
                <p className="text-[0.98rem] leading-relaxed text-[var(--color-thread-gray)]">
                  Every conversation, questionnaire, report and clinician review adds another piece to the
                  picture. Today you&apos;ve taken the very first step.
                </p>
              </div>
            </div>

            <div className="space-y-5 pt-1">
              <div>
                <p className="text-[0.98rem] leading-relaxed text-[var(--color-thread-gray)] mb-5">
                  Here&apos;s where the picture is beginning to take shape.
                </p>
                {questionnaireSignals.length > 0 ? (
                  <div className="space-y-3">
                    {questionnaireSignals.map((signal, index) => (
                      <motion.div
                        key={signal.key}
                        className="flex items-center gap-3 text-[0.98rem] text-[var(--color-thread-heading)]"
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.26, ease: 'easeOut', delay: 0.08 + index * 0.05 }}
                      >
                        <span className="w-10 h-10 rounded-full bg-[var(--color-thread-light-green)] flex items-center justify-center text-[var(--color-thread-mid-green)] flex-shrink-0">
                          <Check className="w-4 h-4" />
                        </span>
                        <span className="min-w-0">
                          <span className="block font-medium">{signal.label}</span>
                        </span>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[0.92rem] leading-relaxed text-[var(--color-thread-gray)]">
                    The profile will start showing domains once answers are added.
                  </p>
                )}
              </div>

              <div className="pt-2">
                <p className="text-[1rem] font-medium leading-snug text-[var(--color-thread-heading)] mb-1.5">
                  This isn&apos;t a diagnosis or a final answer.
                </p>
                <p className="text-[0.98rem] leading-relaxed text-[var(--color-thread-gray)]">
                  It&apos;s an early, living picture that will grow clearer as we learn more about {childName}.
                </p>
              </div>
            </div>
          </div>

          <Card className="bg-[var(--color-thread-off-white)] h-full">
            <CardContent className="p-5 sm:p-6 h-full flex items-center justify-center">
              <WholeMindWheel childName={childName} activeKeys={selectedDomains} variant="intro" />
            </CardContent>
          </Card>
        </div>
      ),
    },
    {
      id: 'story-grows',
      content: (
        <div className="grid xl:grid-cols-[0.82fr_1.18fr] gap-8 items-stretch">
          <div className="space-y-6">
            <div className="space-y-6">
              <div>
                <SectionLabel>How {childName}&apos;s profile grows</SectionLabel>
                <SectionTitle className={cn(SLIDE_HEADING_CLASS, 'mb-0')}>
                  Your child&apos;s story grows over time
                </SectionTitle>
              </div>

              <div className="space-y-2">
                <p className="text-[0.98rem] leading-relaxed text-[var(--color-thread-gray)]">
                  The more we learn, the clearer the picture becomes.
                </p>
                <p className="text-[0.98rem] leading-relaxed text-[var(--color-thread-gray)]">
                  Today&apos;s answers were just the beginning. {childName}&apos;s Whole Mind Profile grows as new
                  information is added, from home, school, clinicians and everyday life.
                </p>
              </div>
            </div>

            <div className="space-y-4 pt-1">
              {[
                {
                  icon: Home,
                  title: 'Everyday observations',
                  description: 'From you and your family.',
                },
                {
                  icon: FileText,
                  title: 'Reports',
                  description: 'School reports, assessments and letters can be added whenever you have them.',
                },
                {
                  icon: School,
                  title: 'School information',
                  description: hasSchoolContext
                    ? 'Teachers, observations and feedback are already shaping the picture.'
                    : 'Teachers, observations and feedback can be added as they become useful.',
                },
                {
                  icon: Stethoscope,
                  title: 'Clinician insights',
                  description: hasClinicianContext
                    ? 'Conversations, reviews and expert input will add depth without losing your context.'
                    : 'Conversations, reviews and expert input will layer in as the assessment moves forward.',
                },
              ].map(({ icon: Icon, title, description }, index) => (
                <motion.div
                  key={title}
                  className="flex items-start gap-4"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.26, ease: 'easeOut', delay: 0.08 + index * 0.05 }}
                >
                  <div className="w-10 h-10 rounded-full bg-[var(--color-thread-light-green)] text-[var(--color-thread-mid-green)] flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-[1rem] font-medium leading-snug text-[var(--color-thread-heading)] mb-1.5">
                      {title}
                    </h3>
                    <p className="text-[0.92rem] leading-relaxed text-[var(--color-thread-gray)]">
                      {description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <Card className="bg-[var(--color-thread-off-white)] h-full">
            <CardContent className="p-5 sm:p-6 h-full flex items-center justify-center">
              <WholeMindWheel childName={childName} activeKeys={growthDomains} variant="growth" />
            </CardContent>
          </Card>
          </div>
      ),
    },
    {
      id: 'navigator-help',
      content: (
        <div className="grid xl:grid-cols-[0.82fr_1.18fr] gap-8 items-stretch">
          <div className="space-y-6">
            <div className="space-y-6">
              <div>
                <SectionLabel>How Navigator can help</SectionLabel>
                <SectionTitle className={cn(SLIDE_HEADING_CLASS, 'mb-0')}>
                  Keep everything in one place, without rushing the picture.
                </SectionTitle>
              </div>

              <div className="space-y-2">
                <p className="text-[0.98rem] leading-relaxed text-[var(--color-thread-gray)]">
                  Navigator is built to hold everything in one place, help you notice what matters, and guide the next
                  gentle step.
                </p>
                <p className="text-[0.98rem] leading-relaxed text-[var(--color-thread-gray)]">
                  From your workspace, you can keep adding the small pieces that help {childName}&apos;s story become clearer.
                </p>
              </div>
            </div>

            <div className="space-y-4 pt-1">
              {[
                {
                  icon: FileText,
                  title: 'Add reports and documents',
                  description: 'Upload school reports, clinician letters, assessments and more.',
                },
                {
                  icon: Camera,
                  title: 'Save photos and documents',
                  description: `Anything that helps tell ${childName}'s story belongs here.`,
                },
                {
                  icon: PenLine,
                  title: 'Record everyday observations',
                  description: 'Quick notes about wins, challenges, moods and routines.',
                },
                {
                  icon: Folder,
                  title: 'Keep everything together',
                  description: 'Securely organised and always easy to find.',
                },
              ].map(({ icon: Icon, title, description }, index) => (
                <motion.div
                  key={title}
                  className="flex items-start gap-4"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.26, ease: 'easeOut', delay: 0.08 + index * 0.05 }}
                >
                  <div className="w-10 h-10 rounded-full bg-[var(--color-thread-light-green)] text-[var(--color-thread-mid-green)] flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-[1rem] font-medium leading-snug text-[var(--color-thread-heading)] mb-1.5">
                      {title}
                    </h3>
                    <p className="text-[0.92rem] leading-relaxed text-[var(--color-thread-gray)]">
                      {description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <Card className="bg-[var(--color-thread-off-white)] h-full">
            <CardContent className="p-5 sm:p-6 h-full flex items-center justify-center">
              <FloatingDiaryEntries childName={childName} />
            </CardContent>
          </Card>
        </div>
      ),
    },
    {
      id: 'choose-pathway',
      content: (
        <div className="space-y-6">
          <div className="space-y-2">
            <SectionLabel>Your Care Options</SectionLabel>
            <SectionTitle className={cn(SLIDE_HEADING_CLASS, 'mb-0')}>
              Choose your pathway.
            </SectionTitle>
            <p className="text-[0.98rem] leading-relaxed text-[var(--color-thread-gray)] max-w-3xl">
              Based on where you are in your journey, you can choose the option that best supports your family right now.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 items-stretch">
            {/* Left Card: Diagnostic Assessment */}
            <Card className="bg-white border border-black/5 rounded-2xl shadow-none flex flex-col justify-between">
              <div className="p-6 sm:p-7.5 flex flex-col h-full justify-between">
                <div className="space-y-4">
                  <div className="w-10 h-10 rounded-full bg-[var(--color-thread-light-green)] flex items-center justify-center text-[var(--color-thread-mid-green)]">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      <circle cx="12" cy="13" r="1" />
                      <path strokeLinecap="round" d="M12 17h.01" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-[1.38rem] font-serif font-normal text-[var(--color-thread-heading)] leading-snug">Diagnostic assessment</h3>
                    <p className="text-[0.88rem] leading-normal text-[var(--color-thread-gray)] mt-1.5 font-normal">For families seeking answers.</p>
                  </div>
                  <p className="text-[0.92rem] leading-relaxed text-[var(--color-thread-gray)] mt-3">
                    A comprehensive assessment to understand your child&apos;s strengths and challenges, and whether a neurodevelopmental condition may explain what you&apos;re seeing.
                  </p>
                  
                  <div className="border-t border-black/5 my-4" />
                  
                  <ul className="space-y-2.5 pt-1">
                    {[
                      'Comprehensive multidisciplinary assessment',
                      'Personalised report',
                      'Clear recommendations',
                      'Access to Navigator',
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-[0.9rem] text-[var(--color-thread-dark-slate)] leading-snug">
                        <Check className="w-[15px] h-[15px] text-[var(--color-thread-mid-green)] mt-0.5 flex-shrink-0 stroke-[2.5]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="pt-6 border-t border-black/5 mt-6 flex items-center justify-between">
                  {isDiagnosticActive ? (
                    <div className="flex items-center justify-end w-full">
                      <div className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[var(--color-thread-light-green)] text-[var(--color-thread-mid-green)] rounded-full text-[0.85rem] font-semibold">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>Current plan</span>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-baseline">
                        <span className="text-2xl sm:text-[1.85rem] font-serif font-normal text-[var(--color-thread-heading)] leading-none tracking-tight">$1,850</span>
                        <span className="text-[0.82rem] text-[var(--color-thread-gray)] ml-2.5 font-normal">One-off</span>
                      </div>
                      <Button variant="secondary" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                        Learn more
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </Card>

            {/* Right Card: Navigator Care Program */}
            <Card className="bg-white border border-black/5 rounded-2xl shadow-none flex flex-col justify-between">
              <div className="p-6 sm:p-7.5 flex flex-col h-full justify-between">
                <div className="space-y-4">
                  <div className="w-10 h-10 rounded-full bg-[var(--color-thread-light-green)] flex items-center justify-center text-[var(--color-thread-mid-green)]">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-[1.38rem] font-serif font-normal text-[var(--color-thread-heading)] leading-snug">Navigator Care Program</h3>
                    <p className="text-[0.88rem] leading-normal text-[var(--color-thread-gray)] mt-1.5 font-normal">For families wanting ongoing guidance.</p>
                  </div>
                  <p className="text-[0.92rem] leading-relaxed text-[var(--color-thread-gray)] mt-3">
                    Ongoing support to help you focus on what matters, track progress, prepare for reviews, and adapt your plan as your child grows.
                  </p>
                  
                  <div className="border-t border-black/5 my-4" />
                  
                  <ul className="space-y-2.5 pt-1">
                    {[
                      'Continuous Priority Reviews',
                      'Family Workspace',
                      'Clinician reviews',
                      'Adaptive care plans',
                      'Personalised resources',
                      'Secure document library',
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-[0.9rem] text-[var(--color-thread-dark-slate)] leading-snug">
                        <Check className="w-[15px] h-[15px] text-[var(--color-thread-mid-green)] mt-0.5 flex-shrink-0 stroke-[2.5]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="pt-6 border-t border-black/5 mt-6 flex items-center justify-between">
                  {isNavigatorActive ? (
                    <div className="flex items-center justify-end w-full">
                      <div className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[var(--color-thread-light-green)] text-[var(--color-thread-mid-green)] rounded-full text-[0.85rem] font-semibold">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>Current plan</span>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-baseline">
                        <span className="text-2xl sm:text-[1.85rem] font-serif font-normal text-[var(--color-thread-heading)] leading-none tracking-tight">$490</span>
                        <div className="flex flex-col ml-2.5">
                          <span className="text-[0.78rem] text-[var(--color-thread-gray)] font-medium leading-none">Every 90 days</span>
                          <span className="text-[0.68rem] text-[var(--color-thread-gray)]/85 font-normal mt-0.5 leading-none">Annual commitment</span>
                        </div>
                      </div>
                      <Button variant="secondary" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                        Learn more
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </Card>
          </div>

          {/* Evidence/Family Focused Bottom Banner */}
          <div className="bg-[var(--color-thread-light-green)]/35 p-4.5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-[var(--color-thread-light-green)] flex items-center justify-center text-[var(--color-thread-mid-green)] flex-shrink-0 mt-0.5">
                <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h4 className="text-[0.92rem] font-medium text-[var(--color-thread-heading)] leading-snug">Evidence-informed. Family-focused.</h4>
                <p className="text-[0.86rem] text-[var(--color-thread-gray)] leading-normal mt-0.5">
                  Both pathways are designed by clinicians and built on the Whole Mind Model™ to support better decisions and better outcomes for your child.
                </p>
              </div>
            </div>
            <Button variant="link" className="text-[var(--color-thread-mid-green)] border-[var(--color-thread-mid-green)]/40 hover:text-[var(--color-thread-heading)] hover:border-[var(--color-thread-heading)] cursor-pointer self-end sm:self-auto" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
              How it works
            </Button>
          </div>
        </div>
      ),
    },
  ];

  const isLastSlide = slideIndex === slides.length - 1;
  const previousLabel = slideIndex === 0 ? 'Back' : 'Previous slide';
  const nextLabel = isLastSlide ? `See ${childName} profile` : 'Next slide';

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 px-8 pb-6 pt-8 sm:px-10 sm:pb-8 sm:pt-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={slides[slideIndex].id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.24, ease: 'easeOut' }}
            className="min-h-[27rem]"
          >
            {slides[slideIndex].content}
          </motion.div>
        </AnimatePresence>
      </div>

      {!isPathwayOnly && (
        <SlideFooter
          slides={slides}
          slideIndex={slideIndex}
          previousLabel={previousLabel}
          nextLabel={nextLabel}
          onPrevious={() => {
            if (slideIndex === 0) {
              onBackToSetup();
              return;
            }
            setSlideIndex((current) => current - 1);
          }}
          onNext={() => {
            if (isLastSlide) {
              onGoToProfile();
              return;
            }
            setSlideIndex((current) => current + 1);
          }}
          onSelectSlide={setSlideIndex}
        />
      )}
    </div>
  );
}
