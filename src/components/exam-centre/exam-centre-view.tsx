'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Icons } from '../icons';
import ExamComparisonTable from './exam-comparison-table';
import type { View } from '../main-layout';
import { Landmark, FileText, Shield, Layers, Building, Banknote } from 'lucide-react';
import type { ExamComparisonData } from '@/lib/exam-comparison-data';

const otherExams = [
    { name: 'SSC CGL', icon: FileText, comingSoon: true },
    { name: 'CAPF (AC)', icon: Shield, comingSoon: true },
    { name: 'RBI/NABARD', icon: Building, comingSoon: true },
    { name: 'Banking (SBI/IBPS)', icon: Banknote, comingSoon: true },
]

interface ExamCentreViewProps {
  setActiveView: (view: View) => void;
  comparisonData: ExamComparisonData[];
  comparisonDataError: string | null;
}

export default function ExamCentreView({ setActiveView, comparisonData, comparisonDataError }: ExamCentreViewProps) {
  return (
    <>
      <header className="flex h-14 items-center gap-4 border-b bg-card px-4 md:px-6">
        <Icons.Layers className="h-6 w-6" />
        <h2 className="text-lg font-semibold">Exam Centre</h2>
      </header>
      <ScrollArea className="h-[calc(100vh-3.5rem)]">
        <main className="flex-1 space-y-8 p-4 md:p-6">
          
          <div>
            <h2 className="mb-4 text-2xl font-headline font-bold">Select an Exam for Detailed Insights</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card className="flex flex-col">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <Landmark className="h-8 w-8 text-primary" />
                    <CardTitle>UPSC CSE</CardTitle>
                  </div>
                  <CardDescription>The primary focus of this tool. Dive deep into the Civil Services Examination.</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow" />
                <CardFooter className="flex flex-col gap-2 sm:flex-row">
                   <Button className="w-full" onClick={() => setActiveView('exam-explorer')}>Structure</Button>
                   <Button className="w-full" variant="outline" onClick={() => setActiveView('syllabus')}>Syllabus</Button>
                   <Button className="w-full" variant="outline" onClick={() => setActiveView('insights')}>Insights</Button>
                </CardFooter>
              </Card>

              <Card className="flex flex-col">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <Landmark className="h-8 w-8 text-primary" />
                    <CardTitle>MPSC Rajyaseva</CardTitle>
                  </div>
                  <CardDescription>Explore the structure of the Maharashtra State Services Examination.</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow" />
                <CardFooter>
                   <Button className="w-full" onClick={() => setActiveView('mpsc-explorer')}>Structure</Button>
                </CardFooter>
              </Card>

              {otherExams.map((exam) => {
                const Icon = exam.icon;
                return (
                  <Card key={exam.name} className="flex flex-col bg-muted/50">
                    <CardHeader>
                      <div className="flex items-center gap-4">
                        <Icon className="h-8 w-8 text-muted-foreground" />
                        <CardTitle className="text-muted-foreground">{exam.name}</CardTitle>
                      </div>
                       <CardDescription>Detailed insights for this exam are coming soon.</CardDescription>
                    </CardHeader>
                     <CardContent className="flex-grow" />
                    <CardFooter>
                      <Button className="w-full" disabled>Coming Soon</Button>
                    </CardFooter>
                  </Card>
                )
              })}
            </div>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-2xl text-primary">Syllabus Overlap Analysis</CardTitle>
              <CardDescription>
                An analysis of syllabus overlap between UPSC CSE and other major government examinations. This helps in understanding how preparation for one exam can be leveraged for others.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Percentages are approximate, representing the fraction of syllabus content common with UPSC General Studies.
              </p>
              <div className="mt-4">
                 <ExamComparisonTable data={comparisonData} error={comparisonDataError} />
              </div>
            </CardContent>
          </Card>

        </main>
      </ScrollArea>
    </>
  );
}
