'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import type { z } from 'zod';
import type { DailyPlanSchema } from '@/ai/flows/study-plan/schemas';
import { useToast } from './use-toast';

interface GenerateStudyPlanOutput {
  plan: z.infer<typeof DailyPlanSchema>[];
  summary: string;
}

type PlannerInput = {
  focusAreas: string;
  timeframe: string;
  hoursPerWeek: number;
  syllabusContext: string;
};

export const useStudyPlanStream = () => {
  const [studyPlan, setStudyPlan] = useState<GenerateStudyPlanOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const eventSourceRef = useRef<EventSource | null>(null);

  const generatePlan = useCallback((values: PlannerInput) => {
    if (isLoading) return;
    
    setStudyPlan(null);
    setIsLoading(true);
    setError(null);

    if (eventSourceRef.current) {
        eventSourceRef.current.close();
    }
    
    const queryParams = new URLSearchParams({
        focusAreas: values.focusAreas,
        timeframe: values.timeframe,
        hoursPerWeek: values.hoursPerWeek.toString(),
        syllabusContext: values.syllabusContext,
    });

    const eventSource = new EventSource(`/api/generate-plan?${queryParams.toString()}`);
    eventSourceRef.current = eventSource;

    eventSource.onopen = () => {
      console.log('Connection to SSE opened.');
    };

    eventSource.onmessage = (event) => {
        try {
            const parsed = JSON.parse(event.data);

            if (parsed.type === 'day') {
                setStudyPlan(prevPlan => ({
                    plan: [...(prevPlan?.plan || []), parsed.payload],
                    summary: prevPlan?.summary || 'Generating plan, please wait...'
                }));
            } else if (parsed.type === 'summary') {
                 setStudyPlan(prevPlan => ({
                    plan: prevPlan?.plan || [],
                    summary: parsed.payload
                }));
            } else if (parsed.type === 'error') {
                throw new Error(parsed.payload);
            }
        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
            console.error("Failed to parse SSE message:", e);
            setError(errorMessage);
            toast({ variant: 'destructive', title: 'Error Processing Plan', description: errorMessage });
            eventSource.close();
        }
    };

    eventSource.onerror = (err) => {
        console.error('EventSource failed:', err);
        setError('A connection error occurred. Please try again.');
        toast({
            variant: 'destructive',
            title: 'Connection Error',
            description: 'Failed to generate study plan. Please check your connection and try again.'
        });
        setIsLoading(false);
        eventSource.close();
    };

    eventSource.addEventListener('close', () => {
        console.log('SSE connection closed by server.');
        setIsLoading(false);
        eventSource.close();
        eventSourceRef.current = null;
    });

  }, [toast, isLoading]);

  useEffect(() => {
      // Cleanup function to close connection on component unmount
      return () => {
          if(eventSourceRef.current) {
              eventSourceRef.current.close();
          }
      }
  }, []);

  return { studyPlan, isLoading, error, generatePlan };
};
