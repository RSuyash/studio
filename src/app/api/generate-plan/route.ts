'use server';

import {NextRequest} from 'next/server';
import {z} from 'zod';
import {generateStudyPlanChunkPrompt} from '@/ai/flows/study-plan/prompts';
import {GenerateStudyPlanInputSchema, DailyPlanSchema} from '@/ai/flows/study-plan/schemas';
import {getTimeframeInDays} from '@/ai/flows/study-plan/utils';

const PlannerRequestSchema = GenerateStudyPlanInputSchema;

/**
 * API route to generate a study plan using a streaming approach.
 * It generates the plan in weekly chunks and streams them back to the client.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = PlannerRequestSchema.safeParse(body);

    if (!validation.success) {
      return new Response(JSON.stringify(validation.error.format()), {
        status: 400,
        headers: {'Content-Type': 'application/json'},
      });
    }

    const input = validation.data;

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        const push = (data: object) => {
          controller.enqueue(encoder.encode(JSON.stringify(data) + '\n'));
        };

        const totalDays = getTimeframeInDays(input.timeframe);
        const chunkSize = 7;
        let planGeneratedSoFarSummary = 'This is the beginning of the plan. Start with the highest priority focus areas.';
        let allDailyPlans: z.infer<typeof DailyPlanSchema>[] = [];

        for (let startDay = 1; startDay <= totalDays; startDay += chunkSize) {
          const daysToGenerate = Math.min(chunkSize, totalDays - startDay + 1);

          try {
            const {output} = await generateStudyPlanChunkPrompt({
              ...input,
              daysToGenerate,
              startDay,
              planGeneratedSoFarSummary,
            });

            if (output?.chunk && output.chunk.length > 0) {
              allDailyPlans.push(...output.chunk);
              push({type: 'chunk', payload: output.chunk});

              // Create a summary of the generated chunk to inform the next iteration.
              const lastDayPlan = output.chunk[output.chunk.length - 1];
              const topicsCovered = lastDayPlan.tasks
                .map(t => t.topic)
                .slice(0, 3)
                .join(', ');
              planGeneratedSoFarSummary = `The plan up to Day ${lastDayPlan.day.split(' ')[1]} is complete. The last few days focused on: ${topicsCovered}. Now continue the plan, moving on to other topics from the focus areas or syllabus.`;
            } else {
              console.warn(`Generated empty chunk starting from day ${startDay}.`);
              // If one chunk is empty, we can try to continue, but it might indicate a problem.
            }
          } catch (e) {
             console.error(`Failed to generate a plan chunk starting from day ${startDay}. Stopping generation.`, e);
             push({type: 'error', payload: 'An error occurred while generating a part of the plan.'});
             break;
          }
        }
        
        const summary = `A comprehensive, ${allDailyPlans.length}-day plan has been generated based on your request for a ${input.timeframe} timeframe.`;
        push({type: 'summary', payload: summary});
        
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {'Content-Type': 'application/json; charset=utf-8'},
    });

  } catch (error) {
    console.error('Error in generate-plan route:', error);
    return new Response(JSON.stringify({error: 'An internal server error occurred.'}), {
        status: 500,
        headers: {'Content-Type': 'application/json'},
    });
  }
}
