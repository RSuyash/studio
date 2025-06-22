'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { mpscRajyasevaExam } from '@/lib/mpsc-exam-data';
import type { Exam } from '@/lib/exam-data';
import StageCard from './stage-card';
import { ScrollArea } from '../ui/scroll-area';
import { type View } from '../main-layout';
import { Icons } from '../icons';

export default function MpscExplorerView({ setActiveView }: { setActiveView: (view: View) => void }) {
  const exam: Exam = mpscRajyasevaExam;

  return (
    <>
       <header className="flex h-14 items-center gap-4 border-b bg-card px-4 md:px-6">
        <Icons.Landmark className="h-6 w-6" />
        <h2 className="text-lg font-semibold">MPSC Rajyaseva Exam Structure</h2>
      </header>
       <ScrollArea className="h-[calc(100vh-3.5rem)]">
         <main className="flex-1 space-y-6 p-4 md:p-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-3xl text-primary">{exam.title}</CardTitle>
              <CardDescription>{exam.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
               <div className="flex justify-start">
                 <Button onClick={() => setActiveView('syllabus')} disabled>
                   View Detailed Syllabus (Coming Soon)
                 </Button>
               </div>
            </CardContent>
          </Card>
          
          <div className="space-y-6">
            {exam.stages.map((stage, index) => (
                <StageCard key={index} stage={stage} stageNumber={index + 1} />
            ))}
          </div>

          <Card>
            <CardHeader>
                <CardTitle>Final Score for Ranking</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-muted">
                            <tr>
                                <th className="p-3 font-semibold">Component</th>
                                <th className="p-3 font-semibold">Marks</th>
                            </tr>
                        </thead>
                        <tbody>
                            {exam.finalScore.map((item, index) => (
                                <tr key={index} className="border-b">
                                    <td className="p-3">{item.component}</td>
                                    <td className="p-3">{item.marks}</td>
                                </tr>
                            ))}
                             <tr className="border-b bg-muted/50 font-bold">
                                <td className="p-3">Total</td>
                                <td className="p-3">{exam.finalScore.reduce((acc, item) => acc + item.marks, 0)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </CardContent>
          </Card>

        </main>
      </ScrollArea>
    </>
  );
}
