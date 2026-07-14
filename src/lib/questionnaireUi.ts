export const NOT_COLLECTED_YET_ANSWER = "not collected yet";

export const NOT_SURE_PROMPT_TEXT =
  "Not sure? That's fine. We'll mark this as \"not collected yet\" so you remember it's open - not blank.";

export function getNotSureAnswerValue(options?: string[]) {
  return options?.find((option) => option.toLowerCase() === "not sure") ?? NOT_COLLECTED_YET_ANSWER;
}
