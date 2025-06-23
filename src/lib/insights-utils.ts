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
    meritPapersMains: { value: number; description: string };
    qualifyingPapers: { value: number; description: string };
    meritPapersPrelims: { value: number; description: string };
    totalStages: { value: number; description: string };
    totalTopics: { value: number; description: string };
    optionalSubjects?: { value: number; description: string };
}

export const calculateExamStats = (exam: Exam, syllabus: SyllabusTopic[]): ExamStats => {
    let qualifyingPapers = 0;
    let meritPapersMains = 0;
    let meritPapersPrelims = 0;

    exam.stages.forEach(stage => {
        qualifyingPapers += stage.papers?.filter(p => p.nature === 'Qualifying').length ?? 0;
        
        if (stage.title.toLowerCase().includes('main')) {
            meritPapersMains += stage.papers?.filter(p => p.nature === 'Merit').length ?? 0;
        } else if (stage.title.toLowerCase().includes('preliminary')) {
            meritPapersPrelims += stage.papers?.filter(p => p.nature === 'Merit').length ?? 0;
        }
    });
    
    const totalPapers = meritPapersMains + meritPapersPrelims + qualifyingPapers;
    const totalStages = exam.stages.length;
    const totalTopics = countSyllabusEntries(syllabus);
    const mainStage = exam.stages.find(s => s.title.toLowerCase().includes('main'));
    const optionalSubjectsPaper = mainStage?.papers?.find(p => p.subject.toLowerCase().includes('optional'));
    
    const stats: ExamStats = {
        totalPapers: {
            value: totalPapers,
            description: "Total written papers across all stages."
        },
        meritPapersMains: {
            value: meritPapersMains,
            description: "Merit-Based (Mains)"
        },
        qualifyingPapers: {
            value: qualifyingPapers,
            description: "Qualifying"
        },
        meritPapersPrelims: {
            value: meritPapersPrelims,
            description: "Merit-Based (Prelims)"
        },
        totalStages: {
            value: totalStages,
            description: "Distinct stages in the examination"
        },
        totalTopics: {
            value: totalTopics,
            description: "Detailed topics & sub-topics"
        }
    };

    if (optionalSubjectsPaper) {
        stats.optionalSubjects = {
            value: 1, // Assuming one choice of optional subject
            description: "Number of optional subjects to choose"
        };
    }
    
    return stats;
}
