
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Icons } from '../icons';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { SyllabusTopic } from '@/lib/types';

import { upscCseExam } from '@/lib/exams/upsc/upsc-exam-data';
import { initialSyllabusData } from '@/lib/exams/upsc/upsc-syllabus-data';
import { mpscRajyasevaExam } from '@/lib/exams/mpsc/mpsc-exam-data';
import { mpscSyllabusData } from '@/lib/exams/mpsc/mpsc-syllabus-data';

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


export default function InsightsView() {
  const [selectedExam, setSelectedExam] = React.useState<'upsc' | 'mpsc'>('upsc');

  const examData = React.useMemo(() => {
    return selectedExam === 'upsc'
      ? { exam: upscCseExam, syllabus: initialSyllabusData, title: 'UPSC CSE' }
      : { exam: mpscRajyasevaExam, syllabus: mpscSyllabusData, title: 'MPSC Rajyaseva' };
  }, [selectedExam]);


  const stats = React.useMemo(() => {
    const { exam, syllabus } = examData;
    
    const mainStage = exam.stages.find(s => s.title.includes('Main'));
    const prelimsStage = exam.stages.find(s => s.title.includes('Preliminary'));
    const interviewStage = exam.stages.find(s => s.title.includes('Interview'));

    const writtenMeritPapers = mainStage?.papers?.filter(p => p.nature === 'Merit').length ?? 0;
    
    const prelimsQualifying = prelimsStage?.papers?.filter(p => p.nature === 'Qualifying').length ?? 0;
    const mainsQualifying = mainStage?.papers?.filter(p => p.nature === 'Qualifying').length ?? 0;
    const totalQualifyingPapers = prelimsQualifying + mainsQualifying;
    
    const interviewMarks = interviewStage?.papers?.[0]?.marks ?? 0;

    const optionalSubjects = mainStage?.papers?.some(p => p.subject.includes('Optional')) ? 1 : 0;
    
    const totalSyllabusTopics = countSyllabusEntries(syllabus);

    let statCards = [
         {
            title: 'Written Merit Papers',
            value: writtenMeritPapers,
            icon: FileText,
            description: `${writtenMeritPapers} papers in Mains for final merit.`
        },
        {
            title: 'Qualifying Papers',
            value: totalQualifyingPapers,
            icon: BookOpen,
            description: 'Across Prelims and Mains stages.'
        },
        {
            title: 'Interview Marks',
            value: interviewMarks,
            icon: Users,
            description: `The final stage for merit ranking.`
        },
        {
            title: 'Optional Subjects',
            value: optionalSubjects,
            icon: ListTree,
            description: `Number of optional subjects to choose.`
        }
    ];
    
    if (selectedExam === 'mpsc') {
      statCards[1].description = 'Prelims CSAT & Mains Language papers.';
      statCards[3] = {
            title: 'Total Syllabus Topics',
            value: totalSyllabusTopics,
            icon: ListTree,
            description: 'Detailed topics & sub-topics combined.'
        };
    } else {
        statCards[3] = {
            title: 'Optional Subjects',
            value: optionalSubjects,
            icon: ListTree,
            description: `Number of optional subjects to choose.`
        };
    }

    return statCards;
  }, [examData]);

  return (
    <>
      <header className="flex h-14 items-center gap-4 border-b bg-card px-4 md:px-6">
        <Icons.Sparkles className="h-6 w-6" />
        <h2 className="text-lg font-semibold">Exam Insights</h2>
      </header>
      <ScrollArea className="h-[calc(100vh-3.5rem)]">
        <main className="flex-1 space-y-8 p-4 md:p-6">
            <Tabs defaultValue="upsc" onValueChange={(value) => setSelectedExam(value as 'upsc' | 'mpsc')} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="upsc">UPSC CSE</TabsTrigger>
                    <TabsTrigger value="mpsc">MPSC Rajyaseva</TabsTrigger>
                </TabsList>
                <div className="pt-6">
                    <h2 className="mb-4 text-2xl font-headline font-bold">{examData.title}: At a Glance</h2>
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
            </Tabs>
          
          <div>
            <h2 className="mb-4 mt-8 text-2xl font-headline font-bold">Trends &amp; Analysis</h2>
            <p className="text-muted-foreground mb-6">
              Explore data-driven insights into the {examData.title} exam. More features are coming soon.
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
