
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Icons } from '../icons';
import { Button } from '../ui/button';
import { mpscRajyasevaExam } from '@/lib/mpsc-exam-data';
import { FileText, BookOpen, ListTree, Users } from 'lucide-react';

export default function MpscInsightsView() {
  const stats = React.useMemo(() => {
    const mainStage = mpscRajyasevaExam.stages.find(s => s.title.includes('Main'));
    const interviewStage = mpscRajyasevaExam.stages.find(s => s.title.includes('Interview'));

    const meritPapers = mainStage?.papers?.filter(p => p.nature === 'Merit') ?? [];
    const qualifyingPapers = mainStage?.papers?.filter(p => p.nature === 'Qualifying') ?? [];
    
    const meritPaperCount = meritPapers.length;
    const qualifyingPaperCount = qualifyingPapers.length;

    const interviewMarks = mpscRajyasevaExam.finalScore.find(c => c.component === 'Interview')?.marks ?? 0;
    
    const essayPapers = meritPapers.filter(p => p.subject === 'Essay').length;
    const gsPapers = meritPapers.filter(p => p.subject.startsWith('General Studies')).length;
    
    let meritDescParts: string[] = [];
    if (essayPapers > 0) meritDescParts.push('Essay');
    if (gsPapers > 0) meritDescParts.push(`${gsPapers} GS papers`);
    const meritDescription = meritDescParts.join(' & ');
    
    return [
      {
        title: 'Written Merit Papers',
        value: meritPaperCount,
        icon: FileText,
        description: `${meritPaperCount} in Mains (${meritDescription}).`
      },
      {
        title: 'Core Merit Subjects',
        value: meritPaperCount,
        icon: BookOpen,
        description: meritDescription,
      },
      {
        title: 'Qualifying Language Papers',
        value: qualifyingPaperCount,
        icon: ListTree,
        description: `${qualifyingPapers.map(p => p.subject).join(', ')} in Mains.`
      },
      {
        title: 'Personality Test',
        value: interviewStage ? 1 : 0,
        icon: Users,
        description: `Carries ${interviewMarks} marks.`
      }
    ];
  }, []);

  return (
    <>
      <header className="flex h-14 items-center gap-4 border-b bg-card px-4 md:px-6">
        <Icons.Sparkles className="h-6 w-6" />
        <h2 className="text-lg font-semibold">MPSC Rajyaseva Insights</h2>
      </header>
      <ScrollArea className="h-[calc(100vh-3.5rem)]">
        <main className="flex-1 space-y-8 p-4 md:p-6">
          
           <div>
            <h2 className="mb-4 text-2xl font-headline font-bold">Exam at a Glance</h2>
             <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <Card key={stat.title}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                        <Icon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stat.value}</div>
                        <p className="text-xs text-muted-foreground">{stat.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
          
          <div>
            <h2 className="mb-4 text-2xl font-headline font-bold">Trends & Analysis</h2>
            <p className="text-muted-foreground mb-6">
              Explore data-driven insights into the MPSC Rajyaseva exam. More features are coming soon.
            </p>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card className="flex flex-col bg-muted/50">
                <CardHeader>
                  <CardTitle className="text-muted-foreground">PYQ Analysis</CardTitle>
                  <CardDescription>Topic-wise breakdown of Previous Year Questions.</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow" />
                <CardFooter>
                  <Button className="w-full" disabled>Coming Soon</Button>
                </CardFooter>
              </Card>
              <Card className="flex flex-col bg-muted/50">
                <CardHeader>
                  <CardTitle className="text-muted-foreground">Topic Weightage</CardTitle>
                  <CardDescription>Analysis of subject and topic importance over the years.</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow" />
                <CardFooter>
                  <Button className="w-full" disabled>Coming Soon</Button>
                </CardFooter>
              </Card>
              <Card className="flex flex-col bg-muted/50">
                <CardHeader>
                  <CardTitle className="text-muted-foreground">Cut-off Trends</CardTitle>
                  <CardDescription>Historical data on Prelims and Mains cut-off marks.</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow" />
                <CardFooter>
                  <Button className="w-full" disabled>Coming Soon</Button>
                </CardFooter>
              </Card>
            </div>
          </div>

        </main>
      </ScrollArea>
    </>
  );
}
