import { useState, useMemo } from "react";
import { motion } from "motion/react";
import { Clock, Info, Download } from "lucide-react";
import { cn } from "../lib/utils";
import { Page } from "../types";

import { PageHeader } from "./ui/PageHeader";
import { PageMetaRow } from "./ui/PageMetaRow";
import { HeroQuoteCard } from "./ui/HeroQuoteCard";
import { HeroActionCard } from "./ui/HeroActionCard";
import { SectionTitle } from "./ui/SectionTitle";
import { SectionLabel } from "./ui/SectionLabel";
import { ListItemCard } from "./ui/ListItemCard";
import { FadeInScroll } from "./ui/FadeInScroll";
import { TimelineItem } from "./ui/TimelineItem";
import { InsightSection } from "./ui/InsightSection";
import { PageFooterCTA } from "./ui/PageFooterCTA";

import sleepImg from "../assets/images/optimized/abstract-sleep-rhythm-900.jpg";
import classroomImg from "../assets/images/optimized/abstract-classroom-support-900.jpg";
import breathingImg from "../assets/images/optimized/abstract-breathing-coregulation-900.jpg";
import pediatricianImg from "../assets/images/optimized/abstract-pediatrician-questions-900.jpg";

import { PageContainer } from "./ui/PageContainer";

import { useCurrentChild } from "../context/ChildContext";
import { isMaintenancePhase, isPlanNotStarted } from "../lib/childStatus";
import {
  getPriorityMaintenanceNarrative,
  getPriorityStartingNarrative,
} from "../lib/profileNarratives";

