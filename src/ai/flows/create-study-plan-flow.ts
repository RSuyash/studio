
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
  duration: z.string().describe('Suggested time allocation for the task (e.g., "2h", "45m").'),
  topic: z.string().describe('The specific syllabus topic or concept to study.'),
  activity: z.enum(['Study', 'Revise', 'Practice', 'Test', 'Weekly Revision', 'Analyze Test']).describe('The type of activity to perform.'),
  suggestion: z.string().describe("A brief, actionable suggestion for the activity, e.g., 'GS-II Notes' or 'Sectional Test'. Include the GS Paper number if applicable."),
});

const DailyPlanSchema = z.object({
    day: z.string().describe('The day or period for this part of the plan (e.g., "Mon", "Tue", "Week 1", or a date like "2024-07-26").'),
    tasks: z.array(DailyTaskSchema).describe('A list of tasks scheduled for that day.'),
});

const GenerateStudyPlanOutputSchema = z.object({
  plan: z.array(DailyPlanSchema).describe('A day-by-day breakdown of the study plan, corresponding to the requested timeframe.'),
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
  prompt: `You are an expert UPSC exam coach who specializes in creating highly efficient and practical study schedules. A student needs a detailed study plan and has provided their current mastery level for each topic.

Your task is to act as a hyper-intelligent scheduler. Based on the user's focus areas, available time, mastery of the syllabus, and the **requested timeframe**, create a balanced, day-by-day study plan.

**Key Instructions:**
1.  **Adhere to the Timeframe**: The number of days or periods in your generated 'plan' array MUST logically match the user's requested 'timeframe'. For "This Week", generate a 7-day plan (Mon-Sun). For "For Today", generate a 1-day plan. For "Next Month", you can generate a plan broken down into 4 "Week" periods. Be flexible and logical.
2.  **Prioritize Weak Areas**: Give higher priority and more 'Study' time to topics marked with [Mastery: novice] or [Mastery: none]. These are the user's weaknesses.
3.  **Schedule Revisions**: For topics marked [Mastery: advanced] or [Mastery: expert], schedule 'Revise' activities to ensure knowledge retention. Do not schedule 'Study' for these. Use 'Weekly Revision' for broader revision tasks.
4.  **Balance Activities**: The plan should not just be about studying new things. Intelligently mix in 'Revise', 'Practice', and 'Test' activities. For example, include a 'Take Test' on Friday and an 'Analyze Test' on Sunday for weekly plans.
5.  **Be Granular**: For each task, provide a short 'suggestion' to guide the user (e.g., 'GS-I (2h)', 'Polity Notes (1h)', 'Sectional (1h)'). This should be very brief.
6.  **Return Topic ID**: For every single task you create, you MUST include the original 'topicId' from the syllabus context. This is crucial for linking the plan back to the syllabus. For general tasks like 'Weekly Revision', you can use a high-level topic ID like 'preliminary-exam'.
7.  **Be Realistic**: The daily schedule should be achievable within the user's weekly hour constraints. Distribute the hours logically across the days of the plan.
8.  **Summarize**: Provide a short, encouraging summary of the plan's strategy.

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
