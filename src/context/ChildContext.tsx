import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect, useMemo } from 'react';
import { Child } from '../types';
import { QUESTIONNAIRE_SECTIONS } from '../questionnaire';
import { MVP_WORKFLOW_QUESTIONS } from '../lib/familyJourneyQuestionBank';
import { DEFAULT_CLINICIAN_SHORT_NAME } from '../lib/clinicalProvider';
import { isDeprecatedProfile, shouldHideInMvpMode } from '../lib/childStatus';
import watercolorBg from '../assets/images/optimized/watercolor-bg-900.jpg';
import { useDisplayMode } from './DisplayModeContext';

interface ChildContextType {
  childrenList: Child[];
  currentChild: Child;
  setChild: (child: Child) => void;
  addChild: (child: Child) => void;
  updateChild: (child: Child) => void;
  deleteChild: (childId: string) => void;
  createNewChild: () => Child;
  showGlobalIcons: boolean;
  setShowGlobalIcons: (show: boolean) => void;
}

function mockImageAttachment(id: string, name: string, sizeLabel: string) {
  return {
    id,
    name,
    mimeType: 'image/jpeg',
    sizeLabel,
    kind: 'image' as const,
    dataUrl: watercolorBg,
  };
}

function mockDocumentAttachment(id: string, name: string, sizeLabel: string) {
  const body = `${name}\n\nThis is a placeholder document attached to a diary entry.`;
  return {
    id,
    name,
    mimeType: 'application/pdf',
    sizeLabel,
    kind: 'document' as const,
    dataUrl: `data:text/plain,${encodeURIComponent(body)}`,
  };
}

const MVP_QUESTIONNAIRE_SECTIONS = Object.keys(MVP_WORKFLOW_QUESTIONS);
const MVP_QUESTIONNAIRE_QUESTIONS = Object.values(MVP_WORKFLOW_QUESTIONS).flat();

function buildMvpQuestionnaireAnswers(limit = MVP_QUESTIONNAIRE_QUESTIONS.length) {
  return Object.fromEntries(
    MVP_QUESTIONNAIRE_QUESTIONS.slice(0, limit).map((question, index) => [
      question.id,
      question.type === 'choice'
        ? question.options?.[0] || 'Yes'
        : `Seeded assessment response ${index + 1}`,
    ]),
  );
}

