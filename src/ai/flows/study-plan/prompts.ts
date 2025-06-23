'use server';
/**
 * @fileOverview Prompts used for generating study plan chunks.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { GenerateStudyPlanInputSchema, DailyPlanSchema } from './schemas';

export const generateStudyPlanChunkPrompt = ai.definePrompt({
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
