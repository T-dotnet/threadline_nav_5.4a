import { Child, GuideCardProps } from "../types";

import bedtimeRoutineImg from "../assets/images/optimized/abstract-bedtime-wind-down-900.jpg";
import sleepAdhdImg from "../assets/images/optimized/abstract-sleep-rhythm-900.jpg";
import classroomFatigueImg from "../assets/images/optimized/abstract-classroom-support-900.jpg";
import breathingExercisesImg from "../assets/images/optimized/abstract-breathing-coregulation-900.jpg";
import pediatricianQuestionsImg from "../assets/images/optimized/abstract-pediatrician-questions-900.jpg";
import greenPlumBedtimeImg from "../assets/images/optimized/abstract-bedtime-wind-down-900.jpg";
import greenPlumClassroomImg from "../assets/images/optimized/abstract-classroom-support-900.jpg";
import greenPlumBreathingImg from "../assets/images/optimized/abstract-breathing-coregulation-900.jpg";

export interface ResourceGuide extends GuideCardProps {
  catId: string;
}

const ALL_GUIDES: ResourceGuide[] = [
  {
    category: "Tools & Templates",
    catId: "tools",
    title: "Developing a Calming Bedtime Wind-Down",
    description:
      "A visual template with calming colour shifts — steps to swap screen time for sensory, hands-on cues that help {childName} settle.",
    readTime: "8 min read",
    image: bedtimeRoutineImg,
  },
  {
    category: "Health & Clinical",
    catId: "health",
    title: "How Sleep and ADHD Interact in Growing Brains",
    description:
      "Clear, reassuring neuroscience on why dopamine profiles affect circadian rhythms — and how to work with {childName}'s natural bedtime schedule rather than against it.",
    readTime: "6 min read",
    image: sleepAdhdImg,
  },
  {
    category: "Tools & Templates",
    catId: "tools",
    title: "Questions to Discuss With Your Pediatrician",
    description:
      "A simple printable question list to bring to your next check-up, prompting useful conversations about the biological factors affecting {childName}'s sleep.",
    readTime: "5 min read",
    image: pediatricianQuestionsImg,
  },
  {
    category: "Classroom Strategies",
    catId: "classroom",
    title: "Classroom Accommodation Strategies for ADHD Fatigue",
    description:
      "Creative, respectful options the school can use to help {childName} restabilise — without feeling singled out — when fatigue spikes around 10:30 AM.",
    readTime: "10 min read",
    image: classroomFatigueImg,
  },
  {
    category: "Emotional Regulation",
    catId: "emotional",
    title: "Deep Breathing & Co-Regulation for Bedtime Resistance",
    description:
      "Short audio prompts and play-based breathing — like blowing out imaginary stars — for a calm, cooperative parent-child bedtime ritual.",
    readTime: "7 min read",
    image: breathingExercisesImg,
  },
  {
    category: "Tools & Templates",
    catId: "tools",
    title: "Green Room Bedtime Routine Map",
    description:
      "A mint-and-plum routine map for turning the last hour before bed into a calmer sequence of visible, repeatable cues.",
    readTime: "6 min read",
    image: greenPlumBedtimeImg,
  },
  {
    category: "Classroom Strategies",
    catId: "classroom",
    title: "Quiet Classroom Reset Script",
    description:
      "A teacher-facing script for offering support without drawing attention, built around a soft reset and one clear next step.",
    readTime: "5 min read",
    image: greenPlumClassroomImg,
  },
  {
    category: "Emotional Regulation",
    catId: "emotional",
    title: "Mint-and-Plum Breathing Cards",
    description:
      "Simple co-regulation prompts families can use when big feelings arrive before sleep, homework, or a difficult transition.",
    readTime: "4 min read",
    image: greenPlumBreathingImg,
  },
];

const INTAKE_GUIDES: ResourceGuide[] = [
  {
    category: "Session Prep",
    catId: "prep",
    title: "Questions to Bring to the First Session",
    description:
      "A short planning guide for the concerns, hopes, and examples worth bringing into the first conversation.",
    readTime: "5 min read",
    image: greenPlumBreathingImg,
  },
  {
    category: "Documents",
    catId: "documents",
    title: "What to Upload Before Assessment",
    description:
      "Reports, teacher notes, work samples, and parent observations that can help the clinician understand the full picture.",
    readTime: "4 min read",
    image: pediatricianQuestionsImg,
  },
  {
    category: "Observation",
    catId: "observation",
    title: "What to Notice This Week",
    description:
      "Simple prompts for spotting patterns around routines, transitions, sleep, school, and friendships before the call.",
    readTime: "6 min read",
    image: greenPlumClassroomImg,
  },
  {
    category: "Family Notes",
    catId: "prep",
    title: "Turning Concerns Into Useful Examples",
    description:
      "How to describe what you are seeing without needing clinical language or a finished explanation.",
    readTime: "7 min read",
    image: greenPlumBedtimeImg,
  },
];

export function getResourceGuides(child: Child): ResourceGuide[] {
  const guides = child.isNew ? INTAKE_GUIDES : ALL_GUIDES;
  return guides.map((guide) => ({
    ...guide,
    description: guide.description.replace(/\{childName\}/g, child.name),
  }));
}
