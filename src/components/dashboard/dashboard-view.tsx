
"use client"

import * as React from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Skeleton } from '@/components/ui/skeleton'
import { Icons } from '@/components/icons';
import type { View } from '../main-layout';
import { useToast } from '@/hooks/use-toast';
import { explainSyllabusTopic, type ExplainTopicOutput } from '@/ai/flows/explain-topic-flow';
import { LoaderCircle, Sparkles, BookOpen, Library, ChevronRight } from 'lucide-react';

const SubjectMasteryChart = dynamic(
  () => import('@/components/dashboard/subject-mastery-chart'),
  {
    ssr: false,
    loading: () => <Skeleton className="h-[300px] w-full" />
  }
)

export const DashboardView = ({ setActiveView }: { setActiveView: (view: View) => void }) => {
    const [isGenerating, setIsGenerating] = React.useState(false);
    const [explanation, setExplanation] = React.useState<ExplainTopicOutput | null>(null);
    const { toast } = useToast();

    const handleGenerateTip = async () => {
        setIsGenerating(true);
        setExplanation(null);
        try {
            const result = await explainSyllabusTopic({
                title: 'Random UPSC CSE Topic',
                description: 'Suggest a random, interesting, and non-obvious interlinkage between two different topics in the UPSC CSE syllabus. For example, connecting a topic from GS-1 History to a concept in GS-4 Ethics.',
            });
            if (result.explanation) {
                setExplanation(result);
            } else {
                throw new Error('Failed to get a tip.');
            }
        } catch (error) {
            console.error("Failed to generate tip:", error);
            toast({
                variant: "destructive",
                title: "AI Error",
                description: "Could not generate a study tip. Please try again.",
            });
        } finally {
            setIsGenerating(false);
        }
    };


    return (
        <>
            <header className="flex h-14 items-center gap-4 border-b bg-card px-4 md:px-6">
                <SidebarTrigger />
                <div className="flex-1">
                    <h2 className="text-lg font-semibold">Dashboard</h2>
                </div>
            </header>
            <main className="flex-1 space-y-6 p-4 md:p-6">
                <div className="mb-6">
                    <h1 className="font-headline text-3xl font-bold text-primary">Welcome back!</h1>
                    <p className="text-muted-foreground">Here's a summary of your learning journey.</p>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Syllabus Progress</CardTitle>
                            <Icons.BookOpen className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">75%</div>
                            <p className="text-xs text-muted-foreground">
                                You're on the right track!
                            </p>
                        </CardContent>
                        <CardFooter>
                           <Progress value={75} className="w-full" />
                        </CardFooter>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Topics Mastered</CardTitle>
                            <Icons.Target className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">42</div>
                            <p className="text-xs text-muted-foreground">
                                2 expert, 15 advanced, 25 novice
                            </p>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Mock Tests</CardTitle>
                            <Icons.PencilLine className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">+12</div>
                            <p className="text-xs text-muted-foreground">
                                +19% from last month
                            </p>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Days to Prelims 2025</CardTitle>
                            <Icons.CalendarDays className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">245</div>
                            <p className="text-xs text-muted-foreground">
                                Stay focused and consistent.
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-7">
                    <Card className="lg:col-span-4">
                        <CardHeader>
                            <CardTitle>Subject-wise Mastery</CardTitle>
                            <CardDescription>Your progress across key GS subjects.</CardDescription>
                        </CardHeader>
                        <CardContent className="pl-2">
                            <SubjectMasteryChart />
                        </CardContent>
                    </Card>

                    <Card className="lg:col-span-3">
                         <CardHeader>
                            <CardTitle>Your Toolkit</CardTitle>
                            <CardDescription>Quick access to your learning tools.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            <div className="flex items-center justify-between rounded-lg border p-4">
                                <div className="flex items-center gap-4">
                                    <BookOpen className="h-6 w-6 text-primary" />
                                    <div>
                                        <p className="font-semibold">Syllabus Explorer</p>
                                        <p className="text-sm text-muted-foreground">Dive into the syllabus.</p>
                                    </div>
                                </div>
                                <Button size="sm" onClick={() => setActiveView('syllabus')}>Open</Button>
                            </div>
                            <div className="flex items-center justify-between rounded-lg border p-4">
                                 <div className="flex items-center gap-4">
                                    <Library className="h-6 w-6 text-primary" />
                                    <div>
                                        <p className="font-semibold">My Resources</p>
                                        <p className="text-sm text-muted-foreground">Browse your saved links.</p>
                                    </div>
                                </div>
                                <Button size="sm" onClick={() => setActiveView('resources')}>Open</Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card className="cursor-pointer transition-colors hover:bg-muted/50" onClick={() => setActiveView('exam-explorer')}>
                    <CardHeader className="flex flex-row items-center gap-4">
                        <div className="rounded-full bg-primary/10 p-3">
                            <Icons.Landmark className="h-8 w-8 text-primary" />
                        </div>
                        <div className="flex-1">
                            <CardTitle>UPSC Exam Insights</CardTitle>
                            <CardDescription>An interactive breakdown of the CSE stages, papers, marks, and syllabus.</CardDescription>
                        </div>
                        <Button variant="ghost" size="icon" asChild>
                           <ChevronRight className="h-6 w-6 text-muted-foreground" />
                        </Button>
                    </CardHeader>
                </Card>

                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Sparkles className="text-primary" /> AI Study Tip
                        </CardTitle>
                        <CardDescription>Get a unique, AI-generated tip to help you find new connections in the syllabus.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isGenerating && (
                            <div className="flex items-center space-x-2 text-muted-foreground">
                                <LoaderCircle className="h-4 w-4 animate-spin" />
                                <span>Generating...</span>
                            </div>
                        )}
                        {explanation && (
                             <blockquote className="mt-2 border-l-2 pl-6 italic">
                                "{explanation.explanation}"
                            </blockquote>
                        )}
                    </CardContent>
                    <CardFooter>
                        <Button onClick={handleGenerateTip} disabled={isGenerating}>
                             {isGenerating ? (
                                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Sparkles className="mr-2 h-4 w-4" />
                            )}
                            Generate New Tip
                        </Button>
                    </CardFooter>
                </Card>

            </main>
        </>
    )
}
