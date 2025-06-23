
'use client';

import * as React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Icons } from '../icons';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import type { SyllabusTopic } from '@/lib/types';
import { generateStudyPlan, type GenerateStudyPlanOutput } from '@/ai/flows/create-study-plan-flow';
import { serializeSyllabusWithMastery } from '@/lib/resource-utils';
import { BrainCircuit, BookOpen, Repeat, Pencil, Clock, ListChecks, ArrowRight, Lightbulb, CalendarDays, BarChart, FileText, Activity } from 'lucide-react';
import type { View, SyllabusType } from '../main-layout';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';


const plannerFormSchema = z.object({
  focusAreas: z.string().min(10, 'Please describe your focus areas, e.g., "UPSC GS Paper II and Ethics"'),
  timeframe: z.string({ required_error: 'Please select a timeframe.' }),
  hoursPerWeek: z.number().min(1, 'Please enter at least 1 hour.').max(100, 'Please enter a realistic number of hours.'),
});

type PlannerFormValues = z.infer<typeof plannerFormSchema>;

type ActivityType = 'Study' | 'Revise' | 'Practice' | 'Test' | 'Weekly Revision' | 'Analyze Test';

const activityIconMap: Record<ActivityType, React.ElementType> = {
    Study: BookOpen,
    Revise: Repeat,
    'Weekly Revision': CalendarDays,
    Test: ListChecks,
    'Analyze Test': BrainCircuit,
    Practice: Pencil,
};

const activityColors: Record<ActivityType, string> = {
    Study: 'border-blue-500',
    Revise: 'border-green-500',
    'Weekly Revision': 'border-green-500',
    Test: 'border-pink-500',
    'Analyze Test': 'border-pink-500',
    Practice: 'border-yellow-500',
};

// Mock data for AI-suggested priorities
const suggestedPriorities = [
    { icon: Lightbulb, text: "**Focus on Polity:** Your test accuracy is low (45%)." },
    { icon: Lightbulb, text: "**Revise Environment:** You haven't reviewed 'Biodiversity' in 3 weeks." },
];

const parseDurationToHours = (durationStr: string): number => {
    if (!durationStr) return 0;
    const lowerCaseStr = durationStr.toLowerCase();
    const value = parseFloat(lowerCaseStr.match(/[\d.]+/)?.[0] || '0');
    if (isNaN(value)) return 0;

    if (lowerCaseStr.includes('h')) { // Catches 'h', 'hr', 'hour', 'hours'
        return value;
    }
    if (lowerCaseStr.includes('m')) { // Catches 'm', 'min', 'minute', 'minutes'
        return value / 60;
    }
    // Fallback for just a number, assume it's hours
    if (!isNaN(parseFloat(durationStr))) {
        return parseFloat(durationStr);
    }
    return 0;
};


interface StudyPlannerViewProps {
    allSyllabusData: { upsc: SyllabusTopic[], mpsc: SyllabusTopic[], ifos: SyllabusTopic[] };
    setActiveView: (view: View, syllabusType: SyllabusType, topicId: string) => void;
}

