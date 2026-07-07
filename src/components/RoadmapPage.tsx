import { motion } from "motion/react";
import {
  Clock,
  Layers,
  Check,
  ArrowRight,
  FileText,
  Home,
  Download,
} from "lucide-react";
import { cn } from "../lib/utils";

import { Child, Page } from "../types";
import { PageHeader } from "./ui/PageHeader";
import { PageMetaRow } from "./ui/PageMetaRow";
import { HeroQuoteCard } from "./ui/HeroQuoteCard";
import { HeroActionCard } from "./ui/HeroActionCard";
import { SectionTitle } from "./ui/SectionTitle";
import { SectionLabel } from "./ui/SectionLabel";
import { SectionDescription } from "./ui/SectionDescription";
import { FadeInScroll } from "./ui/FadeInScroll";
import { TimelineStep } from "./ui/TimelineStep";
import { Button } from "./ui/Button";
import { AreaItem } from "./ui/AreaItem";
import { StrategyCard } from "./ui/StrategyCard";
import { PageFooterCTA } from "./ui/PageFooterCTA";
import { WatercolorPanel } from "./ui/WatercolorPanel";

import { PageContainer } from "./ui/PageContainer";

import { useCurrentChild } from "../context/ChildContext";
import { useDisplayMode } from "../context/DisplayModeContext";
import { getChildSessionStatus, getChildSubheading, getSessionDate, isMaintenancePhase, isPlanNotStarted } from "../lib/childStatus";
import { getRoadmapMaintenanceNarrative, getRoadmapStartingNarrative } from "../lib/profileNarratives";

