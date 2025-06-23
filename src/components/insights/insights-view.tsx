
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Icons } from '../icons';
import { Button } from '../ui/button';
import { type View } from '../main-layout';
import { upscCseExam } from '@/lib/exams/upsc/upsc-exam-data';
import { initialSyllabusData } from '@/lib/exams/upsc/upsc-syllabus-data';
import type { SyllabusTopic } from '@/lib/types';
import { FileText, BookOpen, ListTree, Users } from 'lucide-react';

const countSyllabusEntries = (topics: SyllabusTopic[]): number => {
  let count = 0;
  const recurse = (items: SyllabusTopic[]) => {
    items.forEach(item => {
      count++;
      if (item.subtopics) {
        recurse(item.subtopics);
      }
    });
  };
  recurse(topics);
  return count;
};


export default function InsightsView({ setActiveView }: { setActiveView: (view: View) => void }) {
  const stats = React.useMemo(() => {
    const prelimsStage = upscCseExam.stages.find(s => s.title.includes('Preliminary'));
    const mainStage = upscCseExam.stages.find(s => s.title.includes('Main'));
    const interviewStage = upscCseExam.stages.find(s => s.title.includes('Interview'));

    const prelimsPaperCount = prelimsStage?.papers?.length ?? 0;
    const mainPaperCount = mainStage?.papers?.length ?? 0;
    const totalWrittenPapers = prelimsPaperCount + mainPaperCount;

    const prelimsGsCount = prelimsStage?.papers?.filter(p => p.subject.includes('General Studies') && p.nature === 'Merit').length ?? 0;
    const mainsGsCount = mainStage?.papers?.filter(p => p.subject.includes('General Studies')).length ?? 0;
    const essayCount = mainStage?.papers?.filter(p => p.subject === 'Essay').length ?? 0;
    const optionalSubjectCount = mainStage?.papers?.some(p => p.subject.includes('Optional')) ? 1 : 0;
    const coreSubjectsCount = prelimsGsCount + mainsGsCount + essayCount + optionalSubjectCount;

    const totalSyllabusTopics = countSyllabusEntries(initialSyllabusData);
    
    return [
      {
        title: 'Written Papers',
        value: totalWrittenPapers,
        icon: FileText,
        description: `${prelimsPaperCount} in Prelims + ${mainPaperCount} in Mains.`
      },
      {
        title: 'Core Merit Subjects',
        value: coreSubjectsCount,
        icon: BookOpen,
        description: 'GS (Prelims + Mains), Essay & Optional.'
      },
      {
        title: 'Total Syllabus Topics',
        value: totalSyllabusTopics,
        icon: ListTree,
        description: 'Detailed topics & sub-topics combined.'
      },
      {
        title: 'Personality Test',
        value: interviewStage ? 1 : 0,
        icon: Users,
        description: 'The final stage for merit ranking.'
      }
    ];
  }, []);

  return (
    <>
      <header className="flex h-14 items-center gap-4 border-b bg-card px-4 md:px-6">
        <Icons.Sparkles className="h-6 w-6" />
        <h2 className="text-lg font-semibold">UPSC Insights</h2>
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
              Explore data-driven insights into the UPSC CSE exam. More features are coming soon.
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
