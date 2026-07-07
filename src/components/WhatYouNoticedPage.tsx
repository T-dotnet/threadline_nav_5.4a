import { motion } from "motion/react";
import {
  ArrowUpRight,
  ArrowRight,
  Calendar,
  Check,
  ClipboardList,
  Clock,
  Home,
  Layers,
} from "lucide-react";
import { Page } from "../types";
import { useCurrentChild } from "../context/ChildContext";
import { PageContainer } from "./ui/PageContainer";
import { PageHeader } from "./ui/PageHeader";
import { PageMetaRow } from "./ui/PageMetaRow";
import { HeroQuoteCard } from "./ui/HeroQuoteCard";
import { SectionDescription } from "./ui/SectionDescription";
import { SectionLabel } from "./ui/SectionLabel";
import { SectionTitle } from "./ui/SectionTitle";
import { FadeInScroll } from "./ui/FadeInScroll";
import { AreaItem } from "./ui/AreaItem";
import { StrategyCard } from "./ui/StrategyCard";
import { PageFooterCTA } from "./ui/PageFooterCTA";
import { Button } from "./ui/Button";
import { ReviewRhythmSection } from "./ui/ReviewRhythmSection";
import { FirstSessionCard } from "./ui/FirstSessionCard";
import { WatercolorPanel } from "./ui/WatercolorPanel";
import { getChildSessionStatus, getSessionDate, isSessionBooked as getIsSessionBooked } from "../lib/childStatus";

interface WhatYouNoticedPageProps {
  onPageChange: (page: Page) => void;
  onOpenSetup?: (step?: 1 | 2 | 3 | 4 | 5 | "welcome") => void;
  onShowPathway?: (child: any) => void;
}

const noticeDescriptions: Record<string, string> = {
  "Attention & focus": "Keep examples of when focus is easiest, when it slips, and what helps bring attention back without pressure.",
  "Behaviour & emotions": "Notice the moments before big feelings or behaviour changes, especially transitions, demands, tiredness, or sensory load.",
  Sleep: "Track the rhythm around bedtime, waking, night settling, and how sleep seems to shape the next day.",
  Learning: "Bring examples of what feels hard, what feels easy, and any difference between understanding something and showing it.",
  "Movement & coordination": "Watch for patterns around balance, handwriting, dressing, sports, fatigue, or movement-seeking.",
  "Speech & communication": "Notice how communication changes across home, school, peers, new places, or tired moments.",
  Friendships: "Hold onto examples of connection, conflict, play, withdrawal, or moments where social rules feel unclear.",
};

function getSupportDescription(answer: string) {
  return noticeDescriptions[answer] || `Because you marked "${answer}" as hard right now, keep a few real examples close by so it can be explored during the first session.`;
}

function formatList(items: string[]) {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0].toLowerCase();
  if (items.length === 2) return `${items[0].toLowerCase()} and ${items[1].toLowerCase()}`;
  return `${items.slice(0, -1).map((item) => item.toLowerCase()).join(", ")}, and ${items[items.length - 1].toLowerCase()}`;
}

