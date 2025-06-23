
'use client';

import * as React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Icons } from '../icons';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import type { SyllabusTopic } from '@/lib/types';
import { generateStudyPlan, type GenerateStudyPlanOutput } from '@/ai/flows/study-plan';
import { serializeSyllabusWithMastery } from '@/lib/resource-utils';
import { BrainCircuit, BookOpen, Repeat, Pencil, Clock, ListChecks, ArrowRight, Lightbulb, CalendarDays, BarChart, FileText, Activity } from 'lucide-react';
import type { View, SyllabusType } from '../main-layout';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { findTopicById } from '@/lib/resource-utils';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '@/components/ui/badge';


const plannerFormSchema = z.object({
  focusAreas: z.string().min(10, 'Please describe your focus areas, e.g., "UPSC GS Paper II and Ethics"'),
  timeframe: z.string({ required_error: 'Please select a timeframe.' }),
  hoursPerWeek: z.number().min(1, 'Please enter at least 1 hour.').max(100, 'Please enter a realistic number of hours.'),
});

type PlannerFormValues = z.infer<typeof plannerFormSchema>;

type ActivityType = 'Study' | 'Revise' | 'Practice' | 'Test' | 'Weekly Revision' | 'Analyze Test';

const activityInfo: Record<ActivityType, { icon: React.ElementType, color: string }> = {
    Study: { icon: BookOpen, color: 'border-blue-500' },
    Revise: { icon: Repeat, color: 'border-green-500' },
    'Weekly Revision': { icon: CalendarDays, color: 'border-green-500' },
    Test: { icon: ListChecks, color: 'border-pink-500' },
    'Analyze Test': { icon: BrainCircuit, color: 'border-pink-500' },
    Practice: { icon: Pencil, color: 'border-yellow-500' },
};


const suggestedPriorities = [
    { icon: Lightbulb, text: "**Focus on Polity:** Your test accuracy is low (45%)." },
    { icon: Lightbulb, text: "**Revise Environment:** You haven't reviewed 'Biodiversity' in 3 weeks." },
];

