'use client';

import * as React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Icons } from '../icons';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import type { SyllabusTopic } from '@/lib/types';
import { generateStudyPlan, type GenerateStudyPlanOutput } from '@/ai/flows/create-study-plan-flow';
import { serializeSyllabusWithMastery } from '@/lib/resource-utils';
import { BrainCircuit, CheckCircle, BookOpen, Repeat, Pencil, Clock, ListChecks } from 'lucide-react';
import { MultiSelect } from '@/components/ui/multi-select';
import StatCard from '../insights/stat-card';

const plannerFormSchema = z.object({
  focusAreas: z.array(z.string()).min(1, 'Please select at least one focus area.'),
  timeframe: z.string({ required_error: 'Please select a timeframe.' }),
  hoursPerWeek: z.coerce.number().min(1, 'Please enter at least 1 hour.').max(100, 'Please enter a realistic number of hours.'),
});

type PlannerFormValues = z.infer<typeof plannerFormSchema>;

const activityIcons: Record<string, React.ElementType> = {
  Study: BookOpen,
  Revise: Repeat,
  Practice: Pencil,
  Test: CheckCircle,
};

interface PlanStats {
    totalHours: string;
    totalTasks: number;
    studyTasks: number;
    revisionTasks: number;
    practiceTasks: number;
    testTasks: number;
}

const parseDuration = (durationStr: string): number => {
    if (!durationStr) return 0;
    const parts = durationStr.toLowerCase().split(' ');
    const value = parseFloat(parts[0]);
    if (isNaN(value)) return 0;

    if (parts[1].startsWith('hr')) {
        return value * 60;
    }
    if (parts[1].startsWith('min')) {
        return value;
    }
    return 0;
};

