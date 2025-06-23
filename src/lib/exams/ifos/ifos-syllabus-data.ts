
import type { SyllabusTopic } from '@/lib/types';

export const ifosSyllabusData: SyllabusTopic[] = [
  {
    id: 'ifos-preliminary-exam',
    title: 'Stage I: Preliminary Examination',
    icon: 'ClipboardList',
    description: 'The syllabus for the Preliminary Examination is the same as that of the Civil Services (Preliminary) Examination.',
    tags: ['objective', 'qualifying', 'shared-with-cse'],
    mastery: 'none',
    subtopics: [
        {
            id: 'ifos-prelims-gs1',
            title: 'Paper I: General Studies',
            icon: 'FileText',
            description: 'Syllabus is identical to UPSC CSE Prelims GS Paper I.',
            tags: ['gs', 'merit-cutoff'],
            mastery: 'none',
            marks: 200,
        },
        {
            id: 'ifos-prelims-csat',
            title: 'Paper II: CSAT',
            icon: 'FileText',
            description: 'Syllabus is identical to UPSC CSE Prelims CSAT Paper. Qualifying in nature.',
            tags: ['csat', 'aptitude', 'qualifying'],
            mastery: 'none',
            marks: 200,
        }
    ]
  },
  {
    id: 'ifos-main-exam',
    title: 'Stage II: Main Examination',
    icon: 'PencilLine',
    description: 'A descriptive exam consisting of 6 papers. All papers are counted for merit.',
    tags: ['descriptive', 'merit-based'],
    mastery: 'none',
    subtopics: [
      {
        id: 'ifos-mains-english',
        title: 'Paper I: General English',
        icon: 'FileText',
        description: 'Tests the candidate\'s ability to read and understand serious discursive prose, and to express his/her ideas clearly and correctly in English.',
        tags: ['english', 'merit'],
        mastery: 'none',
        marks: 300,
      },
      {
        id: 'ifos-mains-gk',
        title: 'Paper II: General Knowledge',
        icon: 'FileText',
        description: 'Broad general knowledge including current events, history, polity, geography and scientific aspects.',
        tags: ['gk', 'merit'],
        mastery: 'none',
        marks: 300,
      },
      {
        id: 'ifos-mains-optional1',
        title: 'Optional Subject 1 (Papers III & IV)',
        icon: 'BookMarked',
        description: 'Two descriptive papers on the first optional subject chosen by the candidate.',
        tags: ['optional', 'specialized', 'merit'],
        mastery: 'none',
        marks: 400,
      },
      {
        id: 'ifos-mains-optional2',
        title: 'Optional Subject 2 (Papers V & VI)',
        icon: 'BookMarked',
        description: 'Two descriptive papers on the second optional subject chosen by the candidate.',
        tags: ['optional', 'specialized', 'merit'],
        mastery: 'none',
        marks: 400,
      },
    ]
  },
  {
    id: 'ifos-interview',
    title: 'Stage III: Interview / Personality Test',
    icon: 'Users',
    description: 'A personality test assessing suitability for a career in the forest service.',
    tags: ['interview', 'personality-test', 'final-stage'],
    mastery: 'none',
    marks: 300,
  },
];
