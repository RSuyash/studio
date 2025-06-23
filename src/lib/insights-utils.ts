import type { Exam, SyllabusTopic } from '@/lib/types';

// Recursive helper to count all topics and subtopics
const countSyllabusEntries = (topics: SyllabusTopic[]): number => {
  let count = 0;
  const recurse = (items: SyllabusTopic[]) => {
    items.forEach(item => {
      count++;
      if (item.subtopics) {
        recurse(item.subtopics);
      }
    });
  };
  recurse(topics);
  return count;
};

export interface ExamStats {
    totalPapers: { value: number; description: string };
    meritPapers: { value: number; description: string };
    qualifyingPapers: { value: number; description: string };
    totalStages: { value: number; description: string };
    totalTopics: { value: number; description: string };
    optionalSubjects?: { value: number; description: string };
}

export const calculateExamStats = (exam: Exam, syllabus: SyllabusTopic[]): ExamStats => {
    let totalPapers = 0;
    let qualifyingPapers = 0;

    exam.stages.forEach(stage => {
        totalPapers += stage.papers?.length ?? 0;
        qualifyingPapers += stage.papers?.filter(p => p.nature === 'Qualifying').length ?? 0;
    });

    const mainStage = exam.stages.find(s => s.title.toLowerCase().includes('main'));
    const meritPapers = mainStage?.papers?.filter(p => p.nature === 'Merit').length ?? 0;
    
    const totalStages = exam.stages.length;
    const totalTopics = countSyllabusEntries(syllabus);

    const optionalSubjectsPaper = mainStage?.papers?.find(p => p.subject.toLowerCase().includes('optional'));
    
    const stats: ExamStats = {
        totalPapers: {
            value: totalPapers,
            description: "Total written papers across all stages."
        },
        meritPapers: {
            value: meritPapers,
            description: "Papers in Mains for final merit ranking."
        },
        qualifyingPapers: {
            value: qualifyingPapers,
            description: "Papers that don't count for merit."
        },
        totalStages: {
            value: totalStages,
            description: "Distinct stages in the examination process."
        },
        totalTopics: {
            value: totalTopics,
            description: "Detailed topics & sub-topics combined."
        }
    };

    if (optionalSubjectsPaper) {
        stats.optionalSubjects = {
            value: 1,
            description: "Number of optional subjects to choose."
        };
    }
    
    return stats;
}
