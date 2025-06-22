
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
  syllabus?: string[];
  notes?: string[];
  subStages?: Stage[];
}

export interface Exam {
  id: string;
  title: string;
  description: string;
  stages: Stage[];
  finalScore: {
    component: string;
    marks: number;
  }[];
}

export const upscCseExam: Exam = {
  id: 'upsc-cse',
  title: 'UPSC Civil Services Exam (CSE)',
  description: 'A complete and accurate overview of the UPSC Civil Services Examination (CSE) structure, as of the latest format followed by the Union Public Service Commission.',
  stages: [
    {
      title: 'Stage I: Preliminary Examination',
      description: 'This stage consists of two compulsory papers, both of which are objective (multiple choice) and carry 200 marks each. They are qualifying in nature, i.e., marks are not counted for final ranking, but you must clear the cutoff.',
      papers: [
        { name: 'Paper I', subject: 'General Studies (GS-I)', duration: '2 hours', marks: 200, qualifyingMarks: 'Decided by UPSC', nature: 'Merit' },
        { name: 'Paper II', subject: 'CSAT (GS-II)', duration: '2 hours', marks: 200, qualifyingMarks: '33% (66 marks)', nature: 'Qualifying' },
      ],
      subStages: [
        {
          title: 'Syllabus – Prelims Paper I – General Studies (GS-I)',
          description: '',
          syllabus: [
            'Current events of national and international importance',
            'History of India and Indian National Movement',
            'Indian and World Geography – Physical, Social, Economic',
            'Indian Polity and Governance – Constitution, Political System, Panchayati Raj, Public Policy, Rights Issues',
            'Economic and Social Development – Sustainable Development, Poverty, Inclusion, Demographics, Social Sector initiatives',
            'General issues on Environmental Ecology, Biodiversity, and Climate Change',
            'General Science',
          ],
        },
        {
          title: 'Syllabus – Prelims Paper II – CSAT (GS-II)',
          description: '',
          syllabus: [
            'Comprehension',
            'Interpersonal skills including communication skills',
            'Logical reasoning and analytical ability',
            'Decision-making and problem-solving',
            'General mental ability',
            'Basic numeracy (Class X level)',
            'Data interpretation (charts, graphs, tables – Class X level)',
          ],
        },
      ],
    },
    {
      title: 'Stage II: Main Examination',
      description: 'The Main Exam is descriptive in nature and consists of 9 papers, out of which 7 are counted for merit, and 2 are qualifying.',
      papers: [
        { name: 'Paper A', subject: 'Indian Language (from Eighth Schedule)', duration: '3 hours', marks: 300, qualifyingMarks: '25% (75 marks)', nature: 'Qualifying' },
        { name: 'Paper B', subject: 'English', duration: '3 hours', marks: 300, qualifyingMarks: '25% (75 marks)', nature: 'Qualifying' },
        { name: 'Paper I', subject: 'Essay', duration: '3 hours', marks: 250, nature: 'Merit' },
        { name: 'Paper II', subject: 'General Studies I', duration: '3 hours', marks: 250, nature: 'Merit' },
        { name: 'Paper III', subject: 'General Studies II', duration: '3 hours', marks: 250, nature: 'Merit' },
        { name: 'Paper IV', subject: 'General Studies III', duration: '3 hours', marks: 250, nature: 'Merit' },
        { name: 'Paper V', subject: 'General Studies IV', duration: '3 hours', marks: 250, nature: 'Merit' },
        { name: 'Paper VI', subject: 'Optional Subject Paper 1', duration: '3 hours', marks: 250, nature: 'Merit' },
        { name: 'Paper VII', subject: 'Optional Subject Paper 2', duration: '3 hours', marks: 250, nature: 'Merit' },
      ],
      subStages: [
        {
            title: 'Syllabus – GS I (Indian Heritage and Culture, History & Geography of the World and Society)',
            description: '',
            syllabus: [
                'Indian culture: Art forms, Literature, Architecture',
                'Modern Indian History (1857 to present)',
                'Indian Freedom Struggle',
                'Post-independence consolidation',
                'World History: Events of the 18th century onwards (Industrial Revolution, WWs, etc.)',
                'Indian Society: Diversity, Role of Women, Globalization effects',
                'Geography: Physical, Social, and Economic Geography of India and the World'
            ]
        },
        {
            title: 'Syllabus – GS II (Governance, Constitution, Polity, Social Justice, International Relations)',
            description: '',
            syllabus: [
                'Indian Constitution: Features, Amendments, Provisions',
                'Parliament, State Legislatures, Executive, Judiciary',
                'Government policies and interventions',
                'Development processes and the role of NGOs',
                'Welfare schemes for vulnerable sections',
                'Health, Education, Human Resources',
                'International Relations: Bilateral, Regional, Global groupings and agreements'
            ]
        },
        {
            title: 'Syllabus – GS III (Technology, Economic Development, Biodiversity, Environment, Security & Disaster Management)',
            description: '',
            syllabus: [
                'Indian Economy: Planning, Growth, Budgeting',
                'Agriculture, Infrastructure, Investment models',
                'Science and Technology developments',
                'Environment and Ecology',
                'Disaster Management',
                'Internal Security, Role of External State and Non-State actors, Cybersecurity, Security Forces'
            ]
        },
        {
            title: 'Syllabus – GS IV (Ethics, Integrity, and Aptitude)',
            description: '',
            syllabus: [
                'Ethics and Human Interface',
                'Attitude: Content, Structure, Function',
                'Emotional Intelligence',
                'Public/Civil service values',
                'Probity in Governance',
                'Case studies on above topics'
            ]
        }
      ]
    },
    {
      title: 'Stage III: Personality Test / Interview',
      description: 'The final stage of the examination process. It is not a test of knowledge but an assessment of the candidate\'s suitability for a career in public service.',
      notes: [
        'Mental alertness',
        'Critical powers of assimilation',
        'Clear and logical exposition',
        'Balance of judgment',
        'Variety and depth of interest',
        'Leadership, integrity, and moral character'
      ],
      papers: [
        { name: 'Interview', subject: 'Personality Test', marks: 275, nature: 'Merit' }
      ]
    },
  ],
  finalScore: [
    { component: 'Mains (7 papers)', marks: 1750 },
    { component: 'Interview', marks: 275 },
  ],
};
