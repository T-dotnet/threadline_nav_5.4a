export interface Question {
  id: string;
  text: string;
  subtext?: string;
  type: 'choice' | 'multiple-choice' | 'text';
  options?: string[];
  placeholder?: string;
}

export const QUESTIONS: Record<string, Question[]> = {
  "What's going well": [
    {
      id: 'attention_focus',
      text: 'Where does ${childName} seem most confident or settled right now?',
      subtext: 'Choose the option that fits best.',
      type: 'choice',
      options: [
        'At home routines',
        'Creative or play activities',
        'Talking or sharing ideas',
        'With familiar adults or friends'
      ],
    },
    {
      id: 'behaviour_emotions',
      text: 'What usually helps ${childName} feel calm, connected, or ready to try?',
      subtext: 'Choose the option that fits best.',
      type: 'choice',
      options: [
        'Clear routines and warning before changes',
        'Quiet reassurance and time',
        'Movement or sensory breaks',
        'Choice, play, or special interests'
      ],
    },
    {
      id: 'sleep',
      text: 'When does the day tend to go best?',
      type: 'choice',
      options: ['Mornings', 'After school', 'Evenings', 'It changes day to day']
    }
  ],
  "What you're seeing": [
    {
      id: 'learning',
      text: 'What feels hardest for ${childName} right now?',
      type: 'choice',
      options: [
        'Starting or finishing tasks',
        'Managing big feelings',
        'Joining in at school or with peers',
        'Moving through daily routines'
      ]
    },
    {
      id: 'movement_coordination',
      text: 'Where do you notice the most effort or support needed?',
      type: 'choice',
      options: [
        'Attention and concentration',
        'Transitions or changes',
        'Communication or being understood',
        'Movement, coordination, or body confidence'
      ]
    },
    {
      id: 'speech_communication',
      text: 'How does ${childName} usually show that something is too much?',
      type: 'choice',
      options: [
        'Withdraws or becomes quiet',
        'Gets upset or frustrated',
        'Avoids the task or situation',
        'Needs an adult close by to reset'
      ]
    }
  ],
  'At school': [
    {
      id: 'school_participation',
      text: 'How does ${childName} usually participate in school activities and learning?',
      type: 'choice',
      options: [
        'Engages well and joins in readily',
        'Participates with some support',
        'Often avoids or withdraws from activities',
        'Finds school participation a major challenge'
      ]
    },
    {
      id: 'friendships',
      text: 'How does ${childName} usually interact with friends or peers?',
      type: 'choice',
      options: [
        'Has close friends and socializes easily',
        'Enjoys playing but has occasional conflicts',
        'Prefers solo play or struggles to make friends',
        'Often feels left out or overwhelmed socially'
      ]
    }
  ],
  'Development & history': [
    {
      id: 'dev_available_information',
      text: 'Do you already have any reports or information?',
      subtext: "Select all that apply. Don't worry if you don't. Many families are just getting started.",
      type: 'multiple-choice',
      options: [
        'Nothing yet',
        'School reports',
        'Teacher observations',
        'GP or paediatrician reports',
        'Psychology reports',
        'Speech reports',
        'OT reports',
        'Previous assessments',
        'Other'
      ]
    }
  ]
};

export const QUESTIONNAIRE_SECTIONS = Object.keys(QUESTIONS);

const LEGACY_QUESTIONNAIRE_SECTION_NAMES: Record<string, string> = {
  "What we're seeing": "What you're seeing",
};

export function normalizeQuestionnaireSectionName(sectionName: string): string {
  return LEGACY_QUESTIONNAIRE_SECTION_NAMES[sectionName] || sectionName;
}

export function isAnswered(answer: unknown): boolean {
  if (answer === undefined || answer === null) return false;
  if (Array.isArray(answer)) return answer.length > 0;
  if (typeof answer === 'string') return answer.trim() !== '';
  return true;
}

export function getAnsweredCount(sectionName: string, answers: Record<string, unknown>): number {
  const normalizedSectionName = normalizeQuestionnaireSectionName(sectionName);
  return (QUESTIONS[normalizedSectionName] || []).filter((question) => isAnswered(answers[question.id])).length;
}

export function getCompletedQuestionnaireSections(answers: Record<string, unknown>): string[] {
  return QUESTIONNAIRE_SECTIONS.filter((sectionName) => {
    const sectionQuestions = QUESTIONS[sectionName] || [];
    return sectionQuestions.length > 0 && getAnsweredCount(sectionName, answers) === sectionQuestions.length;
  });
}

export function formatAnswer(answer: unknown): string {
  if (Array.isArray(answer)) return answer.join(', ');
  if (typeof answer === 'string') return answer;
  if (answer === undefined || answer === null) return '';
  return String(answer);
}
