'use client';

import * as React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Icons } from '../icons';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { calculateExamStats, type ExamStats } from '@/lib/insights-utils';

import { upscCseExam } from '@/lib/exams/upsc/upsc-exam-data';
import { initialSyllabusData } from '@/lib/exams/upsc/upsc-syllabus-data';
import { mpscRajyasevaExam } from '@/lib/exams/mpsc/mpsc-exam-data';
import { mpscSyllabusData } from '@/lib/exams/mpsc/mpsc-syllabus-data';

import { FileText, CheckCircle, ListTree, Layers, BookOpen } from 'lucide-react';
import StatCard from './stat-card';
import AnalysisSection from './analysis-section';

const statIcons = {
    totalPapers: FileText,
    meritPapers: CheckCircle,
    qualifyingPapers: BookOpen,
    totalStages: Layers,
    totalTopics: ListTree,
    optionalSubjects: ListTree,
};

const statTitles: Record<keyof ExamStats, string> = {
    totalPapers: 'Total Written Papers',
    meritPapers: 'Merit-Based Papers',
    qualifyingPapers: 'Qualifying Papers',
    totalStages: 'Exam Stages',
    totalTopics: 'Syllabus Topics',
    optionalSubjects: 'Optional Subjects',
};


export default function InsightsView() {
  const [selectedExam, setSelectedExam] = React.useState<'upsc' | 'mpsc'>('upsc');

  const examInfo = React.useMemo(() => {
    return selectedExam === 'upsc'
      ? { exam: upscCseExam, syllabus: initialSyllabusData, title: 'UPSC CSE' }
      : { exam: mpscRajyasevaExam, syllabus: mpscSyllabusData, title: 'MPSC Rajyaseva' };
  }, [selectedExam]);

  const stats = React.useMemo(() => {
    return calculateExamStats(examInfo.exam, examInfo.syllabus);
  }, [examInfo]);


  return (
    <>
      <header className="flex h-14 items-center gap-4 border-b bg-card px-4 md:px-6">
        <Icons.Sparkles className="h-6 w-6" />
        <h2 className="text-lg font-semibold">Exam Insights</h2>
      </header>
      <ScrollArea className="h-[calc(100vh-3.5rem)]">
        <main className="flex-1 space-y-8 p-4 md:p-6">
            <Tabs defaultValue="upsc" onValueChange={(value) => setSelectedExam(value as 'upsc' | 'mpsc')} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="upsc">UPSC CSE</TabsTrigger>
                    <TabsTrigger value="mpsc">MPSC Rajyaseva</TabsTrigger>
                </TabsList>
                <div className="pt-6">
                    <h2 className="mb-4 text-2xl font-headline font-bold">{examInfo.title}: At a Glance</h2>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {Object.entries(stats).map(([key, statData]) => {
                            if (!statData) return null;
                            const statKey = key as keyof ExamStats;
                            const Icon = statIcons[statKey];
                            const title = statTitles[statKey];
                            
                            return (
                                <StatCard 
                                    key={title}
                                    Icon={Icon}
                                    title={title}
                                    value={statData.value}
                                    description={statData.description}
                                />
                            );
                        })}
                    </div>
                </div>
            </Tabs>
          
          <AnalysisSection examTitle={examInfo.title} />

        </main>
      </ScrollArea>
    </>
  );
}
