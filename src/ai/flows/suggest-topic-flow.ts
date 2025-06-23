'use server';
/**
 * @fileOverview An AI flow to suggest the most relevant syllabus topic for a given resource.
 *
 * - suggestSyllabusTopic - A function that suggests a topic ID based on resource details.
 * - SuggestTopicInput - The input type for the suggestSyllabusTopic function.
 * - SuggestTopicOutput - The return type for the suggestSyllabusTopic function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestTopicInputSchema = z.object({
  resourceTitle: z.string().describe('The title of the resource (e.g., book, article, video).'),
  resourceDescription: z.string().optional().describe('An optional description of the resource.'),
  syllabusTreeText: z.string().describe('A text representation of the syllabus tree, where each line is a topic formatted as: `[topic-id] Topic Title`. This provides the context for the AI to choose from.'),
});
export type SuggestTopicInput = z.infer<typeof SuggestTopicInputSchema>;

const SuggestTopicOutputSchema = z.object({
    topicId: z.string().describe('The ID of the most relevant syllabus topic for the given resource. The ID must be one of the IDs present in the provided syllabus tree text.'),
});
export type SuggestTopicOutput = z.infer<typeof SuggestTopicOutputSchema>;

export async function suggestSyllabusTopic(input: SuggestTopicInput): Promise<SuggestTopicOutput> {
  return suggestSyllabusTopicFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestSyllabusTopicPrompt',
  input: {schema: SuggestTopicInputSchema},
  output: {schema: SuggestTopicOutputSchema},
  prompt: `You are an expert curriculum organizer for competitive exams. Your task is to analyze the title and description of a study resource and determine which syllabus topic it is most relevant to.

You will be given the resource details and a structured text representation of the entire syllabus. You must choose the single most specific and relevant topic ID from the list.

**Resource Details:**
- Title: {{{resourceTitle}}}
{{#if resourceDescription}}- Description: {{{resourceDescription}}}{{/if}}

**Syllabus Structure:**
\`\`\`
{{{syllabusTreeText}}}
\`\`\`

Based on the information, identify the single best 'topicId' from the syllabus structure provided. Your response must only contain the chosen 'topicId'.`,
});

const suggestSyllabusTopicFlow = ai.defineFlow(
  {
    name: 'suggestSyllabusTopicFlow',
    inputSchema: SuggestTopicInputSchema,
    outputSchema: SuggestTopicOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
