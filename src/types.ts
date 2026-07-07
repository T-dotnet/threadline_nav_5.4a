export type Page = 'home' | 'assessment' | 'preview' | 'what-you-noticed' | 'understanding' | 'priorities' | 'roadmap' | 'reviews' | 'resources' | 'documents' | 'diary' | 'settings' | 'emerging-details' | 'all-children' | 'style-guide' | 'questionnaire';

export interface DiaryAttachment {
  id: string;
  name: string;
  mimeType: string;
  sizeLabel: string;
  kind: 'image' | 'document';
  dataUrl: string;
}

export interface DiaryEntry {
  id: string;
  createdAt: string;
  note: string;
  tags: string[];
  attachments: DiaryAttachment[];
}

export interface Child {
  id?: string;
  name: string;
  age: number;
  initial: string;
  isNew?: boolean;
  diaryEntries?: DiaryEntry[];
  intake?: {
    relation?: string;
    journeyStage?: string;
    stateOrTerritory?: string;
    availableInfo?: string[];
    notices?: string[];
    notes?: string;
    sessionDay?: string;
    sessionTime?: string;
    sessionCancelled?: boolean;
    questionnaireAnswers?: Record<string, unknown>;
    completedQuestionnaireSections?: string[];
  };
}

export interface Priority {
  tag: 'Now' | 'Next' | 'Later';
  name: string;
  meta: string;
  why: string;
  impact?: 'High' | 'Moderate' | 'Low';
  risk?: string;
  burden?: string;
  capacity?: string;
  progress?: number;
  dependencies?: string;
}

export interface Strategy {
  title: string;
  icon: 'school' | 'home';
  items: string[];
}

export interface Resource {
  category: string;
  title: string;
  description: string;
  readTime: string;
}

export interface DocFile {
  name: string;
  type: string;
  date: string;
  uploadedBy?: 'you' | 'threadline';
  shared: boolean;
  sharedWith?: string;
}

export interface StrategyCardProps {
  title: string;
  icon: React.ReactNode;
  items: string[];
  cornerClass?: string;
  className?: string;
}

export interface ChecklistItemProps {
  title: string;
  description: string;
  className?: string;
  icon?: React.ReactNode;
}

export interface GuideCardProps {
  category: string;
  title: string;
  description: string;
  readTime: string;
  image?: string;
  cornerClass?: string;
  actionText?: string;
  secondaryActionText?: string;
  onSecondaryAction?: () => void;
  onClick?: () => void;
  disableHover?: boolean;
  className?: string;
}

export interface InsightSectionProps {
  kicker: string;
  title: string;
  description: string;
  image: string;
  actionText?: string;
  onActionClick?: () => void;
  className?: string;
  reverse?: boolean;
  equalHeight?: boolean;
  hierarchy?: 'default' | 'supporting';
}

export interface ProgressChartSectionProps {
  label: string;
  title: string;
  chartLabel: string;
  chartSubtitle: string;
  data: any[];
  description: string;
  xAxisLabels: string[];
  activeLabelIndex?: number;
  statusPill?: string;
  className?: string;
}