export default function RoadmapPage({
  onPageChange,
}: {
  onPageChange: (page: Page) => void;
}) {
  const { currentChild } = useCurrentChild();
  const { isParentClarity } = useDisplayMode();
  const isMaintenancePlan = isMaintenancePhase(currentChild);
  const isStartingPlan = isPlanNotStarted(currentChild);
  const isNewChild = Boolean(currentChild.isNew);
  const showParentClarity = isParentClarity && !isNewChild && !isMaintenancePlan && !isStartingPlan;
  const newChildSetupStatus = getChildSubheading(currentChild).toLowerCase();
  const maintenanceNarrative = getRoadmapMaintenanceNarrative(currentChild);
  const startingNarrative = getRoadmapStartingNarrative(currentChild);
  const sessionStatus = getChildSessionStatus(currentChild);
  const sessionMeta = sessionStatus === "booked"
    ? `${getSessionDate(currentChild, "long")} · Telehealth`
    : sessionStatus === "cancelled"
    ? "Session cancelled"
    : "Session not booked";
  const sessionMetaTag = sessionStatus === "booked" ? "Booked" : sessionStatus === "cancelled" ? "Cancelled" : "To book";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="pt-16 pb-16"
    >
      <PageContainer>
        <PageHeader
        kicker="Roadmap · What to do"
        title={isNewChild ? "Your setup, in clear steps." : isMaintenancePlan ? "Plan complete." : isStartingPlan ? "Plan ready to start." : "Your plan, in clear steps."}
        titleClassName="md:leading-[4.5rem]"
        className={isNewChild ? "mb-12" : "mb-24"}
        description={
          <PageMetaRow
            items={[
              { icon: Clock, children: "Updated 14 June 2026" },
              {
                icon: Layers,
                children: isNewChild ? getChildSubheading(currentChild) : "Sequenced to build on itself",
              },
            ]}
          />
        }
      />

      <HeroQuoteCard
        kicker="The plan"
        quote={
          isNewChild
            ? `A short setup roadmap for getting ready for ${currentChild.name}'s first session. Finish the essentials, share existing context if you have it, then the support roadmap opens after review.`
            : isMaintenancePlan
            ? maintenanceNarrative.heroQuote
            : isStartingPlan
            ? startingNarrative.heroQuote
            : showParentClarity
            ? `This is the practical plan for ${currentChild.name}: share the teacher pack first, agree the small classroom changes, then watch whether focus and home frustration ease.`
            : "A short, prioritised plan — not a 40-page report. A few things to do, in an order where each step makes the next one easier."
        }
        className="mb-24"
        rightNode={
          <HeroActionCard
            icon={<Download className="w-[22px] h-[22px] stroke-[1.7]" />}
            title={isNewChild ? "Setup roadmap" : "Roadmap"}
            subtitle={isNewChild ? "Preview PDF" : "Download PDF"}
          />
        }
        action={
          <div className="font-medium text-[0.84rem] opacity-70">
            Focused on{" "}
            <strong className="opacity-100 ml-1">
              {isNewChild ? "Intake setup" : isMaintenancePlan ? "Maintenance & Enrichment" : isStartingPlan ? "First support step" : "Classroom attention"}
            </strong> · {isNewChild ? newChildSetupStatus : isMaintenancePlan ? "Goal status: 100%" : isStartingPlan ? "Goal status: 0%" : "your Now priority"}
          </div>
        }
      />

      {/* Next Actions Section */}
      <FadeInScroll className="mb-24">
        <div>
          <SectionLabel>
            Recommended next actions
          </SectionLabel>
          <SectionTitle>
            {isMaintenancePlan ? "Past milestones." : isStartingPlan ? "Start the first step." : showParentClarity ? "Start with the teacher pack." : "Do these, in this order."}
          </SectionTitle>
        </div>

        <div className="relative mt-1">
          {/* Vertical Line */}
          <div className="absolute left-[11px] top-3.5 bottom-5 w-[2px] bg-black/10" />

          {isNewChild ? (
            <>
              <TimelineStep
                active
                title="Finish the questionnaire"
                meta="Before session · You"
                metaTag="Now"
                description={`Your everyday observations give your child's clinician useful context before ${currentChild.name}'s first session.`}
              />
              <TimelineStep
                todo
                title="Share existing context"
                meta="Before session · Optional"
                metaTag="Optional"
                description="Use the Development history questions to tell us what reports or observations already exist. No upload is needed here."
              />
              <TimelineStep
                todo
                title="Attend the first session"
                meta={sessionMeta}
                metaTag={sessionMetaTag}
                description={sessionStatus === "booked"
                  ? "After clinical review, the assessment pages will open with real priorities and next steps."
                  : sessionStatus === "cancelled"
                  ? "Book a new time before clinical review can begin."
                  : "Choose a session time when you are ready to complete the assessment setup."}
              />
            </>
          ) : isMaintenancePlan ? (
            <>
              {maintenanceNarrative.timelineSteps.map((step) => (
                <TimelineStep
                  key={step.title}
                  done
                  title={step.title}
                  meta={step.meta}
                  metaTag={step.metaTag}
                  description={step.description}
                />
              ))}
            </>
          ) : isStartingPlan ? (
            <>
              <TimelineStep
                active
                title="Begin the first support routine"
                meta="This week · You + School"
                metaTag="Start"
                description="Use the first agreed support in one real setting. The aim is repeatability, not perfection."
              />
              <TimelineStep
                todo
                title="Record what happens first"
                meta="First week · You"
                metaTag="Observe"
                description="Capture short examples of what was easier, what was harder, and whether the routine felt realistic."
              />
              <TimelineStep
                todo
                title="Adjust with your child's clinician"
                meta="8 October · Review"
                metaTag="Review"
                description={startingNarrative.firstReviewDescription}
              />
            </>
          ) : (
            <>
              <TimelineStep
                done
                title="Assessment completed"
                meta="14 June · Threadline"
                metaTag="Done"
                description={`The full picture is in - brought together from you, ${currentChild.name}'s teacher, your child's clinician, and ${currentChild.name} herself.`}
              />
              <TimelineStep
                active
                title={`Share the classroom strategy pack with ${currentChild.name}'s teacher`}
                meta="This week · You"
                metaTag="In progress"
                description={showParentClarity
                  ? "This is the main action. Send or hand over the pack, then use it to agree two or three changes the teacher can actually try this week."
                  : `A short, teacher-friendly summary of what helps ${currentChild.name} focus, ready to send or hand over.`}
              />
              <TimelineStep
                todo
                title="Agree classroom accommodations with the school"
                meta="Next 2 weeks · You + School"
                metaTag="To do"
                description={showParentClarity
                  ? `Keep the conversation small: where ${currentChild.name} sits, how tasks are chunked, and how the teacher gives a quiet cue when attention drifts.`
                  : "A 20-minute conversation to put a few of the school strategies below in place and decide who's tracking them."}
              />
            </>
          )}
        </div>
      </FadeInScroll>

      {/* Strategies Section */}
      {!isNewChild && (
        <FadeInScroll className="mb-24">
          <div>
            <SectionLabel>
              Strategies that help
            </SectionLabel>
            <SectionTitle>
              Practical things to try.
            </SectionTitle>
          </div>

          <WatercolorPanel innerClassName="grid grid-cols-2 gap-6 max-md:grid-cols-1">
              <StrategyCard
                title="At school"
                icon={<FileText className="w-[18px] h-[18px] stroke-[1.8]" />}
                items={isMaintenancePlan ? maintenanceNarrative.schoolStrategies : isStartingPlan ? startingNarrative.schoolStrategies : [
                  `Seat ${currentChild.name} near the front, away from busy walkways and windows.`,
                  "Break tasks into short, clear chunks with quick check-ins.",
                  "Use visual timers and simple written checklists.",
                  "Agree a quiet signal for when she's drifting, instead of calling it out.",
                ]}
                cornerClass="rounded-tr-[28px]"
                className="shadow-premium border border-black/[0.03]"
              />
              <StrategyCard
                title="At home"
                icon={<Home className="w-[18px] h-[18px] stroke-[1.8]" />}
                items={isMaintenancePlan ? maintenanceNarrative.homeStrategies : isStartingPlan ? startingNarrative.homeStrategies : [
                  "Keep homework at the same time and place each day.",
                  "Short focused bursts with movement breaks between them.",
                  showParentClarity ? "Clear phones, screens and clutter before homework starts." : "Clear the workspace of phones, screens and clutter.",
                  "Notice and name what went well, however small.",
                ]}
                cornerClass="rounded-bl-[28px]"
                className="shadow-premium border border-black/[0.03]"
              />
          </WatercolorPanel>
        </FadeInScroll>
      )}

      {/* Supports Section */}
      <FadeInScroll className="mb-24">
        <div>
          <SectionLabel>
            Supports worth exploring
          </SectionLabel>
          <SectionTitle>
            Options, not obligations.
          </SectionTitle>
        </div>
        <SectionDescription className="mb-6">
          {isNewChild ? (
            `Optional ways to give your child's clinician more context before ${currentChild.name}'s assessment. Use what is useful; nothing here needs to become a new task list.`
          ) : isMaintenancePlan ? (
            maintenanceNarrative.supportsDescription
          ) : isStartingPlan ? (
            startingNarrative.supportsDescription
          ) : showParentClarity ? (
            `These are options to discuss, not extra homework. Start with the teacher pack, then add support only if ${currentChild.name}'s focus still needs it.`
          ) : (
            `Only what's likely to help, given where ${currentChild.name} is now. Explore these at your own pace, with your child's clinician.`
          )}
        </SectionDescription>

        <div className="border-b border-black/10">
          <AreaItem
            title={isNewChild ? "Upload existing reports" : isMaintenancePlan ? maintenanceNarrative.supportItems[0].title : isStartingPlan ? startingNarrative.supportItems[0].title : "School support plan"}
            description={isNewChild ? "Add any previous assessments, school notes, examples of work, or health letters you already have." : isMaintenancePlan ? maintenanceNarrative.supportItems[0].description : isStartingPlan ? startingNarrative.supportItems[0].description : "Formalise the classroom accommodations so they hold steady across teachers and terms."}
            status={isNewChild ? "Optional" : isMaintenancePlan ? maintenanceNarrative.supportItems[0].status : isStartingPlan ? startingNarrative.supportItems[0].status : "Suggested"}
          />
          <AreaItem
            title={isNewChild ? "Share school context" : isMaintenancePlan ? maintenanceNarrative.supportItems[1].title : isStartingPlan ? startingNarrative.supportItems[1].title : "Occupational therapy — focus & regulation"}
            description={isNewChild ? "Bring teacher notes, recent feedback, or a few examples of what feels harder at school." : isMaintenancePlan ? maintenanceNarrative.supportItems[1].description : isStartingPlan ? startingNarrative.supportItems[1].description : "Worth considering if the home strategies need more hands-on support down the track."}
            status={isMaintenancePlan ? maintenanceNarrative.supportItems[1].status : isStartingPlan ? startingNarrative.supportItems[1].status : "Optional"}
          />
          <AreaItem
            title={isNewChild ? "Keep a short observation note" : isMaintenancePlan ? maintenanceNarrative.supportItems[2].title : isStartingPlan ? startingNarrative.supportItems[2].title : "GP / paediatric review"}
            description={isNewChild ? "Jot down patterns around routines, transitions, sleep, friendships, or school days if they stand out." : isMaintenancePlan ? maintenanceNarrative.supportItems[2].description : isStartingPlan ? startingNarrative.supportItems[2].description : "Keep your GP in the loop so medical options can be discussed if and when they're relevant."}
            status={isNewChild ? "Optional" : isMaintenancePlan ? maintenanceNarrative.supportItems[2].status : isStartingPlan ? startingNarrative.supportItems[2].status : "In place"}
          />
        </div>
      </FadeInScroll>

      </PageContainer>

      {/* Forward Button */}
      <PageFooterCTA
        title="A plan only works if you track it."
        buttonText="See how it's going"
        onClick={() => onPageChange("reviews")}
      />
    </motion.div>
  );
}
