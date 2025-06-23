'use server';
/**
 * @fileOverview An AI flow to create a study plan for a syllabus topic.
 *
 * - createStudyPlan - A function that generates an actionable study plan.
 * - CreateStudyPlanInput - The input type for the createStudyPlan function.
 * - CreateStudyPlanOutput - The return type for the createStudyPlan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CreateStudyPlanInputSchema = z.object({
  title: z.string().describe('The title of the syllabus topic.'),
  description: z.string().describe('The description of the syllabus topic.'),
});
export type CreateStudyPlanInput = z.infer<typeof CreateStudyPlanInputSchema>;

const CreateStudyPlanOutputSchema = z.object({
  keyFocusAreas: z.array(z.string()).describe('A list of the most critical sub-topics or concepts to focus on.'),
  studyTechniques: z.array(z.string()).describe('A list of recommended study methods or techniques for this topic.'),
  suggestedTimeAllocation: z.string().describe('A suggested time to spend on this topic, e.g., "2-3 hours" or "4 Pomodoro sessions".'),
  crossReferenceTopics: z.array(z.string()).describe('A list of related topics the user should cross-reference.'),
});
export type CreateStudyPlanOutput = z.infer<typeof CreateStudyPlanOutputSchema>;

export async function createStudyPlan(input: CreateStudyPlanInput): Promise<CreateStudyPlanOutput> {
  return createStudyPlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'createStudyPlanPrompt',
  input: {schema: CreateStudyPlanInputSchema},
  output: {schema: CreateStudyPlanOutputSchema},
  prompt: `You are an expert UPSC exam coach. A student needs a practical study plan for a specific syllabus topic. Create a concise, actionable plan.

Break down the topic into its most critical focus areas.
Suggest effective study techniques (e.g., 'mind-mapping', 'solving past year questions', 'making flowcharts').
Provide a realistic time allocation for studying this topic.
Finally, list any other important syllabus topics that have strong connections to this one for cross-referencing.

Topic Title: {{{title}}}
Topic Description: {{{description}}}
`,
});

const createStudyPlanFlow = ai.defineFlow(
  {
    name: 'createStudyPlanFlow',
    inputSchema: CreateStudyPlanInputSchema,
    outputSchema: CreateStudyPlanOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
