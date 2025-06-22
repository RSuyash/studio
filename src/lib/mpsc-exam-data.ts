
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
          description: 'This is a compulsory paper, but qualifying in nature. Candidates must score a minimum of 25 marks in each language section.',
          syllabus: [
            'Marathi Section (50 marks): Essay Writing, Translation (English to Marathi), Precis Writing, Grammar.',
            'English Section (50 marks): Essay Writing, Translation (Marathi to English), Precis Writing, Grammar.',
          ]
        },
        {
          title: 'Syllabus – Paper I (Essay)',
          description: 'Two essays to be written, one in Marathi and one in English (125 marks each). Topics can be contemporary, socio-economic, political, environmental, or Maharashtra-specific.',
          syllabus: []
        },
        {
          title: 'Syllabus – Paper II (GS I: History, Geography, Society)',
          description: '',
          syllabus: [
            'History and Culture: Ancient/Medieval India, Modern India (1757–1947), Social reform movements, Post-independence consolidation, History of Maharashtra, Art & Culture.',
            'Geography: Physical (India & Maharashtra), Economic (agriculture, industries), Human (population, urbanization), Environmental geography & disaster management.',
            'Society: Indian society features, social problems (poverty, communalism), social justice schemes, role of women, regionalism.',
          ]
        },
        {
          title: 'Syllabus – Paper III (GS II: Polity, Governance, Law)',
          description: 'Detailed syllabus for this paper will be added in a future update.',
          syllabus: []
        },
        {
          title: 'Syllabus – Paper IV (GS III: Economy, Agriculture, Science, Technology)',
          description: 'Detailed syllabus for this paper will be added in a future update.',
          syllabus: []
        },
        {
          title: 'Syllabus – Paper V (GS IV: Ethics, Aptitude, Integrity)',
          description: 'Detailed syllabus for this paper will be added in a future update.',
          syllabus: []
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
