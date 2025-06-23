import type { StudyPlanData, SyllabusTopic } from './types';
import { findTopicPath } from './resource-utils';

export interface PlanAnalytics {
  totalHours: number;
  studyHours: number;
  reviseHours: number;
  testHours: number;
  paperBreakdown: {
    name: string;
    study: number;
    revise: number;
    test: number;
    total: number;
  }[];
}

const paperNameMapping: Record<string, string> = {
    'prelims-gs1': 'Prelims GS-I',
    'prelims-csat': 'Prelims CSAT',
    'mains-essay': 'Essay',
    'mains-gs1': 'GS Paper I',
    'mains-gs2': 'GS Paper II',
    'mains-gs3': 'GS Paper III',
    'mains-gs4': 'GS Paper IV',
    'mains-optional': 'Optional',
    'mpsc-prelims-gs1': 'MPSC Prelims GS',
    'mpsc-prelims-csat': 'MPSC Prelims CSAT',
    'mpsc-mains-essay': 'MPSC Essay',
    'mpsc-mains-gs1': 'MPSC GS-I',
    'mpsc-mains-gs2': 'MPSC GS-II',
    'mpsc-mains-gs3': 'MPSC GS-III',
    'mpsc-mains-gs4': 'MPSC GS-IV',
    'ifos-prelims-gs1': 'IFoS Prelims GS',
    'ifos-prelims-csat': 'IFoS Prelims CSAT',
    'ifos-mains-english': 'IFoS English',
    'ifos-mains-gk': 'IFoS Gen. Knowledge',
    'ifos-mains-optional1': 'IFoS Optional 1',
    'ifos-mains-optional2': 'IFoS Optional 2',
};

// Centralized function to parse duration strings like "2h", "45m", "1.5 hours"
export const parseDurationToHours = (durationStr: string): number => {
    if (!durationStr) return 0;
    const lowerCaseStr = durationStr.toLowerCase();
    
    let hours = 0;
    const hoursMatch = lowerCaseStr.match(/([\d.]+)\s*h/);
    if (hoursMatch) hours += parseFloat(hoursMatch[1]);
    
    const minutesMatch = lowerCaseStr.match(/([\d.]+)\s*m/);
    if (minutesMatch) hours += parseFloat(minutesMatch[1]) / 60;
    
    // Fallback for formats like "1.5" or "2" without h/m
    if (!hoursMatch && !minutesMatch && !lowerCaseStr.includes('rest')) {
      const numberMatch = lowerCaseStr.match(/[\d.]+/);
      if (numberMatch) hours = parseFloat(numberMatch[0]);
    }
    
    return hours;
};

// Main function to process the entire plan and extract detailed analytics
export const processPlanAnalytics = (
    plan: StudyPlanData, 
    allSyllabusData: { upsc: SyllabusTopic[], mpsc: SyllabusTopic[], ifos: SyllabusTopic[] }
): PlanAnalytics => {
    const combinedSyllabus = [...allSyllabusData.upsc, ...allSyllabusData.mpsc, ...allSyllabusData.ifos];
    const breakdown: Record<string, { name: string; study: number; revise: number; test: number; total: number }> = {};
    
    let totalStudy = 0, totalRevise = 0, totalTest = 0;

    const allTasks = plan.plan.flatMap(day => day.tasks);

    for (const task of allTasks) {
        const hours = parseDurationToHours(task.duration);
        const pathInfo = findTopicPath(combinedSyllabus, task.topicId);
        
        // Determine the parent paper. The second element in the path is usually the paper level.
        const paperId = pathInfo && pathInfo.path.length > 1 ? pathInfo.path[1].id : 'general';
        const paperName = paperNameMapping[paperId] || 'Miscellaneous';

        if (!breakdown[paperName]) {
            breakdown[paperName] = { name: paperName, study: 0, revise: 0, test: 0, total: 0 };
        }

        const activity = task.activity.toLowerCase();
        if (activity.includes('study')) {
            breakdown[paperName].study += hours;
            totalStudy += hours;
        } else if (activity.includes('revise')) {
            breakdown[paperName].revise += hours;
            totalRevise += hours;
        } else if (activity.includes('test') || activity.includes('practice')) {
            breakdown[paperName].test += hours;
            totalTest += hours;
        }
        breakdown[paperName].total += hours;
    }
    
    // Convert the record object to a sorted array
    const paperBreakdown = Object.values(breakdown).sort((a, b) => b.total - a.total);

    return {
        studyHours: Math.round(totalStudy),
        reviseHours: Math.round(totalRevise),
        testHours: Math.round(totalTest),
        totalHours: Math.round(totalStudy + totalRevise + totalTest),
        paperBreakdown
    };
};
