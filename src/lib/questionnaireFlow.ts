import type { Question } from "../questionnaire";

export type QuestionnaireAnswerType = Question["type"];
export type QuestionnaireAnswers = Record<string, any>;

export function getConversationLead(sectionName: string, questionIndex: number) {
  if (questionIndex === 0) {
    if (sectionName === "What's going well") return "Let’s start with what already helps.";
    if (sectionName === "What you're seeing") return "Now let’s look at what feels harder right now.";
    if (sectionName === "At school") return "Next, a little about learning and school life.";
    if (sectionName === "Development & history") return "Finally, a few background details that may help later.";
  }

  if (questionIndex === 1) return "That helps. Here’s the next piece.";
  if (questionIndex === 2) return "A little more context, then we’re nearly there.";
  return "One last thing for this part.";
}

export function getAnswerCue(type: QuestionnaireAnswerType) {
  if (type === "multiple-choice") return "Choose any that fit. If none feel right, you can just move on.";
  if (type === "choice") return "Choose the closest fit. It does not need to be perfect.";
  return "Use your own words. A few words is enough.";
}

export function getAnswersAfterOptionSelect(
  previousAnswers: QuestionnaireAnswers,
  qId: string,
  option: string,
  type: QuestionnaireAnswerType,
) {
  if (type === "choice") {
    return { ...previousAnswers, [qId]: option };
  }

  if (type === "multiple-choice") {
    const current = previousAnswers[qId] || [];
    if (option === "Nothing yet") {
      return { ...previousAnswers, [qId]: current.includes(option) ? [] : ["Nothing yet"] };
    }

    const currentWithoutNone = current.filter((item: string) => item !== "Nothing yet");
    const updated = current.includes(option)
      ? currentWithoutNone.filter((item: string) => item !== option)
      : [...currentWithoutNone, option];

    return { ...previousAnswers, [qId]: updated };
  }

  return previousAnswers;
}
