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
  timeframe: z.string().describe('The total duration for the study plan (e.g., "1 Week", "1 Month").'),
  hoursPerWeek: z.number().describe('The total number of hours the user can study per week.'),
  syllabusContext: z.string().describe('A text representation of the entire syllabus tree, including user-defined mastery levels for each topic (e.g., "[id] [Mastery: novice] Title").'),
});
export type GenerateStudyPlanInput = z.infer<typeof GenerateStudyPlanInputSchema>;

const DailyTaskSchema = z.object({
  duration: z.string().describe('Suggested time allocation for the task (e.g., "2 hours", "45 mins").'),
  topic: z.string().describe('The specific syllabus topic or concept to study.'),
  activity: z.enum(['Study', 'Revise', 'Practice', 'Test']).describe('The type of activity to perform.'),
  suggestion: z.string().describe("A brief, actionable suggestion for the activity, e.g., 'Focus on making short notes' or 'Attempt previous year questions'."),
});

const DailyPlanSchema = z.object({
    day: z.string().describe('The day of the plan (e.g., "Day 1", "Monday").'),
    tasks: z.array(DailyTaskSchema).describe('A list of tasks scheduled for that day.'),
});

const GenerateStudyPlanOutputSchema = z.object({
  plan: z.array(DailyPlanSchema).describe('A day-by-day breakdown of the study plan.'),
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

Your task is to act as a hyper-intelligent scheduler. Based on the user's focus areas, available time, and their mastery of the syllabus, create a balanced, day-by-day study plan.

**Key Instructions:**
1.  **Prioritize Weak Areas**: Give higher priority and more 'Study' time to topics marked with [Mastery: novice] or [Mastery: none]. These are the user's weaknesses.
2.  **Schedule Revisions**: For topics marked [Mastery: advanced] or [Mastery: expert], schedule 'Revise' activities to ensure knowledge retention. Do not schedule 'Study' for these.
3.  **Balance Activities**: The plan should not just be about studying new things. Intelligently mix in 'Revise', 'Practice' (e.g., answer writing), and 'Test' activities.
4.  **Be Granular**: For each task, provide a short, actionable 'suggestion' to guide the user. For example, for a 'Study' task, suggest "Focus on creating flashcards for key terms". For a 'Practice' task, suggest "Write a 250-word answer on this topic".
5.  **Be Realistic**: The daily schedule should be achievable within the user's weekly hour constraints. Assume a 7-day week if the timeframe is in weeks.
6.  **Summarize**: Provide a short, encouraging summary of the plan's strategy, referencing how it will tackle weak areas first.

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
