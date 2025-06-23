import { NextRequest } from 'next/server';
import { z } from 'zod';
import { generateStudyPlanChunkPrompt } from '@/ai/flows/study-plan/prompts';
import { GenerateStudyPlanInputSchema, DailyPlanSchema } from '@/ai/flows/study-plan/schemas';
import { getTimeframeInDays } from '@/ai/flows/study-plan/utils';

const PlannerRequestSchema = GenerateStudyPlanInputSchema;

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

      const totalDays = getTimeframeInDays(input.timeframe);
      const chunkSize = 7;
      let planGeneratedSoFarSummary = 'This is the beginning of the plan. Start with the highest priority focus areas.';
      let allDailyPlans: z.infer<typeof DailyPlanSchema>[] = [];

      for (let startDay = 1; startDay <= totalDays; startDay += chunkSize) {
        if (signal.aborted) break;

        const daysToGenerate = Math.min(chunkSize, totalDays - startDay + 1);

        try {
          const { output } = await generateStudyPlanChunkPrompt({
            ...input,
            daysToGenerate,
            startDay,
            planGeneratedSoFarSummary,
          });

          if (output?.chunk && output.chunk.length > 0) {
            for (const dailyPlan of output.chunk) {
              if (signal.aborted) break;
              allDailyPlans.push(dailyPlan);
              pushEvent({ type: 'day', payload: dailyPlan });
              await new Promise(resolve => setTimeout(resolve, 50)); 
            }

            const lastDayPlan = output.chunk[output.chunk.length - 1];
            const topicsCovered = lastDayPlan.tasks.map(t => t.topic).slice(0, 3).join(', ');
            planGeneratedSoFarSummary = `The plan up to Day ${lastDayPlan.day.split(' ')[1]} is complete. The last few days focused on: ${topicsCovered}. Now continue the plan.`;
          } else {
             console.warn(`Generated empty chunk starting from day ${startDay}.`);
          }
        } catch (e) {
          if (signal.aborted) {
            console.log("Stream generation aborted during AI call.");
            break;
          }
          console.error(`Failed to generate a plan chunk starting from day ${startDay}. Stopping generation.`, e);
          pushEvent({ type: 'error', payload: 'An error occurred while generating a part of the plan.' });
          closeStream();
          return;
        }
      }

      if (!signal.aborted) {
        const summary = `A comprehensive, ${allDailyPlans.length}-day plan has been generated based on your request for a ${input.timeframe} timeframe.`;
        pushEvent({ type: 'summary', payload: summary });
      }
      
      closeStream();
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