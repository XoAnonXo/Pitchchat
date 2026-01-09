/**
 * Shared type definitions for pSEO content matrix
 * Each industry/stage combination provides unique content for all page types
 */

export type InvestorQuestion = {
  category: string;
  question: string;
  answer: string;
};

export type Metric = {
  label: string;
  value: string;
  note: string;
  source?: string;
  unit?: string;
};

export type Objection = {
  objection: string;
  response: string;
};

export type DeckSection = {
  title: string;
  goal: string;
  guidance: string;
};

export type ChecklistItem = {
  item: string;
  rationale: string;
};

export type UpdateSection = {
  section: string;
  content: string;
};

export type InvestorQuestionsContent = {
  summary: string;
  questions: InvestorQuestion[];
  metrics: Metric[];
  objections: Objection[];
};

export type PitchDeckContent = {
  summary: string;
  sections: DeckSection[];
};

export type MetricsBenchmarksContent = {
  summary: string;
  metrics: Metric[];
};

export type DiligenceChecklistContent = {
  summary: string;
  items: ChecklistItem[];
};

export type InvestorUpdateContent = {
  summary: string;
  sections: UpdateSection[];
};

export type IndustryStageContent = {
  investorQuestions: InvestorQuestionsContent;
  pitchDeck: PitchDeckContent;
  metricsBenchmarks: MetricsBenchmarksContent;
  diligenceChecklist: DiligenceChecklistContent;
  investorUpdate: InvestorUpdateContent;
};
