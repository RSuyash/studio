'use server';
/**
 * @fileOverview The core Genkit flow for creating a study plan.
 * This flow is designed to handle very long-term plans by generating them in weekly chunks
 * to avoid timeouts, and then stitching them together into a single comprehensive plan.
 */
import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { GenerateStudyPlanInputSchema, GenerateStudyPlanOutputSchema, DailyPlanSchema } from './schemas';
import { generateStudyPlanChunkPrompt } from './prompts';
import { getTimeframeInDays } from './utils';

export const createStudyPlanFlow = ai.defineFlow(
  {
    name: 'createStudyPlanFlow',
    inputSchema: GenerateStudyPlanInputSchema,
    outputSchema: GenerateStudyPlanOutputSchema,
  },
  async (input) => {
    const totalDays = getTimeframeInDays(input.timeframe);
    // Generate in weekly chunks to avoid model timeout or context limits
    const chunkSize = 7;
    let allDailyPlans: z.infer<typeof DailyPlanSchema>[] = [];
    let planGeneratedSoFarSummary = "This is the beginning of the plan. Start with the highest priority focus areas.";

    for (let startDay = 1; startDay <= totalDays; startDay += chunkSize) {
        const daysToGenerate = Math.min(chunkSize, totalDays - startDay + 1);

        console.log(`Generating plan chunk for days ${startDay} to ${startDay + daysToGenerate - 1}...`);

        const { output } = await generateStudyPlanChunkPrompt({
            ...input,
            daysToGenerate,
            startDay,
            planGeneratedSoFarSummary,
        });

        if (output?.chunk && output.chunk.length > 0) {
            allDailyPlans.push(...output.chunk);

            // Create a summary of the generated chunk to inform the next iteration.
            const lastDayPlan = output.chunk[output.chunk.length - 1];
            const topicsCovered = lastDayPlan.tasks.map(t => t.topic).slice(0, 3).join(', ');
            planGeneratedSoFarSummary = `The plan up to Day ${lastDayPlan.day.split(' ')[1]} is complete. The last few days focused on: ${topicsCovered}. Now continue the plan, moving on to other topics from the focus areas or syllabus.`;
        } else {
            console.error(`Failed to generate a valid chunk starting from day ${startDay}. Stopping generation.`);
            // If one chunk fails, we stop to avoid an incomplete plan and return what we have.
            break;
        }
    }

    const finalPlan: z.infer<typeof GenerateStudyPlanOutputSchema> = {
      plan: allDailyPlans,
      summary: `A comprehensive, ${allDailyPlans.length}-day plan has been generated based on your request for a ${input.timeframe} timeframe.`,
    };

    return finalPlan;
  }
);
