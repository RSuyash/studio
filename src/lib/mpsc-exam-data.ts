
import type { Exam } from './exam-data';

export const mpscRajyasevaExam: Exam = {
  id: 'mpsc-rajyaseva',
  title: 'MPSC Rajyaseva Exam',
  description: 'A comprehensive overview of the MPSC Rajyaseva (State Services) Examination, based on the revised pattern from 2023 onwards.',
  stages: [
    {
      title: 'Stage I: Preliminary Examination',
      description: 'An objective-type screening test. Marks are not counted for the final merit list, but candidates must clear the cut-off. The CSAT paper is qualifying in nature.',
      papers: [
        { name: 'Paper I', subject: 'General Studies (GS)', duration: '2 hours', marks: 200, nature: 'Merit' },
        { name: 'Paper II', subject: 'CSAT (Aptitude Test)', duration: '2 hours', marks: 200, qualifyingMarks: '33%', nature: 'Qualifying' },
      ],
      notes: [
          'Both papers are in English & Marathi.'
      ],
      subStages: [
        {
          title: 'Syllabus – Prelims Paper I – General Studies (GS)',
          description: 'This paper is counted for merit ranking in Prelims.',
          syllabus: [
            'Current Affairs: State, national, and international events, schemes, reports, awards, etc.',
            'History of India and Maharashtra: Ancient, Medieval, Modern Indian history with a focus on the freedom struggle and Maharashtra\'s role.',
            'Geography of India and Maharashtra: Physical, Economic, and Human Geography, including Maharashtra-specific features.',
            'Indian Polity and Governance: Constitution, government structure, judiciary, local governance (Panchayati Raj), and key acts.',
            'Economy and Planning: Indian economy sectors, GDP, planning (NITI Aayog), budget, banking, and Maharashtra\'s economy.',
            'General Science and Technology: Basic Physics, Chemistry, Biology, and key developments in Biotech, Nanotech, Space tech.',
            'Environment and Ecology: Ecosystems, biodiversity, climate change, conservation, and environmental movements in Maharashtra.',
            'Maharashtra-specific Topics: State administration, development programs, heritage, and important figures.',
          ],
        },
        {
          title: 'Syllabus – Prelims Paper II – CSAT (Qualifying)',
          description: 'Qualifying paper with a minimum of 33% marks required.',
          syllabus: [
            'Comprehension (Marathi and English)',
            'Interpersonal Skills including Communication Skills',
            'Logical Reasoning and Analytical Ability',
            'General Mental Ability (series, coding-decoding, etc.)',
            'Basic Numeracy and Data Interpretation (Class X level)',
          ],
        },
      ]
    },
    {
      title: 'Stage II: Main Examination',
      description: 'The Main Exam is descriptive in nature. Marks from the qualifying paper are not counted, while marks from the Essay and 4 GS papers are counted for the final ranking.',
      papers: [
        { name: 'Qualifying Paper', subject: 'Marathi & English Language', duration: '3 hours', marks: 100, qualifyingMarks: '35% overall', nature: 'Qualifying' },
        { name: 'Paper I', subject: 'Essay', duration: '3 hours', marks: 250, nature: 'Merit' },
        { name: 'Paper II', subject: 'General Studies I', duration: '3 hours', marks: 250, nature: 'Merit' },
        { name: 'Paper III', subject: 'General Studies II', duration: '3 hours', marks: 250, nature: 'Merit' },
        { name: 'Paper IV', subject: 'General Studies III', duration: '3 hours', marks: 250, nature: 'Merit' },
        { name: 'Paper V', subject: 'General Studies IV', duration: '3 hours', marks: 250, nature: 'Merit' },
      ],
      notes: [
          'No Optional Subjects in the revised MPSC pattern (2023 onwards).',
          'Medium of papers is Marathi or English (except for language sections).'
      ],
      subStages: [
        {
          title: 'Syllabus – Qualifying Paper (Marathi & English)',
          description: 'This is a compulsory paper, but qualifying in nature. Candidates must score a minimum of 25 marks in each section and 35% overall. Marks are not counted in the final tally.',
          subStages: [
            { title: 'A. Marathi (50 marks)', description: '', syllabus: ['Essay Writing (15 marks)', 'Translation from English to Marathi (10 marks)', 'Precis Writing (10 marks)', 'Grammar (15 marks)'] },
            { title: 'B. English (50 marks)', description: '', syllabus: ['Essay Writing (15 marks)', 'Translation from Marathi to English (10 marks)', 'Precis Writing (10 marks)', 'Grammar (15 marks)'] },
          ]
        },
        {
          title: 'Syllabus – Paper I (Essay)',
          description: 'Three essays need to be written. Topics are provided in English and Marathi, and candidates can write in their chosen medium. Evaluated on clarity, coherence, factual accuracy, and expression.',
          subStages: [
            {
              title: 'Structure',
              description: '',
              syllabus: [
                'Three essays need to be written.',
                'Topics are generally drawn from: Contemporary issues (national/international), Ethics, governance, and social justice, Economic and developmental issues, Science and technology, Environment and sustainable development, Philosophy and abstract themes, History, society, and culture (including Maharashtra-specific angles).'
              ]
            },
            {
              title: 'Instructions',
              description: '',
              syllabus: [
                'Each essay is typically expected to be between 1000–1200 words.',
                'Topics are provided in English and Marathi, and candidates can write in their chosen medium.',
                'Essays should demonstrate: Clarity of thought, Logical flow, Coherence and structure, Originality, Depth of analysis, Balanced viewpoints.'
              ]
            },
            {
              title: 'Past Examples of Themes',
              description: '',
              syllabus: [
                'Ethical/Social: “Is development at the cost of the environment justifiable?” or “Role of youth in combating corruption.”',
                'Philosophical: “Happiness is a journey, not a destination.” or “Technology shapes society more than society shapes technology.”',
                'Economic/Political: “Federalism in India: Challenges and Prospects.” or “Digital India and its socio-economic implications.”',
                'Maharashtra-specific: “Urbanization in Maharashtra: Boon or Bane?” or “Role of cooperatives in Maharashtra’s development.”'
              ]
            },
            {
              title: 'Tips',
              description: '',
              syllabus: [
                'Structure your essay into: Introduction, Body (with thematic paragraphs), and Conclusion (with a future-forward tone).',
                'Use facts, real-world examples (esp. Maharashtra), quotes, and balanced arguments.',
                'Avoid taking extreme or biased positions.'
              ]
            }
          ]
        },
        {
          title: 'Syllabus – Paper II (GS I: History, Geography, Society)',
          description: 'Covers Indian History & Culture, Geography of India & the World, and Indian Society, with special emphasis on Maharashtra.',
          subStages: [
            {
              title: 'A. History and Culture',
              description: '',
              syllabus: ['Ancient and Medieval Indian History', 'Modern Indian History (1757–1947)', 'Social reform movements (India & Maharashtra)', 'Post-independence consolidation', 'History of Maharashtra: Shivaji, Marathas, freedom struggle', 'Art, Culture, Literature, Architecture']
            },
            {
              title: 'B. Geography',
              description: '',
              syllabus: ['Physical Geography of India and Maharashtra', 'Climate, resources, rivers, soils, natural hazards', 'Economic Geography: agriculture, industries, trade', 'Human Geography: population, urbanization, migration', 'Environmental geography, biodiversity, disaster management']
            },
            {
              title: 'C. Society',
              description: '',
              syllabus: ['Indian society: features, diversity, secularism', 'Caste, religion, language, ethnicity', 'Social problems: poverty, unemployment, communalism', 'Social justice and welfare schemes', 'Role of women and gender issues', 'Regionalism and communalism']
            },
          ]
        },
        {
          title: 'Syllabus – Paper III (GS II: Constitution, Polity, Governance, Law, Social Justice, and International Relations)',
          description: 'Covers the Indian Constitution, Polity, Governance, Law, Social Justice, and International Relations.',
          subStages: [
            {
              title: 'A. Indian Constitution and Polity',
              description: '',
              syllabus: [
                'Historical Background: Making of the Constitution', 'Salient Features of the Constitution', 'Preamble, Fundamental Rights, Directive Principles, Fundamental Duties',
                'Union and State Government: Executive, Legislature, Judiciary', 'Federal Structure and Centre-State Relations',
                'Constitutional and Statutory Bodies: Election Commission, UPSC, CAG, Finance Commission, NITI Aayog, Human Rights Commission, SC/ST Commission, Women’s Commission, etc.'
              ]
            },
            {
              title: 'B. Governance and Public Policy',
              description: '',
              syllabus: [
                'Good Governance, E-Governance, RTI', 'Citizen Charters, Transparency, Accountability', 'Role of Civil Services in Democracy', 'Governance Reforms and Administrative Reforms',
                'Social Audit, Vigilance Mechanisms', 'Use of ICT in administration', 'Government Policies and Interventions for Development (especially in Maharashtra)', 'Issues related to implementation of schemes'
              ]
            },
            {
              title: 'C. Social Justice and Welfare',
              description: '',
              syllabus: [
                'Welfare schemes for: SCs, STs, OBCs, minorities, women, children, elderly, disabled', 'Constitutional Provisions and Policies', 'Issues of Social Inclusion, Empowerment', 'Problems of Vulnerable Sections'
              ]
            },
            {
              title: 'D. Law and Public Policy',
              description: '',
              syllabus: [
                'Legal Awareness', 'Important Acts/Laws related to: Women and Child Welfare, Environment and Forests, Education and Health, Cybersecurity and IT', 'Right to Education, Right to Food, Right to Health', 'Disaster Laws and Administrative Responses'
              ]
            },
            {
              title: 'E. International Relations',
              description: '',
              syllabus: [
                'India’s foreign policy: objectives, principles', 'India and neighbors: SAARC, ASEAN', 'International institutions: UN, WTO, IMF, World Bank',
                'Bilateral and Multilateral relations with: USA, Russia, China, EU, Japan, West Asia', 'Role of India in global governance', 'Agreements and Treaties impacting India'
              ]
            }
          ]
        },
        {
          title: 'Syllabus – Paper IV (GS III: Indian Economy, Agriculture, Science, Technology, Environment, and Internal Security)',
          description: 'Covers Indian Economy, Agriculture, Science, Technology, Environment, and Internal Security.',
          subStages: [
            {
              title: 'A. Indian Economy and Planning',
              description: '',
              syllabus: ['Nature and characteristics of the Indian Economy', 'Growth, Development, and Sustainable Development', 'Poverty, Unemployment, and Inequality', 'Planning: Five Year Plans, NITI Aayog', 'Economic Reforms: LPG Model', 'Fiscal Policy: Budgeting, Deficits, Taxation (GST)', 'Monetary Policy: RBI, Inflation, Banking, NBFCs', 'Public Distribution System', 'Government Welfare Schemes (esp. Maharashtra)', 'Economy of Maharashtra: Growth, Issues, State Finances']
            },
            {
              title: 'B. Agriculture and Allied Sectors',
              description: '',
              syllabus: ['Land reforms, Irrigation, Cropping patterns', 'Farm Mechanization, Agri-Infrastructure', 'Agricultural Marketing, APMC Act, e-NAM', 'Animal Husbandry, Poultry, Fishery, Sericulture', 'Food Processing and Agri-Industries', 'Government schemes for farmers', 'Agricultural credit and insurance (PMFBY, KCC)', 'Organic and Natural Farming', 'Role of biotechnology in agriculture']
            },
            {
              title: 'C. Industry and Infrastructure',
              description: '',
              syllabus: ['Industrial Policy and Growth Trends', 'MSMEs, Startups, Make in India, Skill India', 'Industrial corridors, SEZs', 'Infrastructure: Roads, Railways, Ports, Energy, Smart Cities', 'Public-Private Partnership (PPP) Models', 'FDI and Industrial Investment Trends']
            },
            {
              title: 'D. Science and Technology',
              description: '',
              syllabus: ['Role of S&T in India’s development', 'Space Technology: ISRO, satellites, Gaganyaan', 'Nuclear Technology', 'Biotechnology: GM crops, Genetic engineering', 'Nanotechnology, Robotics', 'ICT: Digital India, Cybersecurity', 'Artificial Intelligence, Machine Learning', 'Indigenous innovation and R&D policy', 'Technology Missions in agriculture, water, health']
            },
            {
              title: 'E. Environment and Ecology',
              description: '',
              syllabus: ['Environmental Conservation and Legislation', 'Biodiversity and Climate Change', 'Forest and Wildlife Conservation (incl. in Maharashtra)', 'Pollution and Control Measures', 'National Action Plan on Climate Change', 'UN Frameworks and COP Summits', 'Waste Management: Solid, e-waste, biomedical', 'Environmental Impact Assessment (EIA)', 'Sustainable Development Goals (SDGs)']
            },
            {
              title: 'F. Internal Security and Disaster Management',
              description: '',
              syllabus: ['Internal Security: Threats from Extremism, Terrorism, Cybercrime', 'Role of Armed Forces, CAPFs, Police, Intelligence', 'Cybersecurity and Information Warfare', 'Money laundering, Fake currency, Organized crime', 'Disaster Management: Types, Preparedness, Response', 'Role of NDMA, SDRF, Local Administration', 'Community-based disaster risk reduction']
            }
          ]
        },
        {
          title: 'Syllabus – Paper V (GS IV: Ethics, Integrity, and Aptitude)',
          description: 'Designed to assess the candidate’s attitude and approach to issues relating to integrity, probity in public life, and their problem-solving approach to various societal issues. It includes case studies to test decision-making and ethical competence.',
          subStages: [
            {
              title: 'A. Ethics and Human Interface',
              description: '',
              syllabus: ['Essence of Ethics, Determinants and Consequences of Ethics in Human Action', 'Dimensions of Ethics', 'Ethics in Private and Public Relationships', 'Human Values: Lessons from the lives and teachings of great leaders, reformers, and administrators', 'Role of family, society, and educational institutions in inculcating values']
            },
            {
              title: 'B. Attitude',
              description: '',
              syllabus: ['Content, Structure, and Function of Attitude', 'Influence and Relation with Thought and Behaviour', 'Moral and Political Attitudes', 'Social Influence and Persuasion']
            },
            {
              title: 'C. Aptitude and Foundational Values for Civil Services',
              description: '',
              syllabus: ['Integrity, Impartiality, and Non-partisanship', 'Objectivity, Dedication to Public Service', 'Empathy, Tolerance, and Compassion towards the weaker sections']
            },
            {
              title: 'D. Emotional Intelligence',
              description: '',
              syllabus: ['Concepts and Dimensions of Emotional Intelligence', 'Emotional Intelligence in Personal and Professional Life', 'Role of Emotional Intelligence in Decision-Making and Leadership']
            },
            {
              title: 'E. Contributions of Thinkers and Philosophers',
              description: '',
              syllabus: ['Contributions of Indian and Western moral thinkers and philosophers', 'Application of their ideas in administration and governance']
            },
            {
              title: 'F. Public/Civil Service Values and Ethics in Public Administration',
              description: '',
              syllabus: ['Status and Problems of Civil Services', 'Ethical Concerns and Dilemmas in Government and Private Institutions', 'Laws, Rules, Regulations, and Conscience as Sources of Ethical Guidance', 'Accountability and Ethical Governance', 'Strengthening of Ethical and Moral Values in Governance', 'Ethical Issues in International Relations and Funding']
            },
            {
              title: 'G. Probity in Governance',
              description: '',
              syllabus: ['Concept of Public Service, Philosophical Basis of Governance and Probity', 'Information Sharing and Transparency in Government', 'Right to Information (RTI)', 'Codes of Ethics, Codes of Conduct', 'Citizen’s Charters', 'Work Culture', 'Quality of Service Delivery', 'Utilization of Public Funds', 'Challenges of Corruption']
            },
            {
              title: 'H. Case Studies on Above Topics',
              description: '',
              syllabus: ['Practical situations involving: Decision making, Ethical dilemmas, Conflict resolution, Administrative behavior', 'Testing candidate’s: Ethical reasoning, Moral compass, Application of values to real-world scenarios']
            },
          ]
        },
      ]
    },
    {
      title: 'Stage III: Interview / Personality Test',
      description: 'A personality test for candidates who clear the Main Examination, assessing their suitability for a career in public administration.',
      papers: [
          { name: 'Interview', subject: 'Personality Test', marks: 100, nature: 'Merit' }
      ]
    },
  ],
  finalScore: [
    { component: 'Mains (Essay + 4 GS Papers)', marks: 1250 },
    { component: 'Interview', marks: 100 },
  ],
};
