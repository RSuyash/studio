
'use client';

import * as React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { BrainCircuit, Lightbulb } from 'lucide-react';

const plannerFormSchema = z.object({
  exam: z.enum(['upsc', 'mpsc', 'ifos', 'combined'], { required_error: 'Please select an exam focus.'}),
  focusAreas: z.string().min(10, 'Please describe your focus areas, e.g., "UPSC GS Paper II and Ethics"'),
  timeframe: z.string({ required_error: 'Please select a timeframe.' }),
  hoursPerWeek: z.number().min(1, 'Please enter at least 1 hour.').max(100, 'Please enter a realistic number of hours.'),
});

type PlannerFormValues = z.infer<typeof plannerFormSchema>;

interface PlannerFormProps {
  isLoading: boolean;
  onSubmit: (values: PlannerFormValues) => void;
}

const suggestedPriorities = [
    { icon: Lightbulb, text: "**Focus on Polity:** Your test accuracy is low (45%)." },
    { icon: Lightbulb, text: "**Revise Environment:** You haven't reviewed 'Biodiversity' in 3 weeks." },
];

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

export default function PlannerForm({ isLoading, onSubmit }: PlannerFormProps) {
  const form = useForm<PlannerFormValues>({
    resolver: zodResolver(plannerFormSchema),
    defaultValues: {
      exam: 'upsc',
      focusAreas: 'UPSC GS Paper II (Polity & Governance) and GS Paper IV (Ethics), with some time for revision of Modern History.',
      timeframe: 'This Week',
      hoursPerWeek: 25,
    },
  });

  return (
    <div className="flex flex-col border-r bg-muted/40 p-4 lg:p-6">
      <ScrollArea className="flex-1 pr-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="exam"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Primary Exam Focus</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="upsc">UPSC CSE</SelectItem>
                      <SelectItem value="mpsc">MPSC Rajyaseva</SelectItem>
                      <SelectItem value="ifos">IFoS</SelectItem>
                      <SelectItem value="combined">Combined (Cross-Syllabus)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                    <FormMessage />
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
  );
}
