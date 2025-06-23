
'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { Exam } from '@/lib/types';
import StageCard from './stage-card';
import { ScrollArea } from '../ui/scroll-area';
import { type View, type SyllabusType } from '../main-layout';
import { Sprout } from 'lucide-react';

export default function IfosExplorerView({ setActiveView, exam }: { setActiveView: (view: View, syllabus?: SyllabusType) => void, exam: Exam }) {

  if (!exam || exam.stages.length === 0) {
    return (
        <>
            <header className="flex h-14 items-center gap-4 border-b bg-card px-4 md:px-6">
                <Sprout className="h-6 w-6" />
                <h2 className="text-lg font-semibold">IFoS Exam Structure</h2>
            </header>
            <main className="flex-1 space-y-6 p-4 md:p-6">
                <Card>
                    <CardHeader>
                        <CardTitle>{exam?.title || 'IFoS Exam'}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">{exam?.description || 'Exam data not found. Please ensure your database is connected and migrated.'}</p>
                    </CardContent>
                </Card>
            </main>
        </>
    );
  }

  return (
    <>
       <header className="flex h-14 items-center gap-4 border-b bg-card px-4 md:px-6">
        <Sprout className="h-6 w-6" />
        <h2 className="text-lg font-semibold">IFoS Exam Structure</h2>
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
                 <Button onClick={() => setActiveView('syllabus', 'ifos')}>
                   View Detailed Syllabus
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
