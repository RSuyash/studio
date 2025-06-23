import { NextRequest } from 'next/server';
import { z } from 'zod';
import { generateMetaPlanPrompt, generateStudyPlanChunkPrompt } from '@/ai/flows/study-plan/prompts';
import { GenerateStudyPlanInputSchema, DailyPlanSchema, MetaPlanSchema } from '@/ai/flows/study-plan/schemas';
import { getTimeframeInDays } from '@/ai/flows/study-plan/utils';

const PlannerRequestSchema = GenerateStudyPlanInputSchema;
const LONG_PLAN_THRESHOLD_DAYS = 14;

// This function now handles POST requests for EventSource-like streaming
export async function POST(req: NextRequest) {
  let inputData;
  try {
      inputData = await req.json();
  } catch (error) {
      return new Response(JSON.stringify({ error: "Invalid JSON in request body" }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
  }

  const validation = PlannerRequestSchema.safeParse(inputData);

  if (!validation.success) {
    return new Response(JSON.stringify(validation.error.format()), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const input = validation.data;
  const signal = req.signal;

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      const pushEvent = (data: object) => {
        if (controller.desiredSize === null || controller.desiredSize <= 0) {
            return;
        }
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      const closeStream = () => {
         try {
             controller.enqueue(encoder.encode('event: close\ndata: Connection closed\n\n'));
             controller.close();
         } catch (e) {
            // Ignore errors if the stream is already closed
         }
      }

      // Listen for client disconnect
      signal.addEventListener('abort', () => {
        console.log("Client aborted the request.");
        closeStream();
      });

      try {
        const totalDays = getTimeframeInDays(input.timeframe);
        let allDailyPlans: z.infer<typeof DailyPlanSchema>[] = [];
        
        // Short Plan Logic: Generate in a single chunk
        if (totalDays <= LONG_PLAN_THRESHOLD_DAYS) {
            const { output } = await generateStudyPlanChunkPrompt({
                ...input,
                daysToGenerate: totalDays,
                startDay: 1,
                weeklyFocus: `A focused, ${totalDays}-day plan based on these priorities: ${input.focusAreas}`,
            });

            if (output?.chunk) {
                for (const dailyPlan of output.chunk) {
                    if (signal.aborted) break;
                    allDailyPlans.push(dailyPlan);
                    pushEvent({ type: 'day', payload: dailyPlan });
                    await new Promise(resolve => setTimeout(resolve, 50));
                }
            }
        } else {
            // Long Plan Logic: Use Meta-Plan and Parallel Chunking
            const totalWeeks = Math.ceil(totalDays / 7);

            // 1. Generate the high-level Meta Plan
            const metaPlanResponse = await generateMetaPlanPrompt({
                ...input,
                totalWeeks,
            });

            const weeklyFocuses = metaPlanResponse.output?.weeklyPlan;
            if (!weeklyFocuses || weeklyFocuses.length === 0) {
                throw new Error("The AI failed to generate a high-level weekly plan.");
            }
            
            pushEvent({ type: 'meta', payload: metaPlanResponse.output });

            // 2. Fire off all chunk generation requests in parallel
            const chunkPromises = weeklyFocuses.map((weekFocus, index) => {
                const startDay = index * 7 + 1;
                const daysInThisChunk = Math.min(7, totalDays - startDay + 1);
                if (daysInThisChunk <= 0) return Promise.resolve(null);

                return generateStudyPlanChunkPrompt({
                    ...input,
                    daysToGenerate: daysInThisChunk,
                    startDay,
                    weeklyFocus: weekFocus.focus,
                });
            });

            // 3. Await each promise in sequence and stream its results
            for (const chunkPromise of chunkPromises) {
                if (signal.aborted) break;
                
                const chunkResult = await chunkPromise;
                if (chunkResult?.output?.chunk) {
                    for (const dailyPlan of chunkResult.output.chunk) {
                        if (signal.aborted) break;
                        allDailyPlans.push(dailyPlan);
                        pushEvent({ type: 'day', payload: dailyPlan });
                        await new Promise(resolve => setTimeout(resolve, 50));
                    }
                }
            }
        }

        if (!signal.aborted) {
          const summary = `A comprehensive, ${allDailyPlans.length}-day plan has been generated based on your request for a ${input.timeframe} timeframe.`;
          pushEvent({ type: 'summary', payload: summary });
        }
      
      } catch (e) {
          if (signal.aborted) {
            console.log("Stream generation aborted by client.");
          } else {
            console.error(`Failed to generate the plan.`, e);
            pushEvent({ type: 'error', payload: 'An error occurred while generating the plan.' });
          }
      } finally {
        closeStream();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Connection': 'keep-alive',
      'Cache-Control': 'no-cache, no-transform',
    },
  });
}
