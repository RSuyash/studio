'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Icons } from '../icons';
import ExamComparisonTable from './exam-comparison-table';

export default function ExamCentreView() {
  return (
    <>
      <header className="flex h-14 items-center gap-4 border-b bg-card px-4 md:px-6">
        <Icons.Layers className="h-6 w-6" />
        <h2 className="text-lg font-semibold">Exam Centre</h2>
      </header>
      <ScrollArea className="h-[calc(100vh-3.5rem)]">
        <main className="flex-1 space-y-6 p-4 md:p-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-3xl text-primary">Syllabus Overlap Analysis</CardTitle>
              <CardDescription>
                An analysis of syllabus overlap between UPSC CSE and other major government examinations. This helps in understanding how preparation for one exam can be leveraged for others.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Percentages are approximate, representing the fraction of syllabus content common with UPSC General Studies.
              </p>
            </CardContent>
          </Card>

          <ExamComparisonTable />

        </main>
      </ScrollArea>
    </>
  );
}
