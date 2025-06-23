'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import type { z } from 'zod';
import type { DailyPlanSchema } from '@/ai/flows/study-plan/schemas';
import type { StudyPlanInput, StudyPlanData } from '@/lib/types';
import { useToast } from './use-toast';


type PlannerInputWithContext = StudyPlanInput & { syllabusContext: string };

export const useStudyPlanStream = () => {
  const [studyPlan, setStudyPlan] = useState<StudyPlanData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentInputs, setCurrentInputs] = useState<StudyPlanInput | null>(null);

  const { toast } = useToast();
  const abortControllerRef = useRef<AbortController | null>(null);

  const generatePlan = useCallback(async (values: PlannerInputWithContext) => {
    if (isLoading) return;
    
    setCurrentInputs({ 
      focusAreas: values.focusAreas,
      timeframe: values.timeframe,
      hoursPerWeek: values.hoursPerWeek
    });
    setStudyPlan(null);
    setIsLoading(true);
    setError(null);

    if (abortControllerRef.current) {
        abortControllerRef.current.abort();
    }
    
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
        const response = await fetch('/api/generate-plan', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(values),
            signal: controller.signal,
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || `Request failed with status ${response.status}`);
        }
        
        if (!response.body) {
            throw new Error('Response body is empty.');
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            
            const parts = buffer.split('\n\n');
            buffer = parts.pop() || '';

            for (const part of parts) {
                if (part.startsWith('data: ')) {
                    const dataString = part.substring(6);
                    try {
                        const parsed = JSON.parse(dataString);
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
                         controller.abort();
                         break;
                    }
                } else if (part.startsWith('event: close')) {
                    setIsLoading(false);
                    abortControllerRef.current = null;
                    return;
                }
            }
        }
        setIsLoading(false);

    } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
             console.log('Stream generation aborted by client.');
             setIsLoading(false);
             return;
        }

        console.error('Study plan generation failed:', err);
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
        setError(errorMessage);
        toast({
            variant: 'destructive',
            title: 'Generation Failed',
            description: errorMessage
        });
        setIsLoading(false);
    } finally {
        if (abortControllerRef.current === controller) {
           abortControllerRef.current = null;
        }
    }
  }, [toast, isLoading]);

  useEffect(() => {
      return () => {
          if(abortControllerRef.current) {
              abortControllerRef.current.abort();
          }
      }
  }, []);

  return { studyPlan, isLoading, error, generatePlan, currentInputs };
};