export default function StudyPlannerView({ allSyllabusData }: { allSyllabusData: SyllabusTopic[] }) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [studyPlan, setStudyPlan] = React.useState<GenerateStudyPlanOutput | null>(null);
  const [planStats, setPlanStats] = React.useState<PlanStats | null>(null);
  const { toast } = useToast();

  const form = useForm<PlannerFormValues>({
    resolver: zodResolver(plannerFormSchema),
    defaultValues: {
      focusAreas: [],
      timeframe: '1 Week',
      hoursPerWeek: 20,
    },
  });

  const syllabusContext = React.useMemo(() => {
    return serializeSyllabusWithMastery(allSyllabusData);
  }, [allSyllabusData]);

  const focusAreaOptions = React.useMemo(() => {
    return allSyllabusData.map(topic => ({
      value: topic.title,
      label: topic.title,
    }));
  }, [allSyllabusData]);
  
  React.useEffect(() => {
    if (!studyPlan) {
        setPlanStats(null);
        return;
    }

    let totalMinutes = 0;
    let studyTasks = 0, revisionTasks = 0, practiceTasks = 0, testTasks = 0;
    
    studyPlan.plan.forEach(dailyPlan => {
        dailyPlan.tasks.forEach(task => {
            totalMinutes += parseDuration(task.duration);
            switch(task.activity) {
                case 'Study': studyTasks++; break;
                case 'Revise': revisionTasks++; break;
                case 'Practice': practiceTasks++; break;
                case 'Test': testTasks++; break;
            }
        });
    });

    setPlanStats({
        totalHours: (totalMinutes / 60).toFixed(1),
        totalTasks: studyPlan.plan.flatMap(p => p.tasks).length,
        studyTasks,
        revisionTasks,
        practiceTasks,
        testTasks
    });

  }, [studyPlan]);


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

  return (
    <>
      <header className="flex h-14 items-center gap-4 border-b bg-card px-4 md:px-6">
        <Icons.ListTodo className="h-6 w-6" />
        <h2 className="text-lg font-semibold">Strategic Study Planner</h2>
      </header>
      <ScrollArea className="h-[calc(100vh-3.5rem)]">
        <main className="flex-1 space-y-8 p-4 md:p-6 lg:p-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Create Your Plan</CardTitle>
                  <CardDescription>Tell the AI your goals, and it will generate a personalized schedule based on your topic mastery.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="focusAreas"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Focus Areas</FormLabel>
                             <MultiSelect
                                options={focusAreaOptions}
                                selected={field.value}
                                onChange={field.onChange}
                                placeholder="Select focus areas..."
                             />
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="timeframe"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Timeframe</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select duration" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="1 Week">1 Week</SelectItem>
                                  <SelectItem value="2 Weeks">2 Weeks</SelectItem>
                                  <SelectItem value="1 Month">1 Month</SelectItem>
                                  <SelectItem value="3 Months">3 Months</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="hoursPerWeek"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Hours/Week</FormLabel>
                              <Input {...field} type="number" placeholder="e.g., 25" />
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <BrainCircuit className="mr-2 h-4 w-4 animate-spin" />
                                Generating...
                            </>
                        ) : 'Generate Study Plan'}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2">
              <div className="space-y-6">
                {!studyPlan && !isLoading && (
                  <div className="flex h-full min-h-[400px] flex-col items-center justify-center rounded-lg border-2 border-dashed bg-card p-12 text-center">
                    <Icons.ListTodo className="h-16 w-16 text-muted-foreground/30 mb-4" />
                    <h3 className="text-2xl font-semibold tracking-tight">Your AI-Powered Plan Awaits</h3>
                    <p className="mt-2 max-w-md text-muted-foreground">
                      Fill out the form on the left to generate a dynamic study schedule tailored to your needs and mastery levels.
                    </p>
                  </div>
                )}
                
                {isLoading && (
                    <div className="space-y-4">
                        <Skeleton className="h-8 w-1/2" />
                        <Skeleton className="h-4 w-3/4" />
                        <div className="mt-6 space-y-6">
                            {[...Array(3)].map((_, i) => (
                                <Card key={i}>
                                    <CardHeader>
                                        <Skeleton className="h-6 w-1/4" />
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <Skeleton className="h-10 w-full" />
                                        <Skeleton className="h-10 w-full" />
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

                {studyPlan && (
                  <div className="space-y-6">
                    <Alert className="border-primary/20 bg-primary/5">
                      <BrainCircuit className="h-4 w-4 text-primary" />
                      <AlertTitle className="font-semibold text-primary">AI Plan Summary</AlertTitle>
                      <AlertDescription className="text-foreground/90">{studyPlan.summary}</AlertDescription>
                    </Alert>

                     {planStats && (
                        <div>
                             <h3 className="text-lg font-semibold mb-4">Plan Analytics</h3>
                             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                 <StatCard Icon={Clock} title="Total Hours" value={planStats.totalHours} description="Total planned study time"/>
                                 <StatCard Icon={ListChecks} title="Total Tasks" value={planStats.totalTasks} description="Total number of activities"/>
                                 <StatCard Icon={BookOpen} title="Study Tasks" value={planStats.studyTasks} description={`Study: ${planStats.studyTasks} | Revise: ${planStats.revisionTasks}`}/>
                                 <StatCard Icon={Pencil} title="Practice Tasks" value={planStats.practiceTasks} description={`Practice: ${planStats.practiceTasks} | Test: ${planStats.testTasks}`}/>
                             </div>
                        </div>
                     )}


                    {studyPlan.plan.map((dailyPlan, index) => (
                      <Card key={index}>
                        <CardHeader>
                          <CardTitle>{dailyPlan.day}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {dailyPlan.tasks.map((task, taskIndex) => {
                             const Icon = activityIcons[task.activity] || BookOpen;
                             return (
                                <div key={taskIndex} className="flex items-start gap-4 rounded-md border p-3">
                                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted mt-1">
                                    <Icon className="h-4 w-4 text-muted-foreground" />
                                  </div>
                                  <div className="flex-1">
                                    <p className="font-semibold">{task.topic}</p>
                                    <p className="text-sm text-muted-foreground">
                                        <span className="font-medium text-foreground">{task.activity}</span> &middot; {task.duration}
                                    </p>
                                    <p className="text-xs text-muted-foreground italic mt-1">"{task.suggestion}"</p>
                                  </div>
                                </div>
                             )
                          })}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </ScrollArea>
    </>
  );
}
