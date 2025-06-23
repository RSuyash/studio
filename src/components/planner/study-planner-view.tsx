
'use client';

import * as React from 'react';
import { useToast } from '@/hooks/use-toast';
import type { SyllabusTopic } from '@/lib/types';
import { generateStudyPlan, type GenerateStudyPlanOutput } from '@/ai/flows/study-plan';
import { serializeSyllabusWithMastery, findTopicById } from '@/lib/resource-utils';
import { Icons } from '../icons';
import type { View, SyllabusType } from '../main-layout';
import PlannerForm from './planner-form';
import PlannerResults from './planner-results';

const parseDurationToHours = (durationStr: string): number => {
    if (!durationStr) return 0;
    const lowerCaseStr = durationStr.toLowerCase();
    
    let hours = 0;
    const hoursMatch = lowerCaseStr.match(/([\d.]+)\s*h/);
    if (hoursMatch) hours = parseFloat(hoursMatch[1]);
    
    const minutesMatch = lowerCaseStr.match(/([\d.]+)\s*m/);
    if (minutesMatch) hours += parseFloat(minutesMatch[1]) / 60;
    
    if (!hoursMatch && !minutesMatch && !lowerCaseStr.includes('rest')) {
      const numberMatch = lowerCaseStr.match(/[\d.]+/);
      if (numberMatch) hours = parseFloat(numberMatch[0]);
    }
    
    return hours;
};

interface StudyPlannerViewProps {
    allSyllabusData: { upsc: SyllabusTopic[], mpsc: SyllabusTopic[], ifos: SyllabusTopic[] };
    setActiveView: (view: View, syllabusType: SyllabusType, topicId: string) => void;
}

export default function StudyPlannerView({ allSyllabusData, setActiveView }: StudyPlannerViewProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [studyPlan, setStudyPlan] = React.useState<GenerateStudyPlanOutput | null>(null);
  const { toast } = useToast();

  const syllabusContext = React.useMemo(() => {
    return serializeSyllabusWithMastery(allSyllabusData);
  }, [allSyllabusData]);

  const onSubmit = async (values: { focusAreas: string, timeframe: string, hoursPerWeek: number }) => {
    setIsLoading(true);
    setStudyPlan(null);
    try {
      const result = await generateStudyPlan({
        focusAreas: values.focusAreas,
        timeframe: values.timeframe,
        hoursPerWeek: values.hoursPerWeek,
        syllabusContext,
      });
      setStudyPlan(result);
    } catch (error) {
      console.error('Failed to generate study plan:', error);
      toast({
        variant: 'destructive',
        title: 'Error Generating Plan',
        description: 'The AI failed to create a plan. Please try adjusting your inputs or try again later.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const planHours = React.useMemo(() => {
    if (!studyPlan) return { total: 0, study: 0, revise: 0, test: 0 };
    let study = 0, revise = 0, test = 0;

    studyPlan.plan.flatMap(day => day.tasks).forEach(task => {
        const hours = parseDurationToHours(task.duration);
        if (task.activity.toLowerCase().includes('study')) study += hours;
        else if (task.activity.toLowerCase().includes('revise')) revise += hours;
        else if (task.activity.toLowerCase().includes('test') || task.activity.toLowerCase().includes('practice')) test += hours;
    });
    
    const total = Math.round(study + revise + test);
    study = Math.round(study);
    revise = Math.round(revise);
    test = Math.round(test);

    return { total, study, revise, test };
  }, [studyPlan]);

  const handleTaskClick = (topicId: string) => {
    let syllabusType: SyllabusType = 'upsc';
    if (findTopicById(allSyllabusData.mpsc, topicId)) syllabusType = 'mpsc';
    else if (findTopicById(allSyllabusData.ifos, topicId)) syllabusType = 'ifos';
    
    setActiveView('syllabus', syllabusType, topicId);
  };
  
  return (
    <div className="flex h-screen flex-col bg-background">
      <header className="flex h-14 shrink-0 items-center gap-4 border-b bg-card px-4 md:px-6">
          <Icons.ListTodo className="h-6 w-6" />
          <h2 className="text-lg font-semibold">Strategic Study Planner</h2>
      </header>

      <div className="grid min-h-0 flex-1 md:grid-cols-[400px_1fr]">
          <PlannerForm
            isLoading={isLoading}
            onSubmit={onSubmit}
          />
          <PlannerResults
            isLoading={isLoading}
            studyPlan={studyPlan}
            planHours={planHours}
            onTaskClick={handleTaskClick}
          />
      </div>
  </div>
);
}
