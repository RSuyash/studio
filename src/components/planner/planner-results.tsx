
'use client';

import * as React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Icons } from '../icons';
import type { StudyPlanData } from '@/lib/types';
import PlannerAnalytics from './planner-analytics';
import DailyPlanCard from './daily-plan-card';
import { Button } from '../ui/button';
import { Save } from 'lucide-react';
import { Card } from '../ui/card';

interface PlannerResultsProps {
  isLoading: boolean;
  studyPlan: StudyPlanData | null;
  planHours: { total: number; study: number; revise: number; test: number };
  onTaskClick: (topicId: string) => void;
  onSavePlan: () => void;
}

export default function PlannerResults({
  isLoading,
  studyPlan,
  planHours,
  onTaskClick,
  onSavePlan,
}: PlannerResultsProps) {
  return (
    <main className="flex-1 overflow-hidden">
      <ScrollArea className="h-full">
        <div className="p-4 md:p-6 lg:p-8">
          {!studyPlan && !isLoading && (
            <div className="flex h-full min-h-[70vh] flex-col items-center justify-center rounded-lg border-2 border-dashed bg-card/50 p-12 text-center">
              <Icons.ListTodo className="h-16 w-16 text-muted-foreground/30 mb-4" />
              <h3 className="text-2xl font-semibold tracking-tight">Your AI-Powered Plan Awaits</h3>
              <p className="mt-2 max-w-md text-muted-foreground">
                Use the controls on the left to generate a dynamic study schedule tailored to your mastery levels and priorities.
              </p>
            </div>
          )}

          {isLoading && !studyPlan && (
            <div className="space-y-6">
              <Skeleton className="h-24 w-full" />
              <div className="grid grid-cols-1 gap-4">
                {[...Array(7)].map((_, i) => (
                  <div key={i} className="space-y-4 rounded-lg border p-4">
                    <Skeleton className="h-6 w-1/4" />
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {studyPlan && (
            <div className="space-y-8">
              <PlannerAnalytics planHours={planHours} />

              <div>
                <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
                    <h2 className="text-2xl font-bold font-headline tracking-tight">Your Generated Study Plan</h2>
                    <Button onClick={onSavePlan} disabled={isLoading}>
                        <Save className="mr-2 h-4 w-4" />
                        Save Plan
                    </Button>
                </div>

                <div className="space-y-6">
                  {studyPlan.plan.map((dailyPlan) => (
                    <DailyPlanCard
                      key={dailyPlan.day}
                      dailyPlan={dailyPlan}
                      onTaskClick={onTaskClick}
                    />
                  ))}
                </div>
                
                {isLoading && (
                  <div className="flex flex-col items-center justify-center pt-8">
                    <div className="flex items-center space-x-2">
                        <Skeleton className="h-4 w-4 rounded-full animate-bounce [animation-delay:0ms]" />
                        <Skeleton className="h-4 w-4 rounded-full animate-bounce [animation-delay:150ms]" />
                        <Skeleton className="h-4 w-4 rounded-full animate-bounce [animation-delay:300ms]" />
                    </div>
                    <p className="mt-4 text-sm text-muted-foreground">The AI is building the rest of your plan...</p>
                  </div>
                )}
                
                {!isLoading && (
                    <Card className="mt-6 bg-muted/50 p-4 text-center text-sm text-muted-foreground">
                       <p>{studyPlan.summary}</p>
                    </Card>
                )}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </main>
  );
}
