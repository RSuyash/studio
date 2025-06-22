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
    description: 'This stage consists of two compulsory objective-type papers. Paper I (GS) determines the cut-off, while Paper II (CSAT) is qualifying (33%). There is negative marking for incorrect answers.',
    tags: ['objective', 'qualifying'],
    mastery: 'none',
    subtopics: [
      {
        id: 'prelims-gs1',
        title: 'Paper I: General Studies (GS)',
        description: 'Decides the cut-off for the Main exam. Syllabus covers a wide range of subjects from current events to general science. Marks: 200, Questions: 100.',
        tags: ['gs', 'merit-cutoff'],
        mastery: 'none',
        subtopics: [
          {
            id: 'prelims-gs1-current-events',
            title: 'Current Affairs',
            description: 'Current events of national and international importance, covering polity, economy, environment, science & tech, and international relations.',
            tags: ['dynamic', 'high-priority'],
            mastery: 'none',
            subtopics: [
              {
                id: 'prelims-ca-national',
                title: 'National',
                description: 'Polity: Supreme Court rulings, constitutional amendments, government bills. Economy: Budget, Economic Survey, inflation, GDP, indices. Environment: National schemes (CAMPA, Green India). Science & Tech: ISRO missions, new technologies.',
                tags: ['polity', 'economy', 'environment', 'sci-tech'],
                mastery: 'none',
              },
              {
                id: 'prelims-ca-international',
                title: 'International',
                description: 'IR: Major international treaties, India’s bilateral/multilateral relations. Reports/Indices: HDI, GHI, EPI, WEF indices. Environment: Global climate agreements (e.g., COPs, IPCC).',
                tags: ['ir', 'reports-indices', 'global-events'],
                mastery: 'none',
              },
            ]
          },
          {
            id: 'prelims-gs1-history',
            title: 'History of India and Indian National Movement',
            description: 'Covers Ancient, Medieval, and Modern Indian history, with a special focus on the national freedom struggle.',
            tags: ['history', 'static'],
            mastery: 'none',
            subtopics: [
              { id: 'prelims-history-ancient', title: 'Ancient History', description: 'Prehistoric cultures, Indus Valley Civilization, Vedic Period, Mauryan & Gupta Empires.', tags: [], mastery: 'none' },
              { id: 'prelims-history-medieval', title: 'Medieval History', description: 'Delhi Sultanate, Mughal Empire, Bhakti & Sufi movements, Vijayanagar Empire.', tags: [], mastery: 'none' },
              { id: 'prelims-history-modern', title: 'Modern History', description: 'European advent, 1857 Revolt, social reforms, Gandhian era, and key legislations.', tags: [], mastery: 'none' },
            ],
          },
          {
            id: 'prelims-gs1-geography',
            title: 'Indian and World Geography',
            description: 'Physical, Social, and Economic Geography of India and the World.',
            tags: ['geography', 'static'],
            mastery: 'none',
            subtopics: [
                { id: 'prelims-geography-physical', title: 'Physical Geography', description: 'Geomorphology (landforms, volcanoes), Climatology, and Oceanography.', tags: [], mastery: 'none' },
                { id: 'prelims-geography-indian', title: 'Indian Geography', description: 'Physiography, river systems, climate, soils, vegetation, agriculture, and mineral resources.', tags: [], mastery: 'none' },
                { id: 'prelims-geography-world', title: 'World Geography (Basics)', description: 'Continents, Oceans, and major global physical features.', tags: [], mastery: 'none' },
            ]
          },
          {
            id: 'prelims-gs1-polity',
            title: 'Indian Polity and Governance',
            description: 'Constitution, government structure (Union & State), judiciary, local governance, and public policy.',
            tags: ['polity', 'governance'],
            mastery: 'none',
          },
          {
            id: 'prelims-gs1-economy',
            title: 'Economic and Social Development',
            description: 'Economic concepts, planning, banking, fiscal/monetary policy, poverty, and government schemes.',
            tags: ['economy', 'development'],
            mastery: 'none',
          },
          {
            id: 'prelims-gs1-environment',
            title: 'Environment & Ecology',
            description: 'Ecosystems, biodiversity conservation, pollution, climate change agreements, and environmental laws.',
            tags: ['environment', 'ecology'],
            mastery: 'none',
          },
          {
            id: 'prelims-gs1-science',
            title: 'General Science',
            description: 'Basics of Physics, Chemistry, Biology (up to Class X level) and key developments in S&T.',
            tags: ['science', 'technology'],
            mastery: 'none',
          },
        ],
      },
      {
        id: 'prelims-csat',
        title: 'Paper II: CSAT (Civil Services Aptitude Test)',
        description: 'A qualifying paper requiring 33% marks (66/200). Tests aptitude and reasoning skills. Marks: 200, Questions: 80.',
        tags: ['csat', 'aptitude', 'qualifying'],
        mastery: 'none',
        subtopics: [
            { id: 'prelims-csat-comprehension', title: 'Comprehension', description: 'Reading passages with factual and inference-based questions.', tags: [], mastery: 'none' },
            { id: 'prelims-csat-reasoning', title: 'Logical Reasoning & Analytical Ability', description: 'Syllogisms, blood relations, puzzles, seating arrangements.', tags: [], mastery: 'none' },
            { id: 'prelims-csat-numeracy', title: 'Basic Numeracy (Class X level)', description: 'Number systems, percentages, time & work, averages.', tags: [], mastery: 'none' },
            { id: 'prelims-csat-di', title: 'Data Interpretation', description: 'Interpreting charts, graphs, and tables (Class X level).', tags: [], mastery: 'none' },
            { id: 'prelims-csat-decision-making', title: 'Decision Making & Problem Solving', description: 'Questions on ethical dilemmas and practical problem-solving. No negative marking for these.', tags: [], mastery: 'none' },
        ]
      },
    ],
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
        description: 'These papers test basic language proficiency and are not counted for merit. Candidates must score 25% (75/300) to pass.',
        tags: ['qualifying', 'language'],
        mastery: 'none',
        subtopics: [
          {
            id: 'mains-qualifying-a',
            title: 'Paper A: Indian Language',
            description: 'Any language from the Eighth Schedule. The pattern is similar to the English paper, focusing on comprehension, précis, and translation.',
            tags: ['indian-language'],
            mastery: 'none',
          },
          {
            id: 'mains-qualifying-b',
            title: 'Paper B: English',
            description: 'Tests comprehension of given passages, précis writing, usage and vocabulary, and short essays. Class X level.',
            tags: ['english'],
            mastery: 'none',
          },
        ]
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
        description: 'Candidates choose one subject from a list. This tests in-depth knowledge and understanding of the chosen discipline.',
        tags: ['optional', 'specialized', 'merit'],
        mastery: 'none',
        subtopics: [
          {
            id: 'mains-optional-1',
            title: 'Optional Paper 1',
            description: 'The first of two papers on the chosen optional subject. Each paper is 250 marks. Syllabus varies by subject.',
            tags: ['paper-1'],
            mastery: 'none',
          },
          {
            id: 'mains-optional-2',
            title: 'Optional Paper 2',
            description: 'The second of two papers on the chosen optional subject. Each paper is 250 marks. Syllabus varies by subject.',
            tags: ['paper-2'],
            mastery: 'none',
          },
        ]
      },
    ],
  },
  {
    id: 'interview',
    title: 'Stage III: Personality Test / Interview',
    description: 'The final stage to assess suitability for a career in public service. It evaluates mental alertness, critical thinking, leadership, and integrity. Total marks: 275.',
    tags: ['interview', 'personality-test', 'final-stage'],
    mastery: 'none',
  },
];
