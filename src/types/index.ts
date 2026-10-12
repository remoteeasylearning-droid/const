export type Grade = 3 | 4;

export type IndependenceLevel =
  | 'independent'
  | 'mostly_independent'
  | 'with_help'
  | 'constant_support'
  | 'insufficient_data';

export type CreativeComponentLevel =
  | 'original_ideas'
  | 'applies_new_contexts'
  | 'suggests_with_support'
  | 'acts_by_sample'
  | 'not_evaluated';

export type AchievementLevel = 'В' | 'Д' | 'С' | 'П';
export type ActivityTraitStatus = 'Сформовано' | 'Формується';

export interface CriterionNextStep {
  skill: string;
  activity: string;
  teacherSupport: string;
  independencePath: string;
  checkProgressSign: string;
}

export interface CriterionAnalysis {
  strengths: string[];
  areasForImprovement: string[];
  independenceAnalysis: string;
  creativeAnalysis: string;
  rationale: string;
  recommendedLevel: AchievementLevel | ActivityTraitStatus | 'Недостатньо даних';
  levelJustification: string;
  complianceWithCriteria: string;
  whatToClarify?: string;
  nextSteps: CriterionNextStep[];
  certificateTextShort: string;
  certificateTextExpanded: string;
}

export interface CriterionRecord {
  criterionId: string;
  observations: string;
  independenceLevel: IndependenceLevel;
  creativeComponent: CreativeComponentLevel;
  creativeExample?: string;
  extraNotes?: string;
  // Analysis & recommendations
  analysis?: CriterionAnalysis;
  // Final teacher decision
  teacherDecision?: AchievementLevel | ActivityTraitStatus | 'Недостатньо даних';
  teacherComment?: string;
  isPostponed?: boolean;
  finalCertificateText?: string;
  isCompleted?: boolean;
  updatedAt: string;
}

export interface CriterionItem {
  id: string;
  text: string;
  shortDescription?: string;
  officialStandardNotes?: string;
  gradeSpecificNotes?: {
    3?: string;
    4?: string;
  };
  sampleObservations?: string[]; // Quick chips for teacher
  allowsCreativeComponent?: boolean;
}

export interface SubjectSubGroup {
  id: string;
  title: string;
  criteria: CriterionItem[];
}

export interface EducationalArea {
  id: string;
  title: string;
  shortCode: string;
  isActivityTrait?: boolean; // True for 'Характеристика навчальної діяльності'
  subGroups?: SubjectSubGroup[];
  criteria?: CriterionItem[];
}

export interface StudentProfile {
  id: string; // e.g. "student_1", "student_2"
  code: string; // "Учень 1", "Учениця 2", etc.
  grade: Grade;
  pedagogicalCouncilDecision?: string; // Рішення педради про переведення
  teacherGeneralRecommendations?: string; // Рекомендації вчителя (загальні)
  records: Record<string, CriterionRecord>; // criterionId -> record
  createdAt: string;
  updatedAt: string;
}
