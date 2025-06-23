
'use client';

import * as React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Icons } from '../icons';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import type { SyllabusTopic } from '@/lib/types';
import { generateStudyPlan, type GenerateStudyPlanOutput } from '@/ai/flows/create-study-plan-flow';
import { serializeSyllabusWithMastery, findTopicById } from '@/lib/resource-utils';
import { BrainCircuit, CheckCircle, BookOpen, Repeat, Pencil, Clock, ListChecks, ArrowRight, Lightbulb, Plus, X } from 'lucide-react';
import { View, SyllabusType } from '../main-layout';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';


const plannerFormSchema = z.object({
  topics: z.array(z.string()).min(1, 'Please select at least one topic.'),
  timeframe: z.string({ required_error: 'Please select a timeframe.' }),
  hoursPerWeek: z.number().min(1, 'Please enter at least 1 hour.').max(100, 'Please enter a realistic number of hours.'),
});

type PlannerFormValues = z.infer<typeof plannerFormSchema>;

type ActivityType = 'Study' | 'Revise' | 'Practice' | 'Test' | 'Weekly Revision' | 'Analyze Test';

const activityColors: Record<ActivityType, string> = {
    Study: 'border-blue-500',
    Revise: 'border-green-500',
    'Weekly Revision': 'border-green-500',
    Test: 'border-pink-500',
    'Analyze Test': 'border-pink-500',
    Practice: 'border-yellow-500',
};

const activityLegend: Record<string, { color: string, label: string}> = {
    Study: { color: 'bg-blue-500', label: 'Study' },
    Revise: { color: 'bg-green-500', label: 'Revision' },
    Test: { color: 'bg-pink-500', label: 'Test' },
}

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

    if (lowerCaseStr.includes('hr') || lowerCaseStr.includes('hour')) {
        return value;
    }
    if (lowerCaseStr.includes('min') || lowerCaseStr.includes('minute')) {
        return value / 60;
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
      topics: ['mains-gs2-polity-constitution', 'mains-gs1-modern-history', 'mains-gs3-env-conservation'],
      timeframe: 'This Week',
      hoursPerWeek: 20,
    },
  });

  const syllabusContext = React.useMemo(() => {
    return serializeSyllabusWithMastery(allSyllabusData);
  }, [allSyllabusData]);


  const onSubmit = async (values: PlannerFormValues) => {
    setIsLoading(true);
    setStudyPlan(null); // Clear previous plan
    try {
      // For now, we join the selected topics into the string the AI expects
      const focusAreas = values.topics.map(id => findTopicById(Object.values(allSyllabusData).flat(), id)?.title || id).join(', ');

      const result = await generateStudyPlan({
        focusAreas,
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
    if (!studyPlan) return { Study: 0, Revise: 0, Test: 0 };
    return studyPlan.plan.flatMap(day => day.tasks).reduce((acc, task) => {
        const hours = parseDurationToHours(task.duration);
        if (task.activity.includes('Study')) acc.Study += hours;
        else if (task.activity.includes('Revise')) acc.Revise += hours;
        else if (task.activity.includes('Test')) acc.Test += hours;
        return acc;
    }, { Study: 0, Revise: 0, Test: 0 });
  }, [studyPlan]);

  const selectedTopics = form.watch('topics');

  return (
      <div className="flex h-screen flex-col bg-muted/40">
        <header className="flex h-14 shrink-0 items-center gap-4 border-b bg-background px-4 md:px-6">
            <Icons.ListTodo className="h-6 w-6" />
            <h2 className="text-lg font-semibold">Strategic Study Planner</h2>
            <span className="hidden sm:inline-block text-sm text-muted-foreground ml-2">Co-create your perfect study schedule with your AI co-pilot.</span>
        </header>

        <div className="flex min-h-0 flex-1">
            {/* Left Control Panel */}
            <aside className="hidden w-full max-w-sm flex-col border-r bg-background p-4 md:flex">
                <ScrollArea className="flex-1">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            {/* 1. Select Topics */}
                            <div className="space-y-4">
                                <h3 className="font-semibold">1. Select Your Topics</h3>
                                <Card className="p-4">
                                    <div className="flex flex-col gap-2">
                                        {selectedTopics.map(topicId => {
                                            const topic = findTopicById(Object.values(allSyllabusData).flat(), topicId);
                                            return (
                                                <Badge key={topicId} variant="secondary" className="flex justify-between py-1.5 text-sm">
                                                    <span>{topic ? topic.title : topicId}</span>
                                                    <button onClick={() => form.setValue('topics', selectedTopics.filter(id => id !== topicId))}>
                                                        <X className="h-3 w-3" />
                                                    </button>
                                                </Badge>
                                            )
                                        })}
                                    </div>
                                    <Button variant="ghost" className="mt-2 w-full justify-start text-muted-foreground">
                                        <Plus className="mr-2 h-4 w-4" /> Add more topics from Syllabus
                                    </Button>
                                </Card>
                            </div>

                            {/* 2. Set Time Commitment */}
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

                            {/* 3. AI-Suggested Priorities */}
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

            {/* Right Plan View */}
            <main className="flex-1 p-4 md:p-6 lg:p-8">
                <ScrollArea className="h-full">
                <div className="flex items-center justify-between mb-4">
                     <h2 className="text-xl font-bold">Your Generated Weekly Plan</h2>
                     <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        {Object.entries(activityLegend).map(([key, {color, label}]) => (
                            <div key={key} className="flex items-center gap-2">
                                <span className={cn("h-2.5 w-2.5 rounded-full", color)}></span>
                                <span>{label}: {planHours[key as keyof typeof planHours].toFixed(0)}h</span>
                            </div>
                        ))}
                    </div>
                </div>

                {!studyPlan && !isLoading && (
                    <div className="flex h-full min-h-[400px] flex-col items-center justify-center rounded-lg border-2 border-dashed bg-card/50 p-12 text-center">
                        <Icons.ListTodo className="h-16 w-16 text-muted-foreground/30 mb-4" />
                        <h3 className="text-2xl font-semibold tracking-tight">Your AI-Powered Plan Awaits</h3>
                        <p className="mt-2 max-w-md text-muted-foreground">
                        Use the controls on the left to generate a dynamic study schedule tailored to your mastery levels and priorities.
                        </p>
                    </div>
                )}
                
                {isLoading && (
                     <div className="grid grid-cols-7 gap-4">
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
                    <div className="grid grid-cols-7 gap-x-2 md:gap-x-4">
                        {studyPlan.plan.map((dailyPlan, index) => (
                            <div key={index} className="space-y-3">
                                <h4 className="text-center font-semibold text-muted-foreground">{dailyPlan.day}</h4>
                                <div className="space-y-3">
                                {dailyPlan.tasks.map((task, taskIndex) => {
                                    const colorClass = activityColors[task.activity as ActivityType] || 'border-gray-400';
                                    return (
                                        <Card key={taskIndex} className={cn("p-2 text-xs border-l-4 bg-card", colorClass)}>
                                            <p className="font-semibold">{task.topic}</p>
                                            <p className="text-muted-foreground">{task.suggestion.split(" ")[0]} ({task.duration})</p>
                                        </Card>
                                    )
                                })}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                </ScrollArea>
            </main>
        </div>
    </div>
  );
}
