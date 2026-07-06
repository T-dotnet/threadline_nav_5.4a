export type DomainKey =
  | 'movement'
  | 'attention'
  | 'learning'
  | 'language'
  | 'social'
  | 'emotional'
  | 'sleep'
  | 'sensory';

export type DomainTone = 'mint' | 'sky' | 'lavender' | 'peach' | 'cream';

export interface DomainSignal {
  key: DomainKey;
  label: string;
  sources: string[];
}

const DOMAIN_LABELS: Record<DomainKey, string> = {
  movement: 'Movement',
  attention: 'Attention & Executive Function',
  learning: 'Learning & Memory',
  language: 'Language & Communication',
  social: 'Social Function',
  emotional: 'Emotional Function',
  sleep: 'Sleep',
  sensory: 'Sensory Function',
};

function mapNoticeToDomain(notice: string): DomainKey | null {
  switch (notice) {
    case 'Attention & focus':
      return 'attention';
    case 'Behaviour & emotions':
      return 'emotional';
    case 'Sleep':
      return 'sleep';
    case 'Learning':
      return 'learning';
    case 'Movement & coordination':
      return 'movement';
    case 'Speech & communication':
      return 'language';
    case 'Friendships':
      return 'social';
    default:
      return null;
  }
}

const QUESTION_DOMAIN_MAP: Record<string, DomainKey> = {
  attention_focus: 'learning',
  behaviour_emotions: 'emotional',
  sleep: 'sleep',
  learning: 'attention',
  movement_coordination: 'movement',
  speech_communication: 'language',
  school_participation: 'learning',
  friendships: 'social',
};

const ANSWER_DOMAIN_MAP: Record<string, DomainKey[]> = {
  'At home routines': ['attention'],
  'Creative or play activities': ['learning'],
  'Talking or sharing ideas': ['language'],
  'With familiar adults or friends': ['social'],
  'Clear routines and warning before changes': ['attention'],
  'Quiet reassurance and time': ['emotional'],
  'Movement or sensory breaks': ['movement', 'sensory'],
  'Choice, play, or special interests': ['learning'],
  Mornings: ['sleep'],
  'After school': ['sleep'],
  Evenings: ['sleep'],
  'It changes day to day': ['sleep'],
  'Starting or finishing tasks': ['attention'],
  'Managing big feelings': ['emotional'],
  'Joining in at school or with peers': ['social'],
  'Moving through daily routines': ['attention'],
  'Attention and concentration': ['attention'],
  'Transitions or changes': ['attention'],
  'Communication or being understood': ['language'],
  'Movement, coordination, or body confidence': ['movement'],
  'Withdraws or becomes quiet': ['emotional'],
  'Gets upset or frustrated': ['emotional'],
  'Avoids the task or situation': ['attention'],
  'Needs an adult close by to reset': ['emotional'],
  'Engages well and joins in readily': ['learning'],
  'Participates with some support': ['learning'],
  'Often avoids or withdraws from activities': ['learning', 'social'],
  'Finds school participation a major challenge': ['learning'],
  'Has close friends and socializes easily': ['social'],
  'Enjoys playing but has occasional conflicts': ['social'],
  'Prefers solo play or struggles to make friends': ['social'],
  'Often feels left out or overwhelmed socially': ['social'],
};

function uniqueKeys(values: DomainKey[]) {
  return Array.from(new Set(values));
}

function addDomainSignal(
  signalMap: Map<DomainKey, DomainSignal>,
  key: DomainKey,
  source: string,
) {
  const existing = signalMap.get(key);
  if (existing) {
    if (!existing.sources.includes(source)) existing.sources.push(source);
    return;
  }

  signalMap.set(key, {
    key,
    label: DOMAIN_LABELS[key],
    sources: [source],
  });
}

export function getQuestionnaireDomainSignals(
  selectedNotices: string[],
  questionnaireAnswers: Record<string, unknown> = {},
) {
  const signalMap = new Map<DomainKey, DomainSignal>();

  selectedNotices.forEach((notice) => {
    const key = mapNoticeToDomain(notice);
    if (key) addDomainSignal(signalMap, key, `Hardest right now: ${notice}`);
  });

  Object.entries(questionnaireAnswers).forEach(([questionId, answer]) => {
    const values = Array.isArray(answer) ? answer : typeof answer === 'string' && answer.trim() ? [answer] : [];
    values.forEach((value) => {
      const mappedKeys = ANSWER_DOMAIN_MAP[value] || (QUESTION_DOMAIN_MAP[questionId] ? [QUESTION_DOMAIN_MAP[questionId]] : []);
      mappedKeys.forEach((key) => addDomainSignal(signalMap, key, `Questionnaire: ${value}`));
    });
  });

  const signals = Array.from(signalMap.values());
  if (signals.length > 0) return signals.slice(0, 4);

  return [];
}

export function getGrowthDomains(activeKeys: DomainKey[], availableInfo: string[]) {
  const cleanedInfo = availableInfo.filter((item) => item !== 'Nothing yet');
  const hasSchoolSignals = cleanedInfo.some((item) => item === 'School reports' || item === 'Teacher observations');
  const hasClinicianSignals = cleanedInfo.some(
    (item) =>
      item === 'GP or paediatrician reports' ||
      item === 'Psychology reports' ||
      item === 'Speech reports' ||
      item === 'OT reports' ||
      item === 'Previous assessments',
  );

  return uniqueKeys([
    ...activeKeys,
    'sensory',
    ...(hasSchoolSignals ? (['learning'] as DomainKey[]) : []),
    ...(hasClinicianSignals ? (['language'] as DomainKey[]) : []),
  ]);
}