export default function PrioritiesPage({
  onPageChange,
}: {
  onPageChange: (page: Page) => void;
}) {
  const { currentChild } = useCurrentChild();
  const isMaintenancePlan = isMaintenancePhase(currentChild);
  const isStartingPlan = isPlanNotStarted(currentChild);
  const showParentClarity = !currentChild.isNew && !isMaintenancePlan && !isStartingPlan;
  const [activePriorityId, setActivePriorityId] = useState("sleep");
  const maintenanceNarrative = useMemo(
    () => getPriorityMaintenanceNarrative(currentChild),
    [currentChild.name],
  );
  const startingNarrative = useMemo(
    () => getPriorityStartingNarrative(currentChild),
    [currentChild.name],
  );

  const newChildConnectionData = useMemo(() => [
    {
      id: "impact",
      label: "First weighting",
      title: "Daily impact",
      description: `A clinician looks for the area that is affecting ${currentChild.name}'s everyday life most often: learning, home routines, emotions, sleep, communication, or participation. High-impact patterns often move closer to Now because easing them can quickly reduce pressure elsewhere.`,
      image: classroomImg,
    },
    {
      id: "timing",
      label: "Developmental timing",
      title: "Timing",
      description: "Some needs can safely be watched for a little longer. Others become harder if support is delayed. Priorities shift when a pattern is starting to affect confidence, access to learning, family stress, or the child's sense of safety.",
      image: pediatricianImg,
    },
    {
      id: "load",
      label: "Family context",
      title: "Family capacity",
      description: "The plan has to fit real life. A clinician weighs what the family can reasonably do now, what support is available from school or services, and which next step will help without adding too much burden.",
      image: breathingImg,
    },
    {
      id: "dependencies",
      label: "Connection check",
      title: "Dependencies",
      description: "Priorities connect. Sleep can affect attention, attention can affect learning, communication can affect behaviour, and sensory load can affect routines. The clinician chooses the first step by asking which support is most likely to unlock progress in the others.",
      image: sleepImg,
    },
  ], [currentChild.name]);

  const prioritiesData = useMemo(() => [
    {
      id: isMaintenancePlan ? "review-evidence" : "sleep",
      label: isMaintenancePlan ? "Review input" : isStartingPlan ? "Watch first" : "On the watchlist",
      title: isMaintenancePlan ? "Review evidence" : isStartingPlan ? "Settling rhythm" : "Sleep",
      description: isMaintenancePlan
        ? maintenanceNarrative.connections.reviewEvidence.description
        : isStartingPlan
        ? startingNarrative.connections.watchFirst.description
        : showParentClarity
        ? `Sleep is not a ranked priority yet. We are watching it because tired mornings can make ${currentChild.name}'s focus harder at school.`
        : `Not a ranked priority yet — but because sleep can feed into attention, we're keeping an eye on ${currentChild.name}'s patterns. If the signal grows, it may move into Now or Next.`,
      image: sleepImg
    },
    {
      id: isMaintenancePlan ? "maintenance" : "attention",
      label: isMaintenancePlan ? "Current rhythm" : isStartingPlan ? "First focus" : "Current focus",
      title: isMaintenancePlan ? "Maintenance" : isStartingPlan ? "Classroom starting routine" : "Attention",
      description: isMaintenancePlan
        ? maintenanceNarrative.connections.maintenance.description
        : isStartingPlan
        ? startingNarrative.connections.firstFocus.description
        : showParentClarity
        ? `This is the main thing to act on now. Helping ${currentChild.name} focus in class should make school feel easier and may reduce knock-on frustration at home.`
        : `Addressing ${currentChild.name}'s classroom focus is our primary objective. Strengthening this foundation is the most effective way to unlock progress in learning and peer socialisation.`,
      image: classroomImg
    },
    {
      id: isMaintenancePlan ? "capacity" : "regulation",
      label: isMaintenancePlan ? "Family fit" : isStartingPlan ? "Next support" : "Next phase",
      title: isMaintenancePlan ? "Capacity" : isStartingPlan ? "After-school reset" : "Emotional regulation",
      description: isMaintenancePlan
        ? maintenanceNarrative.connections.capacity.description
        : isStartingPlan
        ? startingNarrative.connections.nextSupport.description
        : showParentClarity
        ? `Frustration at home matters, but it likely gets easier once school focus improves. That is why it is next, not ignored.`
        : `Once attention stability is established, we'll pivot to proactive emotional tools. This sequence prevents 'effort fatigue' by focusing on one core skill set at a time.`,
      image: breathingImg
    },
    {
      id: isMaintenancePlan ? "decision" : "school",
      label: isMaintenancePlan ? "After review" : isStartingPlan ? "Keep steady" : "Long-term goal",
      title: isMaintenancePlan ? "New order" : isStartingPlan ? "Group confidence" : "School participation",
      description: isMaintenancePlan
        ? maintenanceNarrative.connections.decision.description
        : isStartingPlan
        ? startingNarrative.connections.keepSteady.description
        : showParentClarity
        ? `The bigger goal is for ${currentChild.name} to feel confident and included at school. The current steps are building toward that.`
        : `Meaningful engagement in school life is the ultimate outcome of our current work. Every focus area we tackle today is a building block for this future independence.`,
      image: pediatricianImg
    }
  ], [isMaintenancePlan, isStartingPlan, showParentClarity, currentChild.name, maintenanceNarrative, startingNarrative]);

  const connectionData = currentChild.isNew ? newChildConnectionData : prioritiesData;
  const activePriority = connectionData.find(p => p.id === activePriorityId) || connectionData[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="pt-16 pb-16"
    >
      <PageContainer>
        <PageHeader
        kicker="Priorities · What matters most"
        title="Where to focus — and why."
        titleClassName="md:leading-[4.5rem]"
        className={currentChild.isNew ? "mb-12" : "mb-28"}
        description={
          <PageMetaRow
            items={[
              { icon: Clock, children: "Updated 14 June 2026" },
              {
                icon: Info,
                children: currentChild.isNew
                  ? "Draft until clinician review"
                  : `Built from ${currentChild.name}'s understanding profile`,
              },
            ]}
          />
        }
      />

      {currentChild.isNew ? (
        <FadeInScroll className="mb-24">
          <div className="w-full overflow-hidden shadow-none">
            <HeroQuoteCard
              kicker="How we prioritise"
              quote={`We don't hand you a list of everything. We rank what matters by its real impact on ${currentChild.name} — and show the reasoning behind every call.`}
              className="shadow-none"
              rightNode={
                <HeroActionCard
                  icon={<Info className="w-[22px] h-[22px] stroke-[1.7]" />}
                  title="Draft method"
                  subtitle="Clinician-led"
                />
              }
              action={
                <p className="text-[0.84rem] opacity-70 relative leading-relaxed max-w-[48ch]">
                  Each priority is weighed by{" "}
                  <strong className="opacity-100">functional impact</strong>,{" "}
                  <strong className="opacity-100">developmental risk</strong>,{" "}
                  <strong className="opacity-100">family burden</strong>,{" "}
                  <strong className="opacity-100">family capacity</strong>, and{" "}
                  <strong className="opacity-100">
                    how priorities depend on one another
                  </strong>
                  .
                </p>
              }
            />
          </div>
        </FadeInScroll>
      ) : (
        <FadeInScroll className="mb-24">
          <HeroQuoteCard
            kicker="How we prioritise"
            quote={
              isMaintenancePlan
                ? maintenanceNarrative.heroQuote
                : isStartingPlan
                ? startingNarrative.heroQuote
                : showParentClarity
                ? `${currentChild.name}'s plan starts with classroom attention because it is the clearest lever. Sleep stays on the watchlist, and home regulation comes next if it does not ease.`
                : `We don't hand you a list of everything. We rank what matters by its real impact on ${currentChild.name} — and show the reasoning behind every call.`
            }
            className="h-full"
            rightNode={
              <HeroActionCard
                icon={<Download className="w-[22px] h-[22px] stroke-[1.7]" />}
                title={isMaintenancePlan ? "Review prep" : isStartingPlan ? "Priority list" : "Priority list"}
                subtitle={isMaintenancePlan ? "Next session" : isStartingPlan ? "Starting point" : "Download PDF"}
              />
            }
            action={
              <p className="text-[0.84rem] opacity-70 relative leading-relaxed max-w-[48ch]">
                {isMaintenancePlan ? (
                  <>
                    The next order will be based on{" "}
                    <strong className="opacity-100">review evidence</strong>,{" "}
                    <strong className="opacity-100">what has stayed stable</strong>,{" "}
                    <strong className="opacity-100">family capacity</strong>, and{" "}
                    <strong className="opacity-100">whether enrichment or maintenance is the right next rhythm</strong>.
                  </>
                ) : isStartingPlan ? (
                  <>
                    Each priority is weighed by{" "}
                    <strong className="opacity-100">day-to-day impact</strong>,{" "}
                    <strong className="opacity-100">what can start cleanly</strong>,{" "}
                    <strong className="opacity-100">family capacity</strong>, and{" "}
                    <strong className="opacity-100">what will create useful first evidence</strong>.
                  </>
                ) : (
                  <>
                    Each priority is weighed by{" "}
                    <strong className="opacity-100">{showParentClarity ? "day-to-day impact" : "functional impact"}</strong>,{" "}
                    <strong className="opacity-100">{showParentClarity ? "what might get harder if we wait" : "developmental risk"}</strong>,{" "}
                    <strong className="opacity-100">{showParentClarity ? "family load" : "family burden"}</strong>,{" "}
                    <strong className="opacity-100">{showParentClarity ? "what feels doable now" : "family capacity"}</strong>, and{" "}
                    <strong className="opacity-100">
                      how priorities depend on one another
                    </strong>
                    .
                  </>
                )}
              </p>
            }
          />
        </FadeInScroll>
      )}

      <FadeInScroll className="mb-24">
        {currentChild.isNew ? (
          <div className="space-y-6">
            <div>
              <SectionLabel>
                How priorities are decided
              </SectionLabel>
              <SectionTitle>
                What Now, Next, and Later mean.
              </SectionTitle>
            </div>

            <div className="mt-6 flex flex-col">
              {[
                {
                  label: "Now",
                  title: "The clearest first lever",
                  description: "This is the area where support is most likely to reduce pressure quickly or prevent something important from getting harder.",
                  active: true,
                  note: "This is where the final plan will start.",
                },
                {
                  label: "Next",
                  title: "Important, but not first",
                  description: "This still matters. It may depend on the Now focus, need more information, or be easier once the first support is in place.",
                  active: false,
                },
                {
                  label: "Later",
                  title: "Safe to monitor",
                  description: "Later does not mean ignored. It means your child's clinician will keep watching it, but it does not need to carry today's attention.",
                  active: false,
                },
              ].map((item) => (
                <div key={item.label} className="border-t border-black/10">
                  <div className="flex items-start md:items-center justify-between gap-4 py-6 px-2">
                    <div className="flex-1 flex flex-col items-start gap-1.5 md:flex-row md:items-start md:gap-4">
                      <span
                        className={cn(
                          "text-[0.75rem] tracking-[0.15em] font-medium md:w-12 flex-shrink-0 uppercase",
                          item.active
                            ? "text-[var(--color-thread-mid-green)]"
                            : "text-[var(--color-thread-placeholder)]",
                        )}
                      >
                        {item.label}
                      </span>
                      <div className="flex-1">
                        <div
                          className={cn(
                            "text-[1.18rem] font-medium tracking-tight",
                            item.active
                              ? "text-[var(--color-thread-heading)]"
                              : "text-[var(--color-thread-dark-slate)]",
                          )}
                        >
                          {item.title}
                        </div>
                        <p className="mt-2 text-[0.96rem] text-[var(--color-thread-gray)] leading-relaxed max-w-[60ch]">
                          {item.description}
                        </p>
                        {item.note && (
                          <div className="mt-4 text-[0.78rem] font-medium text-[var(--color-thread-mid-green)]">
                            {item.note}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div className="border-b border-black/10" />
            </div>
          </div>
        ) : (
          <>
            <div>
              <SectionLabel>
                {isMaintenancePlan ? "Completed quarter" : "Now · Next · Later"}
              </SectionLabel>
              <SectionTitle>
                {isMaintenancePlan ? "Next priorities will be set after review." : isStartingPlan ? "Three priorities, ready to begin." : showParentClarity ? "What to act on now, next, and later." : "Three priorities, in order."}
              </SectionTitle>
            </div>

            <div className="mt-6 flex flex-col">
              {isMaintenancePlan ? (
                <>
                  <TimelineItem
                    tag="New"
                    title="This quarter's plan"
                    meta="100% complete · Maintenance active"
                    content={maintenanceNarrative.timeline.currentPlan.content}
                    facts={{
                      "Plan progress": "100%",
                      "Clinical confidence": "High",
                      "Family burden": "Low",
                      "Current rhythm": "Maintain",
                    }}
                    dependency="This closes the current plan before a new <strong>Now · Next · Later</strong> order is agreed."
                    progress={100}
                    active
                    isCollapsible={false}
                  />
                  <TimelineItem
                    tag="Then"
                    title="Next review session"
                    meta="12 December · Clinician-led decision"
                    content={maintenanceNarrative.timeline.nextReview.content}
                    facts={{
                      "Decision owner": "Clinician",
                      "Parent role": "Bring observations",
                      "Priority order": "Not set yet",
                    }}
                    dependency="The next <strong>Now</strong>, <strong>Next</strong>, and <strong>Later</strong> priorities are decided after this review."
                    progress={0}
                    isCollapsible={false}
                    hideMetrics
                  />
                  <TimelineItem
                    tag="Later"
                    title="New priority order"
                    meta="After review · Not assumed"
                    content={maintenanceNarrative.timeline.newOrder.content}
                    facts={{
                      "Now": "To be decided",
                      "Next": "To be decided",
                      "Later": "To be decided",
                    }}
                    dependency="Until then, the experience should reinforce <strong>completion</strong>, <strong>maintenance</strong>, and <strong>review preparation</strong>."
                    progress={0}
                    isCollapsible={false}
                    hideMetrics
                  />
                </>
              ) : (
                <>
                  <TimelineItem
                    tag="Now"
                    title={isStartingPlan ? "Classroom starting routine" : "Classroom attention"}
                    meta={isStartingPlan ? "High impact · ready to begin" : "High impact · clearest theme across every source"}
                    content={isStartingPlan
                      ? startingNarrative.timeline.now.content
                      : showParentClarity
                      ? `${currentChild.name}'s classroom focus is the clearest place to act now. If school feels easier, confidence and home routines often get easier too.`
                      : `Trouble staying focused in class is currently the biggest drag on ${currentChild.name}'s learning and self-confidence. Addressing it first tends to make other supports work better too.`}
                    facts={{
                      "Functional impact": "High",
                      "Developmental risk": "Moderate",
                      "Family burden": "Moderate",
                      "Family capacity": "Strong",
                    }}
                    dependency={isStartingPlan ? "First progress here should create cleaner evidence for <strong>home regulation</strong> and <strong>school participation</strong>." : showParentClarity ? "This is expected to help with <strong>home frustration</strong> and <strong>school participation</strong>." : "Progress here should also ease <strong>Emotional regulation</strong> and <strong>school participation</strong>."}
                    progress={isStartingPlan ? 0 : 35}
                    active
                    isCollapsible={false}
                  />
                  <TimelineItem
                    tag="Next"
                    title={isStartingPlan ? "After-school reset" : "Emotional regulation at home"}
                    meta={isStartingPlan ? "Moderate impact · prepare once the first routine starts" : "Moderate impact · prepare over coming months"}
                    content={isStartingPlan
                      ? startingNarrative.timeline.next.content
                      : showParentClarity
                      ? "Frustration around homework and routine changes is real. We are not ignoring it; we are giving attention-first support a chance to lower the pressure before adding another plan."
                      : "Frustration around homework and changes in routine is real, and it's hard on home life. But it sits downstream of attention — so we expect it to ease as focus improves. That's why it's next, not now: tackling attention first does double duty."}
                    facts={{
                      "Functional impact": "Moderate",
                      "Emotional distress": "Moderate",
                      "Family burden": "High",
                      "Depends on": "Attention",
                    }}
                    dependency={isStartingPlan ? "Linked to <strong>Classroom starting routine</strong> — revisit once the first support has real evidence." : "Linked to <strong>Classroom attention</strong> — we'll revisit this as that improves."}
                    progress={isStartingPlan ? 0 : 15}
                    isCollapsible={false}
                  />
                  <TimelineItem
                    tag="Later"
                    title={isStartingPlan ? "Group confidence" : "Friendships & social connection"}
                    meta={isStartingPlan ? "Safe to protect · not a task today" : "Safe to wait · currently a strength"}
                    content={isStartingPlan ? startingNarrative.timeline.later.content : `${currentChild.name} has warm, steady friendships and real empathy — this is going well, so it doesn't need your attention today. Naming it 'later' is deliberate: it means you can set it down without worrying you've missed something.`}
                    facts={{
                      "Functional impact": "Low",
                      "Developmental risk": "Low",
                    }}
                    dependency="We'll surface this again if anything changes."
                    progress={0}
                    isCollapsible={false}
                  />
                </>
              )}
              <div className="border-b border-black/10" />
            </div>
          </>
        )}
      </FadeInScroll>

      {/* Connect Section */}
      <FadeInScroll className="mb-12">
        <div>
          <SectionLabel>
            How these connect
          </SectionLabel>
          {!currentChild.isNew && (
            <SectionTitle>
              {isMaintenancePlan ? "Review factors will shape the next order." : "Priorities aren't independent."}
            </SectionTitle>
          )}
          {currentChild.isNew && (
            <>
              <SectionTitle>
                Each factor changes the others.
              </SectionTitle>
            </>
          )}
        </div>
        <div className="flex items-center gap-4 max-md:flex-col max-md:items-stretch mb-6 w-full">
          {connectionData.map((priority) => (
            <ListItemCard 
              key={priority.id}
              active={activePriority.id === priority.id}
              onClick={() => setActivePriorityId(priority.id)}
            >
              {priority.title}
            </ListItemCard>
          ))}
        </div>
      </FadeInScroll>

      {/* Watchlist Sleep Section */}
      <InsightSection
        className="mb-24"
        kicker={activePriority.label}
        title={activePriority.title}
        description={activePriority.description}
        image={activePriority.image}
        equalHeight={currentChild.isNew}
        hierarchy={currentChild.isNew ? "supporting" : "default"}
      />

      </PageContainer>

      {/* Forward Button */}
      <PageFooterCTA
        title={currentChild.isNew ? "Priority order will become clearer after review." : isMaintenancePlan ? "The next priority order will be set in review." : "Now you know what matters most."}
        buttonText={currentChild.isNew ? "Back to understanding" : "See progress reviews"}
        onClick={() => onPageChange(currentChild.isNew ? "understanding" : "reviews")}
      />
    </motion.div>
  );
}
