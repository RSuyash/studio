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
  focusAreas: z.array(z.string()).describe('A list of the main syllabus subjects or topics the user wants to focus on.'),
  timeframe: z.string().describe('The total duration for the study plan (e.g., "1 Week", "1 Month").'),
  hoursPerWeek: z.number().describe('The total number of hours the user can study per week.'),
  syllabusContext: z.string().describe('A text representation of the entire syllabus tree for context.'),
});
export type GenerateStudyPlanInput = z.infer<typeof GenerateStudyPlanInputSchema>;

const DailyTaskSchema = z.object({
  time: z.string().describe('Suggested time allocation for the task (e.g., "2 hours", "45 mins").'),
  topic: z.string().describe('The specific syllabus topic or concept to study.'),
  activity: z.enum(['Study', 'Revise', 'Practice', 'Test']).describe('The type of activity to perform.'),
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
  prompt: `You are an expert UPSC exam coach who specializes in creating highly efficient and practical study schedules. A student needs a detailed study plan.

Your task is to act as a scheduler. Based on the user's focus areas, available time, and the full syllabus context, create a balanced, day-by-day study plan.

**Instructions:**
1.  **Analyze Context**: Use the provided syllabus context to select specific, relevant sub-topics within the user's chosen focus areas.
2.  **Balance Activities**: The plan should not just be about studying new things. Intelligently mix in 'Revise' and 'Practice' (e.g., answer writing) activities. For a longer plan (e.g., a month), you can also include 'Test' activities.
3.  **Structure the Output**: Create a plan broken down by day. For each day, list a few actionable tasks with a specific topic, a realistic time allocation, and the type of activity.
4.  **Be Realistic**: The daily schedule should be achievable within the user's weekly hour constraints. Assume a 7-day week if the timeframe is in weeks.
5.  **Summarize**: Provide a short, encouraging summary of the plan's strategy.

**User's Requirements:**
-   **Focus Areas**: {{{focusAreas}}}
-   **Plan Duration**: {{{timeframe}}}
-   **Available Study Time**: {{{hoursPerWeek}}} hours per week

**Full Syllabus for Context:**
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