const INITIAL_CHILDREN: Child[] = [
  { id: 'child-tom', name: 'Tom', age: 8, initial: 'T', isNew: true, intake: {} },
  {
    id: 'child-ava',
    name: 'Ava',
    age: 7,
    initial: 'A',
    isNew: false,
    intake: {
      relation: 'Parent',
      journeyStage: 'Waiting for assessment',
      sessionDay: '26',
      sessionTime: '4:00 pm',
      availableInfo: ['School reports', 'Teacher observations'],
      notices: ['Attention feels harder in busy settings', 'Transitions can take extra reassurance'],
      notes: 'Ava is registered for her first session. The family has shared school context and wants help connecting everyday observations with the assessment conversation.',
      questionnaireAnswers: {
        attention_focus: 'Creative or play activities',
        behaviour_emotions: 'Quiet reassurance and time',
        sleep: 'Mornings',
        learning: 'Starting or finishing tasks',
        movement_coordination: 'Transitions or changes',
        speech_communication: 'Withdraws or becomes quiet',
        school_participation: 'Participates with some support',
        friendships: 'Enjoys playing but has occasional conflicts',
        dev_available_information: ['School reports', 'Teacher observations'],
      },
      completedQuestionnaireSections: QUESTIONNAIRE_SECTIONS,
    },
  },
  { id: 'child-leo', name: 'Leo', age: 8, initial: 'L', isNew: true, intake: {} },
  {
    id: 'child-isla',
    name: 'Isla',
    age: 7,
    initial: 'I',
    isNew: false,
    intake: {
      relation: 'Parent',
      journeyStage: 'Waiting for assessment',
      availableInfo: ['Parent intake notes'],
      notices: ['Focus is harder after school', 'Morning routines are usually calmer'],
      notes: 'Isla has started the diagnostic questionnaire. The family has completed 23 of 51 prompts so far, which shows as 45% progress in the assessment workflow.',
      questionnaireAnswers: buildMvpQuestionnaireAnswers(23),
      completedQuestionnaireSections: [MVP_QUESTIONNAIRE_SECTIONS[0]],
    },
  },
  {
    id: 'child-chloe',
    name: 'Chloe',
    age: 9,
    initial: 'C',
    isNew: false,
    intake: {
      relation: 'Parent',
      journeyStage: 'Waiting for assessment',
      sessionDay: '26',
      sessionTime: '4:00 pm',
      availableInfo: ['School reports', 'Teacher observations', 'Parent intake notes'],
      notices: ['Teacher sees attention fade during independent work', 'Home routines are more settled with visual prompts'],
      notes: 'Chloe has submitted the full questionnaire package. Teacher feedback and supporting documents are in, so the profile is waiting for clinical review.',
      questionnaireAnswers: buildMvpQuestionnaireAnswers(),
      completedQuestionnaireSections: MVP_QUESTIONNAIRE_SECTIONS,
    },
  },
  { id: 'child-noah', name: 'Noah', age: 8, initial: 'N', isNew: false, intake: {} },
  {
    id: 'child-maya',
    name: 'Maya',
    age: 9,
    initial: 'M',
    diaryEntries: [
      {
        id: 'maya-diary-breakfast',
        createdAt: '2026-06-30T07:50:00.000Z',
        note: 'Breakfast was smoother when Maya chose the cereal first and packed the snack box herself. She seemed more settled before the school run.',
        tags: ['Food', 'Routine'],
        attachments: [],
      },
      {
        id: 'maya-diary-photo',
        createdAt: '2026-06-29T16:45:00.000Z',
        note: 'Maya spent the whole afternoon drawing and was so proud of this one. She talked through every detail without being prompted.',
        tags: ['Mood', 'Energy'],
        attachments: [
          mockImageAttachment('maya-att-1', 'maya-artwork.png', '184 KB'),
        ],
      },
      {
        id: 'maya-diary-1',
        createdAt: '2026-06-28T18:10:00.000Z',
        note: 'School pickup felt much calmer today. Maya came out tired but settled quickly after a snack and a quiet 10 minutes at home.',
        tags: ['School', 'Food', 'Mood'],
        attachments: [],
      },
      {
        id: 'maya-diary-reading-group',
        createdAt: '2026-06-27T15:35:00.000Z',
        note: 'Her teacher said Maya joined the reading group without extra prompting. She stayed with the activity and told us about the story at dinner.',
        tags: ['School', 'Activities'],
        attachments: [],
      },
      {
        id: 'maya-diary-doc',
        createdAt: '2026-06-26T09:20:00.000Z',
        note: 'Saved the term report from school so we can bring the focus notes to the next session.',
        tags: ['School'],
        attachments: [
          mockDocumentAttachment('maya-att-2', 'maya-term-report.pdf', '320 KB'),
        ],
      },
      {
        id: 'maya-diary-mixed',
        createdAt: '2026-06-24T19:05:00.000Z',
        note: 'Tougher evening with a meltdown before dinner. Kept a photo of the calm-down corner we set up and the routine sheet that helped.',
        tags: ['Behaviour', 'Routine'],
        attachments: [
          mockImageAttachment('maya-att-3', 'calm-corner.png', '142 KB'),
          mockDocumentAttachment('maya-att-4', 'evening-routine.pdf', '96 KB'),
        ],
      },
      {
        id: 'maya-diary-swimming',
        createdAt: '2026-06-23T17:25:00.000Z',
        note: 'Swimming club went better than expected. Maya needed a quiet rest afterward, but she was proud that she stayed in the pool for the full lesson.',
        tags: ['Activities', 'Health'],
        attachments: [],
      },
      {
        id: 'maya-diary-sleep',
        createdAt: '2026-06-22T20:30:00.000Z',
        note: 'Slept right through the night and woke up in a bright mood, ready for the day without the usual slow start.',
        tags: ['Sleep', 'Mood'],
        attachments: [],
      },
    ],
  },
  {
    id: 'child-liam',
    name: 'Liam',
    age: 10,
    initial: 'L',
    diaryEntries: [
      {
        id: 'liam-diary-photo',
        createdAt: '2026-06-29T11:15:00.000Z',
        note: 'Long morning at the park and Liam led the whole group game. Loads of energy and stayed regulated even when he lost a round.',
        tags: ['Energy', 'Behaviour'],
        attachments: [
          mockImageAttachment('liam-att-1', 'park-morning.jpg', '212 KB'),
        ],
      },
      {
        id: 'liam-diary-1',
        createdAt: '2026-06-27T07:40:00.000Z',
        note: 'Bedtime routine stayed smooth this week. Liam fell asleep faster after keeping screens off and reading before lights out.',
        tags: ['Sleep', 'Routine'],
        attachments: [],
      },
      {
        id: 'liam-diary-doc',
        createdAt: '2026-06-25T20:30:00.000Z',
        note: 'Reading log from the last fortnight - he is well ahead of where he was and asking for harder books.',
        tags: ['School'],
        attachments: [
          mockDocumentAttachment('liam-att-2', 'liam-reading-log.pdf', '78 KB'),
        ],
      },
      {
        id: 'liam-diary-photo2',
        createdAt: '2026-06-22T17:50:00.000Z',
        note: 'Built this Lego set on his own across two afternoons. Great focus and patience with the fiddly steps.',
        tags: ['Mood', 'Routine'],
        attachments: [
          mockImageAttachment('liam-att-3', 'lego-build.png', '168 KB'),
        ],
      },
    ],
  },
  { id: 'child-ruby', name: 'Ruby', age: 8, initial: 'R', isNew: false, intake: {} },
];

