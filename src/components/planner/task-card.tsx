
'use client';

import * as React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { DailyTaskSchema } from '@/ai/flows/study-plan/schemas';
import { BookOpen, Repeat, Pencil, ListChecks, CalendarDays, BrainCircuit, Activity } from 'lucide-react';

type ActivityType = 'Study' | 'Revise' | 'Practice' | 'Test' | 'Weekly Revision' | 'Analyze Test';

const activityInfo: Record<ActivityType, { icon: React.ElementType, color: string }> = {
    Study: { icon: BookOpen, color: 'border-blue-500' },
    Revise: { icon: Repeat, color: 'border-green-500' },
    'Weekly Revision': { icon: CalendarDays, color: 'border-green-500' },
    Test: { icon: ListChecks, color: 'border-pink-500' },
    'Analyze Test': { icon: BrainCircuit, color: 'border-pink-500' },
    Practice: { icon: Pencil, color: 'border-yellow-500' },
};

interface TaskCardProps {
  task: Zod.infer<typeof DailyTaskSchema>;
  onClick: () => void;
}

export default function TaskCard({ task, onClick }: TaskCardProps) {
  const { icon: Icon, color: colorClass } = activityInfo[task.activity as ActivityType] || { icon: Activity, color: 'border-gray-400' };

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full cursor-pointer p-3 text-left text-sm border-l-4 rounded-r-lg bg-card shadow-sm transition-all hover:shadow-md hover:bg-muted",
        colorClass
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
            <Icon className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <p className="font-semibold text-foreground">{task.topic}</p>
            <p className="text-muted-foreground text-xs">{task.suggestion.split(" ")[0]} • {task.duration}</p>
          </div>
        </div>
        <Badge variant="secondary">{task.activity}</Badge>
      </div>
    </button>
  );
}
