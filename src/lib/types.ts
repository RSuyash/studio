
export interface Paper {
  name: string;
  subject: string;
  duration?: string;
  marks: number;
  qualifyingMarks?: string;
  nature: 'Merit' | 'Qualifying';
  syllabus?: string[];
}

export interface Stage {
  title: string;
  description: string;
  papers?: Paper[];
  notes?: string[];
  subStages?: Stage[];
}

export interface Exam {
  id: string;
  title:string;
  description: string;
  stages: Stage[];
  finalScore: {
    component: string;
    marks: number;
  }[];
}

export type ResourceCategory = 'book' | 'video' | 'pdf' | 'note';
export type ResourceStatus = 'todo' | 'in-progress' | 'completed';

export interface Resource {
  id: string;
  title: string;
  url: string;
  category: ResourceCategory;
  status: ResourceStatus;
  description?: string;
  progress?: number;
  total?: number;
}

export type MasteryLevel = 'none' | 'novice' | 'advanced' | 'expert';

export interface SyllabusTopic {
  id: string;
  title: string;
  description: string;
  tags: string[];
  mastery: MasteryLevel;
  subtopics?: SyllabusTopic[];
  icon?: string;
  marks?: number;
  questions?: number;
}

export interface ExamComparisonData {
  exam: string;
  majorTopics: string;
  overlap: string;
  notes: string;
}

export interface ResourceWithTopicInfo extends Resource {
  topicId: string;
  topicTitle: string;
  topicPath: string;
}

// Types related to saved study plans
export interface StudyPlanInput {
  focusAreas: string;
  timeframe: string;
  hoursPerWeek: number;
}

export interface DailyTask {
  topicId: string;
  duration: string;
  topic: string;
  activity: 'Study' | 'Revise' | 'Practice' | 'Test' | 'Weekly Revision' | 'Analyze Test';
  suggestion: string;
}

export interface DailyPlan {
  day: string;
  tasks: DailyTask[];
}

export interface StudyPlanData {
  plan: DailyPlan[];
  summary: string;
}

export interface SavedStudyPlan {
  id: number;
  name: string;
  created_at: string;
  input_details: StudyPlanInput;
  plan_data: StudyPlanData;
}
