export type MasteryLevel = 'none' | 'novice' | 'advanced' | 'expert';

export interface SyllabusTopic {
  id: string;
  title: string;
  description: string;
  tags: string[];
  mastery: MasteryLevel;
  subtopics?: SyllabusTopic[];
}

export const initialSyllabusData: SyllabusTopic[] = [
  {
    id: 'preliminary-exam',
    title: 'Stage I: Preliminary Examination',
    description: 'An objective-type qualifying stage with two papers. Marks are not counted for the final ranking, but candidates must clear the cutoff for GS Paper I and score 33% in CSAT.',
    tags: ['objective', 'qualifying'],
    mastery: 'none',
    subtopics: [
      {
        id: 'prelims-gs1',
        title: 'Paper I: General Studies (GS)',
        description: 'Syllabus includes: Current events, History of India, Geography, Indian Polity, Economy, Environment, and General Science. This paper determines the cutoff for Mains qualification.',
        tags: ['gs', 'merit-cutoff'],
        mastery: 'none',
        subtopics: [
          { id: 'prelims-gs1-current-events', title: 'Current Events', description: 'Current events of national and international importance.', tags: [], mastery: 'none' },
          { id: 'prelims-gs1-history', title: 'History', description: 'History of India and Indian National Movement.', tags: [], mastery: 'none' },
          { id: 'prelims-gs1-geography', title: 'Geography', description: 'Indian and World Geography – Physical, Social, Economic.', tags: [], mastery: 'none' },
          { id: 'prelims-gs1-polity', title: 'Polity and Governance', description: 'Constitution, Political System, Panchayati Raj, Public Policy, Rights Issues.', tags: [], mastery: 'none' },
          { id: 'prelims-gs1-economy', title: 'Economic & Social Development', description: 'Sustainable Development, Poverty, Inclusion, Demographics, Social Sector initiatives.', tags: [], mastery: 'none' },
          { id: 'prelims-gs1-environment', title: 'Environment & Ecology', description: 'General issues on Environmental Ecology, Biodiversity, and Climate Change.', tags: [], mastery: 'none' },
          { id: 'prelims-gs1-science', title: 'General Science', description: 'General Science.', tags: [], mastery: 'none' },
        ]
      },
      {
        id: 'prelims-csat',
        title: 'Paper II: CSAT (Civil Services Aptitude Test)',
        description: 'A qualifying paper requiring 33% marks (66/200). Syllabus includes: Comprehension, Logical Reasoning, Decision Making, General Mental Ability, Basic Numeracy, and Data Interpretation.',
        tags: ['csat', 'aptitude', 'qualifying'],
        mastery: 'none',
      }
    ]
  },
  {
    id: 'main-exam',
    title: 'Stage II: Main Examination',
    description: 'A descriptive exam consisting of 9 papers. Two papers are qualifying, and the other seven are counted for the final merit ranking. Total merit marks: 1750.',
    tags: ['descriptive', 'merit-based'],
    mastery: 'none',
    subtopics: [
      {
        id: 'mains-qualifying',
        title: 'Qualifying Papers (A & B)',
        description: 'Paper A (any Indian Language from Eighth Schedule) and Paper B (English). Both are for 300 marks and are qualifying in nature.',
        tags: ['qualifying', 'language'],
        mastery: 'none',
      },
      {
        id: 'mains-essay',
        title: 'Paper I: Essay',
        description: 'Candidates write essays on multiple topics, testing their ability to organize ideas and write concisely. Marks: 250.',
        tags: ['essay', 'merit'],
        mastery: 'none',
      },
      {
        id: 'mains-gs1',
        title: 'Paper II: General Studies I',
        description: 'Covers Indian Heritage and Culture, History and Geography of the World, and Society. Marks: 250.',
        tags: ['gs-1', 'history', 'geography', 'society'],
        mastery: 'none',
      },
      {
        id: 'mains-gs2',
        title: 'Paper III: General Studies II',
        description: 'Covers Governance, Constitution, Polity, Social Justice, and International Relations. Marks: 250.',
        tags: ['gs-2', 'polity', 'governance', 'ir'],
        mastery: 'none',
      },
      {
        id: 'mains-gs3',
        title: 'Paper IV: General Studies III',
        description: 'Covers Technology, Economic Development, Biodiversity, Environment, Security, and Disaster Management. Marks: 250.',
        tags: ['gs-3', 'economy', 'sci-tech', 'security'],
        mastery: 'none',
      },
      {
        id: 'mains-gs4',
        title: 'Paper V: General Studies IV',
        description: 'Covers Ethics, Integrity, and Aptitude, often using case studies. Marks: 250.',
        tags: ['gs-4', 'ethics', 'aptitude'],
        mastery: 'none',
      },
      {
        id: 'mains-optional',
        title: 'Papers VI & VII: Optional Subject',
        description: 'Two papers (Paper 1 & Paper 2) based on a single optional subject chosen by the candidate. Each paper is for 250 marks.',
        tags: ['optional', 'specialized'],
        mastery: 'none',
      },
    ]
  },
  {
    id: 'interview',
    title: 'Stage III: Personality Test / Interview',
    description: 'The final stage to assess suitability for a career in public service. It evaluates mental alertness, critical thinking, leadership, and integrity. Total marks: 275.',
    tags: ['interview', 'personality-test', 'final-stage'],
    mastery: 'none',
  }
];
