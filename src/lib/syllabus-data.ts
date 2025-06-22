
export type MasteryLevel = 'none' | 'novice' | 'advanced' | 'expert';

export interface SyllabusTopic {
  id: string;
  title: string;
  description: string;
  tags: string[];
  mastery: MasteryLevel;
  subtopics?: SyllabusTopic[];
  icon?: string;
}

export const initialSyllabusData: SyllabusTopic[] = [
  {
    id: 'preliminary-exam',
    title: 'Stage I: Preliminary Examination',
    icon: 'ClipboardList',
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
    icon: 'PencilLine',
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
        description: 'Candidates write two essays on a variety of topics, testing their ability to organize ideas and write concisely. Marks: 250.',
        tags: ['essay', 'merit'],
        mastery: 'none',
        subtopics: [
          { id: 'mains-essay-structure', title: 'Structure & Evaluation', description: 'Two sections, with one essay choice from each (125 marks each). Evaluated on relevance, organization, clarity, analytical depth, and concise expression.', tags: [], mastery: 'none' },
          { id: 'mains-essay-strategy', title: 'Strategy & Topics', description: 'Topics are broad, often philosophical or interdisciplinary. Practice structuring arguments with contemporary relevance and historical/philosophical depth.', tags: [], mastery: 'none' },
        ],
      },
      {
        id: 'mains-gs1',
        title: 'Paper II: General Studies I',
        description: 'Covers Indian Heritage and Culture, History and Geography of the World, and Society. Marks: 250.',
        tags: ['gs-1', 'history', 'geography', 'society'],
        mastery: 'none',
        subtopics: [
          { id: 'mains-gs1-art-culture', title: 'Indian Art & Culture', description: 'Salient aspects of art forms, architecture, literature from ancient to modern times.', tags: [], mastery: 'none' },
          { id: 'mains-gs1-modern-history', title: 'Modern Indian History', description: 'Mid-18th century to present: key events, personalities, issues. Freedom struggle and Post-independence consolidation & state reorganization.', tags: [], mastery: 'none' },
          { id: 'mains-gs1-world-history', title: 'World History', description: 'Events from the 18th century onwards: Industrial Revolution, world wars, decolonization, nation-state formation, and key ideologies.', tags: [], mastery: 'none' },
          { id: 'mains-gs1-society', title: 'Indian Society', description: 'Social structure: diversity, secularism, challenges. Women’s role, population dynamics, poverty, urbanization, and globalization.', tags: [], mastery: 'none' },
          { id: 'mains-gs1-geography', title: 'Geography – India & World', description: 'Physical geography (earth structure, climate, hazards). Human geography (industry locations, resources). Environmental issues (climate change, ecological challenges).', tags: [], mastery: 'none' },
        ],
      },
      {
        id: 'mains-gs2',
        title: 'Paper III: General Studies II',
        description: 'Covers Governance, Constitution, Polity, Social Justice, and International Relations. Marks: 250.',
        tags: ['gs-2', 'polity', 'governance', 'ir'],
        mastery: 'none',
        subtopics: [
          { id: 'mains-gs2-constitution', title: 'Indian Constitution', description: 'Historical underpinnings, evolution, features, amendments, basic structure, federalism, separation of powers, and dispute redressal mechanisms.', tags: [], mastery: 'none' },
          { id: 'mains-gs2-governance', title: 'Governance and Polity', description: 'Structure and functioning of Parliament, Executive, and Judiciary; role of pressure groups, and aspects of governance like transparency and e-governance.', tags: [], mastery: 'none' },
          { id: 'mains-gs2-welfare', title: 'Welfare Schemes and Policies', description: 'Policies for vulnerable sections (SC/ST, women, children), performance of schemes, and the role of NGOs/SHGs.', tags: [], mastery: 'none' },
          { id: 'mains-gs2-justice', title: 'Social Justice', description: 'Issues related to poverty, hunger, health, education, and inclusive growth.', tags: [], mastery: 'none' },
          { id: 'mains-gs2-ir', title: 'International Relations', description: 'India’s neighborhood relations, bilateral/global groupings, effect of foreign policies, and the role of the Indian diaspora and international institutions.', tags: [], mastery: 'none' },
        ]
      },
      {
        id: 'mains-gs3',
        title: 'Paper IV: General Studies III',
        description: 'Covers Technology, Economic Development, Biodiversity, Environment, Security, and Disaster Management. Marks: 250.',
        tags: ['gs-3', 'economy', 'sci-tech', 'security'],
        mastery: 'none',
        subtopics: [
          { id: 'mains-gs3-economy', title: 'Indian Economy', description: 'Planning, resource mobilization, growth, budgeting, agriculture (MSP, PDS, e-tech), land reforms, infrastructure, and investment models.', tags: [], mastery: 'none' },
          { id: 'mains-gs3-scitech', title: 'Science & Technology', description: 'Developments, applications, achievements of Indians, awareness in new fields (space, AI, biotech), and indigenization of technology.', tags: [], mastery: 'none' },
          { id: 'mains-gs3-environment', title: 'Environment and Ecology', description: 'Conservation, pollution, EIA, climate change agreements (UNFCCC, Paris), biodiversity, and sustainable development.', tags: [], mastery: 'none' },
          { id: 'mains-gs3-dm', title: 'Disaster Management', description: 'Types of disasters, disaster preparedness, mitigation strategies, and NDMA guidelines.', tags: [], mastery: 'none' },
          { id: 'mains-gs3-security', title: 'Internal Security', description: 'Linkages with extremism, role of external/non-state actors, cybersecurity, money laundering, and mandates of security forces.', tags: [], mastery: 'none' },
        ]
      },
      {
        id: 'mains-gs4',
        title: 'Paper V: General Studies IV',
        description: 'Covers Ethics, Integrity, and Aptitude, often using case studies. Marks: 250.',
        tags: ['gs-4', 'ethics', 'aptitude'],
        mastery: 'none',
        subtopics: [
            { id: 'mains-gs4-ethics-interface', title: 'Ethics and Human Interface', description: 'Essence, determinants, and consequences of Ethics in human actions; dimensions of ethics; ethics in private and public relationships. Human Values from leaders, reformers and administrators.', tags: [], mastery: 'none'},
            { id: 'mains-gs4-attitude', title: 'Attitude', description: 'Content, structure, function; its influence and relation with thought and behavior; moral and political attitudes; social influence and persuasion.', tags: [], mastery: 'none'},
            { id: 'mains-gs4-aptitude', title: 'Aptitude & Foundational Values', description: 'Integrity, impartiality, non-partisanship, objectivity, dedication to public service, empathy, tolerance, and compassion. Emotional intelligence (EI) concepts and their utility.', tags: [], mastery: 'none'},
            { id: 'mains-gs4-thinkers', title: 'Moral Thinkers & Philosophers', description: 'Contributions from Indian and World thinkers like Gandhi, Kant, Aristotle, etc.', tags: [], mastery: 'none'},
            { id: 'mains-gs4-public-service', title: 'Public/Civil Service Values', description: 'Ethical concerns and dilemmas in government and private institutions; laws, rules, and conscience as sources of guidance; accountability and ethical governance.', tags: [], mastery: 'none'},
            { id: 'mains-gs4-probity', title: 'Probity in Governance', description: 'Concept of public service; philosophical basis of governance and probity; RTI, codes of ethics/conduct; work culture, and challenges of corruption.', tags: [], mastery: 'none'},
            { id: 'mains-gs4-casestudies', title: 'Case Studies', description: 'Analysis of realistic or hypothetical scenarios to test ethical decision-making.', tags: [], mastery: 'none'},
        ]
      },
      {
        id: 'mains-optional',
        title: 'Papers VI & VII: Optional Subject',
        description: 'Candidates choose one subject from a list for two papers. This tests in-depth, graduate-level knowledge of the chosen discipline.',
        tags: ['optional', 'specialized', 'merit'],
        mastery: 'none',
        subtopics: [
          {
            id: 'mains-optional-structure',
            title: 'Paper Structure (I & II)',
            description: 'The optional subject consists of two papers (Paper I & Paper II), each worth 250 marks. Paper I typically covers theoretical foundations, while Paper II focuses on India-specific applications or case studies.',
            tags: ['paper-1', 'paper-2'],
            mastery: 'none',
          },
          {
            id: 'mains-optional-subjects',
            title: 'Common Optional Subjects',
            description: 'Popular choices include: Anthropology, Geography, History, Political Science, Sociology, Public Administration, Philosophy, Law, Economics, and various literature subjects.',
            tags: ['subjects-list'],
            mastery: 'none',
          },
          {
            id: 'psychology-optional-paper1',
            title: 'Psychology Optional – Paper I (Foundations of Psychology)',
            description: 'Covers theoretical and conceptual foundations, research methods, human development, and cognition. Total Marks: 250, Time: 3 hours.',
            tags: ['psychology', 'optional-paper-1'],
            mastery: 'none',
            subtopics: [
              {
                id: 'psych-p1-intro',
                title: '1. Introduction',
                description: 'Definition, scope, and history of Psychology. Historical antecedents and modern trends in the 21st-century discipline. Psychology as a science; its relationship with natural and social sciences. Application of psychology to societal problems.',
                tags: ['history', 'scope', 'application'],
                mastery: 'none',
              },
              {
                id: 'psych-p1-methods',
                title: '2. Methods of Psychology',
                description: 'Research types: descriptive, evaluative, diagnostic, prognostic. Research methods: surveys, observation, case studies, experimental. Distinguishing experimental, non-experimental, and quasi-experimental designs. Qualitative techniques: FGDs, brainstorming, grounded theory.',
                tags: ['research', 'methods', 'qualitative'],
                mastery: 'none',
              },
              {
                id: 'psych-p1-research-design',
                title: '3. Research Design and Methodology',
                description: 'Steps: problem definition, hypothesis, research design, sampling, tool development, data analysis & interpretation, reporting. Fundamental vs. applied research. Data collection methods: interviews, questionnaires, observations, case studies. Designs: ex-post facto, experimental. Statistical applications: t-test, two-way ANOVA, correlation, regression, factor analysis, item response theory.',
                tags: ['research-design', 'statistics', 'methodology'],
                mastery: 'none',
              },
              {
                id: 'psych-p1-development',
                title: '4. Development of Human Behavior',
                description: 'Concepts: growth and developmental principles. Influence of genetics vs. environment; role of culture in socialization. Life-span stages: infancy, childhood, adolescence, adulthood, elderly— tasks and psychological well-being.',
                tags: ['development', 'lifespan', 'nature-nurture'],
                mastery: 'none',
              },
              {
                id: 'psych-p1-sap',
                title: '5. Sensation, Attention & Perception',
                description: 'Sensation: threshold concepts, signal detection, vigilance. Attention: stimulus factors, attentional sets. Perception: experience-based influences, depth/space/size estimation, perceptual defense, plasticity. Extrasensory/perceptual influences; subliminal effects; cultural factors.',
                tags: ['sensation', 'attention', 'perception'],
                mastery: 'none',
              },
              {
                id: 'psych-p1-learning',
                title: '6. Learning',
                description: 'Learning theories: Behaviourist, Gestalt, Information-processing models. Processes: extinction, generalization, discrimination. Programmed learning, probabilistic learning, self-instruction. Reinforcement schedules, escape/avoidance, punishment, modeling/social learning.',
                tags: ['learning-theories', 'behaviorism', 'cognition'],
                mastery: 'none',
              },
              {
                id: 'psych-p1-memory',
                title: '7. Memory',
                description: 'Encoding, Storage, Retrieval. Types: Sensory, Short-term, Long-term memory. Levels of processing. Forgetting: Decay, Interference, Retrieval failure. Techniques to enhance memory.',
                tags: [],
                mastery: 'none',
              },
              {
                id: 'psych-p1-thinking',
                title: '8. Thinking and Problem-Solving',
                description: 'Concept formation. Reasoning: inductive, deductive. Decision-making and problem-solving strategies. Creative thinking and fostering creativity. Barriers to problem-solving.',
                tags: [],
                mastery: 'none',
              },
              {
                id: 'psych-p1-motivation-emotion',
                title: '9. Motivation and Emotion',
                description: 'Theories of motivation and emotion, including drive, incentive, and cognitive models. Covers emotional intelligence and stress management.',
                tags: ['motivation', 'emotion', 'stress'],
                mastery: 'none',
                subtopics: [
                  { id: 'psych-p1-motivation', title: 'Motivation', description: 'Theories: Drive, Incentive, Maslow’s Hierarchy, Herzberg, McClelland, Self-determination. Intrinsic vs. extrinsic. Achievement motivation. Conflicts.', tags: [], mastery: 'none'},
                  { id: 'psych-p1-emotion', title: 'Emotion', description: 'Theories: James-Lange, Cannon-Bard, Schachter-Singer, Lazarus. Physiological correlates. Facial feedback hypothesis. Emotional intelligence. Stress and coping.', tags: [], mastery: 'none'},
                ]
              },
              {
                id: 'psych-p1-intelligence',
                title: '10. Intelligence and Aptitude',
                description: 'Theories: Spearman, Thurstone, Guilford, Cattell, Sternberg, Gardner. Emotional and social intelligence. Aptitude assessment. IQ tests, culture-fair tests. Recent developments in neural basis and genetics.',
                tags: ['intelligence', 'aptitude', 'iq'],
                mastery: 'none',
              },
              {
                id: 'psych-p1-personality',
                title: '11. Personality',
                description: 'Psychoanalytic, Trait, Humanistic, and Cognitive-behavioral theories. Measurement using projective tests and inventories. Biological and cultural perspectives.',
                tags: ['personality', 'theories', 'assessment'],
                mastery: 'none',
              },
              {
                id: 'psych-p1-language',
                title: '12. Language and Communication',
                description: 'Theories of language development (Skinner, Chomsky). Verbal and non-verbal communication. Communication models and barriers. Cross-cultural communication.',
                tags: ['language', 'communication'],
                mastery: 'none',
              },
              {
                id: 'psych-p1-modern-issues',
                title: '13. Issues and Perspectives in Modern Psychology',
                description: 'Indigenous psychology, positive psychology (well-being, resilience), gender issues, and applications in IT, environment, and health.',
                tags: ['positive-psychology', 'gender', 'health'],
                mastery: 'none',
              },
            ],
          },
          {
            id: 'psychology-optional-paper2',
            title: 'Psychology Optional – Paper II (Issues and Applications)',
            description: 'Focuses on the practical and applied domains of psychology in India, covering health, education, work, organizations, and social issues. Total Marks: 250, Time: 3 hours.',
            tags: ['psychology', 'optional-paper-2', 'applied'],
            mastery: 'none',
            subtopics: [
                {
                    id: 'psych-p2-measurement',
                    title: '1. Psychological Measurement',
                    description: 'Concept of testing and assessment. Types of tests (intelligence, personality, etc.). Test construction, standardization, reliability, validity. Applications and ethical issues.',
                    tags: ['testing', 'assessment', 'ethics'],
                    mastery: 'none',
                },
                {
                    id: 'psych-p2-disorders',
                    title: '2. Well-being and Mental Disorders',
                    description: 'Concept of health and well-being. Classification (ICD-11, DSM-5). Etiology, symptoms, and treatment of anxiety, mood disorders, schizophrenia, etc. Rehabilitation.',
                    tags: ['mental-health', 'disorders', 'rehabilitation'],
                    mastery: 'none',
                },
                {
                    id: 'psych-p2-therapies',
                    title: '3. Therapeutic Approaches',
                    description: 'Psychotherapy process. Major orientations: Psychoanalysis, Client-centered, Behavior therapy, Cognitive therapy, Group therapy. Indigenous approaches (Yoga, Meditation).',
                    tags: ['psychotherapy', 'cbt', 'indigenous'],
                    mastery: 'none',
                },
                {
                    id: 'psych-p2-work-org',
                    title: '4. Work Psychology and Organizational Behavior',
                    description: 'Personnel selection, training, performance appraisal. Motivation, leadership, job satisfaction. Stress management, work-life balance.',
                    tags: ['organizational-behavior', 'hr', 'leadership'],
                    mastery: 'none',
                },
                {
                    id: 'psych-p2-education',
                    title: '5. Application to Educational Field',
                    description: 'Principles of teaching/learning. Learning disabilities, gifted learners. Guidance and counselling. Evaluation techniques.',
                    tags: ['education', 'learning-disabilities', 'counselling'],
                    mastery: 'none',
                },
                {
                    id: 'psych-p2-community',
                    title: '6. Community Psychology',
                    description: 'Relevance in Indian context. Social change, empowerment of marginalized groups. Community mental health programs.',
                    tags: ['community', 'empowerment', 'social-change'],
                    mastery: 'none',
                },
                {
                    id: 'psych-p2-social-issues',
                    title: '7. Application to Social Issues',
                    description: 'Psychology of poverty, discrimination, violence, and social change. Health and hygiene behavior.',
                    tags: ['social-issues', 'poverty', 'discrimination'],
                    mastery: 'none',
                },
                {
                    id: 'psych-p2-environment',
                    title: '8. Psychology and Environment',
                    description: 'Effects of noise, pollution, crowding. Pro-environmental behavior. Climate change awareness. Sustainable design.',
                    tags: ['environment', 'sustainability', 'climate-change'],
                    mastery: 'none',
                },
                {
                    id: 'psych-p2-other-fields',
                    title: '9. Application in Other Fields',
                    description: 'Applications in Legal System, Media, and Military Psychology.',
                    tags: ['forensic', 'media', 'military'],
                    mastery: 'none',
                    subtopics: [
                        { id: 'psych-p2-legal', title: 'a. Legal System', description: 'Psychology of evidence, eyewitness testimony, criminal behavior, juvenile delinquency, forensic and police psychology.', tags: [], mastery: 'none'},
                        { id: 'psych-p2-media', title: 'b. Media', description: 'Effects of TV, cinema, social media. Advertising, consumer behavior. Fake news, digital addiction, cyberpsychology.', tags: [], mastery: 'none'},
                        { id: 'psych-p2-military', title: 'c. Military Psychology', description: 'Mental toughness, personnel selection, motivation, combat stress/PTSD, psychological warfare, leadership.', tags: [], mastery: 'none'},
                    ]
                },
                {
                    id: 'psych-p2-emerging',
                    title: '10. Emerging Areas',
                    description: 'Positive Psychology, Health Psychology, Sports Psychology, Cyberpsychology, Cross-cultural psychology. Impact of pandemics and migration.',
                    tags: ['positive-psychology', 'sports-psychology', 'cyberpsychology'],
                    mastery: 'none',
                }
            ]
          }
        ],
      },
    ],
  },
  {
    id: 'interview',
    title: 'Stage III: Personality Test / Interview',
    icon: 'Users',
    description: 'The final stage to assess suitability for a career in public service. It evaluates mental alertness, critical thinking, leadership, and integrity. Total marks: 275.',
    tags: ['interview', 'personality-test', 'final-stage'],
    mastery: 'none',
    subtopics: [
      {
        id: 'interview-purpose',
        title: 'Purpose of the Personality Test',
        description: "Evaluates: Mental alertness, critical thinking, analytical ability, a balance of judgment, leadership potential, integrity, honesty, communication skills, depth of interest, intellectual curiosity, and suitability for public service. It is not primarily a knowledge test.",
        tags: ['evaluation-criteria'],
        mastery: 'none',
      },
      {
        id: 'interview-areas',
        title: 'Areas Generally Covered',
        description: 'Key areas from which questions are typically drawn during the interview.',
        tags: ['daf', 'current-affairs', 'situational'],
        mastery: 'none',
        subtopics: [
          {
            id: 'interview-daf',
            title: 'Detailed Application Form (DAF)',
            description: "Your hobbies, academic background, optional subject, home district, service preference, and work experience. Most questions are drawn from here.",
            tags: [],
            mastery: 'none'
          },
          {
            id: 'interview-current-affairs',
            title: 'Current Affairs',
            description: "Domestic and international issues, government schemes, policy debates, administrative challenges, and the role of science & tech in policy.",
            tags: [],
            mastery: 'none'
          },
          {
            id: 'interview-situational',
            title: 'Situational and Opinion-Based Questions',
            description: "Hypothetical administrative challenges (e.g., handling a riot), moral dilemmas, ethical decision-making, and balancing law with empathy.",
            tags: [],
            mastery: 'none'
          },
          {
            id: 'interview-background',
            title: 'Background-Specific Questions',
            description: "Questions related to your academic or regional background (e.g., tech in governance for science graduates, rural economy for candidates from rural areas).",
            tags: [],
            mastery: 'none'
          }
        ]
      },
      {
        id: 'interview-prep',
        title: 'Preparation & Key Attributes',
        description: "Preparation: Read your DAF, stay updated with news (Hindu/IE, PIB), practice mock interviews, and work on communication skills. Key Attributes to show: Clarity, Honesty, Confidence, Empathy, and Analytical ability.",
        tags: ['preparation', 'attributes'],
        mastery: 'none',
      },
    ]
  },
];