const parseDurationToHours = (durationStr: string): number => {
    if (!durationStr) return 0;
    const lowerCaseStr = durationStr.toLowerCase();
    
    let hours = 0;
    const hoursMatch = lowerCaseStr.match(/([\d.]+)\s*h/);
    if (hoursMatch) hours = parseFloat(hoursMatch[1]);
    
    const minutesMatch = lowerCaseStr.match(/([\d.]+)\s*m/);
    if (minutesMatch) hours += parseFloat(minutesMatch[1]) / 60;
    
    if (!hoursMatch && !minutesMatch && !lowerCaseStr.includes('rest')) {
      const numberMatch = lowerCaseStr.match(/[\d.]+/);
      if (numberMatch) hours = parseFloat(numberMatch[0]);
    }
    
    return hours;
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
    
    const total = Math.round(study + revise + test);
    study = Math.round(study);
    revise = Math.round(revise);
    test = Math.round(test);

    return { total, study, revise, test };
  }, [studyPlan]);

  const handleTaskClick = (topicId: string) => {
    let syllabusType: SyllabusType = 'upsc';
    if (findTopicById(allSyllabusData.mpsc, topicId)) syllabusType = 'mpsc';
    else if (findTopicById(allSyllabusData.ifos, topicId)) syllabusType = 'ifos';
    
    setActiveView('syllabus', syllabusType, topicId);
  };
  
  const planDurationOptions = [
      'For Today', 
      'For Tomorrow',
      'This Week', 
      'Next 2 Weeks', 
      'Next Month', 
      'Next 3 Months', 
      'Next 6 Months', 
      'Next Year'
  ];

  return (
    <div className="flex h-screen flex-col bg-background">
      <header className="flex h-14 shrink-0 items-center gap-4 border-b bg-card px-4 md:px-6">
          <Icons.ListTodo className="h-6 w-6" />
          <h2 className="text-lg font-semibold">Strategic Study Planner</h2>
      </header>

      <div className="grid min-h-0 flex-1 md:grid-cols-[400px_1fr]">
          <div className="flex flex-col border-r bg-muted/40 p-4 lg:p-6">
              <ScrollArea className="flex-1 pr-4">
                  <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                           <FormField
                              control={form.control}
                              name="focusAreas"
                              render={({ field }) => (
                                  <FormItem>
                                      <FormLabel className="font-semibold">What are your focus areas?</FormLabel>
                                      <FormControl>
                                          <Textarea
                                              placeholder="e.g., plan for MPSC GS Paper IV and revise UPSC Modern History"
                                              className="resize-none bg-background"
                                              rows={4}
                                              {...field}
                                          />
                                      </FormControl>
                                      <FormMessage />
                                  </FormItem>
                              )}
                          />

                          <div className="space-y-6">
                              <h3 className="text-base font-semibold text-foreground">Set Your Time Commitment</h3>
                              <FormField
                                  control={form.control}
                                  name="timeframe"
                                  render={({ field }) => (
                                      <FormItem>
                                          <FormLabel>Plan Duration</FormLabel>
                                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                                              <FormControl>
                                                  <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
                                              </FormControl>
                                              <SelectContent>
                                                  {planDurationOptions.map(opt => (
                                                    <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                                                  ))}
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
                              <h3 className="text-base font-semibold text-foreground">AI-Suggested Priorities</h3>
                              <div className="space-y-2">
                              {suggestedPriorities.map((priority, i) => (
                                  <Alert key={i} className="bg-primary/5 border-primary/10">
                                      <Lightbulb className="h-4 w-4 text-primary" />
                                      <AlertDescription className="text-sm text-foreground/80">
                                          {priority.text.split('**').map((part, index) => 
                                              index % 2 === 1 ? <strong key={index} className="font-semibold text-foreground">{part}</strong> : part
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
                                      Generating Plan...
                                  </>
                              ) : 'Generate My Plan'}
                          </Button>
                      </form>
                  </Form>
              </ScrollArea>
          </div>

          <main className="flex-1 overflow-hidden">
              <ScrollArea className="h-full">
                  <div className="p-4 md:p-6 lg:p-8">
                      {!studyPlan && !isLoading && (
                          <div className="flex h-full min-h-[70vh] flex-col items-center justify-center rounded-lg border-2 border-dashed bg-card/50 p-12 text-center">
                              <Icons.ListTodo className="h-16 w-16 text-muted-foreground/30 mb-4" />
                              <h3 className="text-2xl font-semibold tracking-tight">Your AI-Powered Plan Awaits</h3>
                              <p className="mt-2 max-w-md text-muted-foreground">
                                Use the controls on the left to generate a dynamic study schedule tailored to your mastery levels and priorities.
                              </p>
                          </div>
                      )}
                      
                      {isLoading && (
                           <div className="space-y-6">
                               <Skeleton className="h-24 w-full" />
                               <div className="grid grid-cols-1 gap-4">
                                  {[...Array(7)].map((_, i) => (
                                      <div key={i} className="space-y-4 rounded-lg border p-4">
                                          <Skeleton className="h-6 w-1/4" />
                                          <Skeleton className="h-16 w-full" />
                                          <Skeleton className="h-16 w-full" />
                                      </div>
                                  ))}
                               </div>
                           </div>
                      )}

                      {studyPlan && (
                          <div className="space-y-8">
                              <div>
                                  <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                                      <Card>
                                          <CardContent className="flex flex-col items-center p-4">
                                              <Clock className="h-6 w-6 text-primary mb-2" />
                                              <p className="text-2xl font-bold">{planHours.total}h</p>
                                              <p className="text-sm text-muted-foreground">Total Hours</p>
                                          </CardContent>
                                      </Card>
                                      <Card>
                                          <CardContent className="flex flex-col items-center p-4">
                                              <BookOpen className="h-6 w-6 text-blue-500 mb-2" />
                                              <p className="text-2xl font-bold">{planHours.study}h</p>
                                              <p className="text-sm text-muted-foreground">Study Time</p>
                                          </CardContent>
                                      </Card>
                                      <Card>
                                          <CardContent className="flex flex-col items-center p-4">
                                              <Repeat className="h-6 w-6 text-green-500 mb-2" />
                                              <p className="text-2xl font-bold">{planHours.revise}h</p>
                                              <p className="text-sm text-muted-foreground">Revision Time</p>
                                          </CardContent>
                                      </Card>
                                       <Card>
                                          <CardContent className="flex flex-col items-center p-4">
                                              <ListChecks className="h-6 w-6 text-pink-500 mb-2" />
                                              <p className="text-2xl font-bold">{planHours.test}h</p>
                                              <p className="text-sm text-muted-foreground">Test/Practice</p>
                                          </CardContent>
                                      </Card>
                                  </div>
                              </div>

                              <div>
                                  <h2 className="text-2xl font-bold mb-4 font-headline tracking-tight">Your Generated Weekly Plan</h2>
                                  <div className="space-y-6">
                                      {studyPlan.plan.map((dailyPlan, index) => (
                                          <Card key={index}>
                                              <CardHeader>
                                                  <CardTitle className="text-xl font-headline">{dailyPlan.day}</CardTitle>
                                              </CardHeader>
                                              <CardContent className="space-y-3">
                                                  {dailyPlan.tasks.length > 0 ? dailyPlan.tasks.map((task, taskIndex) => {
                                                      const { icon: Icon, color: colorClass } = activityInfo[task.activity as ActivityType] || { icon: Activity, color: 'border-gray-400' };
                                                      return (
                                                          <button 
                                                              key={taskIndex} 
                                                              onClick={() => handleTaskClick(task.topicId)} 
                                                              className={cn("w-full cursor-pointer p-3 text-left text-sm border-l-4 rounded-r-lg bg-card shadow-sm transition-all hover:shadow-md hover:bg-muted", colorClass)}
                                                          >
                                                              <div className="flex items-center justify-between">
                                                                  <div className="flex items-center gap-4">
                                                                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
                                                                          <Icon className="h-5 w-5 text-muted-foreground" />
                                                                      </div>
                                                                      <div>
                                                                          <p className="font-semibold text-foreground">{task.topic}</p>
                                                                          <p className="text-muted-foreground text-xs">{task.suggestion.split(" ")[0]} • {task.duration}</p>
                                                                      </div>
                                                                  </div>
                                                                  <Badge variant="secondary">{task.activity}</Badge>
                                                              </div>
                                                          </button>
                                                      )
                                                  }) : (
                                                      <div className="flex items-center justify-center text-sm text-muted-foreground py-8 rounded bg-muted/50">
                                                          Rest Day
                                                      </div>
                                                  )}
                                              </CardContent>
                                          </Card>
                                      ))}
                                  </div>
                                  <p className="text-sm text-muted-foreground mt-6 text-center">{studyPlan.summary}</p>
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
