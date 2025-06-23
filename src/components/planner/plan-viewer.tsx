'use client';

import * as React from 'react';
import type { SavedStudyPlan, SyllabusTopic, View, SyllabusType } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Icons } from '../icons';
import { Button } from '../ui/button';
import { ArrowLeft, Calendar, Clock, Target, Layers } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { format } from 'date-fns';
import PlannerAnalytics from './planner-analytics';
import DailyPlanCard from './daily-plan-card';
import { findTopicById } from '@/lib/resource-utils';
import { processPlanAnalytics, type PlanAnalytics } from '@/lib/planner-analytics-utils';
import PlanBreakdownChart from './plan-breakdown-chart';

interface PlanViewerProps {
    plan: SavedStudyPlan;
    setActiveView: (view: View, syllabusType?: SyllabusType, topicId?: string) => void;
    allSyllabusData: { upsc: SyllabusTopic[], mpsc: SyllabusTopic[], ifos: SyllabusTopic[] };
}

const Stat = ({ icon: Icon, value, label }: { icon: React.ElementType, value: string | number, label: string }) => (
    <div className="flex items-center text-sm">
        <Icon className="h-4 w-4 mr-2 text-muted-foreground" />
        <span className="text-muted-foreground mr-2">{label}:</span>
        <span className="font-semibold text-foreground">{value}</span>
    </div>
);

const examNameMap = {
    upsc: 'UPSC CSE',
    mpsc: 'MPSC Rajyaseva',
    ifos: 'IFoS',
    combined: 'Combined Focus'
};

export default function PlanViewer({ plan, setActiveView, allSyllabusData }: PlanViewerProps) {

  const analytics = React.useMemo<PlanAnalytics>(() => {
    if (!plan) {
        return { totalHours: 0, studyHours: 0, reviseHours: 0, testHours: 0, paperBreakdown: [] };
    }
    return processPlanAnalytics(plan.plan_data, allSyllabusData);
  }, [plan, allSyllabusData]);

  const handleTaskClick = (topicId: string) => {
    const primarySyllabus = plan.input_details.exam;
    
    if (primarySyllabus === 'combined') {
        // Fallback search logic for combined plans
        let syllabusType: SyllabusType = 'upsc'; // Default
        if (findTopicById(allSyllabusData.mpsc, topicId)) syllabusType = 'mpsc';
        else if (findTopicById(allSyllabusData.ifos, topicId)) syllabusType = 'ifos';
        setActiveView('syllabus', syllabusType, topicId);
    } else {
        // Use the explicitly saved primary syllabus for direct linking
        setActiveView('syllabus', primarySyllabus, topicId);
    }
  };

  const examName = examNameMap[plan.input_details.exam] || 'Custom Plan';

  return (
    <>
      <header className="flex h-14 shrink-0 items-center gap-4 border-b bg-card px-4 md:px-6">
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setActiveView('my-plans')}>
              <ArrowLeft className="h-4 w-4" />
          </Button>
          <Icons.ListChecks className="h-6 w-6" />
          <h2 className="text-lg font-semibold truncate">{plan.name}</h2>
      </header>

      <ScrollArea className="h-[calc(100vh-3.5rem)]">
          <main className="flex-1 space-y-6 p-4 md:p-6 lg:p-8">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <CardDescription>
                        Created on {format(new Date(plan.created_at), "MMMM d, yyyy")}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <CardTitle className="text-lg">Original Inputs</CardTitle>
                    <div className="grid gap-3 sm:grid-cols-2">
                        <Stat icon={Layers} value={examName} label="Primary Focus" />
                        <Stat icon={Calendar} value={plan.input_details.timeframe} label="Duration" />
                        <Stat icon={Clock} value={`${plan.input_details.hoursPerWeek}h / week`} label="Commitment" />
                    </div>
                     <div>
                        <h4 className="font-semibold text-sm mb-2 flex items-center">
                            <Target className="h-4 w-4 mr-2 text-muted-foreground" />
                            Focus Areas
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {plan.input_details.focusAreas.split(',').map((area, index) => (
                                <Badge key={index} variant="secondary">{area.trim()}</Badge>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <PlannerAnalytics analytics={analytics} />

            <PlanBreakdownChart analytics={analytics} />

            <div className="space-y-6">
                <h2 className="text-2xl font-bold font-headline tracking-tight">Daily Breakdown</h2>
                {plan.plan_data.plan.map((dailyPlan) => (
                <DailyPlanCard
                    key={dailyPlan.day}
                    dailyPlan={dailyPlan}
                    onTaskClick={handleTaskClick}
                />
                ))}
            </div>
             <Card className="mt-6 bg-muted/50 p-4 text-center text-sm text-muted-foreground">
                <p>{plan.plan_data.summary}</p>
            </Card>
          </main>
      </ScrollArea>
    </>
  );
}
