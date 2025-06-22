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
          description: 'Focuses on a broad range of subjects with special emphasis on Maharashtra.',
          syllabus: [
            'Current events of state, national and international importance',
            'History of India (with special reference to Maharashtra) and Indian National Movement',
            'Maharashtra, India and World Geography – Physical, Social, Economic Geography',
            'Maharashtra and Indian Polity and Governance – Constitution, Political System, Panchayati Raj, Urban Governance, Public Policy, Rights Issues, etc.',
            'Economic and Social Development – Sustainable Development, Poverty, Inclusion, Demographics, Social Sector Initiatives, etc.',
            'General issues on Environmental ecology, Bio-diversity and Climate Change',
            'General Science',
          ],
        },
        {
          title: 'Syllabus – Prelims Paper II – CSAT',
          description: 'Aptitude test to assess comprehension, reasoning and decision-making skills.',
          syllabus: [
            'Comprehension (Marathi and English)',
            'Interpersonal skills including communication skills',
            'Logical reasoning and analytical ability',
            'Decision-making and problem-solving',
            'General mental ability',
            'Basic numeracy (Class X level)',
            'Data interpretation (charts, graphs, tables – Class X level)',
          ],
        },
      ]
    },
    {
      title: 'Stage II: Main Examination',
      description: 'The Main Exam follows a descriptive pattern and consists of 7 papers: 2 are qualifying language papers, and 5 are counted for the final merit ranking.',
      papers: [
        { name: 'Paper I', subject: 'Marathi (Essay + Grammar)', duration: '3 hours', marks: 300, qualifyingMarks: '25%', nature: 'Qualifying' },
        { name: 'Paper II', subject: 'English (Essay + Grammar)', duration: '3 hours', marks: 300, qualifyingMarks: '25%', nature: 'Qualifying' },
        { name: 'Paper III', subject: 'Essay (Marathi or English)', duration: '3 hours', marks: 250, nature: 'Merit' },
        { name: 'Paper IV', subject: 'GS Paper I', duration: '3 hours', marks: 250, nature: 'Merit' },
        { name: 'Paper V', subject: 'GS Paper II', duration: '3 hours', marks: 250, nature: 'Merit' },
        { name: 'Paper VI', subject: 'GS Paper III', duration: '3 hours', marks: 250, nature: 'Merit' },
        { name: 'Paper VII', subject: 'GS Paper IV', duration: '3 hours', marks: 250, nature: 'Merit' },
      ],
      notes: [
          'No Optional Subjects in the revised MPSC pattern (2023 onwards).',
          'Medium of papers is Marathi or English (except for the compulsory English paper).'
      ],
      subStages: [
        {
          title: 'Syllabus – GS Paper I (History, Geography, & Agriculture)',
          description: '',
          syllabus: [
            'History of Modern India (especially Maharashtra)',
            'Indian Culture, Heritage, and Social Reformers of Maharashtra',
            'Geography of Maharashtra, India, and the World',
            'Agriculture: Agroecology, Soils, Water Management',
          ]
        },
        {
          title: 'Syllabus – GS Paper II (Indian Constitution, Polity, and Law)',
          description: '',
          syllabus: [
            'The Constitution of India',
            'Indian Political System (with reference to Maharashtra)',
            'Administrative Law, Central and State Government Privileges',
            'The Maharashtra Land Revenue Code, 1966',
          ]
        },
        {
          title: 'Syllabus – GS Paper III (Human Resource Development & Human Rights)',
          description: '',
          syllabus: [
            'Human Resource Development in India',
            'Education, Vocational Education, Health, Rural Development',
            'Human Rights: Universal Declaration, Mechanisms, Child Development, Women Empowerment, Tribal Development',
          ]
        },
        {
          title: 'Syllabus – GS Paper IV (Economy, Planning, and S&T)',
          description: '',
          syllabus: [
            'Indian Economy and Planning',
            'Urban and Rural Economy (especially Maharashtra)',
            'Agriculture, Industry, and Service Sectors',
            'Science and Technology Developments',
          ]
        },
      ]
    },
    {
      title: 'Stage III: Interview / Personality Test',
      description: 'A personality test for candidates who clear the Main Examination, assessing their suitability for a career in public administration.',
      papers: [
          { name: 'Interview', subject: 'Personality Test', marks: 50, nature: 'Merit' }
      ]
    },
  ],
  finalScore: [
    { component: 'Mains (5 papers)', marks: 1250 },
    { component: 'Interview', marks: 50 },
  ],
};
