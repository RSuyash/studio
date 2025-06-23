
import type { SyllabusTopic } from '@/lib/types';

export const initialSyllabusData: SyllabusTopic[] = [
  {
    id: 'preliminary-exam',
    title: 'Stage I: Preliminary Examination',
    icon: 'ClipboardList',
    description: 'This stage consists of two compulsory objective-type papers. Paper I (GS) determines the cut-off, while Paper II (CSAT) is qualifying (33%). There is negative marking for incorrect answers.',
    tags: ['objective', 'qualifying'],
    mastery: 'none',
    resources: [],
    subtopics: [
      {
        id: 'prelims-gs1',
        title: 'Paper I: General Studies (GS)',
        icon: 'FileText',
        description: 'Decides the cut-off for the Main exam. Syllabus covers a wide range of subjects from current events to general science. Marks: 200, Questions: 100.',
        tags: ['gs', 'merit-cutoff'],
        mastery: 'none',
        resources: [],
        subtopics: [
          {
            id: 'prelims-gs1-current-events',
            title: 'Current events of national and international importance',
            description: 'Current events of national and international importance, covering polity, economy, environment, science & tech, and international relations.',
            tags: ['dynamic', 'high-priority'],
            mastery: 'none',
            resources: [],
          },
          {
            id: 'prelims-gs1-history',
            title: 'History of India and Indian National Movement',
            description: 'Covers Ancient, Medieval, and Modern Indian history, with a special focus on the national freedom struggle.',
            tags: ['history', 'static'],
            mastery: 'none',
            resources: [],
          },
          {
            id: 'prelims-gs1-geography',
            title: 'Indian and World Geography',
            description: 'Physical, Social, and Economic Geography of India and the World.',
            tags: ['geography', 'static'],
            mastery: 'none',
            resources: [],
            subtopics: [
                { id: 'prelims-geography-physical', title: 'Physical Geography', description: 'Covers key concepts of world physical geography.', tags: [], mastery: 'none', resources: [] },
                { id: 'prelims-geography-social', title: 'Social Geography', description: 'Covers key concepts of social geography of India and the world.', tags: [], mastery: 'none', resources: [] },
                { id: 'prelims-geography-economic', title: 'Economic Geography', description: 'Covers key concepts of economic geography of India and the world.', tags: [], mastery: 'none', resources: [] },
            ]
          },
          {
            id: 'prelims-gs1-polity',
            title: 'Indian Polity and Governance',
            description: 'Constitution, Political System, Panchayati Raj, Public Policy, Rights Issues, etc.',
            tags: ['polity', 'governance'],
            mastery: 'none',
            resources: [],
            subtopics: [
                { id: 'upsc-polity-constitution', title: 'Constitution', description: 'The foundational law and principles of the country.', tags: [], mastery: 'none', resources: [] },
                { id: 'upsc-polity-system', title: 'Political System', description: 'The structure and functioning of the government.', tags: [], mastery: 'none', resources: [] },
                { id: 'upsc-polity-panchayati-raj', title: 'Panchayati Raj', description: 'Local self-governance system in rural India.', tags: [], mastery: 'none', resources: [] },
                { id: 'upsc-polity-public-policy', title: 'Public Policy', description: 'The principles upon which social laws are based.', tags: [], mastery: 'none', resources: [] },
                { id: 'upsc-polity-rights-issues', title: 'Rights Issues', description: 'Issues related to fundamental and other rights of citizens.', tags: [], mastery: 'none', resources: [] },
            ]
          },
          {
            id: 'prelims-gs1-economy',
            title: 'Economic and Social Development',
            description: 'Sustainable Development, Poverty, Inclusion, Demographics, Social Sector initiatives, etc.',
            tags: ['economy', 'development'],
            mastery: 'none',
            resources: [],
            subtopics: [
                { id: 'upsc-eco-sustainable-dev', title: 'Sustainable Development', description: 'Development that meets present needs without compromising future generations.', tags: [], mastery: 'none', resources: [] },
                { id: 'upsc-eco-poverty', title: 'Poverty', description: 'Issues and policies related to poverty alleviation.', tags: [], mastery: 'none', resources: [] },
                { id: 'upsc-eco-inclusion', title: 'Inclusion', description: 'Ensuring that all segments of society participate in and benefit from development.', tags: [], mastery: 'none', resources: [] },
                { id: 'upsc-eco-demographics', title: 'Demographics', description: 'The study of population dynamics.', tags: [], mastery: 'none', resources: [] },
                { id: 'upsc-eco-social-sector', title: 'Social Sector Initiatives', description: 'Government schemes and programs in health, education, etc.', tags: [], mastery: 'none', resources: [] },
            ]
          },
          {
            id: 'prelims-gs1-environment',
            title: 'Environment & Ecology',
            description: 'General issues on Environmental Ecology, Biodiversity, and Climate Change that do not require subject specialization.',
            tags: ['environment', 'ecology'],
            mastery: 'none',
            resources: [],
          },
          {
            id: 'prelims-gs1-science',
            title: 'General Science',
            description: 'Basics of Physics, Chemistry, Biology (up to Class X level) and key developments in S&T.',
            tags: ['science', 'technology'],
            mastery: 'none',
            resources: [],
          },
        ],
      },
      {
        id: 'prelims-csat',
        title: 'Paper II: CSAT (Civil Services Aptitude Test)',
        icon: 'FileText',
        description: 'A qualifying paper requiring 33% marks (66/200). Tests aptitude and reasoning skills. Marks: 200, Questions: 80.',
        tags: ['csat', 'aptitude', 'qualifying'],
        mastery: 'none',
        resources: [],
        subtopics: [
            { id: 'prelims-csat-comprehension', title: 'Comprehension', description: 'Reading passages with factual and inference-based questions.', tags: [], mastery: 'none', resources: [] },
            { id: 'prelims-csat-interpersonal', title: 'Interpersonal skills including communication skills', description: 'Testing the ability to interact effectively with others.', tags: [], mastery: 'none', resources: [] },
            { id: 'prelims-csat-reasoning', title: 'Logical reasoning and analytical ability', description: 'Syllogisms, blood relations, puzzles, seating arrangements.', tags: [], mastery: 'none', resources: [] },
            { id: 'prelims-csat-decision-making', title: 'Decision-making and problem-solving', description: 'Questions on ethical dilemmas and practical problem-solving. No negative marking for these.', tags: [], mastery: 'none', resources: [] },
            { id: 'prelims-csat-mental-ability', title: 'General mental ability', description: 'Testing reasoning and thinking ability.', tags: [], mastery: 'none', resources: [] },
            { id: 'prelims-csat-numeracy', title: 'Basic numeracy (Class X level)', description: 'Number systems, percentages, time & work, averages.', tags: [], mastery: 'none', resources: [] },
            { id: 'prelims-csat-di', title: 'Data interpretation (Class X level)', description: 'Interpreting charts, graphs, and tables.', tags: [], mastery: 'none', resources: [] },
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
    resources: [],
    subtopics: [
      {
        id: 'mains-qualifying',
        title: 'Qualifying Papers (A & B)',
        icon: 'ShieldCheck',
        description: 'These papers test basic language proficiency and are not counted for merit. Candidates must score at least 25% to pass.',
        tags: ['qualifying', 'language'],
        mastery: 'none',
        resources: [],
        subtopics: [
          {
            id: 'mains-qualifying-a',
            title: 'Paper A: Indian Language',
            description: 'Any language from the Eighth Schedule. The pattern is similar to the English paper, focusing on comprehension, précis, and translation.',
            tags: ['indian-language'],
            mastery: 'none',
            resources: [],
          },
          {
            id: 'mains-qualifying-b',
            title: 'Paper B: English',
            description: 'Tests comprehension of given passages, précis writing, usage and vocabulary, and short essays. Class X level.',
            tags: ['english'],
            mastery: 'none',
            resources: [],
          },
        ]
      },
      {
        id: 'mains-essay',
        title: 'Paper I: Essay',
        icon: 'FileText',
        description: 'Candidates write two essays on a variety of topics, testing their ability to organize ideas and write concisely. Marks: 250.',
        tags: ['essay', 'merit'],
        mastery: 'none',
        resources: [],
      },
      {
        id: 'mains-gs1',
        title: 'Paper II: General Studies I',
        icon: 'FileText',
        description: 'Indian Heritage and Culture, History and Geography of the World and Society. Marks: 250.',
        tags: ['gs-1', 'history', 'geography', 'society'],
        mastery: 'none',
        resources: [],
        subtopics: [
            { 
                id: 'mains-gs1-art-culture', 
                title: 'Indian Heritage and Culture', 
                description: 'Covers the cultural history of India.',
                tags: [], mastery: 'none', resources: [],
                subtopics: [
                  { id: 'mains-gs1-art-forms', title: 'Art Forms', description: 'Salient aspects of Indian Art Forms from ancient to modern times.', tags: [], mastery: 'none', resources: [] },
                  { id: 'mains-gs1-literature', title: 'Literature', description: 'Salient aspects of Indian Literature from ancient to modern times.', tags: [], mastery: 'none', resources: [] },
                  { id: 'mains-gs1-architecture', title: 'Architecture', description: 'Salient aspects of Indian Architecture from ancient to modern times.', tags: [], mastery: 'none', resources: [] },
                ]
            },
            { 
                id: 'mains-gs1-modern-history', 
                title: 'Modern Indian History', 
                description: 'From the middle of the 18th century until the present, including the freedom struggle and post-independence consolidation.',
                tags: [], mastery: 'none', resources: [],
                subtopics: [
                  { id: 'mains-gs1-mid-18th-century', title: 'Significant Events, Issues, Personalities (from mid-18th Century)', description: 'Key events, challenges, and influential figures from around 1750 onwards.', tags: [], mastery: 'none', resources: [] },
                  { id: 'mains-gs1-freedom-struggle', title: 'The Freedom Struggle', description: 'Its various stages and important contributors/contributions from different parts of the country.', tags: [], mastery: 'none', resources: [] },
                  { id: 'mains-gs1-post-independence', title: 'Post-independence Consolidation', description: 'Consolidation and reorganization within the country after 1947.', tags: [], mastery: 'none', resources: [] },
                ]
            },
            { 
                id: 'mains-gs1-world-history', 
                title: 'History of the World', 
                description: 'Events from 18th century such as industrial revolution, world wars, redrawal of national boundaries, colonization, decolonization, political philosophies etc.',
                tags: [], mastery: 'none', resources: []
            },
            { 
                id: 'mains-gs1-society', 
                title: 'Indian Society', 
                description: 'Structure, issues, and dynamics of Indian society.',
                tags: [], mastery: 'none', resources: [],
                subtopics: [
                    { id: 'mains-gs1-society-features', title: 'Salient features of Indian Society, Diversity of India', description: 'The core characteristics and diversity of Indian society.', tags: [], mastery: 'none', resources: [] },
                    { id: 'mains-gs1-society-women', title: 'Role of women and women’s organization', description: 'The role and challenges of women and their organizations.', tags: [], mastery: 'none', resources: [] },
                    { id: 'mains-gs1-society-issues', title: 'Population, Poverty, Urbanization', description: 'Population and associated issues, poverty and developmental issues, urbanization, their problems and their remedies.', tags: [], mastery: 'none', resources: [] },
                    { id: 'mains-gs1-society-globalization', title: 'Effects of globalization on Indian society', description: 'The social and cultural impact of globalization.', tags: [], mastery: 'none', resources: [] },
                    { id: 'mains-gs1-society-empowerment', title: 'Social empowerment, communalism, regionalism & secularism', description: 'Key social dynamics and challenges.', tags: [], mastery: 'none', resources: [] },
                ]
            },
            { 
                id: 'mains-gs1-geography', 
                title: 'Geography of the World and India', 
                description: 'Physical, social, and economic geography.',
                tags: [], mastery: 'none', resources: [],
                subtopics: [
                    { id: 'mains-gs1-geography-physical', title: 'Salient features of world’s physical geography', description: 'Key landforms, climate zones, and oceanographic features.', tags: [], mastery: 'none', resources: [] },
                    { id: 'mains-gs1-geography-resources', title: 'Distribution of key natural resources', description: 'Distribution across the world (including South Asia and the Indian sub-continent).', tags: [], mastery: 'none', resources: [] },
                    { id: 'mains-gs1-geography-industries', title: 'Location of industries', description: 'Factors responsible for the location of primary, secondary, and tertiary sector industries.', tags: [], mastery: 'none', resources: [] },
                    { id: 'mains-gs1-geography-phenomena', title: 'Important Geophysical phenomena', description: 'Earthquakes, Tsunami, Volcanic activity, cyclone etc.', tags: [], mastery: 'none', resources: [] },
                    { id: 'mains-gs1-geography-changes', title: 'Changes in critical geographical features', description: 'Changes in water-bodies, ice-caps, flora and fauna and the effects of such changes.', tags: [], mastery: 'none', resources: [] },
                ]
            },
        ],
      },
      {
        id: 'mains-gs2',
        title: 'Paper III: General Studies II',
        icon: 'FileText',
        description: 'Governance, Constitution, Polity, Social Justice and International relations. Marks: 250.',
        tags: ['gs-2', 'polity', 'governance', 'ir'],
        mastery: 'none',
        resources: [],
        subtopics: [
            { 
                id: 'mains-gs2-constitution', 
                title: 'Indian Constitution', 
                description: 'The foundational legal and political framework of India.',
                tags: [], mastery: 'none', resources: [],
                subtopics: [
                    { id: 'mains-gs2-const-evo', title: 'Historical Underpinnings, Evolution, Features, Amendments', description: 'The making and evolution of the Constitution.', tags: [], mastery: 'none', resources: [] },
                    { id: 'mains-gs2-const-structure', title: 'Significant Provisions and Basic Structure', description: 'Core provisions and the basic structure doctrine.', tags: [], mastery: 'none', resources: [] },
                    { id: 'mains-gs2-const-comparison', title: 'Comparison with other countries', description: 'Comparing the Indian constitutional scheme with that of other nations.', tags: [], mastery: 'none', resources: [] },
                ]
            },
            { 
                id: 'mains-gs2-polity', 
                title: 'Polity', 
                description: 'The structure and functioning of the Indian political system.',
                tags: [], mastery: 'none', resources: [],
                subtopics: [
                    { id: 'mains-gs2-polity-federal', title: 'Functions & Responsibilities of Union & States (Federalism)', description: 'Issues and challenges pertaining to the federal structure, devolution of powers and finances up to local levels.', tags: [], mastery: 'none', resources: [] },
                    { id: 'mains-gs2-polity-separation', title: 'Separation of Powers', description: 'Between various organs, dispute redressal mechanisms and institutions.', tags: [], mastery: 'none', resources: [] },
                    { id: 'mains-gs2-polity-legislature', title: 'Parliament and State Legislatures', description: 'Structure, functioning, conduct of business, powers & privileges.', tags: [], mastery: 'none', resources: [] },
                    { id: 'mains-gs2-polity-executive', title: 'Executive and Judiciary', description: 'Structure, organization and functioning of the Executive and the Judiciary.', tags: [], mastery: 'none', resources: [] },
                    { id: 'mains-gs2-polity-rpa', title: 'Salient features of the Representation of People’s Act', description: 'Key provisions of the RPA.', tags: [], mastery: 'none', resources: [] },
                    { id: 'mains-gs2-polity-bodies', title: 'Constitutional, Statutory, Regulatory and Quasi-judicial bodies', description: 'Appointment, powers, functions and responsibilities.', tags: [], mastery: 'none', resources: [] },
                ]
            },
            { 
                id: 'mains-gs2-governance', 
                title: 'Governance', 
                description: 'Aspects of governance, transparency, and accountability.',
                tags: [], mastery: 'none', resources: [],
                subtopics: [
                    { id: 'mains-gs2-gov-aspects', title: 'Important aspects of governance, transparency and accountability', description: 'Core principles of good governance.', tags: [], mastery: 'none', resources: [] },
                    { id: 'mains-gs2-gov-egov', title: 'E-governance', description: 'Applications, models, successes, limitations, and potential.', tags: [], mastery: 'none', resources: [] },
                    { id: 'mains-gs2-gov-charters', title: 'Citizens Charters', description: 'Mechanisms for accountability to citizens.', tags: [], mastery: 'none', resources: [] },
                    { id: 'mains-gs2-gov-civilservices', title: 'Role of civil services in a democracy', description: 'The function and challenges for the bureaucracy.', tags: [], mastery: 'none', resources: [] },
                ]
            },
            { 
                id: 'mains-gs2-social-justice', 
                title: 'Social Justice', 
                description: 'Welfare policies and developmental issues.',
                tags: [], mastery: 'none', resources: [],
                subtopics: [
                    { id: 'mains-gs2-sj-policies', title: 'Government policies and interventions', description: 'For development in various sectors and issues arising out of their design and implementation.', tags: [], mastery: 'none', resources: [] },
                    { id: 'mains-gs2-sj-dev-process', title: 'Development processes and the development industry', description: 'Role of NGOs, SHGs, various groups and associations, donors, charities.', tags: [], mastery: 'none', resources: [] },
                    { id: 'mains-gs2-sj-vulnerable', title: 'Welfare schemes for vulnerable sections', description: 'Schemes for women, children, SC/ST, minorities, etc., and their performance.', tags: [], mastery: 'none', resources: [] },
                    { id: 'mains-gs2-sj-social-sector', title: 'Issues relating to Health, Education, Human Resources', description: 'Challenges in the management of social sectors.', tags: [], mastery: 'none', resources: [] },
                    { id: 'mains-gs2-sj-poverty', title: 'Issues relating to poverty and hunger', description: 'Core challenges in human development.', tags: [], mastery: 'none', resources: [] },
                ]
            },
            { 
                id: 'mains-gs2-ir', 
                title: 'International Relations', 
                description: 'India\'s engagement with the world.',
                tags: [], mastery: 'none', resources: [],
                subtopics: [
                    { id: 'mains-gs2-ir-neighborhood', title: 'India and its neighborhood', description: 'Bilateral relations with neighboring countries.', tags: [], mastery: 'none', resources: [] },
                    { id: 'mains-gs2-ir-groupings', title: 'Bilateral, regional and global groupings', description: 'Agreements involving India and/or affecting India’s interests (e.g., SAARC, ASEAN, QUAD).', tags: [], mastery: 'none', resources: [] },
                    { id: 'mains-gs2-ir-policies', title: 'Effect of policies of developed & developing countries', description: 'Impact of global politics and policies on India’s interests.', tags: [], mastery: 'none', resources: [] },
                    { id: 'mains-gs2-ir-diaspora', title: 'Indian diaspora', description: 'The role and significance of the Indian diaspora.', tags: [], mastery: 'none', resources: [] },
                    { id: 'mains-gs2-ir-institutions', title: 'Important International institutions', description: 'Agencies and fora- their structure, mandate (e.g., UN, WTO, IMF).', tags: [], mastery: 'none', resources: [] },
                ]
            },
        ]
      },
      {
        id: 'mains-gs3',
        title: 'Paper IV: General Studies III',
        icon: 'FileText',
        description: 'Technology, Economic Development, Bio diversity, Environment, Security and Disaster Management. Marks: 250.',
        tags: ['gs-3', 'economy', 'sci-tech', 'security'],
        mastery: 'none',
        resources: [],
        subtopics: [
            { 
                id: 'mains-gs3-economy', 
                title: 'Economic Development', 
                description: 'Indian Economy and its challenges.',
                tags: [], mastery: 'none', resources: [],
                subtopics: [
                    { id: 'mains-gs3-eco-planning', title: 'Planning, Mobilization of resources, Growth, Development, Employment', description: 'Core issues of Indian economic planning.', tags: [], mastery: 'none', resources: [] },
                    { id: 'mains-gs3-eco-inclusive', title: 'Inclusive growth and issues arising from it', description: 'Challenges and strategies for inclusive development.', tags: [], mastery: 'none', resources: [] },
                    { id: 'mains-gs3-eco-budgeting', title: 'Government Budgeting', description: 'The process and components of the government budget.', tags: [], mastery: 'none', resources: [] },
                    { id: 'mains-gs3-eco-liberalization', title: 'Effects of liberalization on the economy', description: 'Impact of economic reforms since 1991.', tags: [], mastery: 'none', resources: [] },
                    { id: 'mains-gs3-eco-industrial', title: 'Changes in industrial policy and their effects', description: 'Evolution of industrial policy.', tags: [], mastery: 'none', resources: [] },
                    { id: 'mains-gs3-eco-infra', title: 'Infrastructure', description: 'Energy, Ports, Roads, Airports, Railways etc.', tags: [], mastery: 'none', resources: [] },
                    { id: 'mains-gs3-eco-investment', title: 'Investment models', description: 'Different models for public and private investment.', tags: [], mastery: 'none', resources: [] },
                ]
            },
            { 
                id: 'mains-gs3-agriculture', 
                title: 'Agriculture', 
                description: 'The agricultural sector in India.',
                tags: [], mastery: 'none', resources: [],
                subtopics: [
                    { id: 'mains-gs3-agri-patterns', title: 'Major crops, cropping patterns, irrigation', description: 'Agricultural practices and water management.', tags: [], mastery: 'none', resources: [] },
                    { id: 'mains-gs3-agri-subsidies', title: 'Farm subsidies and minimum support prices (MSP)', description: 'Issues related to direct and indirect farm subsidies.', tags: [], mastery: 'none', resources: [] },
                    { id: 'mains-gs3-agri-pds', title: 'Public Distribution System (PDS)', description: 'Objectives, functioning, limitations, and issues of food security.', tags: [], mastery: 'none', resources: [] },
                    { id: 'mains-gs3-agri-tech', title: 'Technology missions; e-technology in the aid of farmers', description: 'Use of technology in agriculture.', tags: [], mastery: 'none', resources: [] },
                    { id: 'mains-gs3-agri-food', title: 'Food processing and related industries', description: 'Scope, significance, and supply chain management.', tags: [], mastery: 'none', resources: [] },
                    { id: 'mains-gs3-agri-land', title: 'Land reforms in India', description: 'History and impact of land reforms.', tags: [], mastery: 'none', resources: [] },
                ]
            },
            { 
                id: 'mains-gs3-scitech', 
                title: 'Science & Technology', 
                description: 'Developments and applications of S&T.',
                tags: [], mastery: 'none', resources: [],
                subtopics: [
                    { id: 'mains-gs3-st-everyday', title: 'S&T developments and their applications in everyday life', description: 'Practical applications of scientific advancements.', tags: [], mastery: 'none', resources: [] },
                    { id: 'mains-gs3-st-achievements', title: 'Achievements of Indians in S&T; indigenization of technology', description: 'India\'s contributions and self-reliance in technology.', tags: [], mastery: 'none', resources: [] },
                    { id: 'mains-gs3-st-awareness', title: 'Awareness in IT, Space, Computers, Robotics, Nano-tech, Bio-tech', description: 'Knowledge of emerging fields.', tags: [], mastery: 'none', resources: [] },
                    { id: 'mains-gs3-st-ipr', title: 'Issues relating to intellectual property rights (IPR)', description: 'Patents, copyrights, and related issues.', tags: [], mastery: 'none', resources: [] },
                ]
            },
            { 
                id: 'mains-gs3-environment', 
                title: 'Environment & Biodiversity', 
                description: 'Conservation and environmental issues.',
                tags: [], mastery: 'none', resources: [],
                subtopics: [
                    { id: 'mains-gs3-env-conservation', title: 'Conservation, environmental pollution and degradation', description: 'Protecting natural resources and mitigating pollution.', tags: [], mastery: 'none', resources: [] },
                    { id: 'mains-gs3-env-eia', title: 'Environmental impact assessment (EIA)', description: 'Assessing the environmental impact of projects.', tags: [], mastery: 'none', resources: [] },
                ]
            },
            { id: 'mains-gs3-dm', title: 'Disaster Management', description: 'Disaster and disaster management.', tags: [], mastery: 'none', resources: [] },
            { 
                id: 'mains-gs3-security', 
                title: 'Internal Security', 
                description: 'Challenges to India\'s internal security.',
                tags: [], mastery: 'none', resources: [],
                subtopics: [
                    { id: 'mains-gs3-sec-linkages', title: 'Linkages between development and spread of extremism', description: 'The relationship between socio-economic factors and extremism.', tags: [], mastery: 'none', resources: [] },
                    { id: 'mains-gs3-sec-actors', title: 'Role of external state and non-state actors', description: 'Cross-border challenges to internal security.', tags: [], mastery: 'none', resources: [] },
                    { id: 'mains-gs3-sec-cyber', title: 'Cyber security and communication networks', description: 'Challenges through communication networks, media, social networking sites.', tags: [], mastery: 'none', resources: [] },
                    { id: 'mains-gs3-sec-money', title: 'Money-laundering and its prevention', description: 'Combating financial crimes.', tags: [], mastery: 'none', resources: [] },
                    { id: 'mains-gs3-sec-border', title: 'Security challenges and their management in border areas', description: 'Linkages of organized crime with terrorism.', tags: [], mastery: 'none', resources: [] },
                    { id: 'mains-gs3-sec-forces', title: 'Various Security forces and agencies and their mandate', description: 'The roles of different security forces.', tags: [], mastery: 'none', resources: [] },
                ]
            },
        ]
      },
      {
        id: 'mains-gs4',
        title: 'Paper V: General Studies IV',
        icon: 'FileText',
        description: 'Ethics, Integrity, and Aptitude. This paper will include questions to test the candidates’ attitude and approach to issues relating to integrity, probity in public life and his problem-solving approach to various issues and conflicts faced by him in dealing with society. Questions may utilise the case study approach. Marks: 250.',
        tags: ['gs-4', 'ethics', 'aptitude'],
        mastery: 'none',
        resources: [],
        subtopics: [
            { 
                id: 'mains-gs4-ethics-interface', 
                title: 'Ethics and Human Interface', 
                description: 'Core concepts of ethics and human values.',
                tags: [], mastery: 'none', resources: [],
                subtopics: [
                    { id: 'mains-gs4-ethics-essence', title: 'Essence, determinants and consequences of Ethics', description: 'The fundamental nature of ethics in human actions.', tags: [], mastery: 'none', resources: []},
                    { id: 'mains-gs4-ethics-dimensions', title: 'Dimensions of ethics', description: 'Different dimensions and theories of ethics.', tags: [], mastery: 'none', resources: []},
                    { id: 'mains-gs4-ethics-relations', title: 'Ethics in private and public relationships', description: 'Applying ethical principles in different contexts.', tags: [], mastery: 'none', resources: []},
                    { id: 'mains-gs4-ethics-values', title: 'Human Values', description: 'Lessons from great leaders, reformers, administrators; role of family, society, and education.', tags: [], mastery: 'none', resources: []},
                ]
            },
            { id: 'mains-gs4-attitude', title: 'Attitude', description: 'Content, structure, function; its influence and relation with thought and behavior; moral and political attitudes; social influence and persuasion.', tags: [], mastery: 'none', resources: []},
            { 
                id: 'mains-gs4-aptitude', 
                title: 'Aptitude and Foundational Values for Civil Service', 
                description: 'The core values required for public service.',
                tags: [], mastery: 'none', resources: [],
                subtopics: [
                    { id: 'mains-gs4-aptitude-values', title: 'Core Foundational Values', description: 'Integrity, impartiality, non-partisanship, objectivity, dedication, empathy, tolerance, compassion.', tags: [], mastery: 'none', resources: []},
                ]
            },
            { id: 'mains-gs4-ei', title: 'Emotional Intelligence', description: 'Concepts, and their utilities and application in administration and governance.', tags: [], mastery: 'none', resources: []},
            { id: 'mains-gs4-thinkers', title: 'Contributions of moral thinkers and philosophers', description: 'From India and the world.', tags: [], mastery: 'none', resources: []},
            { 
                id: 'mains-gs4-public-service', 
                title: 'Public/Civil service values and Ethics in Public administration', 
                description: 'Ethical challenges in public administration.',
                tags: [], mastery: 'none', resources: [],
                subtopics: [
                    { id: 'mains-gs4-ps-status', title: 'Status and problems', description: 'Challenges within the civil services.', tags: [], mastery: 'none', resources: []},
                    { id: 'mains-gs4-ps-dilemmas', title: 'Ethical concerns and dilemmas', description: 'Ethical issues in government and private institutions.', tags: [], mastery: 'none', resources: []},
                    { id: 'mains-gs4-ps-guidance', title: 'Sources of ethical guidance', description: 'Laws, rules, regulations and conscience.', tags: [], mastery: 'none', resources: []},
                    { id: 'mains-gs4-ps-accountability', title: 'Accountability and ethical governance', description: 'Mechanisms for ensuring accountability.', tags: [], mastery: 'none', resources: []},
                    { id: 'mains-gs4-ps-strengthening', title: 'Strengthening of ethical and moral values in governance', description: 'Measures to improve ethical standards.', tags: [], mastery: 'none', resources: []},
                    { id: 'mains-gs4-ps-ir', title: 'Ethical issues in international relations and funding', description: 'Global ethical considerations.', tags: [], mastery: 'none', resources: []},
                    { id: 'mains-gs4-ps-corp-gov', title: 'Corporate governance', description: 'Ethical principles in the corporate sector.', tags: [], mastery: 'none', resources: []},
                ]
            },
            { 
                id: 'mains-gs4-probity', 
                title: 'Probity in Governance', 
                description: 'Upholding integrity and honesty in public governance.',
                tags: [], mastery: 'none', resources: [],
                subtopics: [
                    { id: 'mains-gs4-probity-concept', title: 'Concept of public service; Philosophical basis of governance', description: 'The principles behind public service.', tags: [], mastery: 'none', resources: []},
                    { id: 'mains-gs4-probity-rti', title: 'Information sharing, transparency, Right to Information', description: 'Tools for ensuring transparency.', tags: [], mastery: 'none', resources: []},
                    { id: 'mains-gs4-probity-codes', title: 'Codes of Ethics, Codes of Conduct, Citizen’s Charters', description: 'Formal frameworks for probity.', tags: [], mastery: 'none', resources: []},
                    { id: 'mains-gs4-probity-work', title: 'Work culture, Quality of service delivery', description: 'Operational aspects of good governance.', tags: [], mastery: 'none', resources: []},
                    { id: 'mains-gs4-probity-funds', title: 'Utilization of public funds, challenges of corruption', description: 'Financial integrity and combating corruption.', tags: [], mastery: 'none', resources: []},
                ]
            },
            { id: 'mains-gs4-casestudies', title: 'Case Studies on above issues', description: 'Analysis of realistic or hypothetical scenarios to test ethical decision-making.', tags: [], mastery: 'none', resources: []},
        ]
      },
      {
        id: 'mains-optional',
        title: 'Papers VI & VII: Optional Subject',
        icon: 'BookMarked',
        description: 'Candidates choose one subject from a list for two papers. This tests in-depth, graduate-level knowledge of the chosen discipline.',
        tags: ['optional', 'specialized', 'merit'],
        mastery: 'none',
        resources: [],
        subtopics: [
          {
            id: 'psychology-optional',
            title: 'Psychology Optional',
            description: 'Covers theoretical and applied psychology. Paper I focuses on foundations, and Paper II on issues and applications.',
            tags: ['psychology', 'optional-subject'],
            mastery: 'none',
            resources: [],
            subtopics: [
              {
                id: 'psych-p1',
                title: 'Paper I: Foundations of Psychology',
                description: 'Covers the fundamental principles and theories of psychology.',
                tags: [],
                mastery: 'none',
                resources: [],
                subtopics: [
                  { id: 'psych-p1-1', title: '1. Introduction', description: 'Definition; Historical antecedents & trends; Psychology & scientific methods; Relation to other sciences; Application to societal problems.', tags: [], mastery: 'none', resources: [] },
                  { id: 'psych-p1-2', title: '2. Methods of Psychology', description: 'Types of research; Methods (Survey, observation, case-study, experiments); Experimental & non-experimental designs; Qualitative techniques.', tags: [], mastery: 'none', resources: [] },
                  { id: 'psych-p1-3', title: '3. Research Methods', description: 'Steps in research; Data collection methods; Statistical applications (t-test, ANOVA, correlation, regression, factor analysis).', tags: [], mastery: 'none', resources: [] },
                  { id: 'psych-p1-4', title: '4. Development of Human Behaviour', description: 'Growth & development principles; Role of genetic & environmental factors; Life span development stages & well-being.', tags: [], mastery: 'none', resources: [] },
                  { id: 'psych-p1-5', title: '5. Sensation, Attention and Perception', description: 'Threshold concepts; Signal detection; Factors influencing attention; Perceptual organization; ESP; Culture & perception.', tags: [], mastery: 'none', resources: [] },
                  { id: 'psych-p1-6', title: '6. Learning', description: 'Theories (Behaviourist, Gestalt, Info-processing); Processes (extinction, discrimination); Reinforcement schedules; Social learning.', tags: [], mastery: 'none', resources: [] },
                  { id: 'psych-p1-7', title: '7. Memory', description: 'Encoding & remembering; STM, LTM, Sensory memory; Levels of processing; Forgetting theories; Amnesia.', tags: [], mastery: 'none', resources: [] },
                  { id: 'psych-p1-8', title: '8. Thinking and Problem Solving', description: 'Piaget’s theory; Concept formation; Reasoning; Problem-solving methods; Creativity; Decision making.', tags: [], mastery: 'none', resources: [] },
                  { id: 'psych-p1-9', title: '9. Motivation and Emotion', description: 'Psychological & physiological basis; Measurement; Effects on behaviour; Intrinsic & extrinsic motivation; Emotional competence.', tags: [], mastery: 'none', resources: [] },
                  { id: 'psych-p1-10', title: '10. Intelligence and Aptitude', description: 'Theories (Spearman, Thurstone, etc.); Emotional & social intelligence; IQ measurement; Multiple intelligences.', tags: [], mastery: 'none', resources: [] },
                  { id: 'psych-p1-11', title: '11. Personality', description: 'Theories (psychoanalytical, trait, humanistic, etc.); Measurement (projective tests); Indian approach; Big 5 factor theory.', tags: [], mastery: 'none', resources: [] },
                  { id: 'psych-p1-12', title: '12. Attitudes, Values and Interests', description: 'Components & formation of attitudes; Measurement; Attitude change theories; Stereotypes & prejudices.', tags: [], mastery: 'none', resources: [] },
                  { id: 'psych-p1-13', title: '13. Language and Communication', description: 'Language properties & acquisition (Skinner, Chomsky); Communication process & types; Effective communication training.', tags: [], mastery: 'none', resources: [] },
                  { id: 'psych-p1-14', title: '14. Issues and Perspectives in Modern Psychology', description: 'Computer application & AI; Consciousness studies (sleep, dreams, meditation); ESP; Simulation studies.', tags: [], mastery: 'none', resources: [] },
                ]
              },
              {
                id: 'psych-p2',
                title: 'Paper II: Psychology: Issues and Applications',
                description: 'Focuses on the practical application of psychological principles.',
                tags: [],
                mastery: 'none',
                resources: [],
                subtopics: [
                  { id: 'psych-p2-1', title: '1. Psychological Measurement of Individual Differences', description: 'Nature of individual differences; Construction & use of standardized tests; Ethical issues.', tags: [], mastery: 'none', resources: [] },
                  { id: 'psych-p2-2', title: '2. Psychological well-being and Mental Disorders', description: 'Concept of health/ill-health; Causal factors in mental disorders; Positive health & well-being.', tags: [], mastery: 'none', resources: [] },
                  { id: 'psych-p2-3', title: '3. Therapeutic Approaches', description: 'Psychodynamic, behaviour, client-centered, cognitive therapies; Indigenous therapies (Yoga, Meditation); Rehabilitation.', tags: [], mastery: 'none', resources: [] },
                  { id: 'psych-p2-4', title: '4. Work Psychology and Organisational Behaviour', description: 'Personnel selection & training; Work motivation theories; Leadership; Stress management; Consumer psychology.', tags: [], mastery: 'none', resources: [] },
                  { id: 'psych-p2-5', title: '5. Application to Educational Field', description: 'Teaching-learning process; Training for special needs; Guidance & counseling; Psychological tests in education.', tags: [], mastery: 'none', resources: [] },
                  { id: 'psych-p2-6', title: '6. Community Psychology', description: 'Concept & use in social action; Arousing community consciousness; Leadership for social change.', tags: [], mastery: 'none', resources: [] },
                  { id: 'psych-p2-7', title: '7. Rehabilitation Psychology', description: 'Prevention programs; Rehabilitation for physically, mentally, socially challenged persons; Victims of violence/substance abuse.', tags: [], mastery: 'none', resources: [] },
                  { id: 'psych-p2-8', title: '8. Application to disadvantaged groups', description: 'Concepts of deprivation; Consequences; Educating & motivating the disadvantaged.', tags: [], mastery: 'none', resources: [] },
                  { id: 'psych-p2-9', title: '9. Psychological problem of social integration', description: 'Problem of caste, class, religion conflicts; Prejudice nature & causes; Strategies for handling conflicts.', tags: [], mastery: 'none', resources: [] },
                  { id: 'psych-p2-10', title: '10. Application in IT and Mass Media', description: 'Role of psychologists in IT/media; Distance learning; E-commerce; Impact of TV & social media.', tags: [], mastery: 'none', resources: [] },
                  { id: 'psych-p2-11', title: '11. Psychology and Economic development', description: 'Achievement motivation; Entrepreneurial behaviour; Motivating for entrepreneurship; Consumer rights.', tags: [], mastery: 'none', resources: [] },
                  { id: 'psych-p2-12', title: '12. Application to environment and related fields', description: 'Environmental psychology; Effects of noise, pollution, crowding; Population psychology; Motivating for small family norms.', tags: [], mastery: 'none', resources: [] },
                  { id: 'psych-p2-13', title: '13. Application of psychology in other fields', description: 'Military Psychology, Sports Psychology, Media influences, Psychology of Terrorism.', tags: [], mastery: 'none', resources: [] },
                  { id: 'psych-p2-14', title: '14. Psychology of Gender', description: 'Issues of discrimination, Management of diversity, Glass ceiling effect, Women and Indian society.', tags: [], mastery: 'none', resources: [] },
                ]
              }
            ]
          },
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
    resources: [],
    subtopics: [
      {
        id: 'interview-qualities',
        title: 'Qualities Judged',
        icon: 'HelpCircle',
        description: 'Mental alertness, critical powers of assimilation, clear and logical exposition, balance of judgment, leadership abilities, ability for social cohesion, intellectual and moral integrity.',
        tags: ['evaluation-criteria'],
        mastery: 'none',
        resources: [],
      }
    ]
  },
];
