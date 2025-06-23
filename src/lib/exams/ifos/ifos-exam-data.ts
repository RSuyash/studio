
import type { Exam } from '@/lib/types';

export const ifosExam: Exam = {
  id: 'ifos',
  title: 'Indian Forest Service (IFoS) Exam',
  description: 'A comprehensive overview of the Indian Forest Service (IFoS) Examination, which shares its Preliminary stage with the UPSC Civil Services Exam.',
  stages: [
    {
      title: 'Stage I: Preliminary Examination (Shared with CSE)',
      description: 'An objective-type screening test shared with the Civil Services Exam. Marks are not counted for the final merit list, but candidates must clear the cut-off. The CSAT paper is qualifying in nature.',
      papers: [
        { name: 'Paper I', subject: 'General Studies (GS)', duration: '2 hours', marks: 200, nature: 'Merit' },
        { name: 'Paper II', subject: 'CSAT (Aptitude Test)', duration: '2 hours', marks: 200, qualifyingMarks: '33%', nature: 'Qualifying' },
      ],
      notes: [
          'The syllabus for the Preliminary exam is identical to the UPSC Civil Services Preliminary Exam.',
          'Candidates must apply separately for IFoS and CSE.'
      ]
    },
    {
      title: 'Stage II: Main Examination',
      description: 'The Main Exam is descriptive in nature and consists of six papers. All papers must be written in English only.',
      papers: [
        { name: 'Paper I', subject: 'General English', duration: '3 hours', marks: 300, nature: 'Merit', syllabus: ['Essay writing', 'Précis/Summary writing', 'Comprehension', 'Grammar and usage'] },
        { name: 'Paper II', subject: 'General Knowledge', duration: '3 hours', marks: 300, nature: 'Merit', syllabus: ['Current Affairs', 'Indian Polity & Constitution', 'History of India', 'Geography of India', 'Indian Economy', 'Environmental issues and forestry-related knowledge'] },
        { name: 'Paper III', subject: 'Optional Subject I - Paper 1', duration: '3 hours', marks: 200, nature: 'Merit' },
        { name: 'Paper IV', subject: 'Optional Subject I - Paper 2', duration: '3 hours', marks: 200, nature: 'Merit' },
        { name: 'Paper V', subject: 'Optional Subject II - Paper 1', duration: '3 hours', marks: 200, nature: 'Merit' },
        { name: 'Paper VI', subject: 'Optional Subject II - Paper 2', duration: '3 hours', marks: 200, nature: 'Merit' },
      ],
      notes: [
          'Candidates must choose two optional subjects from the list provided by UPSC.',
          'Certain combinations of optional subjects are not allowed (e.g., Agriculture and Agricultural Engineering).',
          'The standard of the optional subjects is that of a Bachelor\'s degree.'
      ],
    },
    {
      title: 'Stage III: Interview / Personality Test',
      description: 'A personality test to assess the candidate\'s suitability for a career in the forest service, focusing on aptitude, field orientation, and ethical judgment.',
      papers: [
          { name: 'Interview', subject: 'Personality Test', marks: 300, nature: 'Merit' }
      ],
      notes: [
          'Assesses mental alertness, critical thinking, leadership, integrity, and motivation for forest service.',
          'A physical fitness test is also conducted for shortlisted candidates.'
      ]
    },
  ],
  finalScore: [
    { component: 'Mains (6 papers)', marks: 1400 },
    { component: 'Interview', marks: 300 },
  ],
};
