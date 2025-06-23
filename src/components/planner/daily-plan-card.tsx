
'use client';

import * as React from 'react';
import type { DailyPlanSchema } from '@/ai/flows/study-plan/schemas';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TaskCard from './task-card';

interface DailyPlanCardProps {
  dailyPlan: Zod.infer<typeof DailyPlanSchema>;
  onTaskClick: (topicId: string) => void;
}

export default function DailyPlanCard({ dailyPlan, onTaskClick }: DailyPlanCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-headline">{dailyPlan.day}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {dailyPlan.tasks.length > 0 ? dailyPlan.tasks.map((task, taskIndex) => (
          <TaskCard
            key={taskIndex}
            task={task}
            onClick={() => onTaskClick(task.topicId)}
          />
        )) : (
          <div className="flex items-center justify-center text-sm text-muted-foreground py-8 rounded bg-muted/50">
            Rest Day
          </div>
        )}
      </CardContent>
    </Card>
  );
}