const CHILDREN_STORAGE_KEY = 'threadline-children';
const CURRENT_CHILD_STORAGE_KEY = 'threadline-current-child';
const DEMO_DATA_VERSION_KEY = 'threadline-demo-data-version';
const DEMO_DATA_VERSION = 'quarter-zero-noah-v15-ruby-results';
const GLOBAL_ICON_DEFAULTS_VERSION_KEY = 'threadline-global-icons-defaults-version';
const GLOBAL_ICON_DEFAULTS_VERSION = 'quick-access-on-v1';
const DEFAULT_SHOW_GLOBAL_ICONS = true;

const CANONICAL_CHILDREN_BY_ID: Record<string, Child> = {
  'child-maya': INITIAL_CHILDREN[6],
  'child-liam': INITIAL_CHILDREN[7],
  'child-leo': INITIAL_CHILDREN[2],
  'child-isla': INITIAL_CHILDREN[3],
  'child-chloe': INITIAL_CHILDREN[4],
  'child-noah': INITIAL_CHILDREN[5],
  'child-ruby': INITIAL_CHILDREN[8],
};

const CANONICAL_CHILD_ID_BY_NAME: Record<string, string> = {
  Tom: 'child-tom',
  Ava: 'child-ava',
  Maya: 'child-maya',
  Liam: 'child-liam',
  Leo: 'child-leo',
  Isla: 'child-isla',
  Chloe: 'child-chloe',
  Noah: 'child-noah',
  Ruby: 'child-ruby',
};

const LEGACY_CANONICAL_ID_ALIASES: Record<string, string> = {
  'child-new': 'child-tom',
  'child-new-0': 'child-tom',
  'child-tom-0': 'child-tom',
  'child-ava-1': 'child-ava',
  'child-maya-0': 'child-maya',
  'child-maya-1': 'child-maya',
  'child-maya-2': 'child-maya',
  'child-liam-0': 'child-liam',
  'child-liam-1': 'child-liam',
  'child-liam-2': 'child-liam',
  'child-liam-3': 'child-liam',
  'child-leo-0': 'child-leo',
  'child-isla-0': 'child-isla',
  'child-chloe-0': 'child-chloe',
  'child-noah-0': 'child-noah',
  'child-noah-1': 'child-noah',
  'child-ruby-0': 'child-ruby',
};