export default function WhatYouNoticedPage({ onPageChange, onOpenSetup, onShowPathway }: WhatYouNoticedPageProps) {
  const { currentChild } = useCurrentChild();
  const hardestAnswers = currentChild.intake?.notices || [];
  const notes = currentChild.intake?.notes?.trim() || "";
  const hasHardestAnswers = hardestAnswers.length > 0;
  const noticedSummary = hasHardestAnswers
    ? `You marked ${formatList(hardestAnswers)} as hardest right now for ${currentChild.name}. These answers stay visible so the first session can start from what feels most important.`
    : `This page will update once you answer Hardest right now in setup. Until then, there is nothing to interpret for ${currentChild.name}.`;
  const sessionStatus = getChildSessionStatus(currentChild);
  const isSessionBooked = getIsSessionBooked(currentChild);
  const isSessionCancelled = sessionStatus === "cancelled";
  const firstSessionDate = getSessionDate(currentChild);
  const firstSessionTime = isSessionBooked ? currentChild.intake?.sessionTime || "4:00 pm" : undefined;
  const showReviewDates = !currentChild.isNew || isSessionBooked;
  const reviewRhythmItems = [
    {
      state: "Done",
      title: "Assessment baseline",
      meta: showReviewDates ? "14 June" : "",
      description: "The starting point: what is happening, what matters most, and the first plan.",
      icon: <Check className="w-[19px] h-[19px] stroke-[1.8]" />,
      active: true,
    },
    {
      state: "Next review",
      title: "First full review",
      meta: showReviewDates ? "12 September" : "After first session",
      description: "Revisit priorities, update the plan, and confirm what has improved and what needs attention next.",
      icon: <Calendar className="w-[19px] h-[19px] stroke-[1.8]" />,
    },
    {
      state: "Happening now",
      title: "Progress tracking",
      meta: "Between reviews",
      description: "We watch what changes week to week and flag patterns, like sleep, before they become urgent.",
      icon: <Clock className="w-[19px] h-[19px] stroke-[1.8]" />,
    },
    {
      state: "Ongoing",
      title: "Keep the picture current",
      meta: `Each term`,
      description: `The picture updates as ${currentChild.name} grows, because needs shift and clarity should not expire.`,
      icon: <ArrowUpRight className="w-[19px] h-[19px] stroke-[1.8]" />,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="pt-16 pb-16"
    >
      <PageContainer>
        <PageHeader
          kicker="Intake · Reviews"
          title={`${currentChild.name}'s reviews, kept in one place.`}
          titleClassName="md:leading-[4.5rem]"
          className="mb-12"
          description={
            <PageMetaRow
              items={[
                { icon: Clock, children: "Intake in progress" },
                { icon: Layers, children: "Based on setup step 3" },
              ]}
            />
          }
        />

        <div className="grid grid-cols-[2fr_1fr] md:gap-6 max-md:grid-cols-1 max-md:gap-y-6 mb-24">
          <HeroQuoteCard
            kicker="Reviews"
            quote={noticedSummary}
            showQuotes={false}
            className="h-full"
            action={
              <div className="font-medium text-[0.84rem] opacity-70">
                Source{" "}
                <strong className="opacity-100 ml-1">
                  Setup step 3
                </strong> · not a clinical conclusion yet
              </div>
            }
          />

          <FirstSessionCard
            date={firstSessionDate}
            time={firstSessionTime}
            isBooked={isSessionBooked}
            isCancelled={isSessionCancelled}
            onBook={onShowPathway ? () => onShowPathway(currentChild) : () => onOpenSetup?.(5)}
            onReschedule={isSessionBooked ? () => onOpenSetup?.(5) : undefined}
          />
        </div>

        <FadeInScroll className="mb-24">
          <div>
            <SectionLabel>
              Supports worth exploring
            </SectionLabel>
            <SectionTitle>
              Areas to hold in mind.
            </SectionTitle>
          </div>
          <SectionDescription className="mb-6">
            These are based on the answers from Hardest right now. They do not label the pattern; they simply show what may be worth exploring first.
          </SectionDescription>

          <div className="border-b border-black/10">
            {hasHardestAnswers ? (
              hardestAnswers.map((answer) => (
                <AreaItem
                  key={answer}
                  title={answer}
                  description={getSupportDescription(answer)}
                  actionText="Discover more"
                  actionPlacement="header"
                  onAction={() => onPageChange("understanding")}
                />
              ))
            ) : (
              <AreaItem
                title="Nothing from Hardest right now yet"
                description={
                  <div>
                    <p className="text-[0.96rem] text-[var(--color-thread-gray)] leading-relaxed max-w-[62ch] font-sans mb-4">
                      Answer Hardest right now in setup to show supports worth exploring here. For now, nothing has been recorded for {currentChild.name}.
                    </p>
                    <Button
                      type="button"
                      variant="primary"
                      onClick={() => onOpenSetup?.(3)}
                      rightIcon={<ArrowRight className="w-3.5 h-3.5 stroke-[2]" />}
                    >
                      Start Hardest right now
                    </Button>
                  </div>
                }
              />
            )}
          </div>
        </FadeInScroll>

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
                title="Clinical preparation"
                icon={<ClipboardList className="w-[18px] h-[18px] stroke-[1.8]" />}
                items={[
                  hasHardestAnswers
                    ? `Keep one concrete example for ${hardestAnswers[0].toLowerCase()} if it shows up this week.`
                    : "Start with the Hardest right now step so this page can reflect the right support areas.",
                  "Note what happened before, what helped, and what changed afterward.",
                  "Bring school notes, reports, or examples if they show the pattern clearly.",
                ]}
                cornerClass="rounded-tr-[28px]"
                className="shadow-premium border border-black/[0.03]"
              />
              <StrategyCard
                title="At home"
                icon={<Home className="w-[18px] h-[18px] stroke-[1.8]" />}
                items={[
                  "Keep routines steady while the assessment picture is still forming.",
                  "Use small, low-pressure supports instead of trying a full new plan.",
                  `Notice what already helps ${currentChild.name}, and repeat it on harder days.`,
                ]}
                cornerClass="rounded-bl-[28px]"
                className="shadow-premium border border-black/[0.03]"
              />
          </WatercolorPanel>
        </FadeInScroll>

        <ReviewRhythmSection items={reviewRhythmItems} />
      </PageContainer>

      <PageFooterCTA
        title="Ready to review another part of the intake?"
        buttonText="Review setup"
        buttonIcon={<ArrowRight className="w-4 h-4 stroke-[2]" />}
        onClick={() => {
          if (onOpenSetup) {
            onOpenSetup();
            return;
          }
          onPageChange("home");
        }}
      />
    </motion.div>
  );
}
