
'use server';
/**
 * @fileOverview An AI flow to create a detailed, scheduled study plan.
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
    day: z.string().describe('The day or period for this part of the plan (e.g., "Mon", "Day 1", "Day 365").'),
    tasks: z.array(DailyTaskSchema).describe('A list of tasks scheduled for that day or period.'),
});

const GenerateStudyPlanOutputSchema = z.object({
  plan: z.array(DailyPlanSchema).describe('A breakdown of the study plan, corresponding to the requested timeframe.'),
  summary: z.string().describe('A brief, encouraging summary of the generated plan.'),
});
export type GenerateStudyPlanOutput = z.infer<typeof GenerateStudyPlanOutputSchema>;

export async function generateStudyPlan(input: GenerateStudyPlanInput): Promise<GenerateStudyPlanOutput> {
  return createStudyPlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateStudyPlanPrompt',
  input: {schema: GenerateStudyPlanInputSchema},
  output: {schema: GenerateStudyPlanOutputSchema},
  prompt: `You are an expert UPSC exam coach who specializes in creating hyper-detailed, comprehensive, and practical study schedules. A student needs an overwhelmingly detailed study plan and has provided their current mastery level for each topic.

Your task is to generate a fully detailed, day-by-day plan for the **entire duration** requested by the user. Do not summarize or use weekly/monthly overviews for longer plans, even if the duration is multiple years. The user wants maximum detail.

**Key Instructions:**
1.  **Full Daily Detail**: Generate a day-by-day plan for the ENTIRE requested timeframe. For a "1 Year" plan, you must generate a plan for all 365 days. Each day must have a list of specific, actionable tasks with durations.
2.  **Use Appropriate Labels**: Label each day of the plan clearly. For weekly plans, use "Mon", "Tue", etc. For longer plans, use labels like "Day 1", "Day 2",... "Day 365".
3.  **Prioritize Weak Areas**: Give higher priority and more 'Study' time to topics marked with [Mastery: novice] or [Mastery: none]. These are the user's weaknesses.
4.  **Schedule Revisions**: For topics marked [Mastery: advanced] or [Mastery: expert], schedule 'Revise' activities to ensure knowledge retention. Do not schedule 'Study' for these. Use 'Weekly Revision' for broader revision tasks.
5.  **Balance Activities**: The plan should not just be about studying new things. Intelligently mix in 'Revise', 'Practice', and 'Test' activities.
6.  **Actionable Suggestions**: For each task, provide a brief, actionable 'suggestion' (e.g., 'Read Laxmikanth Ch 22' or 'Focus on Prelims PYQs for this topic').
7.  **Return Topic ID**: For every single task you create, you MUST include the original 'topicId' from the syllabus context. This is crucial for linking the plan back to the syllabus. For high-level tasks, use the ID for that high-level topic.
8.  **Be Realistic but Comprehensive**: The schedule should be achievable within the user's weekly hour constraints. Distribute the hours logically and consistently across every single day of the requested period.
9.  **Summarize**: Provide a short, encouraging summary of the plan's strategy.

**User's Requirements:**
-   **Focus Areas**: {{{focusAreas}}}
-   **Plan Duration**: {{{timeframe}}}
-   **Available Study Time**: {{{hoursPerWeek}}} hours per week

**Full Syllabus with User's Mastery Levels:**
\`\`\`
{{{syllabusContext}}}
\`\`\`
`,
});

const createStudyPlanFlow = ai.defineFlow(
  {
    name: 'generateStudyPlanFlow',
    inputSchema: GenerateStudyPlanInputSchema,
    outputSchema: GenerateStudyPlanOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
