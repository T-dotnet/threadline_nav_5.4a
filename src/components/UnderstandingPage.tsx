import { useState } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { Clock, ClipboardList, Download, Lock, Users, ArrowRight, NotebookPen } from "lucide-react";
import { Page } from "../types";
import { getChildData } from "../data";
import { PageHeader } from "./ui/PageHeader";
import { PageMetaRow } from "./ui/PageMetaRow";
import { HeroQuoteCard } from "./ui/HeroQuoteCard";
import { HeroActionCard } from "./ui/HeroActionCard";
import { ActionPromptPanel } from "./ui/ActionPromptPanel";
import { SectionTitle } from "./ui/SectionTitle";
import { SectionLabel } from "./ui/SectionLabel";
import { SectionDescription } from "./ui/SectionDescription";
import { ValueCard } from "./ui/ValueCard";
import { AreaItem } from "./ui/AreaItem";
import { FadeInScroll } from "./ui/FadeInScroll";
import { PageFooterCTA } from "./ui/PageFooterCTA";
import { GuideCard } from "./ui/GuideCard";
import { ActionLink } from "./ui/ActionLink";
import { QuestionnaireModal } from "./ui/QuestionnaireModal";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";
import { QUESTIONS, QUESTIONNAIRE_SECTIONS, formatAnswer, getAnsweredCount, getCompletedQuestionnaireSections, normalizeQuestionnaireSectionName } from "../questionnaire";

import img2912 from "../assets/images/IMG_2912.jpeg";
import img2947 from "../assets/images/IMG_2947.jpeg";
import creativePlayImg from "../assets/images/optimized/abstract-classroom-support-900.jpg";

import { PageContainer } from "./ui/PageContainer";

import { useCurrentChild } from "../context/ChildContext";
import { useDisplayMode } from "../context/DisplayModeContext";
import { isMaintenancePhase, isPlanNotStarted } from "../lib/childStatus";
import { getJourneyUnderstandingCopy, hasReportContext } from "../lib/journeyCopy";
import { getStartingPlanStrengthCards } from "../lib/profileNarratives";
import { getResourceGuides } from "../lib/resourceGuides";
import { getFeatureCardCornerClass } from "../lib/cornerStyles";

function answerText(answers: Record<string, unknown>, id: string) {
  return formatAnswer(answers[id]).trim();
}

function LockedQuestionnaireSection({
  answeredCount,
  onStart,
  questionCount,
}: {
  answeredCount: number;
  onStart: () => void;
  questionCount: number;
}) {
  return (
    <Card className="rounded-tr-[32px]">
      <CardHeader className="flex flex-row items-start justify-between gap-5 p-7.5 pb-0">
        <div>
          <span className="text-[0.66rem] tracking-[0.16em] uppercase text-slate-400 font-medium mb-2 block">
            Locked
          </span>
          <CardTitle className="font-serif font-light text-[1.45rem] leading-tight">
            Nothing recorded yet.
          </CardTitle>
        </div>
        <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-slate-100 text-slate-400">
          <Lock className="w-4.5 h-4.5" />
        </div>
      </CardHeader>
      <CardContent className="p-7.5 pt-5">
        <p className="text-[0.92rem] leading-relaxed text-slate-500 mb-5 max-w-[56ch]">
          Answer all {questionCount} questions in this section to open it here.{answeredCount > 0 ? ` ${answeredCount} answered so far.` : ""}
        </p>
        <ActionLink
          variant="forest"
          onClick={onStart}
          icon={ArrowRight}
          className="text-[0.84rem]"
        >
          {answeredCount > 0 ? "Continue section" : "Start section"}
        </ActionLink>
      </CardContent>
    </Card>
  );
}

function UnderstandingDiaryPrompt({
  childName,
  hasContextReady,
  onAddNote,
}: {
  childName: string;
  hasContextReady: boolean;
  onAddNote: () => void;
}) {
  return (
    <ActionPromptPanel
      label="Reports or information ready"
      title="Add notes in Diary. We'll keep the picture updated."
      description={
        hasContextReady
          ? `If a report, school note, or everyday observation changes what you understand about ${childName}, add a short note in Diary. Threadline can use those notes to keep this understanding clearer and more up to date.`
          : `When something new happens at home, school, or in a report, add a short note in Diary. Threadline can use those notes to keep ${childName}'s understanding clearer and more up to date.`
      }
      action={
        <HeroActionCard
          icon={<NotebookPen className="w-[22px] h-[22px] stroke-[1.7]" />}
          title="Add diary note"
          subtitle="Open Diary"
          onClick={onAddNote}
        />
      }
    />
  );
}