function createChildId() {
  return `child-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function createDefaultChildName(children: Child[]) {
  const base = 'New child';
  if (!children.some((child) => child.name === base)) return base;
  let index = 1;
  while (children.some((child) => child.name === `${base} ${index}`)) {
    index += 1;
  }
  return `${base} ${index}`;
}

function childIdFor(child: Child, index: number) {
  if (!child.id && index === 0 && child.name === 'New child') return 'child-tom';
  if (!child.id && CANONICAL_CHILD_ID_BY_NAME[child.name]) return CANONICAL_CHILD_ID_BY_NAME[child.name];
  return child.id || `child-${child.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'profile'}-${index}`;
}

function resetStoredChildrenForNewDemoSeed() {
  try {
    if (localStorage.getItem(DEMO_DATA_VERSION_KEY) === DEMO_DATA_VERSION) return;
    localStorage.removeItem(CHILDREN_STORAGE_KEY);
    localStorage.removeItem(CURRENT_CHILD_STORAGE_KEY);
    localStorage.setItem(DEMO_DATA_VERSION_KEY, DEMO_DATA_VERSION);
  } catch {
    // Storage can be unavailable in restricted contexts; in-memory defaults still work.
  }
}

function normalizeChildren(children: Child[]) {
  const normalized = children
    .filter((child) => !isDeprecatedProfile(child))
    .map((child, index) => {
      const id = LEGACY_CANONICAL_ID_ALIASES[childIdFor(child, index)] || childIdFor(child, index);
      const canonicalChild = CANONICAL_CHILDREN_BY_ID[id];
      return canonicalChild || {
        ...child,
        id,
      };
    });
  const hasNoah = normalized.some((child) => child.id === 'child-noah' || child.name === 'Noah');
  const withNoah = hasNoah ? normalized : [...normalized, INITIAL_CHILDREN[5]];
  const hasRuby = withNoah.some((child) => child.id === 'child-ruby' || child.name === 'Ruby');
  return hasRuby ? withNoah : [...withNoah, INITIAL_CHILDREN[8]];
}

function readStoredChildren() {
  try {
    resetStoredChildrenForNewDemoSeed();
    const stored = localStorage.getItem(CHILDREN_STORAGE_KEY);
    if (!stored) return INITIAL_CHILDREN;
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) && parsed.length > 0
      ? normalizeChildren(parsed).filter((child) => !isDeprecatedProfile(child))
      : INITIAL_CHILDREN;
  } catch {
    return INITIAL_CHILDREN;
  }
}

function isRubyProfile(child: Child) {
  return child.id === 'child-ruby' || child.name === 'Ruby';
}

function readStoredCurrentChild(children: Child[]) {
  try {
    const stored = localStorage.getItem(CURRENT_CHILD_STORAGE_KEY);
    const storedId = stored ? LEGACY_CANONICAL_ID_ALIASES[stored] || stored : stored;
    if (storedId === 'child-nick' || storedId === 'Nick') {
      return children[0];
    }
    return children.find((child) => (child.id === storedId || child.name === storedId) && !isDeprecatedProfile(child)) || children[0];
  } catch {
    return children[0];
  }
}

function initializeGlobalIconDefaults() {
  if (typeof window === "undefined") return;
  try {
    if (localStorage.getItem(GLOBAL_ICON_DEFAULTS_VERSION_KEY) === GLOBAL_ICON_DEFAULTS_VERSION) return;
    localStorage.setItem("threadline-show-global-icons", String(DEFAULT_SHOW_GLOBAL_ICONS));
    localStorage.setItem(GLOBAL_ICON_DEFAULTS_VERSION_KEY, GLOBAL_ICON_DEFAULTS_VERSION);
  } catch {
    // Storage can be unavailable in restricted contexts; in-memory defaults still work.
  }
}

const ChildContext = createContext<ChildContextType | undefined>(undefined);

export function ChildProvider({ children }: { children: ReactNode }) {
  const { isMvp, hideRubyHighlightNoah } = useDisplayMode();
  const [rawChildrenList, setRawChildrenList] = useState<Child[]>(readStoredChildren);
  
  const childrenList = useMemo(() => {
    const visibleChildren = hideRubyHighlightNoah
      ? rawChildrenList.filter((child) => !isRubyProfile(child))
      : rawChildrenList;
    if (isMvp) {
      return visibleChildren.filter((child) => !shouldHideInMvpMode(child));
    }
    return visibleChildren;
  }, [rawChildrenList, isMvp, hideRubyHighlightNoah]);

  const [currentChild, setCurrentChild] = useState<Child>(() => readStoredCurrentChild(childrenList));

  // Auto-switch current child if it becomes hidden in MVP mode
  useEffect(() => {
    if ((hideRubyHighlightNoah && isRubyProfile(currentChild)) || (isMvp && shouldHideInMvpMode(currentChild))) {
      const firstAllowed = rawChildrenList.find((child) =>
        !(hideRubyHighlightNoah && isRubyProfile(child)) && !shouldHideInMvpMode(child)
      );
      if (firstAllowed) {
        setCurrentChild(firstAllowed);
      }
    }
  }, [isMvp, hideRubyHighlightNoah, currentChild, rawChildrenList]);

  const [showGlobalIcons, setShowGlobalIconsState] = useState<boolean>(() => {
    if (typeof window === "undefined") return DEFAULT_SHOW_GLOBAL_ICONS;
    try {
      initializeGlobalIconDefaults();
      const stored = localStorage.getItem("threadline-show-global-icons");
      return stored !== null ? stored === "true" : DEFAULT_SHOW_GLOBAL_ICONS;
    } catch {
      return DEFAULT_SHOW_GLOBAL_ICONS;
    }
  });

  const setShowGlobalIcons = useCallback((show: boolean) => {
    setShowGlobalIconsState(show);
    try {
      localStorage.setItem("threadline-show-global-icons", String(show));
    } catch (e) {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(CHILDREN_STORAGE_KEY, JSON.stringify(rawChildrenList));
      localStorage.setItem(CURRENT_CHILD_STORAGE_KEY, currentChild.id || currentChild.name);
      localStorage.setItem(DEMO_DATA_VERSION_KEY, DEMO_DATA_VERSION);
    } catch {
      // Storage can be unavailable in restricted contexts; in-memory state still works.
    }
  }, [rawChildrenList, currentChild.id, currentChild.name]);

  const setChild = useCallback((child: Child) => {
    setCurrentChild(child);
  }, []);

  const addChild = useCallback((child: Child) => {
    const childWithId = { ...child, id: child.id || createChildId() };
    setRawChildrenList((prev) => [...prev, childWithId]);
    setCurrentChild(childWithId);
    return childWithId;
  }, []);

  const createNewChild = useCallback(() => {
    const name = createDefaultChildName(rawChildrenList);
    const child: Child = {
      id: createChildId(),
      name,
      age: 8,
      initial: name.charAt(0).toUpperCase(),
      isNew: true,
      intake: {},
    };
    setRawChildrenList((prev) => [...prev, child]);
    setCurrentChild(child);
    return child;
  }, [rawChildrenList]);

  const updateChild = useCallback((child: Child) => {
    const targetId = child.id || currentChild.id;
    const childWithId = { ...child, id: targetId || createChildId() };
    setRawChildrenList((prev) => prev.map((item) => {
      if (targetId) return item.id === targetId ? childWithId : item;
      return item === currentChild ? childWithId : item;
    }));
    if (!targetId || currentChild.id === targetId) {
      setCurrentChild(childWithId);
    }
  }, [currentChild, rawChildrenList]);

  const deleteChild = useCallback((childId: string) => {
    setRawChildrenList((prev) => {
      const remaining = prev.filter((child) => child.id !== childId);
      if (remaining.length === 0) {
        const freshChild: Child = {
          id: createChildId(),
          name: 'New child',
          age: 8,
          initial: 'N',
          isNew: true,
          intake: {},
        };
        setCurrentChild(freshChild);
        return [freshChild];
      }
      if (currentChild.id === childId) {
        setCurrentChild(remaining[0]);
      }
      return remaining;
    });
  }, [currentChild.id]);

  const value = React.useMemo(() => ({
    childrenList,
    currentChild,
    setChild,
    addChild,
    updateChild,
    deleteChild,
    createNewChild,
    showGlobalIcons,
    setShowGlobalIcons,
  }), [childrenList, currentChild, setChild, addChild, updateChild, deleteChild, createNewChild, showGlobalIcons, setShowGlobalIcons]);

  return (
    <ChildContext.Provider value={value}>
      {children}
    </ChildContext.Provider>
  );
}

export function useCurrentChild() {
  const context = useContext(ChildContext);
  if (context === undefined) {
    throw new Error('useCurrentChild must be used within a ChildProvider');
  }
  return context;
}
