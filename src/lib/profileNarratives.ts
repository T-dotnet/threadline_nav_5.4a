import type { Child } from "../types";

export interface RoadmapSupportItem {
  title: string;
  description: string;
  status: string;
}

export interface PriorityNarrativeConnection {
  description: string;
}

export interface PriorityNarrativeTimeline {
  content: string;
}

export function getPriorityMaintenanceNarrative(child: Child) {
  return {
    heroQuote: `${child.name} has met the goals for this quarter. The next Now, Next, and Later order will be decided with the clinician after the upcoming review session.`,
    connections: {
      reviewEvidence: {
        description: "The next priority order should start from review evidence: what stayed stable, what changed, and whether any new pattern is strong enough to become the next focus.",
      },
      maintenance: {
        description: "Because the quarter is complete, the default rhythm is maintenance. The review decides whether to keep it light or open a new active focus.",
      },
      capacity: {
        description: "The next plan should fit family capacity after a completed quarter. A strong result does not automatically mean adding more work.",
      },
      decision: {
        description: "Now, Next, and Later become visible again only after the review. Until then, the page should communicate completion and preparation, not a guessed next sequence.",
      },
    } satisfies Record<string, PriorityNarrativeConnection>,
    timeline: {
      currentPlan: {
        content: `${child.name} has met the current quarter goals. The routines that helped should stay steady while the review evidence is gathered.`,
      },
      nextReview: {
        content: `The clinician will review what stayed stable, what has changed, and whether ${child.name} needs enrichment goals, light maintenance, or a new support focus.`,
      },
      newOrder: {
        content: "Threadline should not carry forward old priorities as if they are still active. Once the review is complete, this page can show the new order with evidence and rationale.",
      },
    } satisfies Record<string, PriorityNarrativeTimeline>,
  };
}

export function getPriorityStartingNarrative(child: Child) {
  return {
    heroQuote: `${child.name}'s page uses the same priority structure as an assessed profile, but the plan is at the start line: the first focus is ready, and progress evidence is still to come.`,
    connections: {
      watchFirst: {
        description: `${child.name}'s day-to-day rhythm is not the Now priority, but it may affect whether the first school support is easy to repeat.`,
      },
      firstFocus: {
        description: `${child.name}'s first support target is classroom focus, but progress has not started yet. The aim is to make one support routine visible and repeatable.`,
      },
      nextSupport: {
        description: "Home regulation matters, but it should not become a second plan before the first school routine has had a chance to settle.",
      },
      keepSteady: {
        description: `${child.name} has social strengths to protect. This stays later for now so the first plan can focus on access to learning without overloading the week.`,
      },
    } satisfies Record<string, PriorityNarrativeConnection>,
    timeline: {
      now: {
        content: `${child.name}'s first priority is classroom focus, but this is still a starting point. The useful next signal is whether one routine can be repeated without adding too much pressure.`,
      },
      next: {
        content: "After-school emotion and fatigue matter, but they should sit behind the first classroom routine for now. Once the school support is underway, this becomes easier to understand.",
      },
      later: {
        content: `${child.name}'s connection with familiar adults and peers is a useful strength. It stays later so the first plan can focus on school access without turning every area into work.`,
      },
    } satisfies Record<string, PriorityNarrativeTimeline>,
  };
}

export function getRoadmapMaintenanceNarrative(child: Child) {
  return {
    heroQuote: `${child.name} has successfully navigated the core roadmap. All initial intervention steps are finalized and verified.`,
    timelineSteps: [
      {
        title: "All core assessments completed",
        meta: "March 2026 · Threadline",
        metaTag: "Done",
        description: `${child.name}'s profile is fully mapped and integrated across clinical and educational benchmarks.`,
      },
      {
        title: "Social Integration Routines",
        meta: "May 2026 · You + School",
        metaTag: "Done",
        description: `Custom peer-interaction templates are now part of ${child.name}'s daily school experience.`,
      },
      {
        title: "Self-Correction Mastery",
        meta: "June 2026 · You",
        metaTag: "Done",
        description: `${child.name} has achieved independent regulation milestones. No further active routines required.`,
      },
    ],
    schoolStrategies: [
      `${child.name} leads small peer groups during creative projects.`,
      "Utilize advanced logic puzzles for extension during down time.",
      "Monthly check-in with teacher to maintain social velocity.",
    ],
    homeStrategies: [
      "Encourage independent hobby exploration (e.g., coding, building).",
      "Shift from co-regulation to independent reflection sessions.",
      `Allow ${child.name} to choose their own organizational tools.`,
    ],
    supportsDescription: `${child.name}'s support structure is now self-sustaining. These options are for future enrichment.`,
    supportItems: [
      {
        title: "Leadership mentorship",
        description: `Connecting ${child.name} with older student mentors to foster leadership skills.`,
        status: "Optional",
      },
      {
        title: "Creative Logic Course",
        description: `External curriculum to keep ${child.name}'s high creative retention challenged.`,
        status: "Optional",
      },
      {
        title: "Annual Review",
        description: "Scheduled baseline check to ensure maintenance phase remains stable.",
        status: "In place",
      },
    ] satisfies RoadmapSupportItem[],
  };
}

export function getRoadmapStartingNarrative(child: Child) {
  return {
    heroQuote: `${child.name}'s first quarter roadmap is ready, but nothing has moved yet. Start with one practical support, then use the first observations to shape what comes next.`,
    firstReviewDescription: `Use the first evidence to decide whether ${child.name}'s plan stays the same, gets simpler, or needs a new order.`,
    schoolStrategies: [
      "Choose one classroom routine to try first.",
      "Keep the instruction short and visible.",
      `Notice whether ${child.name} can repeat it without extra adult load.`,
    ],
    homeStrategies: [
      "Keep the first home support predictable and brief.",
      "Write down one example of what helped or got in the way.",
      "Avoid adding a second routine until the first one is usable.",
    ],
    supportsDescription: `${child.name}'s first plan is just beginning. These supports are useful only if they make the first routine easier to start, not if they add more tasks.`,
    supportItems: [
      {
        title: "Starter school support",
        description: `A small classroom adjustment to try first, then review against ${child.name}'s baseline.`,
        status: "Optional",
      },
      {
        title: "First-week notes",
        description: "Short examples that show whether the first support can be repeated in real life.",
        status: "Optional",
      },
      {
        title: "First review",
        description: "A check-in to decide whether the first support is working or needs to be simplified.",
        status: "In place",
      },
    ] satisfies RoadmapSupportItem[],
  };
}

export function getStartingPlanStrengthCards(child: Child) {
  return [
    {
      category: "Settled Strength",
      title: "Pattern spotting",
      description: `${child.name} notices routines, details and changes quickly. This can become a useful anchor when the first support plan starts.`,
    },
    {
      category: "Good Foundation",
      title: "Clear one-to-one learning",
      description: `${child.name} responds well when instructions are calm, direct and given one step at a time. That gives the starter plan something practical to build on.`,
    },
    {
      category: "Protective Factor",
      title: "Warm adult connection",
      description: `${child.name} accepts support best when the adult relationship feels predictable. Keeping that connection steady should help the first routine land.`,
    },
  ] as const;
}
