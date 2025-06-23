
import type { SyllabusTopic } from '@/lib/types';

export const mpscSyllabusData: SyllabusTopic[] = [
  {
    id: 'mpsc-preliminary-exam',
    title: 'Stage I: Preliminary Examination',
    icon: 'ClipboardList',
    description: 'Objective Type (Multiple Choice) screening test. Marks are not counted in the final merit list. CSAT is qualifying with 33% passing criteria.',
    tags: ['objective', 'qualifying'],
    mastery: 'none',
    resources: [],
    subtopics: [
      {
        id: 'mpsc-prelims-gs1',
        title: 'Paper I: General Studies',
        icon: 'FileText',
        description: 'This paper is counted for merit ranking in Prelims. It covers a broad range of topics from current affairs to Maharashtra-specific history and geography. Marks: 200.',
        tags: ['gs', 'merit-cutoff'],
        mastery: 'none',
        resources: [],
        subtopics: [
          {
            id: 'mpsc-prelims-gs1-current-affairs',
            title: 'Current Affairs (सामायिक घडामोडी)',
            description: 'State, national, and international current events, government schemes, important reports, indices, awards, and personalities in the news.',
            tags: ['dynamic', 'high-priority'],
            mastery: 'none',
            resources: [],
          },
          {
            id: 'mpsc-prelims-gs1-history',
            title: 'History of India and Maharashtra (इतिहास)',
            description: 'Covers Ancient, Medieval, and Modern Indian history with a special emphasis on Maharashtra\'s role and social reformers.',
            tags: ['history', 'static', 'maharashtra'],
            mastery: 'none',
            resources: [],
            subtopics: [
              { id: 'mpsc-history-ancient-medieval', title: 'Ancient and Medieval India', description: 'Vedic period, Mauryan and Gupta empires, Bhakti and Sufi movements, Sultanate and Mughal administration.', tags: [], mastery: 'none', resources: [] },
              { id: 'mpsc-history-modern', title: 'Modern Indian History', description: 'British policies, social reform movements, 1857 revolt, and freedom movements (1885–1947), including key leaders like Gandhi, Nehru, and Ambedkar.', tags: [], mastery: 'none', resources: [] },
              { id: 'mpsc-history-maharashtra', title: 'History of Maharashtra', description: 'Shivaji and the Maratha Empire, Maharashtra’s role in the freedom struggle, Samyukta Maharashtra Movement, and key social reformers.', tags: [], mastery: 'none', resources: [] },
            ],
          },
          {
            id: 'mpsc-prelims-gs1-geography',
            title: 'Geography of India and Maharashtra (भूगोल)',
            description: 'Covers physical, economic, and human geography of India with a special focus on Maharashtra.',
            tags: ['geography', 'maharashtra'],
            mastery: 'none',
            resources: [],
             subtopics: [
              { id: 'mpsc-geography-physical', title: 'Physical Geography', description: 'Himalayas, rivers, climate, soils of India.', tags: [], mastery: 'none', resources: [] },
              { id: 'mpsc-geography-economic', title: 'Economic Geography', description: 'Agriculture, minerals, industries in India.', tags: [], mastery: 'none', resources: [] },
              { id: 'mpsc-geography-human', title: 'Human Geography', description: 'Population, migration, urbanization in India.', tags: [], mastery: 'none', resources: [] },
              { id: 'mpsc-geography-maharashtra', title: 'Geography of Maharashtra', description: 'Major rivers (Godavari, Krishna), soil types, dams, irrigation, transport, and environmental issues.', tags: [], mastery: 'none', resources: [] },
            ],
          },
          {
            id: 'mpsc-prelims-gs1-polity',
            title: 'Indian Polity and Governance (राज्यशास्त्र)',
            description: 'Indian Constitution, government structure, judiciary, local governance (Panchayati Raj), key acts like RTI, and social justice issues.',
            tags: ['polity', 'governance'],
            mastery: 'none',
            resources: [],
          },
          {
            id: 'mpsc-prelims-gs1-economy',
            title: 'Economy and Planning (अर्थव्यवस्था)',
            description: 'Indian economy sectors, GDP, NITI Aayog, budget, banking, inflation, poverty, and specific indicators for Maharashtra\'s economy.',
            tags: ['economy', 'development', 'maharashtra'],
            mastery: 'none',
            resources: [],
          },
          {
            id: 'mpsc-prelims-gs1-science',
            title: 'General Science and Technology (सामान्य विज्ञान)',
            description: 'Basic Physics, Chemistry, Biology (school-level), along with concepts in Biotechnology, Nanotechnology, and Space technology.',
            tags: ['science', 'technology'],
            mastery: 'none',
            resources: [],
          },
          {
            id: 'mpsc-prelims-gs1-environment',
            title: 'Environment and Ecology (पर्यावरणशास्त्र)',
            description: 'Ecosystems, biodiversity, climate change, conservation, and environmental movements with a focus on Maharashtra.',
            tags: ['environment', 'ecology', 'maharashtra'],
            mastery: 'none',
            resources: [],
          },
           {
            id: 'mpsc-prelims-gs1-maharashtra-specific',
            title: 'Maharashtra-specific Topics',
            description: 'State administration and policy, development programs, historical and cultural heritage, and basic awareness of Marathi language and literature.',
            tags: ['maharashtra', 'state-specific'],
            mastery: 'none',
            resources: [],
          },
        ],
      },
      {
        id: 'mpsc-prelims-csat',
        title: 'Paper II: CSAT (Qualifying)',
        icon: 'FileText',
        description: 'A qualifying paper requiring 33% marks (66/200). Tests aptitude and reasoning skills. Marks: 200, Questions: 80.',
        tags: ['csat', 'aptitude', 'qualifying'],
        mastery: 'none',
        resources: [],
        subtopics: [
            { id: 'mpsc-csat-comprehension', title: 'Comprehension (वाचन समज)', description: 'Reading passages with factual and inference-based questions in both English and Marathi.', tags: [], mastery: 'none', resources: [] },
            { id: 'mpsc-csat-interpersonal', title: 'Interpersonal & Communication Skills', description: 'Situation-based questions to test clarity of communication and empathy.', tags: [], mastery: 'none', resources: [] },
            { id: 'mpsc-csat-reasoning', title: 'Logical Reasoning & Analytical Ability', description: 'Syllogisms, statement-conclusion, cause-effect reasoning, and problem-solving.', tags: [], mastery: 'none', resources: [] },
            { id: 'mpsc-csat-mental-ability', title: 'General Mental Ability', description: 'Number series, coding-decoding, blood relations, directions, and rankings.', tags: [], mastery: 'none', resources: [] },
            { id: 'mpsc-csat-numeracy', title: 'Basic Numeracy (Class X level)', description: 'Arithmetic (percentages, profit & loss), simple & compound interest, time-speed-distance, and data interpretation.', tags: [], mastery: 'none', resources: [] },
        ]
      },
    ],
  },
  {
    id: 'mpsc-main-exam',
    title: 'Stage II: Main Examination',
    icon: 'PencilLine',
    description: 'A descriptive exam based on the revised pattern from 2023 onwards. Total merit marks: 1350 (including interview).',
    tags: ['descriptive', 'merit-based'],
    mastery: 'none',
    resources: [],
    subtopics: [
      {
        id: 'mpsc-mains-qualifying',
        title: 'Qualifying Paper – Marathi & English Language',
        icon: 'ShieldCheck',
        description: 'This is a compulsory paper, but qualifying in nature. Marks are not counted in the final tally. Minimum 25 marks in each section and 35% overall required. Total Marks: 100.',
        tags: ['qualifying', 'language'],
        mastery: 'none',
        resources: [],
        subtopics: [
          {
            id: 'mpsc-mains-qualifying-marathi',
            title: 'Marathi Section (50 marks)',
            description: 'Includes Essay Writing, Translation (English to Marathi), Precis Writing, and Grammar.',
            tags: ['marathi'],
            mastery: 'none',
            resources: [],
          },
          {
            id: 'mpsc-mains-qualifying-english',
            title: 'English Section (50 marks)',
            description: 'Includes Essay Writing, Translation (Marathi to English), Precis Writing, and Grammar.',
            tags: ['english'],
            mastery: 'none',
            resources: [],
          },
        ]
      },
      {
        id: 'mpsc-mains-essay',
        title: 'Paper I: Essay',
        icon: 'FileText',
        description: 'Candidates need to write three essays on various topics. Total Marks: 250.',
        tags: ['essay', 'merit'],
        mastery: 'none',
        resources: [],
      },
      {
        id: 'mpsc-mains-gs1',
        title: 'Paper II: General Studies I',
        icon: 'FileText',
        description: 'Covers Indian History (with emphasis on Maharashtra), Geography (with emphasis on Maharashtra), and Indian Society. Total Marks: 250.',
        tags: ['gs-1', 'history', 'geography', 'society'],
        mastery: 'none',
        resources: [],
        subtopics: [
          { id: 'mpsc-mains-gs1-history-culture', title: 'History and Culture', description: 'Ancient/Medieval India, Modern India (1757–1947), Social reform movements, Post-independence consolidation, History of Maharashtra, Art & Culture.', tags: [], mastery: 'none', resources: [] },
          { id: 'mpsc-mains-gs1-geography', title: 'Geography', description: 'Physical, Economic, and Human Geography of India and Maharashtra; environmental geography and disaster management.', tags: [], mastery: 'none', resources: [] },
          { id: 'mpsc-mains-gs1-society', title: 'Society', description: 'Indian society features, diversity, social problems, social justice schemes, role of women, regionalism and communalism.', tags: [], mastery: 'none', resources: [] },
        ],
      },
       {
        id: 'mpsc-mains-gs2',
        title: 'Paper III: General Studies II',
        icon: 'FileText',
        description: 'Covers Constitution, Polity, Governance, Law, Social Justice, and International Relations. Total Marks: 250.',
        tags: ['gs-2', 'polity', 'governance', 'law'],
        mastery: 'none',
        resources: [],
        subtopics: [
          { id: 'mpsc-gs2-polity', title: 'Indian Constitution and Polity', description: 'Constitution making, Preamble, FRs, DPSPs, Union & State government, Judiciary, Federal Structure, Constitutional Bodies.', tags: [], mastery: 'none', resources: [] },
          { id: 'mpsc-gs2-governance', title: 'Governance and Public Policy', description: 'Good Governance, E-Governance, RTI, Citizen Charters, Role of Civil Services, Social Audit.', tags: [], mastery: 'none', resources: [] },
          { id: 'mpsc-gs2-justice', title: 'Social Justice and Welfare', description: 'Welfare schemes for vulnerable sections (SC, ST, OBC, women, minorities), Issues of Social Inclusion and Empowerment.', tags: [], mastery: 'none', resources: [] },
          { id: 'mpsc-gs2-law', title: 'Law and Public Policy', description: 'Important Acts related to Women, Children, Environment, Education, Health, and Cybersecurity. Disaster Laws.', tags: [], mastery: 'none', resources: [] },
          { id: 'mpsc-gs2-ir', title: 'International Relations', description: 'India’s foreign policy, relations with neighbors (SAARC, ASEAN) and major powers (USA, Russia, China), and role in international institutions (UN, WTO).', tags: [], mastery: 'none', resources: [] }
        ]
      },
      {
        id: 'mpsc-mains-gs3',
        title: 'Paper IV: General Studies III',
        icon: 'FileText',
        description: 'Covers Indian Economy, Agriculture, Science, Technology, Environment, and Internal Security. Total Marks: 250.',
        tags: ['gs-3', 'economy', 'sci-tech', 'agriculture'],
        mastery: 'none',
        resources: [],
         subtopics: [
          { id: 'mpsc-gs3-economy', title: 'Indian Economy and Planning', description: 'Growth, Development, Poverty, Unemployment, Fiscal Policy (Budget, GST), Monetary Policy (RBI, Inflation), Economy of Maharashtra.', tags: [], mastery: 'none', resources: [] },
          { id: 'mpsc-gs3-agriculture', title: 'Agriculture and Allied Sectors', description: 'Land reforms, Irrigation, Cropping patterns, Agri-Marketing, Food Processing, Government schemes for farmers.', tags: [], mastery: 'none', resources: [] },
          { id: 'mpsc-gs3-industry', title: 'Industry and Infrastructure', description: 'Industrial Policy, MSMEs, Startups, Make in India, SEZs, Infrastructure (Roads, Energy), PPP Models.', tags: [], mastery: 'none', resources: [] },
          { id: 'mpsc-gs3-scitech', title: 'Science and Technology', description: 'Role of S&T, Space Technology (ISRO), Biotechnology, Nanotechnology, ICT, Cybersecurity, AI.', tags: [], mastery: 'none', resources: [] },
          { id: 'mpsc-gs3-environment', title: 'Environment and Ecology', description: 'Conservation, Biodiversity, Climate Change, Pollution, Waste Management, EIA, SDGs.', tags: [], mastery: 'none', resources: [] },
          { id: 'mpsc-gs3-security', title: 'Internal Security and Disaster Management', description: 'Threats from Extremism & Terrorism, role of security forces, Cybercrime, Money laundering. Disaster Management cycle (NDMA, SDRF).', tags: [], mastery: 'none', resources: [] }
        ]
      },
      {
        id: 'mpsc-mains-gs4',
        title: 'Paper V: General Studies IV',
        icon: 'FileText',
        description: 'Covers Ethics, Integrity, and Aptitude, using case studies to test practical application. Total Marks: 250.',
        tags: ['gs-4', 'ethics', 'aptitude'],
        mastery: 'none',
        resources: [],
        subtopics: [
          { id: 'mpsc-gs4-ethics-interface', title: 'Ethics and Human Interface', description: 'Essence, determinants, and consequences of Ethics in human actions. Human Values from leaders, reformers, and administrators.', tags: [], mastery: 'none', resources: [] },
          { id: 'mpsc-gs4-attitude', title: 'Attitude', description: 'Content, structure, function; its influence with thought and behavior; moral and political attitudes; social influence.', tags: [], mastery: 'none', resources: [] },
          { id: 'mpsc-gs4-aptitude', title: 'Aptitude & Foundational Values', description: 'Integrity, impartiality, objectivity, dedication to public service, empathy, tolerance, and compassion. Emotional intelligence.', tags: [], mastery: 'none', resources: [] },
          { id: 'mpsc-gs4-thinkers', title: 'Contributions of Thinkers & Philosophers', description: 'Contributions from Indian and Western moral thinkers.', tags: [], mastery: 'none', resources: [] },
          { id: 'mpsc-gs4-probity', title: 'Probity in Governance', description: 'Concept of public service, RTI, codes of ethics/conduct, citizen’s charters, challenges of corruption.', tags: [], mastery: 'none', resources: [] },
          { id: 'mpsc-gs4-casestudies', title: 'Case Studies', description: 'Testing ethical reasoning and moral compass in practical administrative situations.', tags: [], mastery: 'none', resources: [] }
        ]
      },
    ]
  },
  {
    id: 'mpsc-interview',
    title: 'Stage III: Interview / Personality Test',
    icon: 'Users',
    description: 'A personality test for candidates who clear the Main Examination, assessing their suitability for a career in public administration. Total Marks: 100.',
    tags: ['interview', 'personality-test', 'final-stage'],
    mastery: 'none',
    resources: []
  },
];
