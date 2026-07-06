interface QuestionnaireQuestion {
  id: string;
  text: string;
  subtext?: string;
  type: "choice" | "text";
  options?: string[];
  placeholder?: string;
}

const FAMILY_JOURNEY_QUESTION_BANK_ROWS = [
  ["1. Child & Family Profile", "Who lives in your child's home? Please tell us who cares for your child and how they're related.", "Structured list (name, relationship)", ""],
  ["1. Child & Family Profile", "How many siblings does your child have, and what are their ages relative to your child?", "Number + free text", ""],
  ["1. Child & Family Profile", "Does your child have any diagnosed medical conditions?", "Yes/No, then repeatable list + diagnosis date", ""],
  ["1. Child & Family Profile", "Is your child currently taking any medication? Please tell us the name, dose, and prescriber.", "Repeatable structured list", ""],
  ["1. Child & Family Profile", "Do any family members have a diagnosed or suspected neurodevelopmental, mental health, or learning condition? Please tell us who, and what.", "Repeatable structured list", ""],
  ["1. Child & Family Profile", "In your own words, what are your main concerns about your child?", "Free text", ""],
  ["1. Child & Family Profile", "What are you hoping to get out of this assessment?", "Free text", ""],
  ["1. Child & Family Profile", "What are your child's strengths, interests, or things they're good at?", "Free text", ""],
  ["1. Child & Family Profile", "What things help reduce your child's difficulties, or make them easier to manage?", "Free text", ""],
  ["1. Child & Family Profile", "Tell us a bit about your family's day to day life and any supports you currently have.", "Free text", ""],
  ["1. Child & Family Profile", "Is there anything about your own wellbeing or support needs you'd like us to know?", "Free text, optional", "Keep optional and low key, this is about the parent, not the child"],
  ["2. Development & Medical History", "Was your child born on time, early, or late?", "Multiple choice (term / preterm / post-term / unknown)", ""],
  ["2. Development & Medical History", "If born early, at how many weeks?", "Number", "Only shown if preterm selected"],
  ["2. Development & Medical History", "Was your child born with a low birth weight?", "Yes/No", ""],
  ["2. Development & Medical History", "Were there any complications during pregnancy or birth?", "Free text", ""],
  ["2. Development & Medical History", "Was your child exposed to alcohol or other substances during pregnancy, as far as you know?", "Yes/No + free text detail", ""],
  ["2. Development & Medical History", "When did your child reach these milestones: walking, talking, social smiling, toilet training?", "Structured, one field per milestone (age achieved, within typical range Y/N)", ""],
  ["2. Development & Medical History", "Were there any concerns before your child started school?", "Free text", ""],
  ["2. Development & Medical History", "When did concerns first start at school, and what did you notice?", "Age + free text", "Directly supports age of onset, keep prominent"],
  ["2. Development & Medical History", "How would you describe things now?", "Free text", ""],
  ["2. Development & Medical History", "Has your child been given any previous mental health diagnoses? By whom, and when?", "Repeatable structured list (condition, clinician type, date)", ""],
  ["2. Development & Medical History", "Has your child received any previous treatment or therapy for mental health or behaviour?", "Repeatable structured list (type, provider, start/end date)", ""],
  ["2. Development & Medical History", "Is your child currently receiving any treatment or therapy?", "Repeatable structured list (type, provider, frequency)", ""],
  ["2. Development & Medical History", "Has your child ever been hospitalised for a mental health reason?", "Yes/No + category only", "Category only, no free text reason. Do not add any question here about current risk or self harm, that requires a separate, clinically governed workflow, not this form"],
  ["2. Development & Medical History", "Has your child had a significant head injury or brain injury?", "Yes/No + free text detail", ""],
  ["2. Development & Medical History", "Has your child been diagnosed with any of the following: tic disorder, language disorder, intellectual disability, specific learning disorder?", "Checklist, multi-select", ""],
  ["2. Development & Medical History", "Does your child identify as Aboriginal or Torres Strait Islander?", "Yes / No / Prefer not to say", "Wording not finalised, needs review by someone with cultural safety expertise before this goes live"],
  ["2. Development & Medical History", "Has your child ever used alcohol, vaping, or other substances?", "Yes/No + free text detail, age gated", "Wording not finalised, needs review by someone with adolescent health expertise. Only shown for older children in the eligible age range"],
  ["3. Parent ADHD Questionnaire", "Standard Vanderbilt ADHD Parent Rating Scale.", "55 items: 9 attention, 9 hyperactivity/impulsivity, 8 oppositional, 14 conduct, 7 anxiety/depression, 8 performance", "Official item wording still pending confirmation of which edition we are licensed to use, 1st edition (free) or 3rd edition (paid). Open decision: do we administer all 55 items, or only the 26 core symptom and performance items, leaving the oppositional, conduct, and anxiety/depression items out for now"],
  ["4. Teacher Questionnaire", "Parent invites the teacher by email.", "Action: send invitation", "One invitation per assessment"],
  ["4. Teacher Questionnaire", "Standard Vanderbilt ADHD Teacher Rating Scale.", "43 items: 9 attention, 9 hyperactivity/impulsivity, 10 oppositional, 7 anxiety/depression, 8 performance", "43 items, not 55, the teacher form has no separate conduct subscale. Same edition and full-vs-trimmed decision as Section 3 applies here too"],
  ["4. Teacher Questionnaire", "What are this child's strengths?", "Free text", ""],
  ["4. Teacher Questionnaire", "What worries you most about this child?", "Free text", ""],
  ["4. Teacher Questionnaire", "When does this child do their best work?", "Free text", ""],
  ["4. Teacher Questionnaire", "What support is currently in place at school?", "Free text", ""],
  ["5. Emotional Wellbeing", "Standard RCADS questionnaire, parent version.", "47 items, anxiety and depression subscales", "Item wording pending. Licensing for commercial use not yet confirmed, this is a blocker before launch, not just a nice to have"],
  ["5. Emotional Wellbeing", "Standard RCADS questionnaire, child/youth version.", "47 items, self report", "Same as above, plus only shown to children above the age threshold. Candidate threshold of 8 years found in an implementation source, not yet confirmed against RCADS's own documentation"],
  ["6. Child's Own Perspective", "What is hardest for you?", "Free text or short structured interview", "Age gated, shown only when the child is old enough to meaningfully self report"],
  ["6. Child's Own Perspective", "What helps you when things are hard?", "Free text", ""],
  ["6. Child's Own Perspective", "What do grown ups get wrong about you?", "Free text", ""],
  ["6. Child's Own Perspective", "What are you good at?", "Free text", ""],
  ["6. Child's Own Perspective", "What kind of support would you like?", "Free text", ""],
  ["7. Daily Life & Functioning", "Tell us how things are for your child at home.", "Free text", ""],
  ["7. Daily Life & Functioning", "Tell us how things are at school or with learning.", "Free text", ""],
  ["7. Daily Life & Functioning", "Tell us about friendships and getting along with others.", "Free text", ""],
  ["7. Daily Life & Functioning", "Tell us about everyday tasks, like getting dressed, routines, and independence.", "Free text", ""],
  ["8. Supporting Evidence", "Do you have any existing reports to share (paediatrician, psychologist, OT, speech pathology, school)?", "Yes/No", "If No, must actively confirm rather than just skip, this affects package completeness"],
  ["8. Supporting Evidence", "Please upload your existing reports.", "File upload, repeatable", "1 to 5 documents. Action: upload"],
  ["8. Supporting Evidence", "What type of document is this?", "Category (paediatric / psychology / OT / speech / school / other)", "One per uploaded document"],
  ["9. Assessment Review", "System shows a completeness summary and any follow up questions needed to fill gaps.", "Dynamic, depends on what's missing", "Not fixed questions, generated based on what's incomplete. Around 5 to 15 follow ups depending on the family"],
  ["9. Assessment Review", "Final review before submission.", "Confirmation step", "System checks reporter diversity, documentary evidence presence, and that no section relies on rating scales alone, this runs invisibly, not shown as a question to the family"],
] as const;

