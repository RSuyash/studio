
import type { SyllabusTopic } from '@/lib/types';

export const mpscSyllabusData: SyllabusTopic[] = [
  {
    id: 'mpsc-preliminary-exam',
    title: 'Stage I: Preliminary Examination',
    icon: 'ClipboardList',
    description: 'Objective Type (Multiple Choice) screening test. Marks are not counted in the final merit list. CSAT is qualifying with 33% passing criteria.',
    tags: ['objective', 'qualifying'],
    mastery: 'none',
    subtopics: [
      {
        id: 'mpsc-prelims-gs1',
        title: 'Paper I: General Studies',
        icon: 'FileText',
        description: 'This paper is counted for merit ranking in Prelims. It covers a broad range of topics from current affairs to Maharashtra-specific history and geography.',
        tags: ['gs', 'merit-cutoff'],
        mastery: 'none',
        marks: 200,
        questions: 100,
        subtopics: [
          {
            id: 'mpsc-prelims-gs1-current-affairs',
            title: 'Current Affairs (सामायिक घडामोडी)',
            description: 'State, national, and international current events, government schemes, important reports, indices, awards, and personalities in the news.',
            tags: ['dynamic', 'high-priority'],
            mastery: 'none',
          },
          {
            id: 'mpsc-prelims-gs1-history',
            title: 'History of India and Maharashtra (इतिहास)',
            description: 'Covers Ancient, Medieval, and Modern Indian history with a special emphasis on Maharashtra\'s role and social reformers.',
            tags: ['history', 'static', 'maharashtra'],
            mastery: 'none',
            subtopics: [
              { id: 'mpsc-history-ancient-medieval', title: 'Ancient and Medieval India', description: 'Vedic period, Mauryan and Gupta empires, Bhakti and Sufi movements, Sultanate and Mughal administration.', tags: [], mastery: 'none' },
              { id: 'mpsc-history-modern', title: 'Modern Indian History', description: 'British policies, social reform movements, 1857 revolt, and freedom movements (1885–1947), including key leaders like Gandhi, Nehru, and Ambedkar.', tags: [], mastery: 'none' },
              { id: 'mpsc-history-maharashtra', title: 'History of Maharashtra', description: 'Shivaji and the Maratha Empire, Maharashtra’s role in the freedom struggle, Samyukta Maharashtra Movement, and key social reformers.', tags: [], mastery: 'none' },
            ],
          },
          {
            id: 'mpsc-prelims-gs1-geography',
            title: 'Geography of India and Maharashtra (भूगोल)',
            description: 'Covers physical, economic, and human geography of India with a special focus on Maharashtra.',
            tags: ['geography', 'maharashtra'],
            mastery: 'none',
             subtopics: [
              { id: 'mpsc-geography-physical', title: 'Physical Geography', description: 'Himalayas, rivers, climate, soils of India.', tags: [], mastery: 'none' },
              { id: 'mpsc-geography-economic', title: 'Economic Geography', description: 'Agriculture, minerals, industries in India.', tags: [], mastery: 'none' },
              { id: 'mpsc-geography-human', title: 'Human Geography', description: 'Population, migration, urbanization in India.', tags: [], mastery: 'none' },
              { id: 'mpsc-geography-maharashtra', title: 'Geography of Maharashtra', description: 'Major rivers (Godavari, Krishna), soil types, dams, irrigation, transport, and environmental issues.', tags: [], mastery: 'none' },
            ],
          },
          {
            id: 'mpsc-prelims-gs1-polity',
            title: 'Indian Polity and Governance (राज्यशास्त्र)',
            description: 'Indian Constitution, government structure, judiciary, local governance (Panchayati Raj), key acts like RTI, and social justice issues.',
            tags: ['polity', 'governance'],
            mastery: 'none',
          },
          {
            id: 'mpsc-prelims-gs1-economy',
            title: 'Economy and Planning (अर्थव्यवस्था)',
            description: 'Indian economy sectors, GDP, NITI Aayog, budget, banking, inflation, poverty, and specific indicators for Maharashtra\'s economy.',
            tags: ['economy', 'development', 'maharashtra'],
            mastery: 'none',
          },
          {
            id: 'mpsc-prelims-gs1-science',
            title: 'General Science and Technology (सामान्य विज्ञान)',
            description: 'Basic Physics, Chemistry, Biology (school-level), along with concepts in Biotechnology, Nanotechnology, and Space technology.',
            tags: ['science', 'technology'],
            mastery: 'none',
          },
          {
            id: 'mpsc-prelims-gs1-environment',
            title: 'Environment and Ecology (पर्यावरणशास्त्र)',
            description: 'Ecosystems, biodiversity, climate change, conservation, and environmental movements with a focus on Maharashtra.',
            tags: ['environment', 'ecology', 'maharashtra'],
            mastery: 'none',
          },
           {
            id: 'mpsc-prelims-gs1-maharashtra-specific',
            title: 'Maharashtra-specific Topics',
            description: 'State administration and policy, development programs, historical and cultural heritage, and basic awareness of Marathi language and literature.',
            tags: ['maharashtra', 'state-specific'],
            mastery: 'none',
          },
        ],
      },
      {
        id: 'mpsc-prelims-csat',
        title: 'Paper II: CSAT (Qualifying)',
        icon: 'FileText',
        description: 'A qualifying paper requiring 33% marks (66/200). Tests aptitude and reasoning skills.',
        tags: ['csat', 'aptitude', 'qualifying'],
        mastery: 'none',
        marks: 200,
        questions: 80,
        subtopics: [
            { id: 'mpsc-csat-comprehension', title: 'Comprehension (वाचन समज)', description: 'Reading passages with factual and inference-based questions in both English and Marathi.', tags: [], mastery: 'none' },
            { id: 'mpsc-csat-interpersonal', title: 'Interpersonal & Communication Skills', description: 'Situation-based questions to test clarity of communication and empathy.', tags: [], mastery: 'none' },
            { id: 'mpsc-csat-reasoning', title: 'Logical Reasoning & Analytical Ability', description: 'Syllogisms, statement-conclusion, cause-effect reasoning, and problem-solving.', tags: [], mastery: 'none' },
            { id: 'mpsc-csat-mental-ability', title: 'General Mental Ability', description: 'Number series, coding-decoding, blood relations, directions, and rankings.', tags: [], mastery: 'none' },
            { id: 'mpsc-csat-numeracy', title: 'Basic Numeracy (Class X level)', description: 'Arithmetic (percentages, profit & loss), simple & compound interest, time-speed-distance, and data interpretation.', tags: [], mastery: 'none' },
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
    subtopics: [
      {
        id: 'mpsc-mains-qualifying',
        title: 'Qualifying Paper – Marathi & English Language',
        icon: 'ShieldCheck',
        description: 'This is a compulsory paper, but qualifying in nature. Marks are not counted in the final tally. Minimum 25 marks in each section and 35% overall required.',
        tags: ['qualifying', 'language'],
        mastery: 'none',
        marks: 100,
        subtopics: [
          {
            id: 'mpsc-mains-qualifying-marathi',
            title: 'Marathi Section (50 marks)',
            description: 'Includes Essay Writing, Translation (English to Marathi), Precis Writing, and Grammar.',
            tags: ['marathi'],
            mastery: 'none',
          },
          {
            id: 'mpsc-mains-qualifying-english',
            title: 'English Section (50 marks)',
            description: 'Includes Essay Writing, Translation (Marathi to English), Precis Writing, and Grammar.',
            tags: ['english'],
            mastery: 'none',
          },
        ]
      },
      {
        id: 'mpsc-mains-essay',
        title: 'Paper I: Essay',
        icon: 'FileText',
        description: 'Candidates need to write three essays on various topics.',
        tags: ['essay', 'merit'],
        mastery: 'none',
        marks: 250,
      },
      {
        id: 'mpsc-mains-gs1',
        title: 'Paper II: General Studies I',
        icon: 'FileText',
        description: 'Covers History, Geography, and Indian Society, with a focus on Maharashtra.',
        tags: ['gs-1', 'history', 'geography', 'society'],
        mastery: 'none',
        marks: 250,
        subtopics: [
          { id: 'mpsc-mains-gs1-history-culture', title: 'History and Culture', description: 'Ancient/Medieval India, Modern India (1757–1947), Social reform movements, Post-independence consolidation, History of Maharashtra, Art & Culture.', tags: [], mastery: 'none' },
          { id: 'mpsc-mains-gs1-geography', title: 'Geography', description: 'Physical, Economic, and Human Geography of India and Maharashtra; environmental geography and disaster management.', tags: [], mastery: 'none' },
          { id: 'mpsc-mains-gs1-society', title: 'Society', description: 'Indian society features, diversity, social problems, social justice schemes, role of women, regionalism and communalism.', tags: [], mastery: 'none' },
        ],
      },
       {
        id: 'mpsc-mains-gs2',
        title: 'Paper III: General Studies II',
        icon: 'FileText',
        description: 'Covers Constitution, Polity, Governance, Law, Social Justice, and International Relations.',
        tags: ['gs-2', 'polity', 'governance', 'law'],
        mastery: 'none',
        marks: 250,
        subtopics: [
            { 
                id: 'mpsc-gs2-polity', 
                title: 'Indian Constitution and Polity', 
                description: 'The constitutional framework and political system of India.', 
                tags: [], mastery: 'none',
                subtopics: [
                    { id: 'mpsc-gs2-polity-background', title: 'Historical Background & Making of Constitution', description: 'The evolution and framing of the Indian Constitution.', tags: [], mastery: 'none' },
                    { id: 'mpsc-gs2-polity-features', title: 'Salient Features, Preamble, FRs, DPSPs, FDs', description: 'Core principles and components of the Constitution.', tags: [], mastery: 'none' },
                    { id: 'mpsc-gs2-polity-govt', title: 'Union & State Government', description: 'Structure and functioning of the Executive, Legislature, and Judiciary at central and state levels.', tags: [], mastery: 'none' },
                    { id: 'mpsc-gs2-polity-federal', title: 'Federal Structure & Centre-State Relations', description: 'Legislative, administrative, and financial relations between the Union and States.', tags: [], mastery: 'none' },
                    { id: 'mpsc-gs2-polity-bodies', title: 'Constitutional & Statutory Bodies', description: 'EC, UPSC, CAG, Finance Commission, NITI Aayog, Human Rights Commissions, etc.', tags: [], mastery: 'none' }
                ]
            },
            { 
                id: 'mpsc-gs2-governance', 
                title: 'Governance and Public Policy', 
                description: 'Aspects of public administration and policy-making.', 
                tags: [], mastery: 'none',
                subtopics: [
                    { id: 'mpsc-gs2-governance-concepts', title: 'Good Governance, E-Governance, RTI', description: 'Key concepts for transparent and efficient administration.', tags: [], mastery: 'none' },
                    { id: 'mpsc-gs2-governance-accountability', title: 'Accountability Mechanisms', description: 'Citizen Charters, Social Audit, and Vigilance mechanisms.', tags: [], mastery: 'none' },
                    { id: 'mpsc-gs2-governance-civilservices', title: 'Role of Civil Services in Democracy', description: 'The function and importance of the administrative machinery.', tags: [], mastery: 'none' },
                    { id: 'mpsc-gs2-governance-schemes', title: 'Government Policies & Interventions', description: 'Design and implementation of schemes, especially in Maharashtra.', tags: [], mastery: 'none' }
                ]
            },
            { 
                id: 'mpsc-gs2-justice', 
                title: 'Social Justice and Welfare', 
                description: 'Policies and issues related to the welfare of vulnerable sections.', 
                tags: [], mastery: 'none',
                subtopics: [
                    { id: 'mpsc-gs2-justice-schemes', title: 'Welfare Schemes for Vulnerable Sections', description: 'Schemes for SCs, STs, OBCs, minorities, women, children, elderly, disabled.', tags: [], mastery: 'none' },
                    { id: 'mpsc-gs2-justice-issues', title: 'Issues of Social Inclusion & Empowerment', description: 'Challenges and policies related to empowering marginalized communities.', tags: [], mastery: 'none' }
                ]
            },
            { 
                id: 'mpsc-gs2-law', 
                title: 'Law and Public Policy', 
                description: 'Key legislation and its impact on public policy.', 
                tags: [], mastery: 'none',
                subtopics: [
                    { id: 'mpsc-gs2-law-acts', title: 'Important Acts/Laws', description: 'Legislation related to Women, Children, Environment, Education, Health, and Cybersecurity.', tags: [], mastery: 'none' },
                    { id: 'mpsc-gs2-law-disaster', title: 'Disaster Laws & Administrative Responses', description: 'Legal framework for disaster management.', tags: [], mastery: 'none' }
                ]
            },
            { 
                id: 'mpsc-gs2-ir', 
                title: 'International Relations', 
                description: 'India\'s engagement with the world.', 
                tags: [], mastery: 'none',
                subtopics: [
                    { id: 'mpsc-gs2-ir-policy', title: 'India’s Foreign Policy', description: 'Objectives, principles, and evolution of India\'s foreign policy.', tags: [], mastery: 'none' },
                    { id: 'mpsc-gs2-ir-relations', title: 'Bilateral & Multilateral Relations', description: 'Relations with neighbors (SAARC, ASEAN) and major powers (USA, Russia, China, EU).', tags: [], mastery: 'none' },
                    { id: 'mpsc-gs2-ir-institutions', title: 'International Institutions', description: 'India\'s role in the UN, WTO, IMF, World Bank, etc.', tags: [], mastery: 'none' }
                ]
            }
        ]
      },
      {
        id: 'mpsc-mains-gs3',
        title: 'Paper IV: General Studies III',
        icon: 'FileText',
        description: 'Covers Indian Economy, Agriculture, Science, Technology, Environment, and Internal Security.',
        tags: ['gs-3', 'economy', 'sci-tech', 'agriculture'],
        mastery: 'none',
        marks: 250,
         subtopics: [
            { 
                id: 'mpsc-gs3-economy', 
                title: 'Indian Economy and Planning', 
                description: 'Structure and challenges of the Indian economy.', 
                tags: [], mastery: 'none',
                subtopics: [
                    { id: 'mpsc-gs3-economy-growth', title: 'Growth, Development, & SDG', description: 'Concepts of economic growth, development, and sustainable development goals.', tags: [], mastery: 'none' },
                    { id: 'mpsc-gs3-economy-issues', title: 'Poverty, Unemployment, & Inequality', description: 'Major socio-economic challenges.', tags: [], mastery: 'none' },
                    { id: 'mpsc-gs3-economy-policy', title: 'Fiscal & Monetary Policy', description: 'Budgeting, Taxation (GST), role of RBI, and inflation management.', tags: [], mastery: 'none' },
                    { id: 'mpsc-gs3-economy-maharashtra', title: 'Economy of Maharashtra', description: 'Growth, key issues, and state finances of Maharashtra.', tags: [], mastery: 'none' }
                ]
            },
            { 
                id: 'mpsc-gs3-agriculture', 
                title: 'Agriculture and Allied Sectors', 
                description: 'The agricultural sector and its related activities.', 
                tags: [], mastery: 'none',
                subtopics: [
                    { id: 'mpsc-gs3-agri-reforms', title: 'Land Reforms, Irrigation, Cropping Patterns', description: 'Structural aspects of Indian agriculture.', tags: [], mastery: 'none' },
                    { id: 'mpsc-gs3-agri-marketing', title: 'Agricultural Marketing & Food Processing', description: 'APMC Act, e-NAM, and the food processing industry.', tags: [], mastery: 'none' },
                    { id: 'mpsc-gs3-agri-schemes', title: 'Government Schemes for Farmers', description: 'Initiatives for agricultural credit, insurance (PMFBY, KCC), etc.', tags: [], mastery: 'none' }
                ]
            },
            { 
                id: 'mpsc-gs3-industry', 
                title: 'Industry and Infrastructure', 
                description: 'Industrial development and infrastructure.', 
                tags: [], mastery: 'none',
                subtopics: [
                    { id: 'mpsc-gs3-industry-policy', title: 'Industrial Policy & Growth', description: 'MSMEs, Startups, Make in India, Skill India.', tags: [], mastery: 'none' },
                    { id: 'mpsc-gs3-industry-infra', title: 'Infrastructure Development', description: 'Roads, Railways, Ports, Energy, Smart Cities, and PPP Models.', tags: [], mastery: 'none' }
                ]
            },
            { 
                id: 'mpsc-gs3-scitech', 
                title: 'Science and Technology', 
                description: 'Developments in S&T and their applications.', 
                tags: [], mastery: 'none',
                subtopics: [
                    { id: 'mpsc-gs3-scitech-space', title: 'Space Technology', description: 'ISRO achievements, satellites, Gaganyaan mission.', tags: [], mastery: 'none' },
                    { id: 'mpsc-gs3-scitech-emerging', title: 'Emerging Technologies', description: 'Biotechnology, Nanotechnology, Robotics, ICT, Cybersecurity, AI, ML.', tags: [], mastery: 'none' }
                ]
            },
            { 
                id: 'mpsc-gs3-environment', 
                title: 'Environment and Ecology', 
                description: 'Environmental conservation and challenges.', 
                tags: [], mastery: 'none',
                subtopics: [
                    { id: 'mpsc-gs3-env-conservation', title: 'Conservation & Legislation', description: 'Biodiversity, Climate Change, Forest & Wildlife Conservation.', tags: [], mastery: 'none' },
                    { id: 'mpsc-gs3-env-issues', title: 'Pollution & Waste Management', description: 'Control measures for pollution, and management of solid, e-waste, etc.', tags: [], mastery: 'none' },
                    { id: 'mpsc-gs3-env-assessment', title: 'Environmental Impact Assessment (EIA)', description: 'Process and significance of EIA.', tags: [], mastery: 'none' }
                ]
            },
            { 
                id: 'mpsc-gs3-security', 
                title: 'Internal Security and Disaster Management', 
                description: 'Challenges to national security and disaster preparedness.', 
                tags: [], mastery: 'none',
                subtopics: [
                    { id: 'mpsc-gs3-sec-threats', title: 'Internal Security Threats', description: 'Extremism, Terrorism, Cybercrime, Money laundering, Organized crime.', tags: [], mastery: 'none' },
                    { id: 'mpsc-gs3-sec-dm', title: 'Disaster Management', description: 'Types of disasters, preparedness, response, and role of NDMA/SDRF.', tags: [], mastery: 'none' }
                ]
            }
        ]
      },
      {
        id: 'mpsc-mains-gs4',
        title: 'Paper V: General Studies IV',
        icon: 'FileText',
        description: 'Covers Ethics, Integrity, and Aptitude, using case studies to test practical application.',
        tags: ['gs-4', 'ethics', 'aptitude'],
        mastery: 'none',
        marks: 250,
        subtopics: [
            { 
                id: 'mpsc-gs4-ethics-interface', 
                title: 'Ethics and Human Interface', 
                description: 'Core concepts of ethics and human values.', 
                tags: [], mastery: 'none',
                subtopics: [
                    { id: 'mpsc-gs4-ethics-essence', title: 'Essence, Determinants & Consequences of Ethics', description: 'The fundamental nature of ethics in human actions.', tags: [], mastery: 'none' },
                    { id: 'mpsc-gs4-ethics-values', title: 'Human Values', description: 'Lessons from great leaders, reformers, and the role of family and society.', tags: [], mastery: 'none' }
                ]
            },
            { id: 'mpsc-gs4-attitude', title: 'Attitude', description: 'Content, structure, function; its influence with thought and behavior; moral and political attitudes; social influence.', tags: [], mastery: 'none' },
            { 
                id: 'mpsc-gs4-aptitude', 
                title: 'Aptitude & Foundational Values', 
                description: 'Essential values for civil services.', 
                tags: [], mastery: 'none',
                subtopics: [
                    { id: 'mpsc-gs4-aptitude-values', title: 'Core Values', description: 'Integrity, impartiality, objectivity, dedication, empathy, tolerance, compassion.', tags: [], mastery: 'none' },
                    { id: 'mpsc-gs4-aptitude-ei', title: 'Emotional Intelligence', description: 'Concepts, dimensions, and application in administration.', tags: [], mastery: 'none' }
                ]
            },
            { id: 'mpsc-gs4-thinkers', title: 'Contributions of Thinkers & Philosophers', description: 'Contributions from Indian and Western moral thinkers.', tags: [], mastery: 'none' },
            { 
                id: 'mpsc-gs4-probity', 
                title: 'Probity in Governance', 
                description: 'Ethical governance and transparency.', 
                tags: [], mastery: 'none',
                subtopics: [
                    { id: 'mpsc-gs4-probity-concept', title: 'Concept of Public Service & Probity', description: 'Philosophical basis of governance.', tags: [], mastery: 'none' },
                    { id: 'mpsc-gs4-probity-transparency', title: 'Information Sharing & Transparency', description: 'Right to Information (RTI).', tags: [], mastery: 'none' },
                    { id: 'mpsc-gs4-probity-codes', title: 'Codes of Ethics & Conduct', description: 'Frameworks for ethical behavior.', tags: [], mastery: 'none' },
                    { id: 'mpsc-gs4-probity-challenges', title: 'Challenges of Corruption', description: 'Issues and mechanisms to tackle corruption.', tags: [], mastery: 'none' }
                ]
            },
            { id: 'mpsc-gs4-casestudies', title: 'Case Studies', description: 'Testing ethical reasoning and moral compass in practical administrative situations.', tags: [], mastery: 'none' }
        ]
      },
    ]
  },
  {
    id: 'mpsc-interview',
    title: 'Stage III: Interview / Personality Test',
    icon: 'Users',
    description: 'A personality test for candidates who clear the Main Examination, assessing their suitability for a career in public administration.',
    tags: ['interview', 'personality-test', 'final-stage'],
    mastery: 'none',
    marks: 100,
  },
];
