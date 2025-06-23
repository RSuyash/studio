
'use client';

import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, BookOpen, Repeat, ListChecks } from 'lucide-react';

interface PlannerAnalyticsProps {
  planHours: { total: number; study: number; revise: number; test: number };
}

export default function PlannerAnalytics({ planHours }: PlannerAnalyticsProps) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      <Card>
        <CardContent className="flex flex-col items-center p-4">
          <Clock className="h-6 w-6 text-primary mb-2" />
          <p className="text-2xl font-bold">{planHours.total}h</p>
          <p className="text-sm text-muted-foreground">Total Hours</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="flex flex-col items-center p-4">
          <BookOpen className="h-6 w-6 text-blue-500 mb-2" />
          <p className="text-2xl font-bold">{planHours.study}h</p>
          <p className="text-sm text-muted-foreground">Study Time</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="flex flex-col items-center p-4">
          <Repeat className="h-6 w-6 text-green-500 mb-2" />
          <p className="text-2xl font-bold">{planHours.revise}h</p>
          <p className="text-sm text-muted-foreground">Revision Time</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="flex flex-col items-center p-4">
          <ListChecks className="h-6 w-6 text-pink-500 mb-2" />
          <p className="text-2xl font-bold">{planHours.test}h</p>
          <p className="text-sm text-muted-foreground">Test/Practice</p>
        </CardContent>
      </Card>
    </div>
  );
}