export default function StudyPlannerView({ allSyllabusData, setActiveView }: StudyPlannerViewProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [studyPlan, setStudyPlan] = React.useState<GenerateStudyPlanOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<PlannerFormValues>({
    resolver: zodResolver(plannerFormSchema),
    defaultValues: {
      focusAreas: 'UPSC GS Paper II (Polity & Governance) and GS Paper IV (Ethics), with some time for revision of Modern History.',
      timeframe: 'This Week',
      hoursPerWeek: 25,
    },
  });

  const syllabusContext = React.useMemo(() => {
    return serializeSyllabusWithMastery(allSyllabusData);
  }, [allSyllabusData]);


  const onSubmit = async (values: PlannerFormValues) => {
    setIsLoading(true);
    setStudyPlan(null);
    try {
      const result = await generateStudyPlan({
        focusAreas: values.focusAreas,
        timeframe: values.timeframe,
        hoursPerWeek: values.hoursPerWeek,
        syllabusContext,
      });
      setStudyPlan(result);
    } catch (error) {
      console.error('Failed to generate study plan:', error);
      toast({
        variant: 'destructive',
        title: 'Error Generating Plan',
        description: 'The AI failed to create a plan. Please try adjusting your inputs or try again later.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const planHours = React.useMemo(() => {
    if (!studyPlan) return { total: 0, study: 0, revise: 0, test: 0 };
    let study = 0, revise = 0, test = 0;

    studyPlan.plan.flatMap(day => day.tasks).forEach(task => {
        const hours = parseDurationToHours(task.duration);
        if (task.activity.toLowerCase().includes('study')) study += hours;
        else if (task.activity.toLowerCase().includes('revise')) revise += hours;
        else if (task.activity.toLowerCase().includes('test') || task.activity.toLowerCase().includes('practice')) test += hours;
    });

    return { total: study + revise + test, study, revise, test };
  }, [studyPlan]);

  const handleTaskClick = (topicId: string) => {
    let syllabusType: SyllabusType = 'upsc'; // Default
    if (Object.values(allSyllabusData.mpsc).find(t => t.id === topicId)) syllabusType = 'mpsc';
    if (Object.values(allSyllabusData.ifos).find(t => t.id === topicId)) syllabusType = 'ifos';
    
    setActiveView('syllabus', syllabusType, topicId);
  }

  return (
      <div className="flex h-screen flex-col bg-muted/40">
        <header className="flex h-14 shrink-0 items-center gap-4 border-b bg-background px-4 md:px-6">
            <Icons.ListTodo className="h-6 w-6" />
            <h2 className="text-lg font-semibold">Strategic Study Planner</h2>
        </header>

        <div className="flex min-h-0 flex-1">
            <aside className="hidden w-full max-w-sm flex-col border-r bg-background p-4 md:flex">
                <ScrollArea className="flex-1">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="focusAreas"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>1. What are your focus areas?</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="e.g., plan for MPSC GS Paper IV and revise UPSC Modern History"
                                                className="resize-none"
                                                rows={4}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="space-y-4">
                                <h3 className="font-semibold">2. Set Your Time Commitment</h3>
                                <FormField
                                    control={form.control}
                                    name="timeframe"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Plan Duration</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="This Week">This Week</SelectItem>
                                                    <SelectItem value="Next 2 Weeks">Next 2 Weeks</SelectItem>
                                                    <SelectItem value="Next Month">Next Month</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="hoursPerWeek"
                                    render={({ field }) => (
                                        <FormItem>
                                            <div className="flex justify-between">
                                                <FormLabel>Total Hours/Week</FormLabel>
                                                <span className="font-semibold">{field.value} hrs</span>
                                            </div>
                                            <FormControl>
                                                <Slider
                                                    defaultValue={[field.value]}
                                                    onValueChange={(value) => field.onChange(value[0])}
                                                    max={80}
                                                    step={1}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="space-y-4">
                                <h3 className="font-semibold">3. AI-Suggested Priorities</h3>
                                <div className="space-y-2">
                                {suggestedPriorities.map((priority, i) => (
                                    <Alert key={i} className="bg-yellow-50 border-yellow-200 text-yellow-800">
                                        <Lightbulb className="h-4 w-4 text-yellow-600" />
                                        <AlertDescription>
                                            {priority.text.split('**').map((part, index) => 
                                                index % 2 === 1 ? <strong key={index}>{part}</strong> : part
                                            )}
                                        </AlertDescription>
                                    </Alert>
                                ))}
                                </div>
                            </div>

                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <BrainCircuit className="mr-2 h-4 w-4 animate-spin" />
                                        Generating Weekly Plan...
                                    </>
                                ) : 'Generate Plan'}
                            </Button>
                        </form>
                    </Form>
                </ScrollArea>
            </aside>

            <main className="flex-1 overflow-hidden">
                <ScrollArea className="h-full">
                    <div className="p-4 md:p-6 lg:p-8">
                        {!studyPlan && !isLoading && (
                            <div className="flex h-full min-h-[60vh] flex-col items-center justify-center rounded-lg border-2 border-dashed bg-card/50 p-12 text-center">
                                <Icons.ListTodo className="h-16 w-16 text-muted-foreground/30 mb-4" />
                                <h3 className="text-2xl font-semibold tracking-tight">Your AI-Powered Plan Awaits</h3>
                                <p className="mt-2 max-w-md text-muted-foreground">
                                Use the controls on the left to generate a dynamic study schedule tailored to your mastery levels and priorities.
                                </p>
                            </div>
                        )}
                        
                        {isLoading && (
                             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
                                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                                    <div key={day} className="space-y-4">
                                        <h4 className="text-center font-semibold">{day}</h4>
                                        <Skeleton className="h-24 w-full" />
                                        <Skeleton className="h-24 w-full" />
                                    </div>
                                ))}
                             </div>
                        )}

                        {studyPlan && (
                            <div className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Generated Plan Analytics</CardTitle>
                                    </CardHeader>
                                    <CardContent className="grid grid-cols-2 gap-6 md:grid-cols-4">
                                        <div className="flex flex-col items-center rounded-lg border p-4">
                                            <Clock className="h-6 w-6 text-primary mb-2" />
                                            <p className="text-2xl font-bold">{planHours.total.toFixed(0)}h</p>
                                            <p className="text-sm text-muted-foreground">Total Hours</p>
                                        </div>
                                        <div className="flex flex-col items-center rounded-lg border p-4">
                                            <BookOpen className="h-6 w-6 text-blue-500 mb-2" />
                                            <p className="text-2xl font-bold">{planHours.study.toFixed(0)}h</p>
                                            <p className="text-sm text-muted-foreground">Study Time</p>
                                        </div>
                                        <div className="flex flex-col items-center rounded-lg border p-4">
                                            <Repeat className="h-6 w-6 text-green-500 mb-2" />
                                            <p className="text-2xl font-bold">{planHours.revise.toFixed(0)}h</p>
                                            <p className="text-sm text-muted-foreground">Revision Time</p>
                                        </div>
                                         <div className="flex flex-col items-center rounded-lg border p-4">
                                            <ListChecks className="h-6 w-6 text-pink-500 mb-2" />
                                            <p className="text-2xl font-bold">{planHours.test.toFixed(0)}h</p>
                                            <p className="text-sm text-muted-foreground">Test/Practice</p>
                                        </div>
                                    </CardContent>
                                </Card>

                                <div>
                                    <h2 className="text-xl font-bold mb-4">Your Generated Weekly Plan</h2>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-2 lg:gap-4">
                                        {studyPlan.plan.map((dailyPlan, index) => (
                                            <div key={index} className="space-y-3 rounded-lg bg-card p-2">
                                                <h4 className="text-center font-semibold text-muted-foreground">{dailyPlan.day}</h4>
                                                <div className="space-y-3">
                                                {dailyPlan.tasks.length > 0 ? dailyPlan.tasks.map((task, taskIndex) => {
                                                    const Icon = activityIconMap[task.activity as ActivityType] || Activity;
                                                    const colorClass = activityColors[task.activity as ActivityType] || 'border-gray-400';
                                                    return (
                                                        <button key={taskIndex} onClick={() => handleTaskClick(task.topicId)} className={cn("w-full cursor-pointer p-2 text-left text-xs border-l-4 rounded bg-background shadow-sm hover:bg-muted", colorClass)}>
                                                            <div className="flex items-start gap-2">
                                                                <Icon className="h-4 w-4 shrink-0 mt-0.5 text-muted-foreground" />
                                                                <div className="flex-1">
                                                                    <p className="font-semibold text-foreground">{task.topic}</p>
                                                                    <p className="text-muted-foreground">{task.suggestion.split(" ")[0]} ({task.duration})</p>
                                                                </div>
                                                            </div>
                                                        </button>
                                                    )
                                                }) : (
                                                    <div className="text-center text-xs text-muted-foreground py-8">Rest Day</div>
                                                )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-4 text-center">{studyPlan.summary}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </main>
        </div>
    </div>
  );
}

    