function slugifyQuestionId(question: string) {
  return question.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "").slice(0, 56);
}

function toTitleCase(value: string) {
  return value.trim().replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function parseChoiceOptions(answerFormat: string) {
  const lower = answerFormat.toLowerCase();
  if (lower.includes("prefer not to say")) return ["Yes", "No", "Prefer not to say"];
  if (lower.includes("yes/no") || lower.includes("yes / no")) return ["Yes", "No", "Not sure"];
  if (lower.includes("confirmation")) return ["Confirmed", "Needs review"];

  const optionMatch = answerFormat.match(/\(([^)]+)\)/);
  if (!optionMatch) return undefined;
  if (!lower.includes("multiple choice") && !lower.includes("category")) return undefined;

  return optionMatch[1]
    .split("/")
    .map((option) => toTitleCase(option))
    .filter(Boolean);
}

export const MVP_WORKFLOW_QUESTIONS = FAMILY_JOURNEY_QUESTION_BANK_ROWS.reduce<Record<string, QuestionnaireQuestion[]>>(
  (modules, [section, question, answerFormat, notes]) => {
    const options = parseChoiceOptions(answerFormat);
    const entry: QuestionnaireQuestion = options
      ? {
          id: slugifyQuestionId(question),
          text: question,
          subtext: notes || `Answer format: ${answerFormat}`,
          type: "choice",
          options,
        }
      : {
          id: slugifyQuestionId(question),
          text: question,
          subtext: notes || `Answer format: ${answerFormat}`,
          type: "text",
          placeholder: answerFormat.toLowerCase().includes("file upload")
            ? "Add a note about the document you want to upload."
            : "Type your answer here...",
        };

    modules[section] = [...(modules[section] || []), entry];
    return modules;
  },
  {},
);
