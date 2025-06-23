'use server';
/**
 * @fileOverview Prompts used for generating study plan chunks.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { GenerateStudyPlanInputSchema, DailyPlanSchema, MetaPlanSchema } from './schemas';

export const generateMetaPlanPrompt = ai.definePrompt({
    name: 'generateMetaPlanPrompt',
    input: { schema: z.object({
        ...GenerateStudyPlanInputSchema.shape,
        totalWeeks: z.number(),
    })},
    output: { schema: MetaPlanSchema },
    prompt: `You are a master UPSC exam coach. Your first task is to create a high-level, strategic, week-by-week roadmap for a student.

    **Overall Plan Goal:**
    - Focus Areas: {{{focusAreas}}}
    - Total Duration: {{{timeframe}}}
    - Study Time: {{{hoursPerWeek}}} hours per week
    - Total Weeks to Plan: {{{totalWeeks}}}

    **Instructions:**
    1.  Analyze the user's focus areas, timeframe, and the provided syllabus context with their mastery levels.
    2.  Create a logical, week-by-week allocation of subjects and topics for the entire {{{totalWeeks}}}-week period.
    3.  For each week, define a clear, concise 'focus' objective. This should guide the detailed planning for that week.
        - Good examples: "Master GS-II Polity fundamentals", "Complete Modern History up to 1857 & revise Polity", "Focus on Environment concepts and start practicing CSAT".
    4.  Ensure a logical progression. Don't jump between unrelated heavy topics. Incorporate revision weeks where appropriate.
    5.  Prioritize topics marked with [Mastery: novice] or [Mastery: none]. Schedule revision for topics with [Mastery: advanced] or [Mastery: expert].
    6.  Do NOT generate a daily plan. Your ONLY output is the high-level weekly focus plan in JSON format.

    **Full Syllabus with User's Mastery Levels:**
    \`\`\`
    {{{syllabusContext}}}
    \`\`\`
    `
});


export const generateStudyPlanChunkPrompt = ai.definePrompt({
    name: 'generateStudyPlanChunkPrompt',
    input: { schema: z.object({
        ...GenerateStudyPlanInputSchema.shape,
        daysToGenerate: z.number(),
        startDay: z.number(),
        weeklyFocus: z.string().describe("The specific, high-level goal for this week's plan."),
    })},
    output: { schema: z.object({
        chunk: z.array(DailyPlanSchema).describe('The plan for the requested chunk of days.')
    })},
    prompt: `You are an expert UPSC exam coach creating one chunk of a larger, hyper-detailed study schedule.

    **Overall Plan Goal:**
    - Focus Areas: {{{focusAreas}}}
    - Total Duration: {{{timeframe}}}
    - Study Time: {{{hoursPerWeek}}} hours per week

    **This Week's Specific Goal:**
    Your primary objective for this chunk is: **{{{weeklyFocus}}}**
    Use this goal to guide your topic selection and activity types.

    **Current Task:**
    Your job is to generate a detailed, day-by-day plan for the next {{{daysToGenerate}}} days, starting from Day {{{startDay}}}.

    **Instructions for this chunk:**
    1.  Create a detailed task list for each of the {{{daysToGenerate}}} days, guided by the weekly focus.
    2.  Label each day as "Day X" where X is the absolute day number.
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
