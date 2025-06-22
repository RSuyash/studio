'use server';
/**
 * @fileOverview An AI flow to explain a syllabus topic.
 *
 * - explainSyllabusTopic - A function that provides a simple explanation for a given topic.
 * - ExplainTopicInput - The input type for the explainSyllabusTopic function.
 * - ExplainTopicOutput - The return type for the explainSyllabusTopic function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainTopicInputSchema = z.object({
  title: z.string().describe('The title of the syllabus topic.'),
  description: z.string().describe('The description of the syllabus topic.'),
});
export type ExplainTopicInput = z.infer<typeof ExplainTopicInputSchema>;

const ExplainTopicOutputSchema = z.object({
    explanation: z.string().describe('A simple, concise explanation of the topic, suitable for a beginner. Use an analogy if it helps clarify the concept.'),
});
export type ExplainTopicOutput = z.infer<typeof ExplainTopicOutputSchema>;

export async function explainSyllabusTopic(input: ExplainTopicInput): Promise<ExplainTopicOutput> {
  return explainSyllabusTopicFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainSyllabusTopicPrompt',
  input: {schema: ExplainTopicInputSchema},
  output: {schema: ExplainTopicOutputSchema},
  prompt: `You are an expert tutor specializing in breaking down complex topics for students.
Your task is to provide a simple, concise, and easy-to-understand explanation for the following syllabus topic.

Use simple language and an analogy if it helps to clarify the core concept. The explanation should be brief and to the point.

Topic Title: {{{title}}}
Topic Description: {{{description}}}
`,
});

const explainSyllabusTopicFlow = ai.defineFlow(
  {
    name: 'explainSyllabusTopicFlow',
    inputSchema: ExplainTopicInputSchema,
    outputSchema: ExplainTopicOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
