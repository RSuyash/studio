'use client';

import * as React from 'react';
import { serializeSyllabusWithMastery, findTopicById } from '@/lib/resource-utils';
import { Icons } from '../icons';
import type { View, SyllabusType } from '../main-layout';
import PlannerForm from './planner-form';
import PlannerResults from './planner-results';
import type { SyllabusTopic, StudyPlanInput } from '@/lib/types';
import { useStudyPlanStream } from '@/hooks/use-study-plan-stream';
import { useToast } from '@/hooks/use-toast';
import { saveStudyPlan } from '@/actions/study-plan-actions';
import SavePlanDialog from './save-plan-dialog';
import { processPlanAnalytics, type PlanAnalytics } from '@/lib/planner-analytics-utils';

interface StudyPlannerViewProps {
    allSyllabusData: { upsc: SyllabusTopic[], mpsc: SyllabusTopic[], ifos: SyllabusTopic[] };
    setActiveView: (view: View, syllabusType?: SyllabusType, topicId?: string) => void;
}

export default function StudyPlannerView({ allSyllabusData, setActiveView }: StudyPlannerViewProps) {
  const { studyPlan, isLoading, generatePlan, currentInputs } = useStudyPlanStream();
  const { toast } = useToast();
  const [isSaveDialogOpen, setSaveDialogOpen] = React.useState(false);

  const syllabusContext = React.useMemo(() => {
    return serializeSyllabusWithMastery(allSyllabusData);
  }, [allSyllabusData]);

  const handleSubmit = (values: StudyPlanInput) => {
    generatePlan({ ...values, syllabusContext });
  };

  const handleSave = async (planName: string) => {
    if (!studyPlan || !currentInputs) {
        toast({ variant: 'destructive', title: 'Error', description: 'No plan available to save.' });
        return;
    }
    const result = await saveStudyPlan(planName, studyPlan, currentInputs);
    if (result.success) {
        toast({ title: 'Plan Saved!', description: `Your plan "${planName}" has been successfully saved.` });
    } else {
        toast({ variant: 'destructive', title: 'Save Failed', description: result.error });
    }
    setSaveDialogOpen(false);
  };

  const analytics = React.useMemo<PlanAnalytics>(() => {
    if (!studyPlan) {
      return { totalHours: 0, studyHours: 0, reviseHours: 0, testHours: 0, paperBreakdown: [] };
    }
    return processPlanAnalytics(studyPlan, allSyllabusData);
  }, [studyPlan, allSyllabusData]);


  const handleTaskClick = (topicId: string) => {
    const primarySyllabus = currentInputs?.exam || 'upsc';
    if (primarySyllabus === 'combined') {
      let syllabusType: SyllabusType = 'upsc';
      if (findTopicById(allSyllabusData.mpsc, topicId)) syllabusType = 'mpsc';
      else if (findTopicById(allSyllabusData.ifos, topicId)) syllabusType = 'ifos';
      setActiveView('syllabus', syllabusType, topicId);
    } else {
      setActiveView('syllabus', primarySyllabus, topicId);
    }
  };
  
  return (
    <>
      <div className="flex h-screen flex-col bg-background">
        <header className="flex h-14 shrink-0 items-center gap-4 border-b bg-card px-4 md:px-6">
            <Icons.ListTodo className="h-6 w-6" />
            <h2 className="text-lg font-semibold">Strategic Study Planner</h2>
        </header>

        <div className="grid min-h-0 flex-1 md:grid-cols-[400px_1fr]">
            <PlannerForm
              isLoading={isLoading}
              onSubmit={handleSubmit}
            />
            <PlannerResults
              isLoading={isLoading}
              studyPlan={studyPlan}
              analytics={analytics}
              onTaskClick={handleTaskClick}
              onSavePlan={() => setSaveDialogOpen(true)}
            />
        </div>
      </div>
      <SavePlanDialog 
        isOpen={isSaveDialogOpen}
        onOpenChange={setSaveDialogOpen}
        onSave={handleSave}
      />
    </>
);
}
