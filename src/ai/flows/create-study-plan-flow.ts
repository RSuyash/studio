
'use server';
/**
 * @fileOverview An AI flow to create a detailed, scheduled study plan.
 * This flow is designed to handle very long-term plans by generating them in weekly chunks
 * to avoid timeouts, and then stitching them together into a single comprehensive plan.
 *
 * - generateStudyPlan - A function that generates an actionable, scheduled study plan.
 * - GenerateStudyPlanInput - The input type for the generateStudyPlan function.
 * - GenerateStudyPlanOutput - The return type for the generateStudyPlan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateStudyPlanInputSchema = z.object({
  focusAreas: z.string().describe('A comma-separated string of the main syllabus subjects or topics the user wants to focus on.'),
  timeframe: z.string().describe('The total duration for the study plan (e.g., "This Week", "Next Month", "For Today").'),
  hoursPerWeek: z.number().describe('The total number of hours the user can study per week.'),
  syllabusContext: z.string().describe('A text representation of the entire syllabus tree, including user-defined mastery levels for each topic (e.g., "[id] [Mastery: novice] Title").'),
});
export type GenerateStudyPlanInput = z.infer<typeof GenerateStudyPlanInputSchema>;

const DailyTaskSchema = z.object({
  topicId: z.string().describe('The unique ID of the syllabus topic this task refers to. This ID must come from the provided syllabus context.'),
  duration: z.string().describe('Suggested time allocation for the task (e.g., "2h", "45m", "10 hours this week").'),
  topic: z.string().describe('The specific syllabus topic or concept to study.'),
  activity: z.enum(['Study', 'Revise', 'Practice', 'Test', 'Weekly Revision', 'Analyze Test']).describe('The type of activity to perform.'),
  suggestion: z.string().describe("A brief, actionable suggestion for the activity, e.g., 'GS-II Notes' or 'Focus on PYQs'. Include the GS Paper number if applicable."),
});

const DailyPlanSchema = z.object({
    day: z.string().describe('The day for this part of the plan, formatted as "Day X" where X is the absolute day number (e.g., "Day 1", "Day 8").'),
    tasks: z.array(DailyTaskSchema).describe('A list of tasks scheduled for that day.'),
});

const GenerateStudyPlanOutputSchema = z.object({
  plan: z.array(DailyPlanSchema).describe('A breakdown of the study plan, corresponding to the requested timeframe.'),
  summary: z.string().describe('A brief, encouraging summary of the generated plan.'),
});
export type GenerateStudyPlanOutput = z.infer<typeof GenerateStudyPlanOutputSchema>;

export async function generateStudyPlan(input: GenerateStudyPlanInput): Promise<GenerateStudyPlanOutput> {
  return createStudyPlanFlow(input);
}


/**
 * A helper function to parse a human-readable timeframe string into a total number of days.
 * @param timeframe The string to parse (e.g., "Next Month", "2 Years").
 * @returns The total number of days.
 */
function getTimeframeInDays(timeframe: string): number {
    const lower = timeframe.toLowerCase();
    const numMatch = lower.match(/(\d+)/);
    const num = numMatch ? parseInt(numMatch[0], 10) : 1;

    if (lower.includes("today")) return 1;
    if (lower.includes("tomorrow")) return 1;
    if (lower.includes("week")) return num * 7;
    if (lower.includes("month")) return num * 30;
    if (lower.includes("year")) return num * 365;

    return 7; // Default to 7 days if no match
}

const generateStudyPlanChunkPrompt = ai.definePrompt({
    name: 'generateStudyPlanChunkPrompt',
    input: { schema: z.object({
        ...GenerateStudyPlanInputSchema.shape,
        daysToGenerate: z.number(),
        startDay: z.number(),
        planGeneratedSoFarSummary: z.string().describe("A concise summary of the plan generated for the previous days, to ensure continuity and avoid repetition."),
    })},
    output: { schema: z.object({
        chunk: z.array(DailyPlanSchema).describe('The plan for the requested chunk of days.')
    })},
    prompt: `You are an expert UPSC exam coach creating one chunk of a larger, hyper-detailed study schedule.

    **Overall Plan Goal:**
    - Focus Areas: {{{focusAreas}}}
    - Total Duration: {{{timeframe}}}
    - Study Time: {{{hoursPerWeek}}} hours per week

    **Context of Plan Generated So Far:**
    This is a summary of what has been planned already. Do not repeat these topics unless for revision.
    {{{planGeneratedSoFarSummary}}}

    **Current Task:**
    Your job is to generate a detailed, day-by-day plan for the next {{{daysToGenerate}}} days, starting from Day {{{startDay}}}.

    **Instructions for this chunk:**
    1.  Create a detailed task list for each of the {{{daysToGenerate}}} days.
    2.  Label each day as "Day X" where X is the absolute day number. For example, if startDay is 8, you will generate "Day 8", "Day 9", ... "Day 14".
    3.  Prioritize weak areas ([Mastery: novice] or [Mastery: none]) for 'Study' tasks.
    4.  Schedule 'Revise' activities for strong areas ([Mastery: advanced] or [Mastery: expert]).
    5.  Use the full syllabus context provided below to ensure every task has a valid 'topicId'.
    6.  Distribute the weekly hours realistically across the days.
    7.  Do NOT add any summary or intro/outro text. Just return the JSON for the days.

    **Full Syllabus with User's Mastery Levels:**
    \`\`\`
    {{{syllabusContext}}}
    \`\`\`
    `
});

const createStudyPlanFlow = ai.defineFlow(
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

    const finalPlan: GenerateStudyPlanOutput = {
      plan: allDailyPlans,
      summary: `A comprehensive, ${allDailyPlans.length}-day plan has been generated based on your request for a ${input.timeframe} timeframe.`,
    };

    return finalPlan;
  }
);
