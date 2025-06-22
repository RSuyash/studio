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
      ]
    },
    {
      title: 'Stage II: Main Examination',
      description: 'The Main Exam follows a descriptive pattern and consists of 7 papers: 2 are qualifying language papers, and 5 are counted for the final merit ranking.',
      papers: [
        { name: 'Paper I', subject: 'Marathi (Essay + Grammar)', duration: '3 hours', marks: 300, nature: 'Qualifying' },
        { name: 'Paper II', subject: 'English (Essay + Grammar)', duration: '3 hours', marks: 300, nature: 'Qualifying' },
        { name: 'Paper III', subject: 'Essay (Marathi or English)', duration: '3 hours', marks: 250, nature: 'Merit' },
        { name: 'Paper IV', subject: 'GS Paper I (History, Geography, etc.)', duration: '3 hours', marks: 250, nature: 'Merit' },
        { name: 'Paper V', subject: 'GS Paper II (Indian Polity, Law, HRD)', duration: '3 hours', marks: 250, nature: 'Merit' },
        { name: 'Paper VI', subject: 'GS Paper III (Economy, Agriculture, Science)', duration: '3 hours', marks: 250, nature: 'Merit' },
        { name: 'Paper VII', subject: 'GS Paper IV (Ethics, Integrity, Aptitude)', duration: '3 hours', marks: 250, nature: 'Merit' },
      ],
      notes: [
          'No Optional Subjects in the revised MPSC pattern (2023 onwards).',
          'Medium of papers is Marathi or English (except for the compulsory English paper).'
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
