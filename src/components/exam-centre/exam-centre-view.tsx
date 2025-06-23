
'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Icons } from '../icons';
import type { View, SyllabusType } from '../main-layout';
import { 
    Landmark, 
    FileText, 
    Shield, 
    BookMarked, 
    ShieldCheck, 
    GraduationCap, 
    FlaskConical, 
    Sprout, 
    Eye, 
    TramFront, 
    Beaker, 
    Stethoscope 
} from 'lucide-react';
import type { ExamComparisonData } from '@/lib/exam-comparison-data';
import { SidebarTrigger } from '@/components/ui/sidebar';

const otherExams = [
    { name: 'SSC CGL', icon: FileText },
    { name: 'CAPF (AC)', icon: Shield },
    { name: 'NDA/CDS', icon: ShieldCheck },
    { name: 'EPFO/APFC', icon: BookMarked },
    { name: 'RBI/NABARD', icon: Landmark },
    { name: 'Banking (SBI/IBPS)', icon: Landmark },
    { name: 'UGC NET / CSIR NET', icon: GraduationCap },
    { name: 'GATE / JAM (Life Sci)', icon: FlaskConical },
    { name: 'IFoS', icon: Sprout },
    { name: 'IB ACIO', icon: Eye },
    { name: 'RRB NTPC / Group B', icon: TramFront },
    { name: 'Technical Scientist', icon: Beaker },
    { name: 'Medical/Agri Entrance', icon: Stethoscope },
];

interface ExamCentreViewProps {
  setActiveView: (view: View, syllabus?: SyllabusType) => void;
  comparisonData: ExamComparisonData[];
}

export default function ExamCentreView({ setActiveView, comparisonData }: ExamCentreViewProps) {
  return (
    <>
      <header className="flex h-14 items-center gap-4 border-b bg-card px-4 md:px-6">
        <Icons.Layers className="h-6 w-6" />
        <h2 className="text-lg font-semibold">Exam Centre</h2>
      </header>
      <ScrollArea className="h-[calc(100vh-3.5rem)]">
        <main className="flex-1 space-y-8 p-4 md:p-6 lg:p-8">
          
          <div>
            <h1 className="mb-2 text-3xl font-bold tracking-tight">Exam Centre</h1>
            <p className="text-muted-foreground">Select an exam to explore its structure, syllabus, and insights.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              <Card className="flex flex-col border-t-4 border-primary">
                <CardHeader>
                    <div className="bg-primary/10 text-primary self-start rounded-lg p-3">
                        <Landmark className="h-6 w-6" />
                    </div>
                </CardHeader>
                <CardContent className="flex-grow space-y-2">
                  <CardTitle>UPSC CSE</CardTitle>
                  <CardDescription>The primary focus of this tool. Dive deep into the Civil Services Examination.</CardDescription>
                </CardContent>
                <CardFooter className="flex-wrap gap-2">
                   <Button onClick={() => setActiveView('exam-explorer')}>Explore</Button>
                   <Button variant="ghost" onClick={() => setActiveView('syllabus', 'upsc')}>Syllabus</Button>
                   <Button variant="ghost" onClick={() => setActiveView('insights')}>Insights</Button>
                </CardFooter>
              </Card>

              <Card className="flex flex-col border-t-4 border-primary">
                <CardHeader>
                    <div className="bg-primary/10 text-primary self-start rounded-lg p-3">
                        <Landmark className="h-6 w-6" />
                    </div>
                </CardHeader>
                <CardContent className="flex-grow space-y-2">
                  <CardTitle>MPSC Rajyaseva</CardTitle>
                  <CardDescription>Explore the structure of the Maharashtra State Services Examination.</CardDescription>
                </CardContent>
                <CardFooter className="flex-wrap gap-2">
                   <Button onClick={() => setActiveView('mpsc-explorer')}>Explore</Button>
                   <Button variant="ghost" onClick={() => setActiveView('syllabus', 'mpsc')}>Syllabus</Button>
                   <Button variant="ghost" onClick={() => setActiveView('insights')}>Insights</Button>
                </CardFooter>
              </Card>

              {otherExams.map((exam) => {
                const Icon = exam.icon;
                return (
                  <Card key={exam.name} className="flex flex-col bg-muted/50">
                     <CardHeader>
                        <div className="bg-muted text-muted-foreground self-start rounded-lg p-3">
                            <Icon className="h-6 w-6" />
                        </div>
                    </CardHeader>
                    <CardContent className="flex-grow space-y-2">
                      <CardTitle className="text-muted-foreground">{exam.name}</CardTitle>
                       <CardDescription>Detailed insights for this exam are coming soon. Stay tuned for updates!</CardDescription>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full" disabled>Coming Soon</Button>
                    </CardFooter>
                  </Card>
                )
              })}
            </div>
        </main>
      </ScrollArea>
    </>
  );
}
