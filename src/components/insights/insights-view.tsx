'use client';

import * as React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Icons } from '../icons';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { calculateExamStats, type ExamStats } from '@/lib/insights-utils';
import StatCard from './stat-card';
import PaperBreakdownChart from './paper-breakdown-chart';
import { Layers, ListTree, Plus } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import type { Exam, SyllabusTopic } from '@/lib/types';

interface InsightsViewProps {
  upscExam: Exam;
  upscSyllabus: SyllabusTopic[];
  mpscExam: Exam;
  mpscSyllabus: SyllabusTopic[];
}

export default function InsightsView({ upscExam, upscSyllabus, mpscExam, mpscSyllabus }: InsightsViewProps) {
  const [selectedExam, setSelectedExam] = React.useState<'upsc' | 'mpsc'>('upsc');

  const { exam, syllabus, title } = React.useMemo(() => {
    return selectedExam === 'upsc'
      ? { exam: upscExam, syllabus: upscSyllabus, title: 'UPSC CSE' }
      : { exam: mpscExam, syllabus: mpscSyllabus, title: 'MPSC Rajyaseva' };
  }, [selectedExam, upscExam, upscSyllabus, mpscExam, mpscSyllabus]);

  const stats = React.useMemo(() => {
    return calculateExamStats(exam, syllabus);
  }, [exam, syllabus]);

  return (
    <>
      <header className="flex h-14 items-center gap-4 border-b bg-card px-4 md:px-6">
        <Icons.Sparkles className="h-6 w-6" />
        <h2 className="text-lg font-semibold">Exam Insights</h2>
      </header>
      <ScrollArea className="h-[calc(100vh-3.5rem)]">
        <main className="flex-1 space-y-6 p-4 md:p-6 lg:p-8">
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-2xl font-headline font-bold">{title}: At a Glance</h2>
                 <Tabs defaultValue="upsc" onValueChange={(value) => setSelectedExam(value as 'upsc' | 'mpsc')}>
                    <TabsList>
                        <TabsTrigger value="upsc">UPSC CSE</TabsTrigger>
                        <TabsTrigger value="mpsc">MPSC Rajyaseva</TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>
          
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <PaperBreakdownChart stats={stats} />
                </div>
                <div className="space-y-6">
                    <StatCard
                        Icon={Layers}
                        title="Exam Stages"
                        value={stats.totalStages.value}
                        description={stats.totalStages.description}
                    />
                    <StatCard
                        Icon={ListTree}
                        title="Syllabus Topics"
                        value={stats.totalTopics.value}
                        description={stats.totalTopics.description}
                    />
                </div>
            </div>

            {stats.optionalSubjects && (
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                     <div className="lg:col-span-2">
                        <Card>
                             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">Optional Subjects</CardTitle>
                                <Plus className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">{stats.optionalSubjects.value}</div>
                                <p className="text-xs text-muted-foreground">{stats.optionalSubjects.description}</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}
        </main>
      </ScrollArea>
    </>
  );
}
