
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

export type ResourceCategory = 'book-ncert' | 'book-reference' | 'lecture-playlist' | 'lecture-video';

export interface Resource {
  id: string;
  title: string;
  url: string;
  category: ResourceCategory;
  description?: string;
  class?: 'VI' | 'VII' | 'VIII' | 'IX' | 'X' | 'XI' | 'XII';
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
  resources?: Resource[];
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