export default function UnderstandingPage({
  onPageChange,
  onOpenSetup,
}: {
  onPageChange: (page: Page) => void;
  onOpenSetup?: () => void;
}) {
  const { currentChild, updateChild } = useCurrentChild();
  const navigate = useNavigate();
  const { isParentClarity } = useDisplayMode();
  const [activeQuestionnaireSection, setActiveQuestionnaireSection] = useState<string | null>(null);
  const data = getChildData(currentChild).understanding;
  const isStartingPlan = isPlanNotStarted(currentChild);
  const showParentClarity = isParentClarity && !currentChild.isNew && !isMaintenancePhase(currentChild) && !isStartingPlan;
  const answers = currentChild.intake?.questionnaireAnswers || {};
  const completedSections = (currentChild.intake?.completedQuestionnaireSections || getCompletedQuestionnaireSections(answers)).map(normalizeQuestionnaireSectionName);
  const completedCount = completedSections.length;
  const totalSections = QUESTIONNAIRE_SECTIONS.length;
  const progress = Math.round((completedCount / totalSections) * 100);
  const firstIncompleteSection = QUESTIONNAIRE_SECTIONS.find((section) => !completedSections.includes(section));
  const journeyUnderstandingCopy = getJourneyUnderstandingCopy(currentChild.name, currentChild.intake?.journeyStage);
  const strengthsSectionName = QUESTIONNAIRE_SECTIONS[0];
  const seeingSectionName = QUESTIONNAIRE_SECTIONS[1];
  const isStrengthsUnlocked = completedSections.includes(strengthsSectionName);
  const isSeeingUnlocked = completedSections.includes(seeingSectionName);
  const strengthsAnsweredCount = getAnsweredCount(strengthsSectionName, answers);
  const seeingAnsweredCount = getAnsweredCount(seeingSectionName, answers);
  const strengthsQuestionCount = QUESTIONS[strengthsSectionName]?.length || 0;
  const seeingQuestionCount = QUESTIONS[seeingSectionName]?.length || 0;
  const recommendedGuides = getResourceGuides(currentChild).slice(0, 3);
  const startingStrengthCards = getStartingPlanStrengthCards(currentChild);
  const reportOrInformationReady = !currentChild.isNew || hasReportContext(currentChild.intake?.availableInfo);
  const openDiaryComposer = () => navigate("/diary?compose=1");

  const saveQuestionnaireAnswers = (updatedAnswers: Record<string, unknown>) => {
    updateChild({
      ...currentChild,
      intake: {
        ...currentChild.intake,
        questionnaireAnswers: updatedAnswers,
        completedQuestionnaireSections: getCompletedQuestionnaireSections(updatedAnswers),
      },
    });
  };

  // After saving a section, advance to the next incomplete section (or close modal if all done)
  const saveQuestionnaireAnswersAndAdvance = (updatedAnswers: Record<string, unknown>) => {
    saveQuestionnaireAnswers(updatedAnswers);
    const completed = getCompletedQuestionnaireSections(updatedAnswers);
    const next = QUESTIONNAIRE_SECTIONS.find((section) => !completed.includes(section)) || null;
    setActiveQuestionnaireSection(next);
  };

  if (currentChild.isNew) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="pt-16 pb-16"
      >
        <PageContainer>
          <PageHeader
            kicker={journeyUnderstandingCopy.kicker}
            title={journeyUnderstandingCopy.title}
            titleClassName="md:leading-[4.5rem]"
            className="mb-14"
            description={
              <PageMetaRow
                items={[
                  { icon: Clock, children: "Intake in progress" },
                  { icon: Users, children: "Built from questionnaire answers" },
                ]}
              />
            }
          />

          <HeroQuoteCard
            kicker="The picture so far"
            quote={journeyUnderstandingCopy.quote}
            evidenceLevel={completedCount > 0 ? 2 : 1}
            evidenceText={`${completedCount} of ${totalSections} sections unlocked`}
            className="mb-24"
            rightNode={
              <HeroActionCard
                icon={<ClipboardList className="w-[22px] h-[22px] stroke-[1.7]" />}
                title={`${progress}%`}
                subtitle="Questionnaire progress"
              />
            }
          />

          <FadeInScroll className="mb-24">
            <div>
              <SectionLabel>
                What's going well
              </SectionLabel>
              <SectionTitle>
                Strengths to build on.
              </SectionTitle>
              <SectionDescription>
                The skills and qualities that already help {currentChild.name} navigate their day.
              </SectionDescription>
            </div>

            {isStrengthsUnlocked ? (
              <div className="grid grid-cols-3 gap-6 max-md:grid-cols-1 mt-8">
                <GuideCard
                  category="Strength"
                  title={answerText(answers, "attention_focus") || "Strengths emerging"}
                  description={`${currentChild.name} seems most confident or settled here. This gives the first session something positive to build from.`}
                  readTime=""
                  image={creativePlayImg}
                  cornerClass="rounded-tr-[32px]"
                  actionText="Explore strength"
                  onClick={() => setActiveQuestionnaireSection(strengthsSectionName)}
                />
                <GuideCard
                  category="Support that helps"
                  title={answerText(answers, "behaviour_emotions") || "Helpful support"}
                  description="This is the kind of support that may help the day feel safer, calmer, or easier to restart."
                  readTime=""
                  image={img2947}
                  cornerClass="rounded-tl-[32px]"
                  actionText="Explore strength"
                  onClick={() => setActiveQuestionnaireSection(strengthsSectionName)}
                />
                <GuideCard
                  category="Best rhythm"
                  title={answerText(answers, "sleep") || "Best part of the day"}
                  description="Knowing when things tend to go best helps your child's clinician understand what already works."
                  readTime=""
                  image={img2912}
                  cornerClass="rounded-bl-[32px]"
                  actionText="Explore strength"
                  onClick={() => setActiveQuestionnaireSection(strengthsSectionName)}
                />
              </div>
            ) : (
              <div className="mt-8">
                <LockedQuestionnaireSection
                  answeredCount={strengthsAnsweredCount}
                  onStart={() => setActiveQuestionnaireSection(strengthsSectionName)}
                  questionCount={strengthsQuestionCount}
                />
              </div>
            )}
          </FadeInScroll>

          <FadeInScroll className="mb-24">
            <div>
              <SectionLabel>
                What you're seeing
              </SectionLabel>
              <SectionTitle>
                Areas affecting {currentChild.name}'s day.
              </SectionTitle>
              <SectionDescription>
                Specific areas where {currentChild.name} may need more support or scaffolding.
              </SectionDescription>
            </div>

            {isSeeingUnlocked ? (
              <div className="border-b border-black/10 mt-8">
                <AreaItem
                  title={answerText(answers, "learning") || "Hardest right now"}
                  impact=""
                  description="This is the area that feels hardest at the moment, based on the intake answer."
                  actionText="See coping strategies"
                  actionPlacement="after-sources"
                  onAction={() => onPageChange("resources")}
                  sources={["Questionnaire"]}
                />
                <AreaItem
                  title={answerText(answers, "movement_coordination") || "Support needed"}
                  impact=""
                  description="This shows where extra scaffolding, reassurance, or practical support may be most useful."
                  actionText="See coping strategies"
                  actionPlacement="after-sources"
                  onAction={() => onPageChange("resources")}
                  sources={["Questionnaire"]}
                />
                <AreaItem
                  title={answerText(answers, "speech_communication") || "Overload signal"}
                  impact=""
                  description={`This is how ${currentChild.name} may show that something is becoming too much.`}
                  actionText="See coping strategies"
                  actionPlacement="after-sources"
                  onAction={() => onPageChange("resources")}
                  sources={["Questionnaire"]}
                />
              </div>
            ) : (
              <div className="mt-8">
                <LockedQuestionnaireSection
                  answeredCount={seeingAnsweredCount}
                  onStart={() => setActiveQuestionnaireSection(seeingSectionName)}
                  questionCount={seeingQuestionCount}
                />
              </div>
            )}
          </FadeInScroll>

          <FadeInScroll className="grid grid-cols-2 gap-6 mb-24 max-md:grid-cols-1">
            <ValueCard
              variant="mint"
              title={journeyUnderstandingCopy.firstValueTitle}
              content={journeyUnderstandingCopy.firstValue}
              cornerClass="rounded-tr-[32px]"
            />
            <ValueCard
              variant="white"
              title={journeyUnderstandingCopy.secondValueTitle}
              content={journeyUnderstandingCopy.secondValue}
              cornerClass="rounded-bl-[32px]"
            />
          </FadeInScroll>

          <FadeInScroll className="mb-24">
            <UnderstandingDiaryPrompt
              childName={currentChild.name}
              hasContextReady={reportOrInformationReady}
              onAddNote={openDiaryComposer}
            />
          </FadeInScroll>

          <FadeInScroll className="mb-24">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <SectionLabel>
                  From resources
                </SectionLabel>
                <SectionTitle>
                  Three articles to read next.
                </SectionTitle>
                <SectionDescription>
                  Hand-picked articles based on {currentChild.name}'s profile.
                </SectionDescription>
              </div>
              <ActionLink
                variant="forest"
                as="button"
                onClick={() => onPageChange("resources")}
                className="text-[0.84rem]"
              >
                See all resources
              </ActionLink>
            </div>

            <div className="grid grid-cols-3 gap-6 max-md:grid-cols-1 mt-8">
              {recommendedGuides.map((guide, index) => {
                return (
                  <GuideCard
                    key={guide.title}
                    {...guide}
                    cornerClass={getFeatureCardCornerClass(index)}
                    actionText="Open in resources"
                    onClick={() => onPageChange("resources")}
                  />
                );
              })}
            </div>
          </FadeInScroll>
        </PageContainer>

        <PageFooterCTA
          title={completedCount === totalSections ? journeyUnderstandingCopy.footerTitle : "Keep adding context."}
          buttonText={completedCount === totalSections ? "Back to home" : "Continue module"}
          buttonVariant={completedCount === totalSections ? "primary" : "secondary"}
          onClick={() => completedCount === totalSections ? onPageChange("home") : setActiveQuestionnaireSection(firstIncompleteSection || QUESTIONNAIRE_SECTIONS[0])}
        />

        <QuestionnaireModal
          isOpen={Boolean(activeQuestionnaireSection)}
          section={activeQuestionnaireSection}
          answers={answers}
          childName={currentChild.name}
          onClose={() => setActiveQuestionnaireSection(null)}
          onSave={saveQuestionnaireAnswersAndAdvance}
        />

      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="pt-16 pb-16"
    >
      <PageContainer>
        <PageHeader
        kicker="Understanding · What's happening"
        title={`A clear picture of how ${currentChild.name} is doing.`}
        titleClassName="md:leading-[4.5rem]"
        className="mb-24"
        description={
          <PageMetaRow
            items={[
              { icon: Clock, children: "Updated 14 June 2026" },
              { icon: Users, children: "Brought together from 4 sources" },
            ]}
          />
        }
      />

      {/* Picture Card */}
      <HeroQuoteCard
        kicker="The picture so far"
        quote={showParentClarity ? `${currentChild.name} is bright and socially steady. The clearest support need right now is classroom focus, and sleep is worth watching because tired mornings may make attention harder.` : data.description}
        evidenceLevel={3}
        evidenceText="Strong, consistent evidence"
        className="mb-24"
        rightNode={
          <HeroActionCard
            icon={<Download className="w-[22px] h-[22px] stroke-[1.7]" />}
            title="Report"
            subtitle="Download PDF"
          />
        }
      />

      {/* Strengths Section */}
      <FadeInScroll className="mb-24">
        <div>
          <SectionLabel>
            What's going well
          </SectionLabel>
          <SectionTitle>
            Strengths to build on.
          </SectionTitle>
          <SectionDescription>
            The skills and qualities that already help {currentChild.name} navigate their day.
          </SectionDescription>
        </div>

        <div className="grid grid-cols-3 gap-6 max-md:grid-cols-1 mt-8">
          <GuideCard
            category={isStartingPlan ? startingStrengthCards[0].category : "High Competency"}
            title={isStartingPlan ? startingStrengthCards[0].title : "Creative Play"}
            description={isStartingPlan ? startingStrengthCards[0].description : "Displays rich imaginative flow, abstract play and artistic task retention. A real strength to integrate into curriculum pathways."}
            readTime=""
            image={creativePlayImg}
            cornerClass="rounded-tr-[32px]"
            actionText="Explore strength"
          />
          <GuideCard
            category={isStartingPlan ? startingStrengthCards[1].category : "Exceptional Grasp"}
            title={isStartingPlan ? startingStrengthCards[1].title : "Verbal Comprehension"}
            description={isStartingPlan ? startingStrengthCards[1].description : "Excellent grasp of spoken guidelines and a highly adaptive communicative scope. Enthusiastic sharing is seen daily."}
            readTime=""
            image={img2947}
            cornerClass="rounded-tl-[32px]"
            actionText="Explore strength"
          />
          <GuideCard
            category={isStartingPlan ? startingStrengthCards[2].category : "Active Skillset"}
            title={isStartingPlan ? startingStrengthCards[2].title : "Social Empathy"}
            description={isStartingPlan ? startingStrengthCards[2].description : "Deep sensitivity to family members and primary playground buddies. Welcomes constructive social feedback loop cues."}
            readTime=""
            image={img2912}
            cornerClass="rounded-bl-[32px]"
            actionText="Explore strength"
          />
        </div>
      </FadeInScroll>

      {/* Areas Affecting Section */}
      <FadeInScroll className="mb-24">
        <div>
          <SectionLabel>
            What you're seeing
          </SectionLabel>
          <SectionTitle>
            {showParentClarity ? `What affects ${currentChild.name}'s day most.` : `Areas affecting ${currentChild.name}'s day.`}
          </SectionTitle>
          <SectionDescription>
            Specific areas where {currentChild.name} may need more support or scaffolding.
          </SectionDescription>
        </div>

        <div className="border-b border-black/10 mt-8">
          {data.focusAreas.map((area, idx) => (
            <AreaItem
              key={idx}
              title={area.title}
              impact=""
              evidence={3}
              description={area.description}
              sources={area.sources}
              actionText="See coping strategies"
              actionPlacement="after-sources"
              onAction={() => onPageChange("resources")}
            />
          ))}
        </div>
      </FadeInScroll>

      {/* Values Section */}
      <FadeInScroll className="grid grid-cols-2 gap-6 mb-24 max-md:grid-cols-1">
        <ValueCard
          variant="mint"
          title="Evidence → formulation"
          content="Every insight here is traced to its source and reviewed by a qualified clinician — not generated in isolation. Where the evidence is strong, we say so plainly."
          cornerClass="rounded-tr-[32px]"
        />
        <ValueCard
          variant="white"
          title="Honest about uncertainty"
          content="Where the evidence isn't strong enough, we don't force a conclusion. 'More to explore' is a valid, useful result — and the picture keeps building as new information arrives."
          cornerClass="rounded-bl-[32px]"
        />
      </FadeInScroll>

      <FadeInScroll className="mb-24">
        <UnderstandingDiaryPrompt
          childName={currentChild.name}
          hasContextReady={reportOrInformationReady}
          onAddNote={openDiaryComposer}
        />
      </FadeInScroll>

      <FadeInScroll className="mb-24">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <SectionLabel>
              From resources
            </SectionLabel>
            <SectionTitle>
              Three articles to read next.
            </SectionTitle>
            <SectionDescription>
              Hand-picked articles based on {currentChild.name}'s profile.
            </SectionDescription>
          </div>
          <ActionLink
            variant="forest"
            as="button"
            onClick={() => onPageChange("resources")}
            className="text-[0.84rem]"
          >
            See all resources
          </ActionLink>
        </div>

        <div className="grid grid-cols-3 gap-6 max-md:grid-cols-1 mt-8">
          {recommendedGuides.map((guide, index) => {
            return (
              <GuideCard
                key={guide.title}
                {...guide}
                cornerClass={getFeatureCardCornerClass(index)}
                actionText="Open in resources"
                onClick={() => onPageChange("resources")}
              />
            );
          })}
        </div>
      </FadeInScroll>

      </PageContainer>

      {/* Forward Button */}
      <PageFooterCTA
        title="Understanding what's happening is the start."
        buttonText="See what matters most"
        onClick={() => onPageChange("priorities")}
      />
    </motion.div>
  );
}
