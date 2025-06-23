import { NextRequest } from 'next/server';
import { z } from 'zod';
import { generateStudyPlanChunkPrompt } from '@/ai/flows/study-plan/prompts';
import { GenerateStudyPlanInputSchema, DailyPlanSchema } from '@/ai/flows/study-plan/schemas';
import { getTimeframeInDays } from '@/ai/flows/study-plan/utils';

const PlannerRequestSchema = GenerateStudyPlanInputSchema;

// This function now handles GET requests for EventSource
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const inputData = {
    focusAreas: searchParams.get('focusAreas') || '',
    timeframe: searchParams.get('timeframe') || 'This Week',
    hoursPerWeek: Number(searchParams.get('hoursPerWeek')) || 20,
    syllabusContext: searchParams.get('syllabusContext') || '',
  };

  const validation = PlannerRequestSchema.safeParse(inputData);

  if (!validation.success) {
    return new Response(JSON.stringify(validation.error.format()), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const input = validation.data;

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      const pushEvent = (data: object) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      const closeStream = () => {
         controller.enqueue(encoder.encode('event: close\ndata: Connection closed\n\n'));
         controller.close();
      }

      const totalDays = getTimeframeInDays(input.timeframe);
      const chunkSize = 7;
      let planGeneratedSoFarSummary = 'This is the beginning of the plan. Start with the highest priority focus areas.';
      let allDailyPlans: z.infer<typeof DailyPlanSchema>[] = [];

      for (let startDay = 1; startDay <= totalDays; startDay += chunkSize) {
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
          console.error(`Failed to generate a plan chunk starting from day ${startDay}. Stopping generation.`, e);
          pushEvent({ type: 'error', payload: 'An error occurred while generating a part of the plan.' });
          closeStream();
          return;
        }
      }

      const summary = `A comprehensive, ${allDailyPlans.length}-day plan has been generated based on your request for a ${input.timeframe} timeframe.`;
      pushEvent({ type: 'summary', payload: summary });
      closeStream();
    },
    cancel() {
        console.log("Stream canceled by client.");
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Connection': 'keep-alive',
      'Cache-Control': 'no-cache, no-transform',
    },
  });
}
